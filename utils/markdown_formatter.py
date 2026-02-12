"""
Markdown Export Utilities

Formats platform posts and transcripts for markdown export.
"""

from datetime import datetime


def format_posts_to_markdown(
    linkedin_post: str,
    twitter_post: str,
    instagram_post: str,
    campaign_brief: str = None
) -> str:
    """
    Format three platform posts into a structured markdown document.
    
    Args:
        linkedin_post: LinkedIn post content
        twitter_post: Twitter post content
        instagram_post: Instagram post content
        campaign_brief: Original campaign brief (optional)
        
    Returns:
        str: Markdown-formatted document
    """
    md = f"# Social Media Content — Zava Travel Inc.\n\n"
    md += f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    md += "---\n\n"
    
    if campaign_brief:
        md += "## Campaign Brief\n\n"
        md += campaign_brief + "\n\n"
        md += "---\n\n"
    
    md += "## Platform Posts\n\n"
    
    # LinkedIn
    md += "### LinkedIn\n\n"
    md += linkedin_post + "\n\n"
    md += "**Format**: Professional-conversational\n"
    md += "**Target**: Millennials & Gen-Z adventure seekers (professional context)\n\n"
    md += "---\n\n"
    
    # Twitter
    md += "### X/Twitter\n\n"
    md += twitter_post + "\n\n"
    md += "**Format**: Punchy and immediate (≤280 characters)\n"
    md += "**Target**: Quick engagement, wanderlust inspiration\n\n"
    md += "---\n\n"
    
    # Instagram
    md += "### Instagram\n\n"
    md += instagram_post + "\n\n"
    md += "**Format**: Casual storytelling with visual suggestion\n"
    md += "**Target**: Community-driven, aspirational travel content\n\n"
    md += "---\n\n"
    
    md += "## Usage Notes\n\n"
    md += "- All posts maintain Zava Travel's **adventurous and inspiring** brand voice\n"
    md += "- Approved hashtags included: #ZavaTravel, #WanderMore, #AdventureAwaits, #TravelOnABudget\n"
    md += "- Platform-specific CTAs optimized for each audience\n"
    md += "- Ready for immediate publishing\n"
    
    return md
