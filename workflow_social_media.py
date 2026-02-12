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
from azure.ai.projects import AIProjectClient

# Agent Framework imports (will need to be installed)
try:
    from agent_framework import GroupChatBuilder, AgentRunUpdateEvent, WorkflowOutputEvent
    from agent_framework.azure import AzureOpenAIChatClient
    from agent_framework.github import GitHubCopilotAgent
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
from tools.filesystem_mcp import get_filesystem_tools, save_posts_manually
from utils.transcript_formatter import format_conversation_transcript, format_workflow_summary
from utils.markdown_formatter import format_posts_to_markdown


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
    
    # Azure OpenAI client (for Creator and Publisher)
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
    
    # Azure AI Foundry project client (for File Search)
    try:
        project_client = AIProjectClient(
            endpoint=os.getenv("AZURE_AI_FOUNDRY_PROJECT_ENDPOINT"),
            credential=credential
        )
        print("✅ Azure AI Foundry project client initialized")
    except Exception as e:
        print(f"⚠️ Failed to initialize Foundry client: {e}")
        print("   Continuing without File Search grounding...")
        project_client = None
    
    # Create Creator agent with File Search grounding
    print("\n📝 Creating Creator agent...")
    if project_client:
        creator = create_grounded_agent(
            client=azure_client,
            name="Creator",
            instructions=CREATOR_INSTRUCTIONS,
            project_client=project_client,
            brand_guidelines_path="grounding/brand-guidelines.md"
        )
    else:
        creator = azure_client.create_agent(
            name="Creator",
            instructions=CREATOR_INSTRUCTIONS
        )
        print("⚠️ Creator agent created without grounding")
    
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
        reviewer = azure_client.create_agent(
            name="Reviewer",
            instructions=REVIEWER_INSTRUCTIONS
        )
    
    # Create Publisher agent with MCP filesystem tools
    print("\n📤 Creating Publisher agent...")
    publisher = azure_client.create_agent(
        name="Publisher",
        instructions=PUBLISHER_INSTRUCTIONS
    )
    
    # Attach MCP filesystem tools to Publisher
    print("\n🔧 Attaching external tools to Publisher...")
    filesystem_tools = get_filesystem_tools()
    if filesystem_tools:
        publisher.tools.extend(filesystem_tools)
    else:
        print("   ℹ️ Publisher will output to console only (no file save)")
    
    # Build group chat
    print("\n🏗️ Building group chat orchestration...")
    workflow = (
        GroupChatBuilder()
        .with_orchestrator(selection_func=speaker_selector)
        .participants([creator, reviewer, publisher])
        .with_termination_condition(should_terminate)
        .build()
    )
    
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
    termination_reason = "unknown"
    
    try:
        async for event in workflow.run_stream(CAMPAIGN_BRIEF):
            
            if isinstance(event, AgentRunUpdateEvent):
                # Real-time agent message streaming
                print(f"[{event.agent_name}]: {event.message_delta}", end="", flush=True)
            
            elif isinstance(event, WorkflowOutputEvent):
                # Workflow completed
                print("\n\n" + "="*70)
                print("WORKFLOW COMPLETE")
                print("="*70)
                print()
                
                # Extract transcript
                if hasattr(event, 'messages'):
                    messages = event.messages
                if hasattr(event, 'termination_reason'):
                    termination_reason = event.termination_reason
    
    except Exception as e:
        print(f"\n\n❌ Workflow error: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Calculate duration
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
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
        agent_name = getattr(msg, 'agent_name', msg.get('agent_name', ''))
        if agent_name == "Publisher":
            publisher_content = getattr(msg, 'content', msg.get('content', ''))
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


if __name__ == "__main__":
    main()
