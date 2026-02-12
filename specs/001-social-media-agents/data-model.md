# Data Model: Multi-Agent Social Media Content Creation System

**Feature**: 001-social-media-agents  
**Date**: 2025-01-23  
**Status**: Phase 1 Design

---

## Overview

This data model defines the core entities and their relationships for the multi-agent social media content creation workflow. The model is intentionally lightweight to support the 100-minute hackathon constraint, focusing on essential data structures needed for group chat orchestration, reasoning transparency, and platform-specific output generation.

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
brief = CampaignBrief(
    brand_name="TechCorp",
    industry="Technology",
    target_audience="Enterprise CIOs and IT decision-makers in Fortune 500 companies",
    key_message="AI-powered automation transforms enterprise operations, reducing costs by 40% while improving accuracy"
)
```

**Usage in Workflow**:
- Converted to natural language prompt for Creator agent's first turn
- Brand context extracted for grounding source queries (File Search)
- Referenced in Reviewer agent's brand alignment evaluation

---

### 2. AgentMessage (Conversation Entity)

**Purpose**: Represents a single agent's contribution (draft, feedback, or final output) within the group chat conversation.

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `agent_name` | str | Yes | "Creator", "Reviewer", or "Publisher" | "Creator" |
| `content` | str | Yes | Message body (draft text or feedback) | "Step 1: The campaign objective is awareness..." |
| `reasoning_steps` | List[str] | Yes | Visible reasoning (Chain-of-Thought, ReAct, etc.) | ["Step 1: Identify objective...", "Step 2: Consider audience..."] |
| `round_number` | int | Yes | Conversation round (1-5) | 1 |
| `timestamp` | datetime | Yes | Message generation time | 2025-01-23 14:32:15 |
| `role` | str | Yes | "assistant" (all agents are assistants in framework) | "assistant" |

**Constraints**:
- `agent_name` must be one of the three valid agents
- `reasoning_steps` must not be empty (constitutional requirement for visible reasoning)
- `round_number` increments with each new speaker
- `content` length varies by agent role (Creator: ~150 words, Reviewer: ~120 words, Publisher: ~300 words)

**Python Dataclass**:
```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import List

@dataclass
class AgentMessage:
    agent_name: str  # "Creator", "Reviewer", "Publisher"
    content: str
    reasoning_steps: List[str]
    round_number: int
    timestamp: datetime = field(default_factory=datetime.now)
    role: str = "assistant"
    
    def __post_init__(self):
        assert self.agent_name in ["Creator", "Reviewer", "Publisher"], f"Invalid agent: {self.agent_name}"
        assert len(self.reasoning_steps) > 0, "Reasoning steps cannot be empty"
        assert self.round_number >= 1, "Round number must be positive"
```

**Example**:
```python
message = AgentMessage(
    agent_name="Creator",
    content="Step 1: The campaign objective is to drive awareness...\n\nDRAFT: Transform your enterprise operations with AI...",
    reasoning_steps=[
        "Step 1: Identify objective - awareness campaign for product launch",
        "Step 2: Consider audience - Enterprise CIOs value ROI and efficiency",
        "Step 3: Draft hook - Lead with transformation promise",
        "Step 4: Build body - Highlight 40% cost reduction metric",
        "Step 5: Add CTA - Encourage demo request"
    ],
    round_number=1
)
```

**Usage in Workflow**:
- Collected in chronological order to form `ConversationTranscript`
- `reasoning_steps` extracted for judging review (reasoning transparency criterion)
- `agent_name` used by speaker selector to determine next agent
- `content` used by subsequent agents as input for their reasoning

---

### 3. SocialMediaPost (Output Entity)

**Purpose**: Platform-specific formatted social media post ready for publishing.

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `platform` | str | Yes | "LinkedIn", "Twitter", or "Instagram" | "LinkedIn" |
| `body` | str | Yes | Post text content | "🚀 Transform your enterprise operations..." |
| `hashtags` | List[str] | Yes | Platform-appropriate hashtags | ["#EnterpriseAI", "#DigitalTransformation"] |
| `call_to_action` | str | Yes | CTA statement | "Request a demo today: [link]" |
| `character_count` | int | Yes | Text length (platform validation) | 245 |
| `validation_status` | bool | Yes | Passed platform constraints | True |
| `visual_suggestion` | str | Optional | Image/graphic idea (Instagram only) | "[Image: Modern office with AI dashboard on screens]" |
| `emojis` | List[str] | Optional | Emojis used (Instagram/Twitter) | ["🚀", "💡"] |

**Platform-Specific Constraints**:

#### LinkedIn
- **Length**: 1-3 paragraphs (approx. 150-300 words)
- **Tone**: Professional-conversational
- **Hashtags**: 3-5 relevant industry tags
- **CTA**: Professional (e.g., "Learn more in comments", "Download whitepaper")
- **Emojis**: Optional, minimal (0-2)

#### Twitter/X
- **Length**: ≤280 characters (STRICT, enforced by Publisher Self-Reflection)
- **Tone**: Punchy, immediate impact
- **Hashtags**: 2-3 max (included in character count)
- **CTA**: Action-oriented (e.g., "Try now", "Join us")
- **Emojis**: Optional (1-3)

#### Instagram
- **Length**: 125-150 words (caption style)
- **Tone**: Casual, storytelling
- **Hashtags**: 5-10 (mix popular + niche)
- **CTA**: Community-driven (e.g., "Tag a friend", "Share your story")
- **Emojis**: Required (2-5 relevant emojis)
- **Visual**: Suggestion in [brackets] for image content

**Python Dataclass**:
```python
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class SocialMediaPost:
    platform: str  # "LinkedIn", "Twitter", "Instagram"
    body: str
    hashtags: List[str]
    call_to_action: str
    character_count: int
    validation_status: bool
    visual_suggestion: Optional[str] = None
    emojis: Optional[List[str]] = None
    
    def __post_init__(self):
        assert self.platform in ["LinkedIn", "Twitter", "Instagram"], f"Invalid platform: {self.platform}"
        self.character_count = len(self.body)
        self.validation_status = self._validate_constraints()
    
    def _validate_constraints(self) -> bool:
        """Validate platform-specific constraints."""
        if self.platform == "Twitter":
            return self.character_count <= 280 and 2 <= len(self.hashtags) <= 3
        elif self.platform == "LinkedIn":
            return 3 <= len(self.hashtags) <= 5
        elif self.platform == "Instagram":
            return 5 <= len(self.hashtags) <= 10 and self.emojis and len(self.emojis) >= 2
        return False
```

**Example (LinkedIn)**:
```python
linkedin_post = SocialMediaPost(
    platform="LinkedIn",
    body="""Transform your enterprise operations with AI-powered automation.

At TechCorp, we've helped Fortune 500 companies reduce operational costs by 40% while improving accuracy and efficiency. Our latest AI platform integrates seamlessly with your existing systems, delivering measurable results in weeks, not months.

Ready to lead the transformation? Let's talk.""",
    hashtags=["#EnterpriseAI", "#DigitalTransformation", "#AIInnovation", "#TechLeadership"],
    call_to_action="Request a demo: techcorp.com/demo",
    character_count=389,
    validation_status=True,
    emojis=["🚀"]
)
```

**Example (Twitter)**:
```python
twitter_post = SocialMediaPost(
    platform="Twitter",
    body="🚀 Cut enterprise costs by 40% with AI automation. TechCorp delivers results in weeks. Try our platform today. #EnterpriseAI #AIInnovation 💡",
    hashtags=["#EnterpriseAI", "#AIInnovation"],
    call_to_action="Try now: techcorp.com",
    character_count=138,
    validation_status=True,
    emojis=["🚀", "💡"]
)
```

**Example (Instagram)**:
```python
instagram_post = SocialMediaPost(
    platform="Instagram",
    body="""✨ What if your team could do more in less time? 

At TechCorp, we're transforming how enterprises work with AI that actually delivers. 🚀 40% cost savings. 💡 100% accuracy. 🎯 Results in weeks.

Your competitors are already automating. Are you? Tag a colleague who needs to see this! 👇""",
    hashtags=["#EnterpriseAI", "#AIInnovation", "#DigitalTransformation", "#TechLeadership", "#FutureOfWork", "#AIAutomation", "#EnterpriseEfficiency"],
    call_to_action="Tag a colleague who needs to see this! 👇",
    character_count=325,
    validation_status=True,
    visual_suggestion="[Image: Modern office with diverse team collaborating around AI dashboard on large screen]",
    emojis=["✨", "🚀", "💡", "🎯", "👇"]
)
```

**Usage in Workflow**:
- Generated by Publisher agent during final workflow round
- Three instances created (one per platform) in single Publisher turn
- Returned as final output alongside `ConversationTranscript`

---

### 4. ConversationTranscript (Metadata Entity)

**Purpose**: Complete record of the multi-agent workflow execution, including all messages, reasoning steps, and metadata for judging review and debugging.

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `messages` | List[AgentMessage] | Yes | All agent communications in order | [msg1, msg2, msg3, ...] |
| `termination_reason` | str | Yes | Why workflow ended | "publisher_completion" |
| `total_rounds` | int | Yes | Conversation length | 4 |
| `duration_seconds` | float | Yes | Workflow execution time | 87.5 |
| `grounding_sources_used` | List[str] | Yes | Data sources referenced | ["brand-guidelines.docx"] |
| `tools_invoked` | List[str] | Yes | External tools called | ["file_search", "filesystem_write"] |
| `final_posts` | List[SocialMediaPost] | Yes | Platform-ready outputs | [linkedin, twitter, instagram] |
| `evaluation_metrics` | List[EvaluationMetrics] | Optional | Quality scores (bonus feature) | [metrics_linkedin, metrics_twitter, metrics_instagram] |
| `content_safety_passed` | bool | Optional | Content safety check result (bonus) | True |

**Termination Reason Enum**:
- `"publisher_completion"`: Publisher agent finished formatting all platforms
- `"max_rounds_reached"`: 5-round limit hit (safety termination)
- `"reviewer_approval"`: Reviewer fast-tracked with "APPROVED" verdict

**Python Dataclass**:
```python
from dataclasses import dataclass, field
from typing import List
from datetime import datetime

@dataclass
class ConversationTranscript:
    messages: List[AgentMessage]
    termination_reason: str
    total_rounds: int
    duration_seconds: float
    grounding_sources_used: List[str]
    tools_invoked: List[str]
    final_posts: List[SocialMediaPost]
    evaluation_metrics: Optional[List[EvaluationMetrics]] = None  # Bonus feature
    content_safety_passed: Optional[bool] = None  # Bonus feature
    created_at: datetime = field(default_factory=datetime.now)
    
    def __post_init__(self):
        valid_terminations = ["publisher_completion", "max_rounds_reached", "reviewer_approval"]
        assert self.termination_reason in valid_terminations, f"Invalid termination: {self.termination_reason}"
        assert len(self.final_posts) == 3, "Must have exactly 3 platform posts"
    
    def to_markdown(self) -> str:
        """
        Export transcript as formatted markdown for demo output.
        """
        md = f"# Social Media Content Creation — Workflow Transcript\n\n"
        md += f"**Termination**: {self.termination_reason}\n"
        md += f"**Rounds**: {self.total_rounds}\n"
        md += f"**Duration**: {self.duration_seconds:.1f}s\n"
        md += f"**Grounding**: {', '.join(self.grounding_sources_used)}\n"
        md += f"**Tools**: {', '.join(self.tools_invoked)}\n\n"
        
        md += "## Conversation\n\n"
        for msg in self.messages:
            md += f"### {msg.agent_name} (Round {msg.round_number})\n\n"
            md += f"**Reasoning**:\n"
            for step in msg.reasoning_steps:
                md += f"- {step}\n"
            md += f"\n**Message**:\n{msg.content}\n\n"
        
        md += "## Final Platform Posts\n\n"
        for post in self.final_posts:
            md += f"### {post.platform}\n\n"
            md += f"{post.body}\n\n"
            md += f"**Hashtags**: {', '.join(post.hashtags)}\n"
            md += f"**CTA**: {post.call_to_action}\n"
            md += f"**Validation**: {'✅ PASS' if post.validation_status else '❌ FAIL'}\n\n"
        
        return md
```

**Usage in Workflow**:
- Assembled incrementally as agents contribute messages
- Final posts appended when Publisher completes
- Exported as markdown for demo documentation
- Used for judging review (reasoning transparency)

---

### 5. EvaluationMetrics (Bonus Entity — Optional)

**Purpose**: Automated quality assessment scores for generated content (FR-031).

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `platform` | str | Yes | Platform being evaluated | "LinkedIn" |
| `relevance_score` | float | Yes | Content relevance (0-5) | 4.2 |
| `coherence_score` | float | Yes | Logical flow and structure (0-5) | 4.5 |
| `groundedness_score` | float | Yes | Factual accuracy from sources (0-5) | 4.0 |
| `fluency_score` | float | Yes | Language quality and readability (0-5) | 4.8 |
| `aggregate_score` | float | Yes | Average of all metrics | 4.375 |
| `safety_violations` | List[str] | Optional | Content safety issues detected | ["none"] |
| `evaluated_at` | datetime | Yes | Evaluation timestamp | 2025-01-23 14:45:30 |

**Python Dataclass**:
```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional

@dataclass
class EvaluationMetrics:
    platform: str
    relevance_score: float
    coherence_score: float
    groundedness_score: float
    fluency_score: float
    aggregate_score: float
    safety_violations: Optional[List[str]] = None
    evaluated_at: datetime = field(default_factory=datetime.now)
    
    def __post_init__(self):
        # Auto-calculate aggregate if not provided
        if not self.aggregate_score:
            self.aggregate_score = (
                self.relevance_score + 
                self.coherence_score + 
                self.groundedness_score + 
                self.fluency_score
            ) / 4.0
        
        # Validate scores are in range
        for score in [self.relevance_score, self.coherence_score, 
                     self.groundedness_score, self.fluency_score]:
            assert 0 <= score <= 5, f"Score {score} out of range (0-5)"
```

**Example**:
```python
metrics = EvaluationMetrics(
    platform="LinkedIn",
    relevance_score=4.2,
    coherence_score=4.5,
    groundedness_score=4.0,
    fluency_score=4.8,
    aggregate_score=4.375,
    safety_violations=[]  # No violations detected
)
```

**Usage** (Bonus Feature):
- Generated asynchronously after Publisher completes
- Attached to ConversationTranscript for quality tracking
- Provides quantitative metrics for continuous improvement

---

## Entity Relationships

```
CampaignBrief (1)
    ↓ initiates
GroupChatWorkflow (1)
    ↓ produces
ConversationTranscript (1)
    ├── contains (1..N)
    │   ↓
    │   AgentMessage (N)
    │       ├── Creator messages (1..2)
    │       ├── Reviewer messages (1..2)
    │       └── Publisher message (1)
    │
    └── includes (1..3)
        ↓
        SocialMediaPost (3)
            ├── LinkedIn (1)
            ├── Twitter (1)
            └── Instagram (1)
```

**Relationship Rules**:
1. Each `CampaignBrief` triggers exactly one workflow execution
2. Each workflow produces exactly one `ConversationTranscript`
3. Each `ConversationTranscript` contains 3-10 `AgentMessage` instances (depending on rounds)
4. Each `ConversationTranscript` includes exactly 3 `SocialMediaPost` instances (one per platform)
5. `AgentMessage` instances are ordered chronologically by `round_number` and `timestamp`

---

## State Transitions

### Workflow State Machine

```
[INITIAL STATE: CampaignBrief received]
    ↓
Round 1: Creator → generates Draft 1
    ↓
Round 2: Reviewer → evaluates Draft 1 → Verdict: REVISE
    ↓
Round 3: Creator → generates Draft 2 (incorporates feedback)
    ↓
Round 4: Reviewer → evaluates Draft 2 → Verdict: APPROVED
    ↓
[Fast-track to Publisher due to APPROVED verdict]
    ↓
Round 5: Publisher → formats 3 platform posts → Self-Reflection validation
    ↓
[TERMINAL STATE: ConversationTranscript with 3 SocialMediaPost entities]
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
┌─────────────────────┐
│   CampaignBrief     │ (User Input)
│  - brand_name       │
│  - industry         │
│  - target_audience  │
│  - key_message      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  GroupChat Workflow │
│  - Speaker selector │
│  - Termination logic│
└──────┬──────────────┘
       │
       ├─► Creator Agent
       │   └─► AgentMessage (Draft + Chain-of-Thought)
       │
       ├─► Reviewer Agent
       │   └─► AgentMessage (Feedback + ReAct)
       │
       └─► Publisher Agent
           └─► AgentMessage (3x SocialMediaPost + Self-Reflection)
           
           ▼
┌─────────────────────┐
│ ConversationTranscript│
│  - messages[]       │
│  - final_posts[]    │
│  - metadata         │
└─────────────────────┘
           │
           ▼
      (Output to User)
```

---

## Validation Rules Summary

| Entity | Validation Rule | Enforcement Point |
|--------|----------------|------------------|
| CampaignBrief | All fields non-empty, platforms fixed | Input validation (startup) |
| AgentMessage | Reasoning steps not empty | Agent message creation |
| SocialMediaPost (Twitter) | ≤280 chars, 2-3 hashtags | Publisher Self-Reflection |
| SocialMediaPost (LinkedIn) | 3-5 hashtags | Publisher Self-Reflection |
| SocialMediaPost (Instagram) | 5-10 hashtags, 2+ emojis | Publisher Self-Reflection |
| ConversationTranscript | Exactly 3 final posts | Workflow termination |
| All Entities | No null/None for required fields | Dataclass `__post_init__` |

---

## Storage Strategy

**Ephemeral (In-Memory Only)**:
- `CampaignBrief`: Exists only during workflow execution
- `AgentMessage`: Collected in list, discarded after workflow
- `ConversationTranscript`: Exists only during execution

**Optional Persistence (via MCP Filesystem Tool)**:
- `ConversationTranscript.to_markdown()` → saved to `output/social-posts-YYYY-MM-DD.md`
- `SocialMediaPost` entities → saved individually as JSON (optional)

**No Database**: The hackathon scope does not require persistence. All state is ephemeral, suitable for single-session execution.

---

## Data Model Alignment with Requirements

| Requirement | Data Model Support |
|-------------|-------------------|
| FR-001: Accept campaign brief | ✅ `CampaignBrief` entity with all required fields |
| FR-004: Output conversation transcript | ✅ `ConversationTranscript` with all messages |
| FR-005: Produce 3 platform posts | ✅ `SocialMediaPost` (3 instances in transcript) |
| FR-006: Chain-of-Thought reasoning | ✅ `AgentMessage.reasoning_steps` for Creator |
| FR-011: Platform-specific formatting | ✅ `SocialMediaPost` constraints per platform |
| SC-003: Reasoning transparency | ✅ `reasoning_steps` preserved in `AgentMessage` |
| SC-007: Platform constraints satisfied | ✅ `validation_status` in `SocialMediaPost` |

---

## Next Steps

1. ✅ Data model complete — entities and relationships defined
2. ⏭️ Generate contracts (agent system instructions)
3. ⏭️ Generate quickstart guide (hackathon execution timeline)
4. ⏭️ Update agent context with data model terminology
5. ⏭️ Proceed to Phase 2: Generate `tasks.md` with implementation tasks

**Data Model Status**: COMPLETE — Ready for contract generation
