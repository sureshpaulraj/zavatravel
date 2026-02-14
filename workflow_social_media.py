"""
Multi-Agent Social Media Content Creation Workflow

Main entry point for the Zava Travel Inc. social media content generation system.
Uses Microsoft Agent Framework with three specialized agents:
- Creator: Content generation (Chain-of-Thought)
- Reviewer: Quality review (ReAct)
- Publisher: Platform formatting (Self-Reflection)
"""

import os
import sys
import asyncio
from datetime import datetime
from dotenv import load_dotenv

# Validate environment before imports
from config.env_loader import validate_environment

validate_environment()

# Now safe to import Azure dependencies
from azure.identity import DefaultAzureCredential

# Agent Framework imports
try:
    from agent_framework import Agent, WorkflowEvent, WorkflowRunResult
    from agent_framework.azure import AzureOpenAIChatClient
    from agent_framework.github import GitHubCopilotAgent
    from agent_framework_orchestrations import GroupChatBuilder
except ImportError as e:
    print(f"❌ Agent Framework not installed: {e}")
    print("\nPlease install dependencies:")
    print("  pip install -r requirements.txt")
    sys.exit(1)

# Local imports
from agents.creator import CREATOR_INSTRUCTIONS
from agents.reviewer import REVIEWER_INSTRUCTIONS
from agents.publisher import PUBLISHER_INSTRUCTIONS
from orchestration.speaker_selection import speaker_selector
from orchestration.termination import should_terminate
from grounding.file_search import create_grounded_agent
from tools.filesystem_mcp import get_filesystem_tools, save_posts_manually, _cleanup_gateway
from utils.transcript_formatter import format_conversation_transcript, format_workflow_summary
from utils.markdown_formatter import format_posts_to_markdown
from monitoring import configure_tracing, get_tracer, AgentTelemetryMiddleware
from opentelemetry import trace

# Initialise observability (no-op if APPLICATIONINSIGHTS_CONNECTION_STRING not set)
configure_tracing()
_tracer = get_tracer()


# ============================================================================
# CAMPAIGN BRIEF
# ============================================================================

CAMPAIGN_BRIEF = """Create social media content for Zava Travel Inc.'s "Wander More, Spend Less" summer adventure campaign.

Brand: Zava Travel Inc. (zavatravel.com)
Industry: Budget-friendly adventure travel & curated itineraries
Target Audience: Millennials & Gen-Z adventure seekers looking for authentic experiences on a budget
Key Message: Affordable adventure travel to dream destinations like Bali, Patagonia, Iceland, Vietnam, and Costa Rica. Experience more, spend less.
Tone: Adventurous and inspiring
Brand Colors: Teal/ocean blue + sunset orange
Approved Hashtags: #ZavaTravel #WanderMore #AdventureAwaits #TravelOnABudget
Competitors to avoid mentioning: VoyageNow, CookTravel, WanderPath
Platforms: LinkedIn, X/Twitter, Instagram
Price Range: $699-$2,199 for curated adventure itineraries
Season: Summer 2026
"""


# ============================================================================
# WORKFLOW SETUP
# ============================================================================

def build_group_chat():
    """
    Build the multi-agent group chat workflow.
    
    Returns:
        GroupChat workflow instance
    """
    print("🔧 Building multi-agent workflow...\n")
    
    # Azure credentials
    credential = DefaultAzureCredential()
    
    # Azure OpenAI Chat client (for Creator and Publisher)
    try:
        azure_client = AzureOpenAIChatClient(
            endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            credential=credential,
            deployment_name=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME")
        )
        print("✅ Azure OpenAI client initialized")
    except Exception as e:
        print(f"❌ Failed to initialize Azure OpenAI client: {e}")
        sys.exit(1)
    
    # Create Creator agent with brand guidelines grounding
    print("\n📝 Creating Creator agent...")
    creator = create_grounded_agent(
        client=azure_client,
        name="Creator",
        instructions=CREATOR_INSTRUCTIONS,
        brand_guidelines_path="grounding/brand-guidelines.md"
    )
    
    # Create Reviewer agent (GitHub Copilot)
    print("\n🔍 Creating Reviewer agent...")
    try:
        reviewer = GitHubCopilotAgent(
            name="Reviewer",
            instructions=REVIEWER_INSTRUCTIONS
        )
        print("✅ Reviewer agent created (GitHub Copilot SDK)")
    except Exception as e:
        print(f"⚠️ Failed to create GitHub Copilot agent: {e}")
        print("   Falling back to Azure OpenAI for Reviewer...")
        reviewer = Agent(
            client=azure_client,
            name="Reviewer",
            instructions=REVIEWER_INSTRUCTIONS
        )
    
    # Create Publisher agent with MCP filesystem tools
    print("\n📤 Creating Publisher agent...")
    filesystem_tools = get_filesystem_tools()
    publisher = Agent(
        client=azure_client,
        name="Publisher",
        instructions=PUBLISHER_INSTRUCTIONS,
        tools=filesystem_tools if filesystem_tools else None
    )
    if not filesystem_tools:
        print("   ℹ️ Publisher will output to console only (no file save)")
    
    # Build group chat
    print("\n🏗️ Building group chat orchestration...")
    workflow = GroupChatBuilder(
        participants=[creator, reviewer, publisher],
        selection_func=speaker_selector,
        termination_condition=should_terminate,
        max_rounds=5,
        intermediate_outputs=True
    ).build()
    
    print("✅ Group chat workflow built successfully\n")
    return workflow


# ============================================================================
# MAIN WORKFLOW EXECUTION
# ============================================================================

async def run_workflow():
    """
    Execute the multi-agent workflow with real-time streaming.
    """
    print("="*70)
    print("ZAVA TRAVEL INC. — SOCIAL MEDIA CONTENT CREATION")
    print("Multi-Agent Group Chat Workflow")
    print("="*70)
    print()
    
    # Display campaign brief
    print("📋 Campaign Brief:")
    print("-" * 70)
    print(CAMPAIGN_BRIEF)
    print("-" * 70)
    print()
    
    # Build workflow
    workflow = build_group_chat()
    
    # Track start time
    start_time = datetime.now()
    
    # Run workflow with streaming
    print("🚀 Starting multi-agent workflow...\n")
    print("="*70)
    print()
    
    messages = []
    termination_reason = "completed"
    current_agent = None
    
    try:
        # Start observability span for the entire workflow
        _span = _tracer.start_span(
            "social-media-workflow",
            attributes={
                "workflow.type": "group_chat",
                "workflow.campaign": "Wander More Spend Less",
                "workflow.brand": "Zava Travel Inc.",
            },
        )

        # Agent telemetry middleware — creates per-agent child spans
        _agent_telemetry = AgentTelemetryMiddleware(parent_span=_span)

        stream = workflow.run(CAMPAIGN_BRIEF, stream=True)
        async for event in stream:
            # Print agent response updates as they stream
            if event.type == "group_chat" and event.data is not None:
                data = event.data
                # Check for GroupChatResponseReceivedEvent (marks end of agent turn)
                participant = getattr(data, 'participant_name', None)
                if participant:
                    # End of an agent's turn
                    _agent_telemetry.on_agent_end(participant)
                    print(f"\n\n--- [{participant} finished] ---\n")
                    current_agent = None
                    continue
                
                # Check for GroupChatRequestSentEvent (marks start of agent turn)
                if hasattr(data, 'participant_name') and not participant:
                    continue
                    
                # Streaming text delta from agent
                author = getattr(data, 'author_name', None) or ""
                text = getattr(data, 'text', None) or ""
                if author and text:
                    if author != current_agent:
                        _agent_telemetry.on_agent_start(author)
                        current_agent = author
                        print(f"\n\n[{author}]:\n", end="", flush=True)
                    _agent_telemetry.on_agent_text(text)
                    print(text, end="", flush=True)
        
        # Get final result
        result = await stream.get_final_response()
        
        # Extract consolidated messages from the output
        outputs = result.get_outputs() if hasattr(result, 'get_outputs') else []
        for output in outputs:
            if isinstance(output, list):
                messages.extend(output)
            else:
                messages.append(output)
        
        print("\n\n" + "="*70)
        print("WORKFLOW COMPLETE")
        print("="*70)
        print()

        # Calculate duration
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()

        # End the trace span successfully
        telemetry_summary = _agent_telemetry.finalise(
            duration_seconds=duration,
            total_rounds=len(messages),
            success=True,
        )
        _span.set_attribute("workflow.total_turns", telemetry_summary["total_turns"])
        _span.set_attribute("workflow.estimated_tokens", telemetry_summary["estimated_total_tokens"])
        _span.set_status(trace.StatusCode.OK)
        _span.end()
    
    except Exception as e:
        if '_agent_telemetry' in locals():
            _agent_telemetry.finalise(
                duration_seconds=(datetime.now() - start_time).total_seconds(),
                total_rounds=0,
                success=False,
                error=str(e),
            )
        if '_span' in locals():
            _span.set_status(trace.StatusCode.ERROR, str(e))
            _span.end()
        print(f"\n\n❌ Workflow error: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # duration already calculated inside try block
    
    # Display summary
    print(format_workflow_summary(
        termination_reason=termination_reason,
        total_rounds=len(messages),
        duration_seconds=duration
    ))
    
    # Display full transcript
    if messages:
        print(format_conversation_transcript(messages))
    
    # Save to file (if not already saved by Publisher via MCP)
    print("\n💾 Saving workflow results...")
    
    # Extract platform posts from Publisher's message (if available)
    publisher_content = None
    for msg in reversed(messages):
        author = getattr(msg, 'author_name', None) or ''
        if author == "Publisher":
            publisher_content = getattr(msg, 'text', None) or str(msg)
            break
    
    if publisher_content:
        # Format as markdown
        markdown_content = format_posts_to_markdown(
            linkedin_post="[Extract from Publisher output]",
            twitter_post="[Extract from Publisher output]",
            instagram_post="[Extract from Publisher output]",
            campaign_brief=CAMPAIGN_BRIEF
        )
        
        # Append full transcript
        markdown_content += "\n\n## Conversation Transcript\n\n"
        markdown_content += format_conversation_transcript(messages)
        
        # Save to file
        filepath = save_posts_manually(markdown_content)
        if filepath:
            print(f"✅ Workflow results saved to: {filepath}")
    
    print("\n" + "="*70)
    print("SESSION COMPLETE")
    print("="*70)


# ============================================================================
# ENTRY POINT
# ============================================================================

def main():
    """
    Main entry point for the workflow.
    """
    try:
        asyncio.run(run_workflow())
    except KeyboardInterrupt:
        print("\n\n⚠️ Workflow interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        # Ensure supergateway subprocess is cleaned up
        _cleanup_gateway()
        # Suppress cosmetic MCP SDK async-generator cleanup errors that
        # the asyncio event-loop finaliser prints to stderr on exit.
        sys.stderr = open(os.devnull, "w")


if __name__ == "__main__":
    main()
