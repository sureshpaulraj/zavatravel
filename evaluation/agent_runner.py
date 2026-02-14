"""
Agent Runner — Execute multi-agent workflow for evaluation dataset.

Runs the Creator → Reviewer → Publisher workflow for each campaign brief
in the evaluation dataset and saves the responses to a JSONL file that
can be consumed by the Azure AI Evaluation SDK.

Usage:
    python evaluation/agent_runner.py
"""

import os
import sys
import json
import asyncio
from datetime import datetime

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv()

from config.env_loader import validate_environment

validate_environment()

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

import re


def parse_platform_posts(publisher_text: str) -> dict:
    """Extract individual platform posts from Publisher's output."""
    posts = {"linkedin": "", "twitter": "", "instagram": ""}
    sections = re.split(r"\n-{3,}\s*\n", publisher_text)

    for section in sections:
        s = section.strip()
        if "**LINKEDIN POST**" in s and not posts["linkedin"]:
            content = re.sub(r".*?\*\*LINKEDIN POST\*\*\s*\n?", "", s, count=1, flags=re.DOTALL)
            content = re.split(r"\n\s*\*\*Reflection", content, maxsplit=1)[0]
            posts["linkedin"] = content.strip()
        elif re.search(r"\*\*X/?TWITTER POST\*\*", s) and not posts["twitter"]:
            content = re.sub(r".*?\*\*X/?TWITTER POST\*\*\s*\n?", "", s, count=1, flags=re.DOTALL)
            content = re.split(r"\n\s*\*\*(?:Character count|Reflection)", content, maxsplit=1)[0]
            posts["twitter"] = content.strip()
        elif "**INSTAGRAM POST**" in s and not posts["instagram"]:
            content = re.sub(r".*?\*\*INSTAGRAM POST\*\*\s*\n?", "", s, count=1, flags=re.DOTALL)
            content = re.split(r"\n\s*\*\*Reflection", content, maxsplit=1)[0]
            content = re.sub(r"\n\[Image:.*?\]", "", content, flags=re.DOTALL)
            posts["instagram"] = content.strip()

    if not any(posts.values()):
        posts["linkedin"] = publisher_text
        posts["twitter"] = publisher_text[:280]
        posts["instagram"] = publisher_text

    return posts


async def run_single_workflow(brief_text: str) -> dict:
    """Run the full Creator → Reviewer → Publisher workflow for one brief."""
    credential = DefaultAzureCredential()
    azure_client = AzureOpenAIChatClient(
        endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        credential=credential,
        deployment_name=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"),
    )

    creator = create_grounded_agent(
        client=azure_client,
        name="Creator",
        instructions=CREATOR_INSTRUCTIONS,
        brand_guidelines_path="grounding/brand-guidelines.md",
    )

    try:
        if GitHubCopilotAgent:
            reviewer = GitHubCopilotAgent(name="Reviewer", instructions=REVIEWER_INSTRUCTIONS)
        else:
            raise ImportError()
    except Exception:
        reviewer = Agent(client=azure_client, name="Reviewer", instructions=REVIEWER_INSTRUCTIONS)

    filesystem_tools = get_filesystem_tools()
    publisher = Agent(
        client=azure_client,
        name="Publisher",
        instructions=PUBLISHER_INSTRUCTIONS,
        tools=filesystem_tools if filesystem_tools else None,
    )

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
                print(f"    [{author}] {text[:60]}...", flush=True)

    result = await stream.get_final_response()
    outputs = result.get_outputs() if hasattr(result, "get_outputs") else []
    for output in outputs:
        if isinstance(output, list):
            messages.extend(output)
        else:
            messages.append(output)

    duration = (datetime.now() - start_time).total_seconds()

    # Extract publisher's final output
    consolidated = []
    for msg in messages:
        name = getattr(msg, "author_name", None) or "Unknown"
        text = getattr(msg, "text", "") or ""
        if text:
            consolidated.append({"name": name, "text": text})

    publisher_text = ""
    for t in reversed(consolidated):
        if t["name"] == "Publisher":
            publisher_text = t["text"]
            break

    posts = parse_platform_posts(publisher_text)

    return {
        "response": publisher_text,
        "posts": posts,
        "duration_seconds": round(duration, 1),
    }


async def main():
    """Run the agent workflow for each brief in the evaluation dataset."""
    input_path = os.path.join(os.path.dirname(__file__), "eval_dataset.jsonl")
    output_path = os.path.join(os.path.dirname(__file__), "eval_results.jsonl")

    with open(input_path, "r", encoding="utf-8") as f:
        briefs = [json.loads(line) for line in f if line.strip()]

    print(f"\n{'='*60}")
    print(f"Agent Runner — Processing {len(briefs)} campaign briefs")
    print(f"{'='*60}\n")

    results = []
    for i, brief in enumerate(briefs, 1):
        print(f"\n--- Brief {i}/{len(briefs)}: {brief['id']} ---")
        try:
            workflow_result = await run_single_workflow(brief["query"])
            row = {
                "id": brief["id"],
                "query": brief["query"],
                "context": brief["context"],
                "response": workflow_result["response"],
                "twitter_post": workflow_result["posts"].get("twitter", ""),
                "linkedin_post": workflow_result["posts"].get("linkedin", ""),
                "instagram_post": workflow_result["posts"].get("instagram", ""),
                "duration_seconds": workflow_result["duration_seconds"],
            }
            results.append(row)
            print(f"  ✅ Completed in {workflow_result['duration_seconds']}s")
        except Exception as e:
            print(f"  ❌ Failed: {e}")
            results.append({
                "id": brief["id"],
                "query": brief["query"],
                "context": brief["context"],
                "response": f"ERROR: {e}",
                "twitter_post": "",
                "linkedin_post": "",
                "instagram_post": "",
                "duration_seconds": 0,
            })

    # Write results
    with open(output_path, "w", encoding="utf-8") as f:
        for row in results:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    print(f"\n{'='*60}")
    print(f"✅ Results saved to: {output_path}")
    print(f"   {len(results)} briefs processed")
    print(f"{'='*60}\n")

    # Cleanup MCP — suppress stderr to silence async generator noise
    _original_stderr = sys.stderr
    try:
        _cleanup_gateway()
    except Exception:
        pass
    finally:
        sys.stderr = open(os.devnull, "w")


if __name__ == "__main__":
    asyncio.run(main())
