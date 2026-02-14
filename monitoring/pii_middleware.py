"""
PII Scrubbing Middleware

Prevents personally identifiable information (PII) from leaking into
Application Insights telemetry.  Runs as an OpenTelemetry SpanProcessor
that sanitises span attributes before they are exported.

Patterns scrubbed:
  - Email addresses
  - Phone numbers (US / international)
  - Credit-card numbers (basic Luhn-length patterns)
  - IP addresses (v4)
  - Bearer / API tokens in Authorization headers
"""

import re
from typing import Optional

from opentelemetry.sdk.trace import SpanProcessor, ReadableSpan
from opentelemetry.context import Context


# ---------------------------------------------------------------------------
# Regex patterns for common PII
# ---------------------------------------------------------------------------
_PII_PATTERNS = [
    # Email addresses
    (re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"), "[EMAIL_REDACTED]"),
    # US / intl phone numbers  (e.g. +1-555-123-4567, (555) 123-4567)
    (re.compile(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"), "[PHONE_REDACTED]"),
    # Credit-card-like 13-19 digit sequences (with optional separators)
    (re.compile(r"\b(?:\d[-\s]?){13,19}\b"), "[CC_REDACTED]"),
    # IPv4 addresses
    (re.compile(r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b"), "[IP_REDACTED]"),
    # Bearer / API-Key tokens
    (re.compile(r"(Bearer|Api-Key|ApiKey|Authorization)\s+\S+", re.IGNORECASE), r"\1 [TOKEN_REDACTED]"),
]


def scrub_pii(text: str) -> str:
    """Replace PII patterns in *text* with redaction placeholders."""
    for pattern, replacement in _PII_PATTERNS:
        text = pattern.sub(replacement, text)
    return text


class PIIScrubber(SpanProcessor):
    """
    OpenTelemetry SpanProcessor that scrubs PII from span attributes
    before the span is exported to Application Insights.

    Usage:
        from opentelemetry.sdk.trace import TracerProvider
        provider = TracerProvider()
        provider.add_span_processor(PIIScrubber())
    """

    # Attribute keys likely to carry user content or PII
    _SENSITIVE_KEYS = {
        "gen_ai.prompt",
        "gen_ai.completion",
        "gen_ai.content.prompt",
        "gen_ai.content.completion",
        "http.url",
        "http.target",
        "db.statement",
        "messaging.message.body",
        "user.query",
        "user.message",
    }

    def on_start(self, span, parent_context: Optional[Context] = None):
        """No-op on start — scrubbing happens on end."""
        pass

    def on_end(self, span: ReadableSpan):
        """Scrub PII from sensitive attributes before export."""
        if not span.attributes:
            return

        # ReadableSpan.attributes is a MappingProxy — we need to mutate
        # the underlying dict through the internal reference.
        attrs = span.attributes
        needs_update = {}

        for key in attrs:
            # Check both exact matches and prefix matches (gen_ai.*)
            is_sensitive = key in self._SENSITIVE_KEYS or any(
                key.startswith(sk.rstrip("*")) for sk in self._SENSITIVE_KEYS
            )
            if is_sensitive:
                val = attrs[key]
                if isinstance(val, str):
                    scrubbed = scrub_pii(val)
                    if scrubbed != val:
                        needs_update[key] = scrubbed

        # Apply updates (mutate the span's internal attribute dict)
        if needs_update and hasattr(span, "_attributes"):
            for k, v in needs_update.items():
                span._attributes[k] = v

    def shutdown(self):
        pass

    def force_flush(self, timeout_millis: int = 30000) -> bool:
        return True
