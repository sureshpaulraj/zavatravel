"""
Brand Guidelines Grounding

Reads the brand-guidelines markdown file and embeds the content directly
into the Creator agent's system instructions so it can reference brand
voice, tone, colours, hashtags, and constraints during content generation.

This avoids the need for vector-store / File Search APIs and works with
any Azure OpenAI deployment (Chat Completions or Responses).
"""

from __future__ import annotations

import os

from agent_framework import Agent


def _load_brand_guidelines(file_path: str) -> str | None:
    """Read the brand-guidelines file and return its content."""
    if not os.path.exists(file_path):
        print(f"⚠️ Brand guidelines not found: {file_path}")
        return None
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        print(f"📄 Loaded brand guidelines ({len(content):,} chars) from {file_path}")
        return content
    except Exception as e:
        print(f"❌ Failed to read brand guidelines: {e}")
        return None


def create_grounded_agent(
    client,
    name: str,
    instructions: str,
    brand_guidelines_path: str = "grounding/brand-guidelines.md",
) -> Agent:
    """
    Create an Agent whose instructions include the full brand guidelines.

    The guidelines are appended to the agent's system instructions inside a
    clearly delimited ``<brand-guidelines>`` block so the model can reference
    specific brand rules (voice, tone, hashtags, competitors to avoid, etc.)
    during content generation.

    Args:
        client: Any chat client (``AzureOpenAIChatClient``, etc.).
        name: Agent display name.
        instructions: Base system-prompt instructions.
        brand_guidelines_path: Path to the brand-guidelines markdown file.

    Returns:
        ``Agent`` instance with grounded instructions.
    """
    guidelines = _load_brand_guidelines(brand_guidelines_path)

    if guidelines:
        instructions += (
            "\n\n"
            "## Brand Guidelines Reference\n"
            "Use the following brand guidelines when generating content. "
            "Cite specific brand elements (voice, tone, hashtags, pricing, "
            "competitor restrictions) in your reasoning.\n\n"
            "<brand-guidelines>\n"
            f"{guidelines}\n"
            "</brand-guidelines>"
        )
        print("✅ Brand guidelines embedded in Creator instructions")
    else:
        print("⚠️ Creator will run without brand guidelines grounding")

    return Agent(
        client=client,
        name=name,
        instructions=instructions,
    )
