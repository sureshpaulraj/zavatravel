# Evaluation Baselines — Zava Travel Inc.
# Expected quality score ranges for Foundry Evaluation SDK metrics.

---

## Evaluation Metrics Definition

| Metric | Scale | Description | Minimum Acceptable |
|--------|-------|-------------|-------------------|
| **Relevance** | 0-5 | How well the content addresses the campaign brief's topic, audience, and objectives | ≥ 3.5 |
| **Coherence** | 0-5 | Logical flow, readability, and structural quality of the content | ≥ 4.0 |
| **Groundedness** | 0-5 | How well claims are supported by brand guidelines or retrieved data | ≥ 3.0 |
| **Fluency** | 0-5 | Grammar, natural language quality, and platform-appropriate writing style | ≥ 4.0 |

---

## Baseline Scores by Campaign Brief

### CB-001: Summer Adventure Campaign

| Metric | LinkedIn | X/Twitter | Instagram | Aggregate |
|--------|----------|-----------|-----------|-----------|
| Relevance | 4.5 | 4.0 | 4.5 | 4.3 |
| Coherence | 4.5 | 4.0 | 4.0 | 4.2 |
| Groundedness | 4.0 | 3.5 | 4.0 | 3.8 |
| Fluency | 4.5 | 4.0 | 4.5 | 4.3 |
| **Overall** | **4.4** | **3.9** | **4.3** | **4.2** |

**Notes**:
- Twitter scores slightly lower due to character constraints limiting depth
- Groundedness depends on File Search availability (lower without grounding)
- LinkedIn expected to score highest on coherence (paragraph structure)

### CB-002: Vietnam Launch

| Metric | LinkedIn | X/Twitter | Instagram | Aggregate |
|--------|----------|-----------|-----------|-----------|
| Relevance | 4.5 | 4.0 | 4.5 | 4.3 |
| Coherence | 4.0 | 4.0 | 4.0 | 4.0 |
| Groundedness | 4.5 | 3.5 | 4.0 | 4.0 |
| Fluency | 4.5 | 4.0 | 4.5 | 4.3 |
| **Overall** | **4.4** | **3.9** | **4.3** | **4.2** |

### CB-003: Flash Sale

| Metric | LinkedIn | X/Twitter | Instagram | Aggregate |
|--------|----------|-----------|-----------|-----------|
| Relevance | 4.0 | 4.5 | 4.0 | 4.2 |
| Coherence | 4.0 | 3.5 | 4.0 | 3.8 |
| Groundedness | 3.5 | 3.0 | 3.5 | 3.3 |
| Fluency | 4.0 | 4.0 | 4.0 | 4.0 |
| **Overall** | **3.9** | **3.8** | **3.9** | **3.8** |

**Notes**:
- Flash sale content naturally scores lower on coherence (urgency disrupts flow)
- Groundedness lower because sale pricing may not be in brand guidelines
- Twitter should score highest on relevance (urgency fits the format)

### CB-004: Brand Awareness

| Metric | LinkedIn | X/Twitter | Instagram | Aggregate |
|--------|----------|-----------|-----------|-----------|
| Relevance | 4.5 | 4.0 | 4.0 | 4.2 |
| Coherence | 5.0 | 4.0 | 4.5 | 4.5 |
| Groundedness | 4.0 | 3.0 | 3.5 | 3.5 |
| Fluency | 5.0 | 4.0 | 4.5 | 4.5 |
| **Overall** | **4.6** | **3.8** | **4.1** | **4.2** |

**Notes**:
- LinkedIn should score highest overall (brand awareness fits professional thought-leadership)
- Twitter constrained but should still communicate core value proposition

---

## Quality Thresholds

### Pass/Fail Criteria

| Level | Aggregate Score | Action |
|-------|----------------|--------|
| 🟢 **Excellent** | ≥ 4.5 | Auto-publish ready |
| 🟡 **Good** | 3.5 - 4.4 | Acceptable for demo, minor improvements possible |
| 🟠 **Fair** | 2.5 - 3.4 | Needs revision — flag for Creator to iterate |
| 🔴 **Poor** | < 2.5 | Reject and regenerate — investigate agent instructions |

### Per-Metric Minimums

| Metric | Hard Minimum | Soft Target |
|--------|-------------|-------------|
| Relevance | 3.0 | 4.0 |
| Coherence | 3.0 | 4.0 |
| Groundedness | 2.5 | 3.5 |
| Fluency | 3.5 | 4.0 |

---

## Degraded Scoring (Without Grounding)

When File Search / Bing Search is unavailable, expected score adjustments:

| Metric | With Grounding | Without Grounding | Delta |
|--------|---------------|-------------------|-------|
| Relevance | 4.3 | 4.0 | -0.3 |
| Coherence | 4.2 | 4.2 | 0.0 |
| Groundedness | 3.8 | 2.5 | -1.3 |
| Fluency | 4.3 | 4.3 | 0.0 |
| **Overall** | **4.2** | **3.8** | **-0.4** |

**Key Insight**: Groundedness drops significantly without data sources (expected). System should label content as "ungrounded" per FR-016.

---

## Evaluation Test Procedure

```python
# Pseudocode for evaluation validation
def validate_evaluation_scores(scores: dict, brief_id: str):
    baselines = load_baselines(brief_id)
    
    for metric in ["relevance", "coherence", "groundedness", "fluency"]:
        score = scores[metric]
        minimum = HARD_MINIMUMS[metric]
        baseline = baselines[metric]
        
        assert score >= minimum, f"{metric} below hard minimum: {score} < {minimum}"
        
        # Allow 1.0 point variance from baseline
        variance = abs(score - baseline)
        if variance > 1.0:
            warn(f"{metric} deviates significantly from baseline: {score} vs {baseline}")
    
    aggregate = sum(scores.values()) / len(scores)
    if aggregate >= 4.5:
        return "EXCELLENT"
    elif aggregate >= 3.5:
        return "GOOD"
    elif aggregate >= 2.5:
        return "FAIR"
    else:
        return "POOR"
```

---

*Evaluation Baselines v1.0 — Zava Travel Inc.*
