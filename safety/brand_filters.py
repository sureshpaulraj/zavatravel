"""
Brand-Specific Safety Filters — Zava Travel Inc.

Pure-Python filters (no external dependencies) that enforce brand
guidelines and catch common content issues:

  Input filters:
    - Jailbreak / prompt-injection detection

  Output filters:
    - Competitor mentions  (VoyageNow, CookTravel, WanderPath)
    - Banned words          ("cheap", "tourist", "package deal", …)
    - Unsafe activity       (dangerous without safety gear, binge drinking, …)
    - PII in content        (email, phone, SSN)
"""

import re
from dataclasses import dataclass, field
from typing import List


# ============================================================================
# Data classes
# ============================================================================

@dataclass
class SafetyFlag:
    """A single content safety issue detected by a filter."""
    category: str        # e.g. "competitor_mention", "banned_word"
    severity: str        # "warning" | "blocked"
    detail: str          # Human-readable description
    matched_text: str    # The text that triggered the flag
    suggestion: str = "" # Optional suggested fix


@dataclass
class ShieldResult:
    """Aggregated result from one or more safety filters."""
    allowed: bool
    flags: List[SafetyFlag] = field(default_factory=list)

    @property
    def has_warnings(self) -> bool:
        return any(f.severity == "warning" for f in self.flags)

    @property
    def has_blocks(self) -> bool:
        return any(f.severity == "blocked" for f in self.flags)

    @property
    def summary(self) -> str:
        if not self.flags:
            return "Content passed all safety checks."
        return "; ".join(f.detail for f in self.flags)


# ============================================================================
# Brand constants (from grounding/brand-guidelines.md)
# ============================================================================

COMPETITORS = ["voyagenow", "cooktravel", "wanderpath"]

BANNED_WORDS = {
    "cheap":        "budget-friendly",   # also catches cheaper, cheapest
    "tourist":      "traveler",          # also catches tourists
    "package deal": "curated itinerary",
    "discount":     "special offer",     # also catches discounted, discounts
    "basic":        "essential",         # also catches basics
}

UNSAFE_PATTERNS = [
    (re.compile(r"without\s+(any\s+)?safety\s+(gear|equipment|precaution)", re.I),
     "Promotes unsafe activity without safety gear"),
    (re.compile(r"(get|getting)\s+(drunk|wasted|hammered|smashed)", re.I),
     "Promotes excessive alcohol consumption"),
    (re.compile(r"(forget|ignore|skip)\s+.{0,30}\bcustoms\b", re.I),
     "Culturally insensitive language"),
    (re.compile(r"(forget|ignore|skip)\s+.{0,30}\bculture\b", re.I),
     "Culturally insensitive language"),
    (re.compile(r"no\s+(helmet|life\s*jacket|harness|seatbelt)", re.I),
     "Promotes unsafe activity — missing safety equipment"),
    (re.compile(r"cheap\s+beer|cheap\s+drinks|cheap\s+alcohol", re.I),
     "Promotes low-cost drinking rather than culinary experience"),
]

PII_CONTENT_PATTERNS = [
    (re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"),
     "email_address", "Email address detected in content"),
    (re.compile(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"),
     "phone_number", "Phone number detected in content"),
    (re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
     "ssn", "SSN-like number detected in content"),
]

JAILBREAK_PATTERNS = [
    re.compile(r"ignore\s+(all\s+)?previous\s+instructions", re.I),
    re.compile(r"ignore\s+your\s+(instructions|rules|guidelines)", re.I),
    re.compile(r"you\s+are\s+now\s+(a\s+)?(DAN|evil|unfiltered)", re.I),
    re.compile(r"pretend\s+you\s+are\s+(not\s+)?(an?\s+)?(AI|assistant|chatbot)", re.I),
    re.compile(r"bypass\s+(your\s+)?safety\s+(filter|guard|check)", re.I),
    re.compile(r"do\s+not\s+follow\s+(your\s+)?(rules|guidelines|instructions)", re.I),
    re.compile(r"system\s*prompt\s*:", re.I),
    re.compile(r"disregard\s+(all\s+)?prior\s+(instructions|context)", re.I),
]


# ============================================================================
# Individual filter functions
# ============================================================================

def check_competitors(text: str) -> List[SafetyFlag]:
    """Check for competitor mentions (brand policy violation)."""
    flags = []
    lower = text.lower()
    for comp in COMPETITORS:
        if comp in lower:
            flags.append(SafetyFlag(
                category="competitor_mention",
                severity="blocked",
                detail=f"Competitor mention detected: '{comp}'",
                matched_text=comp,
                suggestion="Remove competitor name and focus on Zava Travel's strengths.",
            ))
    return flags


def check_banned_words(text: str) -> List[SafetyFlag]:
    """Check for brand-banned words and suggest replacements."""
    flags = []
    lower = text.lower()
    for word, replacement in BANNED_WORDS.items():
        # Match word stem — e.g. "cheap" also catches "cheaper", "cheapest"
        if re.search(rf"\b{re.escape(word)}", lower):
            flags.append(SafetyFlag(
                category="banned_word",
                severity="warning",
                detail=f"Brand-banned word detected: '{word}'",
                matched_text=word,
                suggestion=f"Replace '{word}' with '{replacement}'.",
            ))
    return flags


def check_unsafe_activity(text: str) -> List[SafetyFlag]:
    """Check for promotion of unsafe activities."""
    flags = []
    for pattern, desc in UNSAFE_PATTERNS:
        match = pattern.search(text)
        if match:
            flags.append(SafetyFlag(
                category="unsafe_activity",
                severity="blocked",
                detail=desc,
                matched_text=match.group(),
                suggestion="Rewrite to emphasise safe, guided experiences.",
            ))
    return flags


def check_pii_in_content(text: str) -> List[SafetyFlag]:
    """Check for PII leaked into generated content."""
    flags = []
    for pattern, pii_type, desc in PII_CONTENT_PATTERNS:
        match = pattern.search(text)
        if match:
            flags.append(SafetyFlag(
                category="pii_detected",
                severity="blocked",
                detail=desc,
                matched_text=match.group()[:20] + "…",
                suggestion="Remove personal data from the content.",
            ))
    return flags


def check_jailbreak(text: str) -> List[SafetyFlag]:
    """Check for prompt injection / jailbreak attempts."""
    flags = []
    for pattern in JAILBREAK_PATTERNS:
        match = pattern.search(text)
        if match:
            flags.append(SafetyFlag(
                category="jailbreak_attempt",
                severity="blocked",
                detail="Potential prompt-injection detected",
                matched_text=match.group(),
            ))
            break  # One is enough to block
    return flags


# ============================================================================
# Composite filters
# ============================================================================

def run_input_filters(text: str) -> ShieldResult:
    """Run all brand-specific filters appropriate for **input** text.

    Only jailbreak detection runs on inputs — brand-word filters do not
    apply because the brief may legitimately reference competitors-to-avoid
    or include words like "cheap" in instructions.
    """
    flags = check_jailbreak(text)
    allowed = not any(f.severity == "blocked" for f in flags)
    return ShieldResult(allowed=allowed, flags=flags)


def run_output_filters(text: str) -> ShieldResult:
    """Run all brand-specific filters appropriate for **output** text."""
    flags: List[SafetyFlag] = []
    flags.extend(check_competitors(text))
    flags.extend(check_banned_words(text))
    flags.extend(check_unsafe_activity(text))
    flags.extend(check_pii_in_content(text))

    allowed = not any(f.severity == "blocked" for f in flags)
    return ShieldResult(allowed=allowed, flags=flags)
