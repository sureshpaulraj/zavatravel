"""
Agent Telemetry Middleware

Wraps multi-agent workflow events to create per-agent OpenTelemetry spans.
Each agent turn (Creator, Reviewer, Publisher) becomes a child span under
the workflow root span, capturing:

  - Agent name and reasoning pattern
  - Turn duration (start → finish)
  - Input/output character counts
  - Approximate token estimate  (chars / 4)
  - Turn index within the conversation
  - Success / error status

Usage:
    middleware = AgentTelemetryMiddleware()
    # In the streaming loop:
    middleware.on_agent_start(agent_name)
    middleware.on_agent_text(text_delta)
    middleware.on_agent_end(agent_name)
    # At workflow end:
    middleware.finalise(duration_seconds, total_rounds)
"""

import time
import logging
from typing import Optional

from opentelemetry import trace
from monitoring.tracing import get_tracer

logger = logging.getLogger(__name__)

# Known reasoning patterns per agent
_REASONING_PATTERNS = {
    "Creator": "Chain-of-Thought",
    "Reviewer": "ReAct",
    "Publisher": "Self-Reflection",
    "Orchestrator": "Router",
}


class AgentTelemetryMiddleware:
    """
    Lightweight middleware that creates OpenTelemetry child spans for each
    agent turn in a GroupChat workflow.

    Attach to the streaming event loop — call ``on_agent_start`` when a new
    agent begins responding, ``on_agent_text`` for each text delta, and
    ``on_agent_end`` when the agent finishes.
    """

    def __init__(self, parent_span: Optional[trace.Span] = None):
        self._tracer = get_tracer("zava-agent-middleware")
        self._parent_span = parent_span
        self._current_span: Optional[trace.Span] = None
        self._current_agent: Optional[str] = None
        self._turn_index = 0
        self._turn_start: float = 0.0
        self._turn_chars: int = 0
        self._total_input_chars: int = 0
        self._total_output_chars: int = 0
        self._agent_turn_counts: dict = {}

    # ------------------------------------------------------------------
    # Event hooks
    # ------------------------------------------------------------------

    def on_agent_start(self, agent_name: str, input_text: str = "") -> None:
        """Call when a new agent turn begins."""
        # Close any lingering span from a previous turn
        self._close_current_span()

        self._turn_index += 1
        self._current_agent = agent_name
        self._turn_start = time.monotonic()
        self._turn_chars = 0

        # Track per-agent turn counts
        self._agent_turn_counts[agent_name] = (
            self._agent_turn_counts.get(agent_name, 0) + 1
        )

        if input_text:
            self._total_input_chars += len(input_text)

        # Create a child span for this agent turn
        context = (
            trace.set_span_in_context(self._parent_span)
            if self._parent_span
            else None
        )
        self._current_span = self._tracer.start_span(
            f"agent-turn-{agent_name.lower()}",
            context=context,
            attributes={
                "agent.name": agent_name,
                "agent.reasoning_pattern": _REASONING_PATTERNS.get(
                    agent_name, "Unknown"
                ),
                "agent.turn_index": self._turn_index,
                "agent.turn_number_for_agent": self._agent_turn_counts[agent_name],
            },
        )

        logger.debug(
            "📊 Telemetry: agent turn started — %s (turn %d)",
            agent_name,
            self._turn_index,
        )

    def on_agent_text(self, text_delta: str) -> None:
        """Call for each text chunk streamed by the current agent."""
        if text_delta:
            self._turn_chars += len(text_delta)

    def on_agent_end(self, agent_name: str) -> None:
        """Call when an agent turn finishes."""
        if self._current_agent and self._current_agent == agent_name:
            self._close_current_span()

    # ------------------------------------------------------------------
    # Workflow-level finalisation
    # ------------------------------------------------------------------

    def finalise(
        self,
        duration_seconds: float,
        total_rounds: int,
        success: bool = True,
        error: Optional[str] = None,
    ) -> dict:
        """
        Close any open spans and return a summary of telemetry data.

        Returns:
            dict with workflow-level telemetry summary.
        """
        self._close_current_span()

        summary = {
            "total_turns": self._turn_index,
            "total_rounds": total_rounds,
            "duration_seconds": round(duration_seconds, 2),
            "total_input_chars": self._total_input_chars,
            "total_output_chars": self._total_output_chars,
            "estimated_total_tokens": (
                self._total_input_chars + self._total_output_chars
            )
            // 4,
            "agent_turn_counts": dict(self._agent_turn_counts),
            "success": success,
        }
        if error:
            summary["error"] = error

        logger.info("📊 Telemetry summary: %s", summary)
        return summary

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _close_current_span(self) -> None:
        """End the currently-open agent span, recording final attributes."""
        if self._current_span is None:
            return

        turn_duration = time.monotonic() - self._turn_start
        self._total_output_chars += self._turn_chars

        self._current_span.set_attributes(
            {
                "agent.output_chars": self._turn_chars,
                "agent.estimated_output_tokens": self._turn_chars // 4,
                "agent.turn_duration_ms": int(turn_duration * 1000),
            }
        )
        self._current_span.set_status(trace.StatusCode.OK)
        self._current_span.end()

        logger.debug(
            "📊 Telemetry: agent turn ended — %s  (%d chars, %.1fs)",
            self._current_agent,
            self._turn_chars,
            turn_duration,
        )

        self._current_span = None
        self._current_agent = None
