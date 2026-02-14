"""
Conversation Transcript Formatting

Formats multi-agent conversation history for display and export.
"""

import re
from datetime import datetime
from typing import List, Dict, Any


def _infer_agent_name(text: str) -> str:
    """
    Try to extract the real agent name from the message content.

    The agent-framework GroupChat orchestrator sometimes delivers messages
    whose ``author_name`` is *None* — typically for the Reviewer (whose
    system prompt self-identifies via ``[Agent Name: Reviewer]``) and for
    the orchestrator itself when it re-injects the campaign brief for a
    second iteration.

    Returns the inferred name, or ``"Orchestrator"`` when no agent tag is
    found (i.e. the message is an orchestrator-injected brief).
    """
    m = re.match(r"\[Agent Name:\s*(\w+)\]", text)
    if m:
        return m.group(1)
    # No [Agent Name: …] tag → orchestrator re-injecting the original brief
    return "Orchestrator"


def _strip_agent_tag(text: str) -> str:
    """Remove the leading ``[Agent Name: X]`` tag from a message body."""
    return re.sub(r"^\[Agent Name:\s*\w+\]\s*\n?", "", text).strip()


def _consolidate_messages(messages: List[Any]) -> List[Dict[str, str]]:
    """
    Consolidate consecutive messages from the same author into single entries.
    Handles both token-level streaming fragments and full messages.

    When ``author_name`` is missing (None / empty) on a message object, we
    fall back to parsing the ``[Agent Name: X]`` prefix that agents embed in
    their responses, or label the message as "Orchestrator".
    """
    consolidated = []
    for msg in messages:
        if hasattr(msg, 'author_name'):
            name = msg.author_name or ''
            text = getattr(msg, 'text', '') or ''
        else:
            name = msg.get('author_name', msg.get('agent_name', ''))
            text = msg.get('text', msg.get('content', ''))

        if not text:
            continue

        # Resolve "Unknown" / empty names by inspecting the text body
        if not name:
            name = _infer_agent_name(text)
            text = _strip_agent_tag(text)

        if not text:
            continue
        
        if consolidated and consolidated[-1]['name'] == name:
            consolidated[-1]['text'] += text
        else:
            consolidated.append({'name': name, 'text': text})
    
    return consolidated


def format_conversation_transcript(messages: List[Any]) -> str:
    """
    Format agent conversation transcript with clear structure.
    Consolidates consecutive messages from the same agent into single rounds.
    
    Args:
        messages: List of agent messages (Message objects or dicts)
        
    Returns:
        str: Formatted conversation transcript
    """
    transcript = "\n" + "="*70 + "\n"
    transcript += "CONVERSATION TRANSCRIPT\n"
    transcript += "="*70 + "\n\n"
    
    turns = _consolidate_messages(messages)
    
    for idx, turn in enumerate(turns, 1):
        transcript += f"Round {idx}: {turn['name']}\n"
        transcript += "-" * 70 + "\n"
        transcript += turn['text'] + "\n\n"
    
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
    turns = _consolidate_messages(messages)
    for idx, turn in enumerate(turns, 1):
        md += f"### Round {idx}: {turn['name']}\n\n"
        md += turn['text'] + "\n\n"
    
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
