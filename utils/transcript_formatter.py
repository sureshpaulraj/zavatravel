"""
Conversation Transcript Formatting

Formats multi-agent conversation history for display and export.
"""

from datetime import datetime
from typing import List, Dict, Any


def format_conversation_transcript(messages: List[Any]) -> str:
    """
    Format agent conversation transcript with clear structure.
    
    Args:
        messages: List of agent messages (AgentMessage objects or dicts)
        
    Returns:
        str: Formatted conversation transcript
    """
    transcript = "\n" + "="*70 + "\n"
    transcript += "CONVERSATION TRANSCRIPT\n"
    transcript += "="*70 + "\n\n"
    
    for idx, msg in enumerate(messages, 1):
        # Handle both object and dict formats
        if hasattr(msg, 'agent_name'):
            agent_name = msg.agent_name
            content = msg.content
            round_num = getattr(msg, 'round_number', idx)
        else:
            agent_name = msg.get('agent_name', 'Unknown')
            content = msg.get('content', '')
            round_num = msg.get('round_number', idx)
        
        transcript += f"Round {round_num}: {agent_name}\n"
        transcript += "-" * 70 + "\n"
        transcript += content + "\n\n"
    
    transcript += "="*70 + "\n"
    transcript += "END OF TRANSCRIPT\n"
    transcript += "="*70 + "\n"
    
    return transcript


def format_workflow_summary(
    termination_reason: str,
    total_rounds: int,
    duration_seconds: float
) -> str:
    """
    Format workflow execution summary.
    
    Args:
        termination_reason: Why workflow ended
        total_rounds: Number of conversation rounds
        duration_seconds: Execution time
        
    Returns:
        str: Formatted summary
    """
    summary = "\n" + "="*70 + "\n"
    summary += "WORKFLOW SUMMARY\n"
    summary += "="*70 + "\n"
    summary += f"Termination Reason: {termination_reason}\n"
    summary += f"Total Rounds: {total_rounds}\n"
    summary += f"Duration: {duration_seconds:.1f} seconds\n"
    summary += "="*70 + "\n"
    
    return summary


def export_to_markdown(
    messages: List[Any],
    linkedin_post: str = None,
    twitter_post: str = None,
    instagram_post: str = None,
    metadata: Dict[str, Any] = None
) -> str:
    """
    Export complete workflow results to markdown format.
    
    Args:
        messages: List of agent messages
        linkedin_post: LinkedIn post content
        twitter_post: Twitter post content
        instagram_post: Instagram post content
        metadata: Additional workflow metadata
        
    Returns:
        str: Markdown-formatted output
    """
    md = f"# Social Media Content Creation — Workflow Output\n\n"
    md += f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    
    if metadata:
        md += "## Workflow Metadata\n\n"
        for key, value in metadata.items():
            md += f"- **{key.replace('_', ' ').title()}**: {value}\n"
        md += "\n"
    
    md += "## Conversation Transcript\n\n"
    for idx, msg in enumerate(messages, 1):
        if hasattr(msg, 'agent_name'):
            agent_name = msg.agent_name
            content = msg.content
        else:
            agent_name = msg.get('agent_name', 'Unknown')
            content = msg.get('content', '')
        
        md += f"### Round {idx}: {agent_name}\n\n"
        md += content + "\n\n"
    
    if linkedin_post or twitter_post or instagram_post:
        md += "## Platform-Ready Posts\n\n"
        
        if linkedin_post:
            md += "### LinkedIn\n\n"
            md += linkedin_post + "\n\n"
        
        if twitter_post:
            md += "### X/Twitter\n\n"
            md += twitter_post + "\n\n"
        
        if instagram_post:
            md += "### Instagram\n\n"
            md += instagram_post + "\n\n"
    
    return md
