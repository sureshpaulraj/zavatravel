"""
Termination Logic for Multi-Agent Group Chat

Defines conditions under which the workflow should terminate:
1. Publisher has completed formatting
2. Maximum rounds reached (safety termination)
3. Reviewer approved and fast-tracked to Publisher
"""


def should_terminate(state) -> bool:
    """
    Determine if the workflow should terminate.
    
    Termination conditions:
    1. Publisher has spoken (content finalized)
    2. Max rounds (5) completed (prevents infinite loops)
    3. Reviewer approved (fast-track scenario)
    
    Args:
        state: GroupChatState object containing messages and round information
        
    Returns:
        bool: True if workflow should terminate, False otherwise
    """
    if not state.messages:
        return False
    
    last_speaker = state.messages[-1].agent_name if state.messages else None
    last_content = state.messages[-1].content if state.messages else ""
    
    # Condition 1: Publisher has completed formatting
    if last_speaker == "Publisher":
        print("\n✅ Termination: Publisher has completed all platform posts\n")
        return True
    
    # Condition 2: Max rounds reached (safety termination)
    if state.current_round >= 5:
        print("\n⚠️ Termination: Maximum rounds (5) reached\n")
        return True
    
    # Condition 3: Reviewer approved (redundant with fast-track, but explicit)
    if "APPROVED" in last_content and last_speaker == "Reviewer":
        # Publisher will be next speaker via fast-track
        # This check ensures we continue one more round for Publisher
        return False
    
    return False
