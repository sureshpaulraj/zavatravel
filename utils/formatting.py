"""
Platform-Specific Formatting Utilities

Provides validation functions for social media platform constraints.
"""


def twitter_char_count(text: str) -> int:
    """
    Approximate Twitter character count.
    Treats most emojis as 2 characters for safety (conservative estimate).
    
    Args:
        text: Text to count
        
    Returns:
        int: Estimated character count
    """
    # Count emojis (Unicode code points > 0x1F300) as 2 characters
    emoji_count = sum(1 for c in text if ord(c) > 0x1F300)
    base_count = len(text)
    
    # Conservative estimate: base count + extra emoji character
    return base_count + emoji_count


def validate_linkedin_post(post: str) -> dict:
    """
    Validate LinkedIn post constraints.
    
    Args:
        post: LinkedIn post text
        
    Returns:
        dict: Validation results with 'valid' boolean and 'issues' list
    """
    issues = []
    
    # Count hashtags
    hashtags = [word for word in post.split() if word.startswith('#')]
    if len(hashtags) < 3 or len(hashtags) > 5:
        issues.append(f"Hashtag count {len(hashtags)} not in range 3-5")
    
    # Check for paragraphs (newlines present)
    if '\n\n' not in post:
        issues.append("Missing paragraph structure (no double newlines)")
    
    # Word count check
    word_count = len(post.split())
    if word_count < 50 or word_count > 350:
        issues.append(f"Word count {word_count} not in typical range 150-300")
    
    return {
        'valid': len(issues) == 0,
        'issues': issues,
        'hashtag_count': len(hashtags),
        'word_count': word_count
    }


def validate_twitter_post(post: str) -> dict:
    """
    Validate Twitter/X post constraints.
    
    Args:
        post: Twitter post text
        
    Returns:
        dict: Validation results with 'valid' boolean and 'issues' list
    """
    issues = []
    
    # Character count (strict limit)
    char_count = twitter_char_count(post)
    if char_count > 280:
        issues.append(f"Character count {char_count} exceeds 280 limit")
    
    # Count hashtags
    hashtags = [word for word in post.split() if word.startswith('#')]
    if len(hashtags) < 2 or len(hashtags) > 3:
        issues.append(f"Hashtag count {len(hashtags)} not in range 2-3")
    
    # Check for paragraphs (should NOT have them)
    if '\n\n' in post:
        issues.append("Twitter posts should not have multiple paragraphs")
    
    return {
        'valid': len(issues) == 0,
        'issues': issues,
        'char_count': char_count,
        'hashtag_count': len(hashtags)
    }


def validate_instagram_post(post: str) -> dict:
    """
    Validate Instagram post constraints.
    
    Args:
        post: Instagram post text (excluding visual suggestion)
        
    Returns:
        dict: Validation results with 'valid' boolean and 'issues' list
    """
    issues = []
    
    # Count hashtags
    hashtags = [word for word in post.split() if word.startswith('#')]
    if len(hashtags) < 5 or len(hashtags) > 10:
        issues.append(f"Hashtag count {len(hashtags)} not in range 5-10")
    
    # Count emojis
    emoji_count = sum(1 for c in post if ord(c) > 0x1F300)
    if emoji_count < 2:
        issues.append(f"Emoji count {emoji_count} is less than minimum 2")
    
    # Word count check
    word_count = len(post.split())
    if word_count < 100 or word_count > 180:
        issues.append(f"Word count {word_count} not in typical range 125-150")
    
    # Check for visual suggestion
    if '[Image:' not in post and '[image:' not in post.lower():
        issues.append("Missing visual suggestion in [Image: ...] format")
    
    return {
        'valid': len(issues) == 0,
        'issues': issues,
        'hashtag_count': len(hashtags),
        'emoji_count': emoji_count,
        'word_count': word_count
    }


def format_validation_report(platform: str, validation: dict) -> str:
    """
    Format validation results as a human-readable report.
    
    Args:
        platform: Platform name (LinkedIn, Twitter, Instagram)
        validation: Validation results dict
        
    Returns:
        str: Formatted report
    """
    status = "✅ PASS" if validation['valid'] else "❌ FAIL"
    report = f"\n{platform} Validation: {status}\n"
    
    if validation['valid']:
        report += "All constraints satisfied.\n"
    else:
        report += "Issues found:\n"
        for issue in validation['issues']:
            report += f"  - {issue}\n"
    
    # Add metrics
    if 'char_count' in validation:
        report += f"  Character count: {validation['char_count']}/280\n"
    if 'word_count' in validation:
        report += f"  Word count: {validation['word_count']}\n"
    if 'hashtag_count' in validation:
        report += f"  Hashtags: {validation['hashtag_count']}\n"
    if 'emoji_count' in validation:
        report += f"  Emojis: {validation['emoji_count']}\n"
    
    return report
