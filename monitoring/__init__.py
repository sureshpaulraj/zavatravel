"""
Monitoring & Observability Module

Provides distributed tracing via OpenTelemetry + Azure Monitor (Application Insights).
Includes:
  - PII-scrubbing span processor to prevent sensitive data export
  - Agent telemetry middleware for per-agent turn tracing
"""

from monitoring.tracing import configure_tracing, get_tracer
from monitoring.pii_middleware import PIIScrubber
from monitoring.agent_middleware import AgentTelemetryMiddleware

__all__ = ["configure_tracing", "get_tracer", "PIIScrubber", "AgentTelemetryMiddleware"]
