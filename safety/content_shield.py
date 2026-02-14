"""
Content Safety Shield — Two-Layer Protection

Layer 1:  Azure AI Content Safety (4 harm categories — Hate, Violence,
          Sexual, Self-Harm)  via the azure-ai-contentsafety SDK.
          Gracefully degrades if not configured.

Layer 2:  Brand-specific local filters (competitors, banned words,
          unsafe activities, PII, jailbreak detection) — always active,
          no external service needed.

Usage:
    from safety import ContentSafetyShield

    shield = ContentSafetyShield()

    # Screen user input (campaign brief)
    result = shield.screen_input(brief_text)
    if not result.allowed:
        print("Blocked:", result.summary)

    # Screen agent output (generated posts)
    result = shield.screen_output(publisher_text)
    for flag in result.flags:
        print(flag.severity, flag.detail, flag.suggestion)
"""

import os
import logging
from typing import List, Optional

from safety.brand_filters import (
    SafetyFlag,
    ShieldResult,
    run_input_filters,
    run_output_filters,
)

logger = logging.getLogger(__name__)

# Map Azure CS category names to readable labels
_CATEGORY_LABELS = {
    "Hate":     "Hate speech",
    "Violence": "Violence",
    "Sexual":   "Sexual content",
    "SelfHarm": "Self-harm",
}


class ContentSafetyShield:
    """
    Two-layer content safety shield.

    Layer 1 — Azure AI Content Safety (cloud, optional):
        Analyses text against Hate / Violence / Sexual / Self-Harm categories.
        Requires ``CONTENT_SAFETY_ENDPOINT`` env var.

    Layer 2 — Brand filters (local, always active):
        Competitor mentions, banned words, unsafe activities, PII, jailbreak.
    """

    # Azure CS severity levels: 0 = safe, 2 = low, 4 = medium, 6 = high
    BLOCK_THRESHOLD = 4   # Block at medium or above
    WARN_THRESHOLD = 2    # Warn at low

    def __init__(self):
        self._azure_client = None
        self._azure_enabled = False
        self._init_azure_client()

    # ------------------------------------------------------------------
    # Azure Content Safety initialisation
    # ------------------------------------------------------------------

    def _init_azure_client(self) -> None:
        endpoint = os.getenv("CONTENT_SAFETY_ENDPOINT")
        if not endpoint:
            print("ℹ️  Azure Content Safety not configured (CONTENT_SAFETY_ENDPOINT not set)")
            print("   Brand-specific safety filters are still active.")
            return

        try:
            from azure.ai.contentsafety import ContentSafetyClient

            key = os.getenv("CONTENT_SAFETY_KEY")
            if key:
                from azure.core.credentials import AzureKeyCredential
                self._azure_client = ContentSafetyClient(
                    endpoint=endpoint,
                    credential=AzureKeyCredential(key),
                )
            else:
                from azure.identity import DefaultAzureCredential
                self._azure_client = ContentSafetyClient(
                    endpoint=endpoint,
                    credential=DefaultAzureCredential(),
                )

            self._azure_enabled = True
            print("✅ Azure Content Safety shield active")

        except ImportError:
            print("⚠️  azure-ai-contentsafety not installed — using brand filters only")
            print("   Install with: pip install azure-ai-contentsafety")
        except Exception as exc:
            logger.warning("Failed to init Content Safety client: %s", exc)
            print(f"⚠️  Azure Content Safety init failed: {exc}")
            print("   Brand-specific safety filters are still active.")

    # ------------------------------------------------------------------
    # Azure Content Safety analysis
    # ------------------------------------------------------------------

    def _analyze_with_azure(self, text: str) -> List[SafetyFlag]:
        """Run Azure AI Content Safety analysis on *text*.

        Returns a list of SafetyFlags (may be empty if text is clean or
        if Azure CS is not configured).
        """
        if not self._azure_client:
            return []

        try:
            from azure.ai.contentsafety.models import AnalyzeTextOptions

            # Azure CS API has a 10 000-character limit per request
            response = self._azure_client.analyze_text(
                AnalyzeTextOptions(text=text[:10_000])
            )

            flags: List[SafetyFlag] = []
            for item in response.categories_analysis:
                cat = str(item.category)
                sev = item.severity
                label = _CATEGORY_LABELS.get(cat, cat)

                if sev >= self.BLOCK_THRESHOLD:
                    flags.append(SafetyFlag(
                        category=f"azure_cs_{cat.lower()}",
                        severity="blocked",
                        detail=f"Azure Content Safety: {label} (severity {sev}/6)",
                        matched_text=f"[{cat}: severity {sev}]",
                        suggestion="Remove or rewrite the flagged content.",
                    ))
                elif sev >= self.WARN_THRESHOLD:
                    flags.append(SafetyFlag(
                        category=f"azure_cs_{cat.lower()}",
                        severity="warning",
                        detail=f"Azure Content Safety: {label} (severity {sev}/6)",
                        matched_text=f"[{cat}: severity {sev}]",
                        suggestion="Review the flagged content for appropriateness.",
                    ))

            return flags

        except Exception as exc:
            logger.warning("Azure Content Safety analysis failed: %s", exc)
            return []

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def screen_input(self, text: str) -> ShieldResult:
        """Screen an input campaign brief before it reaches the agents.

        Checks:
          1. Azure Content Safety  (Hate / Violence / Sexual / Self-Harm)
          2. Jailbreak detection   (prompt-injection patterns)
        """
        all_flags: List[SafetyFlag] = []

        # Layer 1 — Azure AI Content Safety
        all_flags.extend(self._analyze_with_azure(text))

        # Layer 2 — Brand-specific input filters (jailbreak only)
        brand_result = run_input_filters(text)
        all_flags.extend(brand_result.flags)

        allowed = not any(f.severity == "blocked" for f in all_flags)
        return ShieldResult(allowed=allowed, flags=all_flags)

    def screen_output(self, text: str, agent_name: str = "") -> ShieldResult:
        """Screen agent-generated content before it is returned to the user.

        Checks:
          1. Azure Content Safety  (Hate / Violence / Sexual / Self-Harm)
          2. Competitor mentions    (VoyageNow, CookTravel, WanderPath)
          3. Banned words           ("cheap", "tourist", …)
          4. Unsafe activities      (dangerous without safety gear, …)
          5. PII in content         (email, phone, SSN)
        """
        all_flags: List[SafetyFlag] = []

        # Layer 1 — Azure AI Content Safety
        all_flags.extend(self._analyze_with_azure(text))

        # Layer 2 — Brand-specific output filters
        brand_result = run_output_filters(text)
        all_flags.extend(brand_result.flags)

        allowed = not any(f.severity == "blocked" for f in all_flags)
        return ShieldResult(allowed=allowed, flags=all_flags)

    @property
    def azure_enabled(self) -> bool:
        """True if Azure Content Safety is configured and available."""
        return self._azure_enabled
