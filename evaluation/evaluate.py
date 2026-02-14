"""
Agentic Evaluation — Zava Travel Multi-Agent Content System

Evaluates the quality of the multi-agent social media content generation
workflow using the Azure AI Evaluation SDK.

Evaluators:
  1. TaskAdherenceEvaluator  (built-in) — Did agents follow their instructions?
  2. CoherenceEvaluator      (built-in) — Is the output natural and well-written?
  3. RelevanceEvaluator      (built-in) — Does the output address the brief?
  4. GroundednessEvaluator   (built-in) — Is content grounded in brand guidelines?
  5. PlatformComplianceEvaluator (custom) — Platform-specific constraints check

Usage:
    # Step 1: Run agent runner to generate responses (if not already done)
    python evaluation/agent_runner.py

    # Step 2: Run evaluation on the responses
    python evaluation/evaluate.py
"""

import os
import sys
import json
import re
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv()


# ============================================================================
# Custom Code-Based Evaluator: Platform Compliance
# ============================================================================

class PlatformComplianceEvaluator:
    """
    Custom code-based evaluator that checks platform-specific constraints:
    - Twitter: ≤280 characters
    - Instagram: has hashtags and emojis
    - LinkedIn: professional tone (no excessive emojis)
    - All: contains #ZavaTravel hashtag
    - All: does NOT mention competitors by name
    """

    COMPETITORS = ["voyagenow", "cooktravel", "wanderpath"]
    BANNED_WORDS = ["cheap", "tourist", "package deal", "discount", "basic"]

    def __init__(self):
        pass

    def __call__(self, *, response: str, **kwargs) -> dict:
        """Evaluate platform compliance from the full publisher response."""
        checks = {
            "twitter_char_limit": True,
            "instagram_has_hashtags": True,
            "instagram_has_emojis": True,
            "contains_brand_hashtag": False,
            "no_competitor_mentions": True,
            "no_banned_words": True,
        }
        issues = []
        response_lower = response.lower()

        # --- Extract platform posts ---
        twitter_post = self._extract_section(response, r"\*\*X/?TWITTER POST\*\*")
        instagram_post = self._extract_section(response, r"\*\*INSTAGRAM POST\*\*")

        # Twitter: character limit
        if twitter_post:
            # Strip markdown formatting for char count
            clean = re.sub(r"\*\*.*?\*\*", "", twitter_post).strip()
            clean = re.sub(r"\[.*?\]\(.*?\)", "", clean).strip()
            if len(clean) > 280:
                checks["twitter_char_limit"] = False
                issues.append(f"Twitter post is {len(clean)} chars (limit: 280)")

        # Instagram: hashtags
        if instagram_post:
            if "#" not in instagram_post:
                checks["instagram_has_hashtags"] = False
                issues.append("Instagram post missing hashtags")
            # Emojis (basic Unicode emoji range check)
            emoji_pattern = re.compile(
                "[\U0001F300-\U0001F9FF"
                "\U00002702-\U000027B0"
                "\U0001F680-\U0001F6FF"
                "\u2600-\u26FF"
                "\u2700-\u27BF]+",
                flags=re.UNICODE,
            )
            if not emoji_pattern.search(instagram_post):
                checks["instagram_has_emojis"] = False
                issues.append("Instagram post missing emojis")

        # Brand hashtag
        if "#zavatravel" in response_lower:
            checks["contains_brand_hashtag"] = True
        else:
            issues.append("Missing mandatory #ZavaTravel hashtag")

        # Competitor mentions
        for comp in self.COMPETITORS:
            if comp in response_lower:
                checks["no_competitor_mentions"] = False
                issues.append(f"Mentions competitor: {comp}")
                break

        # Banned words
        for word in self.BANNED_WORDS:
            if word in response_lower:
                checks["no_banned_words"] = False
                issues.append(f"Uses banned word: '{word}'")
                break

        # Calculate overall score (0-5 scale to match built-in evaluators)
        passed = sum(1 for v in checks.values() if v)
        total = len(checks)
        score = round((passed / total) * 5, 1)

        return {
            "platform_compliance": score,
            "platform_compliance_details": json.dumps(checks),
            "platform_compliance_issues": "; ".join(issues) if issues else "All checks passed",
        }

    @staticmethod
    def _extract_section(text: str, header_pattern: str) -> str:
        """Extract a section from the publisher output by header pattern."""
        match = re.search(header_pattern, text, re.IGNORECASE)
        if not match:
            return ""
        start = match.end()
        # Find next section header or end
        next_header = re.search(r"\*\*(?:LINKEDIN|X/?TWITTER|INSTAGRAM) POST\*\*", text[start:], re.IGNORECASE)
        end = start + next_header.start() if next_header else len(text)
        return text[start:end].strip()


# ============================================================================
# Main evaluation
# ============================================================================

def run_evaluation():
    """Run the Azure AI Evaluation SDK evaluate() on agent results."""
    from azure.ai.evaluation import (
        evaluate,
        TaskAdherenceEvaluator,
        CoherenceEvaluator,
        RelevanceEvaluator,
        GroundednessEvaluator,
        AzureOpenAIModelConfiguration,
    )
    from azure.identity import DefaultAzureCredential

    # --- Model configuration (reuses the same Azure OpenAI deployment) ---
    model_config = AzureOpenAIModelConfiguration(
        azure_deployment=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    )
    credential = DefaultAzureCredential()

    # --- Initialize evaluators ---
    task_adherence = TaskAdherenceEvaluator(
        model_config=model_config, credential=credential,
    )
    coherence = CoherenceEvaluator(
        model_config=model_config, credential=credential,
    )
    relevance = RelevanceEvaluator(
        model_config=model_config, credential=credential,
    )
    groundedness = GroundednessEvaluator(
        model_config=model_config, credential=credential,
    )
    platform_compliance = PlatformComplianceEvaluator()

    # --- Paths ---
    eval_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(eval_dir, "eval_results.jsonl")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(eval_dir, f"eval_output_{timestamp}")

    if not os.path.exists(data_path):
        print("❌ eval_results.jsonl not found. Run agent_runner.py first:")
        print("   python evaluation/agent_runner.py")
        sys.exit(1)

    # --- Pre-process: build clean response from parsed posts ---
    # The raw Publisher output contains meta-reasoning (Reflection, Character
    # count checks) that confuses the TaskAdherenceEvaluator. We construct a
    # clean "response" from the already-parsed platform posts so the evaluator
    # sees only the actual deliverables that the agents produced.
    processed_path = os.path.join(eval_dir, f"eval_processed_{timestamp}.jsonl")
    with open(data_path, "r", encoding="utf-8") as fin, \
         open(processed_path, "w", encoding="utf-8") as fout:
        for line in fin:
            if not line.strip():
                continue
            row = json.loads(line)
            clean_response = (
                f"LINKEDIN POST:\n{row.get('linkedin_post', '')}\n\n"
                f"---\n\n"
                f"X/TWITTER POST:\n{row.get('twitter_post', '')}\n\n"
                f"---\n\n"
                f"INSTAGRAM POST:\n{row.get('instagram_post', '')}"
            )
            row["response"] = clean_response
            fout.write(json.dumps(row, ensure_ascii=False) + "\n")

    # Use the processed file for evaluation
    eval_data_path = processed_path

    # Count rows
    with open(eval_data_path, "r", encoding="utf-8") as f:
        row_count = sum(1 for line in f if line.strip())

    print(f"\n{'='*60}")
    print(f"🧪 Zava Travel — Agentic Evaluation")
    print(f"{'='*60}")
    print(f"  Dataset:    {data_path} (processed → clean posts)")
    print(f"  Rows:       {row_count}")
    print(f"  Evaluators: 5 (4 built-in + 1 custom)")
    print(f"  Output:     {output_path}")
    print(f"{'='*60}\n")

    # --- Run evaluation ---
    # Note: eval_data_path has the cleaned response (posts only, no meta-reasoning)
    # so TaskAdherenceEvaluator sees actual deliverables, not internal agent reflections.
    result = evaluate(
        data=eval_data_path,
        evaluators={
            "task_adherence": task_adherence,
            "coherence": coherence,
            "relevance": relevance,
            "groundedness": groundedness,
            "platform_compliance": platform_compliance,
        },
        evaluator_config={
            "task_adherence": {
                "column_mapping": {
                    "query": "${data.query}",
                    "response": "${data.response}",
                },
            },
            "coherence": {
                "column_mapping": {
                    "query": "${data.query}",
                    "response": "${data.response}",
                },
            },
            "relevance": {
                "column_mapping": {
                    "query": "${data.query}",
                    "response": "${data.response}",
                },
            },
            "groundedness": {
                "column_mapping": {
                    "query": "${data.query}",
                    "response": "${data.response}",
                    "context": "${data.context}",
                },
            },
            "platform_compliance": {
                "column_mapping": {
                    "response": "${data.response}",
                },
            },
        },
        output_path=output_path,
    )

    # --- Print summary ---
    # Binary evaluators output 0/1 (pass/fail); quality evaluators use 1-5 scale
    BINARY_METRICS = {"task_adherence", "binary_aggregate"}

    print(f"\n{'='*60}")
    print(f"📊 Evaluation Results Summary")
    print(f"{'='*60}")

    metrics = result.get("metrics", {})
    for metric_name, metric_value in sorted(metrics.items()):
        if isinstance(metric_value, (int, float)):
            # Detect binary metrics by checking if any keyword matches
            is_binary = any(bm in metric_name for bm in BINARY_METRICS)
            if is_binary:
                label = "PASS ✅" if metric_value >= 1.0 else "FAIL ❌"
                print(f"  {metric_name:<45} {label}")
            else:
                bar = "█" * int(metric_value) + "░" * (5 - int(metric_value))
                print(f"  {metric_name:<45} {metric_value:>5.2f}/5  {bar}")
        else:
            print(f"  {metric_name:<45} {metric_value}")

    print(f"\n  SDK output saved to: {output_path}")
    print(f"{'='*60}\n")

    # --- Build comprehensive JSON report ---
    rows_data = result.get("rows", [])
    row_results = []
    for row in rows_data:
        row_dict = {}
        for col_name, col_value in row.items():
            # Skip very large fields (raw response text) to keep report readable
            if col_name in ("response", "context"):
                continue
            row_dict[col_name] = col_value
        row_results.append(row_dict)

    report = {
        "report_name": "Zava Travel Multi-Agent Evaluation",
        "timestamp": timestamp,
        "dataset": {
            "path": data_path,
            "rows": row_count,
        },
        "evaluators": [
            {"name": "TaskAdherenceEvaluator", "type": "built-in", "category": "Agent"},
            {"name": "CoherenceEvaluator", "type": "built-in", "category": "Quality"},
            {"name": "RelevanceEvaluator", "type": "built-in", "category": "Quality"},
            {"name": "GroundednessEvaluator", "type": "built-in", "category": "RAG"},
            {"name": "PlatformComplianceEvaluator", "type": "custom-code", "category": "Business"},
        ],
        "aggregate_metrics": {k: v for k, v in sorted(metrics.items()) if isinstance(v, (int, float))},
        "row_results": row_results,
    }

    report_path = os.path.join(eval_dir, "eval_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False, default=str)

    print(f"  📄 Evaluation report: {report_path}\n")


if __name__ == "__main__":
    run_evaluation()
