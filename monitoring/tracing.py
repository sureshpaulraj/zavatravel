"""
Distributed Tracing Setup — Azure Monitor + OpenTelemetry

Configures OpenTelemetry with Azure Monitor exporter so that every
LLM call, agent turn, and workflow execution is captured as a trace
visible in Application Insights → Transaction Search / End-to-end tracing.

Gracefully degrades: if APPLICATIONINSIGHTS_CONNECTION_STRING is not set,
tracing is silently disabled and the workflow runs normally.
"""

import os
import logging
from typing import Optional

from opentelemetry import trace

_TRACER_NAME = "zava-travel-agents"
_configured = False
logger = logging.getLogger(__name__)


def configure_tracing() -> bool:
    """
    Initialise OpenTelemetry + Azure Monitor if Application Insights
    connection string is available.

    Returns:
        True if tracing was successfully configured, False otherwise.
    """
    global _configured
    if _configured:
        return True

    conn_str = os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING")
    if not conn_str:
        print("ℹ️  Tracing not enabled (APPLICATIONINSIGHTS_CONNECTION_STRING not set)")
        return False

    try:
        from azure.monitor.opentelemetry import configure_azure_monitor
        from monitoring.pii_middleware import PIIScrubber

        # configure_azure_monitor wires up the TracerProvider, exporter,
        # and auto-instrumentation for requests / httpx / logging.
        configure_azure_monitor(
            connection_string=conn_str,
            enable_live_metrics=True,
            # Instrument the GenAI semantic conventions for LLM spans
            instrumentation_options={
                "azure_sdk": {"enabled": True},
                "fastapi": {"enabled": True},
                "requests": {"enabled": True},
                "httpx": {"enabled": True},
            },
        )

        # Attach PII scrubber to the active TracerProvider
        provider = trace.get_tracer_provider()
        if hasattr(provider, "add_span_processor"):
            provider.add_span_processor(PIIScrubber())
            print("🛡️  PII scrubbing middleware attached to trace pipeline")

        _configured = True
        print(f"✅ Observability enabled — traces → Application Insights (agentappinsights)")
        return True

    except ImportError:
        print("⚠️  azure-monitor-opentelemetry not installed — tracing disabled")
        print("   Install with: pip install azure-monitor-opentelemetry")
        return False
    except Exception as e:
        logger.warning("Failed to configure tracing: %s", e)
        print(f"⚠️  Tracing setup failed: {e} — continuing without observability")
        return False


def get_tracer(name: Optional[str] = None) -> trace.Tracer:
    """
    Get an OpenTelemetry tracer instance.

    Args:
        name: Tracer name (defaults to 'zava-travel-agents')

    Returns:
        Tracer instance (no-op if tracing not configured)
    """
    return trace.get_tracer(name or _TRACER_NAME)
