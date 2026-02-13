"""
Speaker Selection Logic for Multi-Agent Group Chat

Implements round-robin speaker selection with conditional fast-tracking
to Publisher agent when Reviewer approves content.
"""


def speaker_selector(state):
    """
    Round-robin speaker selection with fast-track logic for approval.
    
    Sequence: Creator → Reviewer → Creator → Reviewer → Publisher
    Fast-track: If Reviewer says "APPROVED", skip to Publisher immediately
    
    Args:
        state: GroupChatState with current_round, participants, and conversation
        
    Returns:
        str: Name of next speaker ("Creator", "Reviewer", or "Publisher")
    """
    # Check for fast-track condition
    last_message = state.conversation[-1] if state.conversation else None
    
    if last_message and "APPROVED" in (getattr(last_message, 'text', '') or ''):
        print("\n🚀 Fast-track: Reviewer approved! Moving to Publisher...\n")
        return "Publisher"
    
    # Round-robin sequence
    sequence = ["Creator", "Reviewer", "Creator", "Reviewer", "Publisher"]
    current_round = state.current_round
    
    next_speaker = sequence[current_round % len(sequence)]
    
    return next_speaker
