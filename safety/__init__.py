"""
Content Safety — Zava Travel Inc.

Two-layer content safety shield:
  Layer 1: Azure AI Content Safety (Hate, Violence, Sexual, Self-Harm)
  Layer 2: Brand-specific local filters (competitors, banned words,
           unsafe activities, PII, jailbreak detection)
"""

from safety.content_shield import ContentSafetyShield
from safety.brand_filters import SafetyFlag, ShieldResult

__all__ = [
    "ContentSafetyShield",
    "SafetyFlag",
    "ShieldResult",
]
