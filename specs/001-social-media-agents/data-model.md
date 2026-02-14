# Data Model: Multi-Agent Social Media Content Creation System

**Feature**: 001-social-media-agents  
**Date**: 2025-01-23  
**Updated**: 2025-07-14  
**Status**: Implemented

---

## Overview

This data model defines the core entities and their relationships for the multi-agent social media content creation workflow. Originally designed as lightweight dataclasses for the 100-minute hackathon, the models have been upgraded to Pydantic `BaseModel` classes in the FastAPI API server (`api_server.py`) and `@dataclass` classes in the safety module (`safety/brand_filters.py`). The model supports group chat orchestration with Router pattern, reasoning transparency, platform-specific output generation, AI image generation, content safety screening, and automated quality evaluation.

---

## Entity Definitions

### 1. CampaignBrief (Input Entity)

**Purpose**: Structured input provided by the user to initialize the content creation workflow.

**Attributes**:

| Attribute | Type | Required | Validation | Example |
|-----------|------|----------|-----------|---------|
| `brand_name` | str | Yes | Non-empty, 1-50 chars | "TechCorp" |
| `industry` | str | Yes | Non-empty, 1-50 chars | "Technology" |
| `target_audience` | str | Yes | Non-empty, 10-200 chars | "Enterprise CIOs and IT decision-makers" |
| `key_message` | str | Yes | Non-empty, 10-300 chars | "AI-powered automation transforms enterprise operations" |
| `platforms` | List[str] | Yes | Fixed: ["LinkedIn", "Twitter", "Instagram"] | ["LinkedIn", "Twitter", "Instagram"] |

**Constraints**:
- All fields are mandatory; no default values
- `platforms` list is immutable for MVP scope (always 3 platforms)
- Total brief size should fit in ~500 characters for efficient agent processing

**Python Dataclass**:
```python
from dataclasses import dataclass
from typing import List

@dataclass
class CampaignBrief:
    brand_name: str
    industry: str
    target_audience: str
    key_message: str
    platforms: List[str] = None
    
    def __post_init__(self):
        # Default to all three platforms
        if self.platforms is None:
            self.platforms = ["LinkedIn", "Twitter", "Instagram"]
        
        # Validation
        assert self.brand_name and len(self.brand_name) <= 50, "Invalid brand_name"
        assert self.industry and len(self.industry) <= 50, "Invalid industry"
        assert len(self.target_audience) >= 10, "target_audience too vague"
        assert len(self.key_message) >= 10, "key_message too vague"
        assert self.platforms == ["LinkedIn", "Twitter", "Instagram"], "Platform list must be fixed"
```

**Example**:
```python
brief = CampaignBriefRequest(
    brand_name="Zava Travel Inc.",
    industry="Budget-friendly adventure travel",
    target_audience="Millennials & Gen-Z adventure seekers looking for affordable, authentic travel experiences",
    key_message="Wander More, Spend Less — affordable adventure to dream destinations",
    destinations="Bali, Patagonia, Iceland, Vietnam, Costa Rica",
    platforms=["LinkedIn", "Twitter", "Instagram"],
    content_type="both"
)
```

**API Usage** (POST `/api/generate`):
```json
{
  "brand_name": "Zava Travel Inc.",
  "industry": "Budget-friendly adventure travel",
  "target_audience": "Millennials & Gen-Z adventure seekers",
  "key_message": "Wander More, Spend Less",
  "destinations": "Bali, Patagonia, Iceland, Vietnam, Costa Rica",
  "platforms": ["LinkedIn", "Twitter", "Instagram"],
  "content_type": "both"
}
```

**Usage in Workflow**:
- Converted to natural language prompt for Creator agent's first turn
- Brand context extracted for grounding source queries (File Search)
- Referenced in Reviewer agent's brand alignment evaluation

---

### 2. AgentMessage (Conversation Entity)

**Purpose**: Represents a single agent's contribution (draft, feedback, or final output) within the group chat conversation. Implemented as a Pydantic `BaseModel` in `api_server.py`.

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `agent_name` | str | Yes | "Creator", "Reviewer", "Publisher", or "Orchestrator" | "Creator" |
| `content` | str | Yes | Message body (draft text or feedback) | "Step 1: The campaign objective is awareness..." |
| `reasoning_pattern` | str | Yes | Reasoning pattern label for this agent | "Chain-of-Thought" |
| `timestamp` | str | Yes | ISO format timestamp | "2025-01-23T14:32:15" |

**Reasoning Pattern Mapping** (defined in `REASONING_PATTERNS` constant):
| Agent | Reasoning Pattern |
|-------|-------------------|
| Orchestrator | Router |
| Creator | Chain-of-Thought |
| Reviewer | ReAct |
| Publisher | Self-Reflection |

**Constraints**:
- `agent_name` must be one of the four valid components (Orchestrator, Creator, Reviewer, Publisher)
- `reasoning_pattern` is automatically assigned based on `REASONING_PATTERNS` lookup
- `content` length varies by agent role (Creator: ~150 words, Reviewer: ~120 words, Publisher: ~300 words)

**Pydantic Model** (actual implementation in `api_server.py`):
```python
class AgentMessage(BaseModel):
    agent_name: str
    content: str
    reasoning_pattern: str
    timestamp: str
```

**Example**:
```python
message = AgentMessage(
    agent_name="Creator",
    content="Step 1: The campaign objective is to drive awareness...\n\nDRAFT: Discover the adventure of a lifetime with Zava Travel...",
    reasoning_pattern="Chain-of-Thought",
    timestamp="2025-01-23T14:32:15"
)
```

**Usage in Workflow**:
- Collected in chronological order to form the `transcript` list in `WorkflowResult`
- `reasoning_pattern` displayed in UI and telemetry spans for judging review
- `agent_name` used by Router speaker selector to determine next agent
- `content` used by subsequent agents as input for their reasoning

---

### 3. GeneratedPosts & GeneratedImages (Output Entities)

**Purpose**: Platform-specific formatted social media posts and AI-generated images ready for publishing. In the actual implementation, the Publisher agent generates all three platform posts in a single turn, and the API server parses them into structured `GeneratedPosts`. When `content_type` includes "images", the API server also generates AI images via gpt-image-1.5.

**GeneratedPosts Pydantic Model** (actual implementation in `api_server.py`):
```python
class GeneratedPosts(BaseModel):
    linkedin: str
    twitter: str
    instagram: str
```

**GeneratedImages Pydantic Model** (actual implementation in `api_server.py`):
```python
class GeneratedImages(BaseModel):
    linkedin: str | None = None   # Base64-encoded image data
    twitter: str | None = None    # Base64-encoded image data
    instagram: str | None = None  # Base64-encoded image data
```

**Platform-Specific Constraints** (validated by Publisher Self-Reflection):

#### LinkedIn
- **Length**: 1-3 paragraphs (approx. 150-300 words)
- **Tone**: Professional yet exciting (adventure travel)
- **Hashtags**: 3-5 relevant tags (#ZavaTravel, #WanderMore)
- **CTA**: Professional (e.g., "Book your adventure at zavatravel.com")
- **Image**: Landscape format when generated

#### Twitter/X
- **Length**: ≤280 characters (STRICT, enforced by Publisher Self-Reflection)
- **Tone**: Punchy, energetic, wanderlust-driven
- **Hashtags**: 2-3 max (included in character count)
- **CTA**: Action-oriented (e.g., "Explore now")
- **Image**: Landscape format when generated

#### Instagram
- **Length**: 125-150 words (caption style)
- **Tone**: Storytelling, aspirational
- **Hashtags**: 5-10 (mix popular + niche)
- **CTA**: Community-driven (e.g., "Tag a travel buddy")
- **Emojis**: Required (2-5 relevant emojis)
- **Image**: Square format when generated

**Usage in Workflow**:
- Publisher agent raw output is parsed by `parse_platform_posts()` in `api_server.py`
- `GeneratedPosts` contains the text content per platform
- `GeneratedImages` contains base64-encoded AI images (optional, depends on `content_type`)
- Both are included in the `WorkflowResult` response

---

### 4. WorkflowResult (Response Entity — replaces ConversationTranscript)

**Purpose**: Complete API response containing generated content, agent transcript, safety results, and metadata. This is the primary output entity returned by the `/api/generate` endpoint. Implemented as a Pydantic `BaseModel` in `api_server.py`.

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `status` | str | Yes | Workflow completion status | "success" |
| `posts` | GeneratedPosts | Yes | Platform-specific text content | {linkedin: "...", twitter: "...", instagram: "..."} |
| `images` | GeneratedImages | No | Base64-encoded AI images (when content_type includes "images") | {linkedin: "base64...", ...} |
| `transcript` | List[AgentMessage] | Yes | All agent communications in order | [msg1, msg2, msg3, ...] |
| `duration_seconds` | float | Yes | Workflow execution time | 87.5 |
| `termination_reason` | str | Yes | Why workflow ended | "publisher_completion" |
| `safety` | SafetyCheckResult | No | Content safety screening results | {status: "passed", flags: []} |

**Termination Reason Values**:
- `"publisher_completion"`: Publisher agent finished formatting all platforms
- `"max_rounds_reached"`: 5-round limit hit (safety termination)
- `"reviewer_approval"`: Reviewer fast-tracked with "APPROVED" verdict

**Pydantic Model** (actual implementation in `api_server.py`):
```python
class WorkflowResult(BaseModel):
    status: str
    posts: GeneratedPosts
    images: GeneratedImages | None = None
    transcript: List[AgentMessage]
    duration_seconds: float
    termination_reason: str
    safety: SafetyCheckResult | None = None
```

**Example API Response**:
```json
{
  "status": "success",
  "posts": {
    "linkedin": "🌍 Discover the adventure of a lifetime with Zava Travel...",
    "twitter": "🏔️ Wander More, Spend Less! Adventure awaits in Bali, Patagonia & beyond 🌊 #ZavaTravel #WanderMore",
    "instagram": "✨ Picture this: You're standing on a black sand beach in Iceland..."
  },
  "images": {
    "linkedin": "data:image/png;base64,iVBOR...",
    "twitter": "data:image/png;base64,iVBOR...",
    "instagram": "data:image/png;base64,iVBOR..."
  },
  "transcript": [
    {
      "agent_name": "Creator",
      "content": "Step 1: The campaign objective is awareness...",
      "reasoning_pattern": "Chain-of-Thought",
      "timestamp": "2025-01-23T14:32:15"
    }
  ],
  "duration_seconds": 87.5,
  "termination_reason": "publisher_completion",
  "safety": {
    "status": "passed",
    "flags": []
  }
}
```

**Usage in Workflow**:
- Assembled by `run_workflow_api()` in `api_server.py` after workflow completes
- Returned as JSON response from `/api/generate` endpoint
- Consumed by React frontend for display
- Safety screening applied to both input and output before response

---

### 5. SafetyCheckResult (Safety Entity — IMPLEMENTED)

**Purpose**: Results from Azure AI Content Safety screening and brand filter checks. Two-layer safety: (1) Azure AI Content Safety API for harmful content, (2) brand-specific filters for competitor mentions and off-brand content.

**Pydantic Model** (in `api_server.py`):
```python
class SafetyCheckResult(BaseModel):
    status: str  # "passed" | "warnings" | "blocked"
    flags: List[str] = []
```

**Supporting Dataclasses** (in `safety/brand_filters.py`):
```python
@dataclass
class SafetyFlag:
    category: str        # e.g. "competitor_mention", "banned_word"
    severity: str        # "warning" | "blocked"
    detail: str          # Human-readable description
    matched_text: str    # The text that triggered the flag
    suggestion: str = "" # Optional suggested fix

@dataclass
class ShieldResult:
    allowed: bool
    flags: List[SafetyFlag] = field(default_factory=list)

    @property
    def has_warnings(self) -> bool:
        return any(f.severity == "warning" for f in self.flags)

    @property
    def has_blocks(self) -> bool:
        return any(f.severity == "blocked" for f in self.flags)
```

**Safety Categories Checked**:
- Hate speech, violence, self-harm, sexual content (Azure AI Content Safety)
- Competitor brand mentions: VoyageNow, CookTravel, WanderPath (brand filters)
- Off-brand tone and messaging (brand filters)

**Authentication**: Three-tier — API Key → ManagedIdentityCredential (client_id) → DefaultAzureCredential

---

### 6. EvaluationMetrics (Evaluation Entity — IMPLEMENTED)

**Purpose**: Automated quality assessment of generated content using 5 evaluators — 4 built-in from `azure-ai-evaluation` SDK and 1 custom code-based evaluator. Invoked via `evaluation/evaluate.py`.

**Evaluators**:

| # | Evaluator | Type | What It Measures | Score Range |
|---|-----------|------|------------------|-------------|
| 1 | `TaskAdherenceEvaluator` | Built-in | Did agents follow their system instructions? | 1-5 |
| 2 | `CoherenceEvaluator` | Built-in | Is output natural and well-structured? | 1-5 |
| 3 | `RelevanceEvaluator` | Built-in | Does output address the campaign brief? | 1-5 |
| 4 | `GroundednessEvaluator` | Built-in | Is content grounded in brand guidelines? | 1-5 |
| 5 | `PlatformComplianceEvaluator` | Custom | Platform-specific constraint checks | 0.0-1.0 |

**PlatformComplianceEvaluator Checks** (custom class in `evaluation/evaluate.py`):
- Twitter: ≤280 characters
- Instagram: has hashtags and emojis
- LinkedIn: professional tone (no excessive emojis)
- All platforms: contains `#ZavaTravel` hashtag
- All platforms: no competitor mentions (VoyageNow, CookTravel, WanderPath)
- All platforms: no banned words (cheap, tourist, package deal, discount, basic)

**Evaluation Output** (JSON per query):
```json
{
  "task_adherence": 4.0,
  "coherence": 5.0,
  "relevance": 5.0,
  "groundedness": 4.0,
  "platform_compliance": 0.83,
  "platform_compliance_issues": "Twitter post is 295 chars (limit: 280)"
}
```

**Usage**:
- Run separately via `python evaluation/evaluate.py` after `agent_runner.py` generates responses
- Results saved to `evaluation/eval_results_{timestamp}.json`
- Built-in evaluators use Azure OpenAI as judge model
- Custom evaluator runs pure Python regex checks (no LLM call)

---

## Entity Relationships

```
CampaignBriefRequest (1)          ← POST /api/generate
    ↓ initiates
GroupChatWorkflow (1)
    ↓ orchestrated by
Orchestrator (Router pattern)     ← speaker_selection.py
    ↓ produces
WorkflowResult (1)                ← API response
    ├── posts: GeneratedPosts (1)
    │       ├── linkedin (str)
    │       ├── twitter (str)
    │       └── instagram (str)
    │
    ├── images: GeneratedImages (0..1)   ← when content_type includes "images"
    │       ├── linkedin (str | None)    ← base64 PNG from gpt-image-1.5
    │       ├── twitter (str | None)
    │       └── instagram (str | None)
    │
    ├── transcript: List[AgentMessage] (3..10)
    │       ├── Creator messages (1..2)    — Chain-of-Thought
    │       ├── Reviewer messages (1..2)   — ReAct
    │       └── Publisher message (1)      — Self-Reflection
    │
    ├── safety: SafetyCheckResult (0..1)
    │       └── flags: List[str]
    │
    └── metadata
            ├── duration_seconds (float)
            └── termination_reason (str)
```

**Relationship Rules**:
1. Each `CampaignBriefRequest` triggers exactly one workflow execution
2. Each workflow produces exactly one `WorkflowResult`
3. Each `WorkflowResult` contains 3-10 `AgentMessage` instances (depending on rounds)
4. Each `WorkflowResult` includes exactly one `GeneratedPosts` (one text per platform)
5. `GeneratedImages` is present only when `content_type` is "images" or "both"
6. `SafetyCheckResult` is present when content safety service is configured
7. `AgentMessage` instances are ordered chronologically by `timestamp`

---

## State Transitions

### Workflow State Machine

```
[API REQUEST: CampaignBriefRequest received at /api/generate]
    ↓
Safety Layer 1: Input screening (Azure AI Content Safety)
    ↓ (blocked → return error)
Orchestrator (Router pattern) → selects first speaker
    ↓
Round 1: Creator → generates Draft 1 (Chain-of-Thought)
    ↓
Round 2: Reviewer → evaluates Draft 1 → Verdict: REVISE (ReAct)
    ↓
Round 3: Creator → generates Draft 2 (incorporates feedback)
    ↓
Round 4: Reviewer → evaluates Draft 2 → Verdict: APPROVED
    ↓
[Fast-track to Publisher due to APPROVED verdict]
    ↓
Round 5: Publisher → formats 3 platform posts → Self-Reflection validation
    ↓
Safety Layer 2: Output screening (brand filters + content safety)
    ↓
[Optional] Image generation: gpt-image-1.5 (when content_type includes "images")
    ↓
[TERMINAL STATE: WorkflowResult returned as JSON response]
```

**Alternative Termination Paths**:

#### Path 1: Max Rounds Reached
```
Rounds 1-4: Creator ↔ Reviewer (continuous REVISE)
    ↓
Round 5: Publisher (forced termination, uses best available draft)
    ↓
Termination Reason: "max_rounds_reached"
```

#### Path 2: Immediate Approval
```
Round 1: Creator → Draft 1
    ↓
Round 2: Reviewer → APPROVED (exceptional quality)
    ↓
Round 3: Publisher → 3 platform posts
    ↓
Termination Reason: "reviewer_approval"
```

---

## Data Flow Diagram

```
┌─────────────────────────┐
│   React Frontend        │ (User Interface — Fluent UI v9)
│  - Campaign brief form  │
│  - Content type selector│
│  - Platform toggles     │
└──────────┬──────────────┘
           │ POST /api/generate
           ▼
┌─────────────────────────┐
│   FastAPI Backend       │ (api_server.py)
│  - CampaignBriefRequest │ (Pydantic validation)
│  - Input safety screen  │ (Azure AI Content Safety)
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  GroupChat Workflow      │
│  - Orchestrator (Router)│ ← speaker_selection.py
│  - Termination logic    │ ← termination.py
└──────┬──────────────────┘
       │
       ├─► Creator Agent (Chain-of-Thought)
       │   ├─► MCP file_search tool → brand-guidelines.md
       │   └─► AgentMessage (Draft content)
       │
       ├─► Reviewer Agent (ReAct)
       │   ├─► MCP file_search tool → brand-guidelines.md
       │   └─► AgentMessage (Feedback / APPROVED / REVISE)
       │
       └─► Publisher Agent (Self-Reflection)
           └─► AgentMessage (3x platform-formatted posts)

           ▼
┌─────────────────────────┐
│  Post-Processing        │
│  - parse_platform_posts │ → GeneratedPosts
│  - gpt-image-1.5       │ → GeneratedImages (optional)
│  - Output safety screen │ → SafetyCheckResult
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  WorkflowResult         │ (JSON API response)
│  - posts                │ (GeneratedPosts)
│  - images               │ (GeneratedImages | null)
│  - transcript           │ (List[AgentMessage])
│  - safety               │ (SafetyCheckResult | null)
│  - duration_seconds     │
│  - termination_reason   │
└─────────────────────────┘
           │
           ▼
      React Frontend (renders results)
```

---

## Validation Rules Summary

| Entity | Validation Rule | Enforcement Point |
|--------|----------------|------------------|
| CampaignBriefRequest | All fields non-empty; platforms ⊂ {LinkedIn, Twitter, Instagram}; content_type ∈ {text, images, both} | Pydantic model validation |
| AgentMessage | content non-empty; reasoning_pattern must match REASONING_PATTERNS | Agent message creation |
| GeneratedPosts (Twitter) | ≤280 chars, 2-3 hashtags | Publisher Self-Reflection |
| GeneratedPosts (LinkedIn) | 3-5 hashtags, professional tone | Publisher Self-Reflection |
| GeneratedPosts (Instagram) | 5-10 hashtags, 2+ emojis | Publisher Self-Reflection |
| GeneratedImages | Base64 PNG format; present only when content_type includes "images" | Image generation pipeline |
| SafetyCheckResult | Input + output both screened; blocked content returns error | Two-layer safety shield |
| WorkflowResult | Must include posts and transcript; images/safety nullable | API response assembly |
| All Entities | No null/None for required fields | Pydantic BaseModel validation |

---

## Storage Strategy

**Ephemeral (In-Memory Only)**:
- `CampaignBriefRequest`: Exists only during API request lifecycle
- `AgentMessage`: Collected in list during workflow, returned in `WorkflowResult`
- `WorkflowResult`: Returned as JSON API response, not persisted server-side

**Optional Persistence (via MCP Filesystem Tool)**:
- Markdown transcript → saved to `output/social-posts-YYYY-MM-DD.md`
- `GeneratedImages` base64 data → rendered in-browser, not saved server-side

**Evaluation Results** (separate pipeline):
- `evaluation/eval_results_{timestamp}.json` → evaluation score snapshots

**No Database**: The hackathon scope does not require persistence. All state is ephemeral. The React frontend displays results in real-time; the API is stateless.

---

## Data Model Alignment with Requirements

| Requirement | Data Model Support |
|-------------|-------------------|
| FR-001: Accept campaign brief | ✅ `CampaignBriefRequest` Pydantic model with all required fields |
| FR-004: Output conversation transcript | ✅ `WorkflowResult.transcript` — ordered list of `AgentMessage` |
| FR-005: Produce 3 platform posts | ✅ `GeneratedPosts` — linkedin, twitter, instagram fields |
| FR-006: Chain-of-Thought reasoning | ✅ `AgentMessage.reasoning_pattern` = "Chain-of-Thought" for Creator |
| FR-011: Platform-specific formatting | ✅ `GeneratedPosts` constraints enforced by Publisher Self-Reflection |
| FR-032: AI image generation | ✅ `GeneratedImages` — base64 PNG via gpt-image-1.5 |
| FR-033: Content type selection | ✅ `CampaignBriefRequest.content_type` — "text" / "images" / "both" |
| FR-034: Content safety screening | ✅ `SafetyCheckResult` + `SafetyFlag` + `ShieldResult` |
| FR-035: Evaluation framework | ✅ 5 evaluators — TaskAdherence, Coherence, Relevance, Groundedness, PlatformCompliance |
| FR-036: Monitoring & observability | ✅ OpenTelemetry spans + Azure Monitor tracing |
| FR-037: Managed identity auth | ✅ Three-tier: API Key → ManagedIdentity → DefaultAzureCredential |
| FR-038: React + FastAPI frontend | ✅ `WorkflowResult` JSON response consumed by React UI |
| SC-003: Reasoning transparency | ✅ `reasoning_pattern` preserved in every `AgentMessage` |
| SC-007: Platform constraints satisfied | ✅ Platform constraints encoded in `GeneratedPosts` validation |

---

## Implementation Status

All data model entities are **fully implemented** as Pydantic `BaseModel` classes (in `api_server.py`) and Python `@dataclass` classes (in `safety/brand_filters.py`). The data model is stable and matches the production codebase.

| Entity | Implementation File | Model Type |
|--------|-------------------|------------|
| CampaignBriefRequest | `api_server.py` | Pydantic BaseModel |
| AgentMessage | `api_server.py` | Pydantic BaseModel |
| GeneratedPosts | `api_server.py` | Pydantic BaseModel |
| GeneratedImages | `api_server.py` | Pydantic BaseModel |
| SafetyCheckResult | `api_server.py` | Pydantic BaseModel |
| WorkflowResult | `api_server.py` | Pydantic BaseModel |
| SafetyFlag | `safety/brand_filters.py` | @dataclass |
| ShieldResult | `safety/brand_filters.py` | @dataclass |

**Data Model Status**: IMPLEMENTED — All entities match production code
