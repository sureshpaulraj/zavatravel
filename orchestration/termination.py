"""
Termination Logic for Multi-Agent Group Chat

Defines conditions under which the workflow should terminate:
1. Publisher has completed formatting
2. Maximum rounds reached (safety termination)
3. Reviewer approved and fast-tracked to Publisher
"""


def should_terminate(messages) -> bool:
    """
    Determine if the workflow should terminate.
    
    Termination conditions:
    1. Publisher has spoken (content finalized)
    2. Maximum message count reached (safety termination)
    3. Reviewer approved (fast-track scenario — continue for Publisher)
    
    Args:
        messages: list[Message] — the conversation history
        
    Returns:
        bool: True if workflow should terminate, False otherwise
    """
    if not messages:
        return False
    
    last_msg = messages[-1]
    last_speaker = getattr(last_msg, 'author_name', None) or ''
    last_content = getattr(last_msg, 'text', '') or ''
    
    # Condition 1: Publisher has completed formatting
    if last_speaker == "Publisher":
        print("\n✅ Termination: Publisher has completed all platform posts\n")
        return True
    
    # Condition 2: Max messages reached (safety termination)
    if len(messages) >= 10:
        print("\n⚠️ Termination: Maximum messages reached\n")
        return True
    
    # Condition 3: Reviewer approved (continue so Publisher can speak next)
    if "APPROVED" in last_content and last_speaker == "Reviewer":
        return False
    
    return False
