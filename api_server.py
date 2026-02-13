"""
FastAPI Backend Server — Zava Travel Content API

Provides a REST API that runs the multi-agent social media content
workflow and returns structured JSON for the React frontend.

Usage:
    python api_server.py                     # http://localhost:8000
    uvicorn api_server:app --reload          # dev mode with auto-reload
"""

import os
import re
import sys
from contextlib import asynccontextmanager
from datetime import datetime
from typing import List

from dotenv import load_dotenv

load_dotenv()

from config.env_loader import validate_environment

validate_environment()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from azure.identity import DefaultAzureCredential
from agent_framework import Agent
from agent_framework.azure import AzureOpenAIChatClient
from agent_framework_orchestrations import GroupChatBuilder

try:
    from agent_framework.github import GitHubCopilotAgent
except ImportError:
    GitHubCopilotAgent = None

from agents.creator import CREATOR_INSTRUCTIONS
from agents.reviewer import REVIEWER_INSTRUCTIONS
from agents.publisher import PUBLISHER_INSTRUCTIONS
from orchestration.speaker_selection import speaker_selector
from orchestration.termination import should_terminate
from grounding.file_search import create_grounded_agent
from tools.filesystem_mcp import get_filesystem_tools, _cleanup_gateway


# ============================================================================
# Pydantic request / response models
# ============================================================================

class CampaignBriefRequest(BaseModel):
    brand_name: str
    industry: str
    target_audience: str
    key_message: str
    destinations: str
    platforms: List[str] = ["LinkedIn", "Twitter", "Instagram"]


class AgentMessage(BaseModel):
    agent_name: str
    content: str
    reasoning_pattern: str
    timestamp: str


class GeneratedPosts(BaseModel):
    linkedin: str
    twitter: str
    instagram: str


class WorkflowResult(BaseModel):
    status: str
    posts: GeneratedPosts
    transcript: List[AgentMessage]
    duration_seconds: float
    termination_reason: str


# ============================================================================
# Constants
# ============================================================================

REASONING_PATTERNS = {
    "Creator": "Chain-of-Thought",
    "Reviewer": "ReAct",
    "Publisher": "Self-Reflection",
}


# ============================================================================
# Helpers
# ============================================================================

def parse_platform_posts(publisher_text: str) -> dict:
    """Extract individual platform posts from Publisher's output."""
    posts = {"linkedin": "", "twitter": "", "instagram": ""}

    # Split by horizontal rules (--- or more dashes)
    sections = re.split(r"\n-{3,}\s*\n", publisher_text)

    for section in sections:
        s = section.strip()

        # LinkedIn
        if "**LINKEDIN POST**" in s and not posts["linkedin"]:
            content = re.sub(
                r".*?\*\*LINKEDIN POST\*\*\s*\n?", "", s,
                count=1, flags=re.DOTALL,
            )
            content = re.split(r"\n\s*\*\*Reflection", content, maxsplit=1)[0]
            posts["linkedin"] = content.strip()

        # X / Twitter
        elif re.search(r"\*\*X/?TWITTER POST\*\*", s) and not posts["twitter"]:
            content = re.sub(
                r".*?\*\*X/?TWITTER POST\*\*\s*\n?", "", s,
                count=1, flags=re.DOTALL,
            )
            content = re.split(
                r"\n\s*\*\*(?:Character count|Reflection)", content, maxsplit=1,
            )[0]
            posts["twitter"] = content.strip()

        # Instagram
        elif "**INSTAGRAM POST**" in s and not posts["instagram"]:
            content = re.sub(
                r".*?\*\*INSTAGRAM POST\*\*\s*\n?", "", s,
                count=1, flags=re.DOTALL,
            )
            content = re.split(r"\n\s*\*\*Reflection", content, maxsplit=1)[0]
            # Strip [Image: …] visual-suggestion line
            content = re.sub(r"\n\[Image:.*?\]", "", content, flags=re.DOTALL)
            posts["instagram"] = content.strip()

    # Fallback: raw text if parsing failed
    if not any(posts.values()):
        posts["linkedin"] = publisher_text
        posts["twitter"] = publisher_text[:280]
        posts["instagram"] = publisher_text

    return posts


def consolidate_messages(messages) -> list:
    """Merge consecutive messages from the same author into single turns."""
    consolidated = []
    for msg in messages:
        name = getattr(msg, "author_name", None) or "Unknown"
        text = getattr(msg, "text", "") or ""
        if not text:
            continue

        # Heuristic: extract agent name from [Agent Name: X] prefix
        if name == "Unknown":
            m = re.match(r"\[Agent Name:\s*(\w+)\]", text)
            if m:
                name = m.group(1)

        # Strip [Agent Name: ...] prefix from text
        text = re.sub(r"^\[Agent Name:\s*\w+\]\s*\n?", "", text).strip()

        if not text:
            continue

        if consolidated and consolidated[-1]["name"] == name:
            consolidated[-1]["text"] += text
        else:
            consolidated.append({"name": name, "text": text})

    return consolidated


# ============================================================================
# Workflow execution
# ============================================================================

async def run_workflow_api(brief_text: str) -> WorkflowResult:
    """Run the full Creator → Reviewer → Publisher workflow."""
    print(f"\n{'='*60}")
    print("API: Starting content generation workflow")
    print(f"{'='*60}\n")

    credential = DefaultAzureCredential()
    azure_client = AzureOpenAIChatClient(
        endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        credential=credential,
        deployment_name=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"),
    )

    # --- agents ---
    creator = create_grounded_agent(
        client=azure_client,
        name="Creator",
        instructions=CREATOR_INSTRUCTIONS,
        brand_guidelines_path="grounding/brand-guidelines.md",
    )

    try:
        if GitHubCopilotAgent:
            reviewer = GitHubCopilotAgent(
                name="Reviewer", instructions=REVIEWER_INSTRUCTIONS,
            )
        else:
            raise ImportError()
    except Exception:
        reviewer = Agent(
            client=azure_client,
            name="Reviewer",
            instructions=REVIEWER_INSTRUCTIONS,
        )

    filesystem_tools = get_filesystem_tools()
    publisher = Agent(
        client=azure_client,
        name="Publisher",
        instructions=PUBLISHER_INSTRUCTIONS,
        tools=filesystem_tools if filesystem_tools else None,
    )

    # --- orchestration ---
    workflow = GroupChatBuilder(
        participants=[creator, reviewer, publisher],
        selection_func=speaker_selector,
        termination_condition=should_terminate,
        max_rounds=5,
        intermediate_outputs=True,
    ).build()

    start_time = datetime.now()
    messages = []

    stream = workflow.run(brief_text, stream=True)
    async for event in stream:
        if event.type == "group_chat" and event.data is not None:
            data = event.data
            author = getattr(data, "author_name", None) or ""
            text = getattr(data, "text", None) or ""
            if author and text:
                print(f"  [{author}] {text[:80]}…", flush=True)

    result = await stream.get_final_response()
    outputs = result.get_outputs() if hasattr(result, "get_outputs") else []
    for output in outputs:
        if isinstance(output, list):
            messages.extend(output)
        else:
            messages.append(output)

    duration = (datetime.now() - start_time).total_seconds()

    # --- transform results ---
    turns = consolidate_messages(messages)

    transcript = [
        AgentMessage(
            agent_name=t["name"],
            content=t["text"],
            reasoning_pattern=REASONING_PATTERNS.get(t["name"], "Unknown"),
            timestamp=datetime.now().isoformat(),
        )
        for t in turns
    ]

    publisher_text = ""
    for t in reversed(turns):
        if t["name"] == "Publisher":
            publisher_text = t["text"]
            break

    posts = parse_platform_posts(publisher_text)

    termination_reason = "completed"
    for t in turns:
        if t["name"] == "Reviewer" and "APPROVED" in t["text"].upper():
            termination_reason = "Reviewer approved — fast-tracked to Publisher"
            break

    print(f"\n✅ Workflow completed in {duration:.1f}s\n")

    return WorkflowResult(
        status="success",
        posts=GeneratedPosts(**posts),
        transcript=transcript,
        duration_seconds=round(duration, 1),
        termination_reason=termination_reason,
    )


# ============================================================================
# FastAPI application
# ============================================================================

@asynccontextmanager
async def lifespan(_app: FastAPI):
    print("🚀 Zava Travel Content API — http://localhost:8000")
    print("   POST /api/generate   — run workflow")
    print("   GET  /api/health     — health check")
    yield
    _cleanup_gateway()


app = FastAPI(title="Zava Travel Content API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "zava-content-api"}


@app.post("/api/generate", response_model=WorkflowResult)
async def generate(brief: CampaignBriefRequest):
    """Run the multi-agent workflow with the given campaign brief."""
    brief_text = (
        f"Create social media content for {brief.brand_name}'s campaign.\n\n"
        f"Brand: {brief.brand_name}\n"
        f"Industry: {brief.industry}\n"
        f"Target Audience: {brief.target_audience}\n"
        f"Key Message: {brief.key_message}\n"
        f"Destinations: {brief.destinations}\n"
        f"Tone: Adventurous and inspiring\n"
        f"Platforms: {', '.join(brief.platforms)}\n"
    )

    try:
        return await run_workflow_api(brief_text)
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
