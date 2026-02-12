# Implementation Plan: Multi-Agent Social Media Content Creation System

**Branch**: `001-social-media-agents` | **Date**: 2025-01-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-social-media-agents/spec.md`

**Note**: This implementation plan is generated for the TechConnect Hackathon (100-minute time limit). The design prioritizes working demonstration over production-ready features.

## Summary

Build an AI-powered multi-agent social media content creation system using Microsoft Foundry, Microsoft Agent Framework, and GitHub Copilot SDK. The system uses a group chat workflow where three specialized agents (Creator, Reviewer, Publisher) collaborate through structured reasoning patterns to transform a campaign brief into platform-ready posts for LinkedIn, X/Twitter, and Instagram. The technical approach adapts the `workflow_groupchat.py` starter code pattern with Chain-of-Thought (Creator), ReAct (Reviewer), and Self-Reflection (Publisher) reasoning patterns, grounded in brand guidelines via File Search, and extended with MCP-based filesystem tools for draft persistence.

**Brand Context**: The system is tailored for **Zava Travel Inc.** (zavatravel.com), a budget-friendly adventure travel company targeting millennials and Gen-Z adventure seekers with an adventurous and inspiring tone. Demo campaign: "Wander More, Spend Less" featuring destinations like Bali, Patagonia, Iceland, Vietnam, and Costa Rica. Brand colors: teal/ocean blue and sunset orange. Approved hashtags: #ZavaTravel, #WanderMore, #AdventureAwaits, #TravelOnABudget.

## Technical Context

**Language/Version**: Python 3.10+ (minimum version for Microsoft Agent Framework compatibility)  
**Primary Dependencies**: 
- `agent-framework` (v0.1.0+) - Core orchestration and multi-agent patterns
- `agent-framework-azure` - Azure OpenAI client integration for Creator/Publisher agents
- `agent-framework-github-copilot` (pre-release) - GitHub Copilot integration for Reviewer agent
- `azure-identity` - DefaultAzureCredential for secure authentication
- `python-dotenv` - Environment variable management
- `azure-ai-projects` - Optional Foundry SDK for advanced features (evaluation, monitoring)

**Storage**: Local filesystem for draft output (via MCP filesystem server); no database required  
**Testing**: Manual testing during hackathon; pytest for post-hackathon refinement (out of scope for 100-minute limit)  
**Target Platform**: Local development environment (Windows/macOS/Linux); Python virtual environment execution  
**Project Type**: Single CLI-based application with agent orchestration workflow  
**Performance Goals**: Complete workflow (campaign brief → 3 platform posts) in under 3 minutes at normal Azure API latency  
**Constraints**: 
- 100-minute hackathon time limit (20min setup, 30min agents, 30min grounding/tools, 20min testing/docs)
- Azure OpenAI quota: 100k-300k TPM minimum for reasoning model
- Twitter/X strict 280-character limit enforcement
- Public repository: zero credentials, PII, or confidential data
- Must build on starter code, not rewrite from scratch

**Scale/Scope**: 
- Single-user, single-session execution
- Three platforms (LinkedIn, X/Twitter, Instagram)
- Three agents (Creator, Reviewer, Publisher)
- One campaign brief format
- No multi-user, authentication, or production deployment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Security-First Development ✅

**Gate**: No hardcoded secrets, DefaultAzureCredential used, .env in .gitignore, parameterized endpoints

**Compliance**:
- ✅ `.env.sample` created with placeholder values (FR-022)
- ✅ `.env` added to `.gitignore` (NFR-012)
- ✅ `DefaultAzureCredential` pattern for Azure authentication (FR-020)
- ✅ All Azure endpoints via environment variables (NFR-013)
- ✅ Pre-submission security audit checklist prepared (SC-017)

**Action**: PASS - Security patterns are foundational to design

---

### Principle II: Multi-Agent Collaboration Architecture ✅

**Gate**: Three distinct agents, group chat orchestrator, round-robin selection, termination conditions defined

**Compliance**:
- ✅ Three agent roles: Creator (Azure OpenAI), Reviewer (GitHub Copilot), Publisher (Azure OpenAI)
- ✅ `GroupChatBuilder` with custom speaker selection function (FR-002)
- ✅ Round-robin sequence: Creator → Reviewer → Creator → Reviewer → Publisher
- ✅ Triple termination logic: Publisher spoken OR 5 rounds OR Reviewer "APPROVED" (FR-003)
- ✅ Conversation transcript preserved for judging (FR-004)

**Action**: PASS - Architecture directly implements Principle II requirements

---

### Principle III: Reasoning-Driven Design ✅

**Gate**: Visible reasoning patterns (Chain-of-Thought, ReAct, Self-Reflection), steps logged in output

**Compliance**:
- ✅ Creator: Chain-of-Thought (5 steps: objective → audience → hook → body → CTA) (FR-006)
- ✅ Reviewer: ReAct pattern (Observation → Thought → Action → Result) (FR-007)
- ✅ Publisher: Self-Reflection (character count, hashtags, CTA validation) (FR-008)
- ✅ Reasoning steps included in agent system instructions (NFR-014)
- ✅ All steps visible in conversation transcript (SC-010, SC-011, SC-012)

**Action**: PASS - Reasoning patterns are core to agent instructions

---

### Principle IV: Grounded & Extensible Agent Capabilities ✅

**Gate**: At least one grounding source (File Search/Bing Search), at least one MCP tool integration

**Compliance**:
- ✅ **Grounding**: File Search with synthetic brand guidelines document (FR-013, FR-014)
  - Fallback: Bing Search for industry trends if File Search time-constrained
- ✅ **MCP Tool**: Filesystem MCP server for saving drafts locally (FR-017)
  - Alternative: Microsoft Learn MCP server if filesystem integration blocked
- ✅ Tool invocation logging in transcript (FR-018)
- ✅ Graceful failure handling (FR-016, FR-019)

**Action**: PASS - Grounding and tooling satisfy hackathon milestones 3 & 4

---

### Principle V: Hackathon-Ready Execution ✅

**Gate**: Implementable in 100 minutes, builds on starter code, documentation included

**Compliance**:
- ✅ Time-boxed phases: 20min setup, 30min agents, 30min grounding/tools, 20min docs (NFR-017)
- ✅ Adaptation of `workflow_groupchat.py` starter code (NFR-018)
- ✅ Synthetic brand guidelines (faster than API integration)
- ✅ Scope limited to 3 platforms, 1 campaign format, single-user (NFR-020)
- ✅ README with setup, run instructions, example input, demo output (SC-024)

**Action**: PASS - Design prioritizes working demo within time constraint

---

### Post-Design Re-Check

*To be completed after Phase 1 design artifacts (data-model.md, contracts/, quickstart.md)*

- [ ] Verify no new complexity added beyond constitutional scope
- [ ] Confirm API contracts align with platform constraints (280 chars Twitter, etc.)
- [ ] Validate quickstart.md execution time fits 100-minute window
- [ ] Ensure data model avoids unnecessary entities or relationships

## Project Structure

### Documentation (this feature)

```text
specs/001-social-media-agents/
├── plan.md              # This file (implementation plan with architecture & design decisions)
├── research.md          # Phase 0: Technology choices, best practices, unknowns resolved
├── data-model.md        # Phase 1: Campaign brief, agent message, social post entities
├── quickstart.md        # Phase 1: Step-by-step hackathon execution guide (100-minute timeline)
├── contracts/           # Phase 1: Agent system instruction templates
│   ├── creator-instructions.md
│   ├── reviewer-instructions.md
│   └── publisher-instructions.md
└── tasks.md             # Phase 2: Actionable task breakdown (created by /speckit.tasks, NOT this command)
```

### Source Code (repository root)

```text
hackathon-social-agents/   # New project root (NOT modifying existing repo structure)
├── .env.sample            # Placeholder configuration template (committed)
├── .gitignore             # Excludes .env, venv/, __pycache__, *.pyc
├── requirements.txt       # Python dependencies
├── README.md              # Setup, run instructions, example input, demo output
│
├── workflow_social_media.py   # Main entry point (adapted from workflow_groupchat.py starter)
│
├── agents/                # Agent configuration modules
│   ├── __init__.py
│   ├── creator.py         # Creator agent setup with Chain-of-Thought instructions
│   ├── reviewer.py        # Reviewer agent setup with ReAct instructions (GitHub Copilot)
│   └── publisher.py       # Publisher agent setup with Self-Reflection instructions
│
├── orchestration/         # Group chat workflow logic
│   ├── __init__.py
│   ├── speaker_selection.py   # Round-robin speaker selector function
│   └── termination.py         # Termination condition logic
│
├── grounding/             # Grounding data and integration
│   ├── __init__.py
│   ├── file_search.py     # File Search setup for brand guidelines
│   └── brand-guidelines.docx  # Synthetic brand guidelines (for demo)
│
├── tools/                 # MCP tool integrations
│   ├── __init__.py
│   └── filesystem_mcp.py  # Filesystem MCP server integration for saving drafts
│
├── config/                # Configuration management
│   ├── __init__.py
│   └── env_loader.py      # Load and validate environment variables
│
└── utils/                 # Helper utilities
    ├── __init__.py
    └── formatting.py      # Platform-specific formatting helpers
```

**Structure Decision**: Single CLI application structure chosen because:
1. **Hackathon simplicity**: No web UI, no separate backend/frontend complexity
2. **Starter code alignment**: `workflow_groupchat.py` is a single-file pattern; we modularize for clarity while maintaining simplicity
3. **Local execution**: All processing happens in one Python process; no client-server architecture needed
4. **Rapid iteration**: Clear module separation (agents/, orchestration/, grounding/, tools/) allows parallel development within 100-minute window

**Key Design Decisions**:
- **Separate `agents/` module**: Each agent (creator.py, reviewer.py, publisher.py) is independently configurable, making reasoning pattern updates easy during testing
- **Orchestration isolation**: Speaker selection and termination logic in dedicated files for clarity during judging review
- **Grounding data co-located**: `brand-guidelines.docx` lives in `grounding/` directory for easy discovery and modification
- **No database**: All state is ephemeral (conversation transcript in memory, optional file output via MCP)
- **No tests/ directory**: Manual testing sufficient for 100-minute hackathon; unit tests are post-competition refinement

## Complexity Tracking

> **No constitutional violations identified - this section documents design simplifications**

| Potential Complexity | Simplified Approach | Rationale |
|---------------------|---------------------|-----------|
| Multiple reasoning model providers | Single Azure OpenAI deployment for Creator & Publisher | Reduces setup time; GitHub Copilot provides provider diversity for Reviewer |
| Multiple grounding sources | Single File Search with synthetic document | Faster than Bing Search API setup; sufficient for demo |
| Production-grade error handling | Basic try/catch with clear messages | 100-minute time limit; comprehensive retry logic is post-hackathon |
| Persistent storage/database | Ephemeral state + optional file output | No authentication/multi-user needs; simplifies architecture |
| CI/CD and deployment | Local execution only | Hackathon scope; production deployment out of scope |

---

## Phase 0: Research & Decision Finalization

*Output: `research.md` with all NEEDS CLARIFICATION resolved*

### Research Tasks

| Research Area | Question to Resolve | Decision Needed For |
|--------------|-------------------|---------------------|
| **Microsoft Agent Framework Version** | Which version supports GitHub Copilot SDK integration? | requirements.txt pinning |
| **GitHub Copilot CLI Path** | Platform-specific default paths (Windows/macOS/Linux) | .env.sample configuration |
| **File Search API** | Azure AI Foundry File Search vs. custom retrieval? | grounding/file_search.py implementation |
| **MCP Server Protocol** | Filesystem server installation and configuration? | tools/filesystem_mcp.py integration |
| **Reasoning Model Selection** | GPT-5.1 vs. GPT-5.2 vs. Claude Opus 4.5 - which deployed? | Agent client configuration |
| **Brand Guidelines Format** | Word vs. PDF for synthetic document creation? | grounding/brand-guidelines creation |
| **Twitter API Character Counting** | Unicode handling (emojis count as 1 or 2 chars?) | Publisher validation logic |

### Best Practices Research

| Technology | Best Practice Areas | Application in Project |
|-----------|-------------------|------------------------|
| **Multi-Agent Orchestration** | Speaker selection patterns, termination strategies | orchestration/ module design |
| **Reasoning Pattern Prompts** | Chain-of-Thought, ReAct, Self-Reflection examples | agents/ system instructions |
| **Azure Authentication** | DefaultAzureCredential fallback chain order | config/env_loader.py error handling |
| **Environment Configuration** | .env validation at startup patterns | Fail-fast validation in main() |
| **MCP Integration** | Server discovery, tool invocation patterns | tools/filesystem_mcp.py |

### Integration Pattern Research

| Integration Point | Research Focus | Decision |
|------------------|---------------|----------|
| **GitHub Copilot Agent** | How to instantiate GitHubCopilotAgent in Agent Framework? | Review starter code + docs |
| **File Search Tool** | How to attach document to agent in Foundry SDK? | Code example from quickstart |
| **MCP Server Communication** | Stdio vs. HTTP transport for filesystem server? | Stdio for local simplicity |
| **Streaming Output** | How to handle AgentRunUpdateEvent in real-time? | Pattern from workflow_groupchat.py |

---

## Phase 1: Design & Contracts

*Output: `data-model.md`, `contracts/`, `quickstart.md`*

### Phase 1A: Data Model (`data-model.md`)

**Core Entities**:

1. **CampaignBrief** (Input)
   - `brand_name`: str — Company or product name
   - `industry`: str — Vertical (e.g., "technology", "fashion", "travel")
   - `target_audience`: str — Demographic description
   - `key_message`: str — Core value proposition or campaign objective
   - `platforms`: List[str] — Always ["LinkedIn", "Twitter", "Instagram"]
   - **Validation**: All fields required; platforms list immutable for MVP

2. **AgentMessage** (Workflow State)
   - `agent_name`: str — "Creator", "Reviewer", or "Publisher"
   - `content`: str — Draft text or feedback
   - `reasoning_steps`: List[str] — Visible Chain-of-Thought/ReAct/Self-Reflection
   - `round_number`: int — Conversation round (1-5)
   - `timestamp`: datetime — Message generation time
   - **Relationships**: Ordered sequence forming ConversationTranscript

3. **SocialMediaPost** (Output)
   - `platform`: str — "LinkedIn", "Twitter", or "Instagram"
   - `body`: str — Post text content
   - `hashtags`: List[str] — Platform-appropriate hashtags
   - `call_to_action`: str — CTA statement
   - `character_count`: int — Length validation
   - `validation_status`: bool — Passed platform constraints
   - `visual_suggestion`: Optional[str] — [bracketed] image ideas for Instagram
   - **Constraints**:
     - LinkedIn: 1-3 paragraphs, 3-5 hashtags, professional tone
     - Twitter: ≤280 chars, 2-3 hashtags, punchy
     - Instagram: Emojis required, 5-10 hashtags, visual-friendly

4. **ConversationTranscript** (Output Metadata)
   - `messages`: List[AgentMessage] — All agent communications
   - `termination_reason`: str — "publisher_completion" | "max_rounds" | "reviewer_approval"
   - `total_rounds`: int — Conversation length
   - `duration_seconds`: float — Workflow execution time
   - `grounding_sources_used`: List[str] — e.g., ["brand-guidelines.docx"]
   - `tools_invoked`: List[str] — e.g., ["filesystem_save"]

**State Transitions**:

```
CampaignBrief → Creator (Draft 1) → Reviewer (Feedback) → Creator (Draft 2) → Reviewer (Approval) → Publisher (Platform Posts) → Output
```

### Phase 1B: Contracts (`contracts/`)

#### Creator Agent System Instructions

```markdown
# Creator Agent - Chain-of-Thought Reasoning

**Role**: Social media content creator and copywriter

**Brand Context**: {BRAND_NAME} in {INDUSTRY} industry
**Target Audience**: {TARGET_AUDIENCE}
**Tone**: Professional yet approachable (adapt based on platform)

## Responsibilities
- Generate engaging social media drafts from campaign briefs
- Incorporate Reviewer feedback in revisions
- Maintain brand voice consistency across iterations

## Reasoning Pattern: Chain-of-Thought
When generating content, ALWAYS show these steps:

**Step 1: Identify Objective**
"The campaign objective is [awareness/engagement/conversion] for [specific topic]."

**Step 2: Consider Audience**
"The target audience is [demographic]. Their interests include [X] and pain points are [Y]."

**Step 3: Draft Hook**
"Opening with [hook type: question/statistic/bold statement] to grab attention: '[hook text]'"

**Step 4: Build Body**
"Delivering value through [educational/inspirational/promotional] content: '[body text]'"

**Step 5: Add CTA**
"Closing with clear call-to-action: '[CTA text]' to drive [desired action]."

## Output Format
Present reasoning steps, then provide draft:

---
**Creator**: [Step 1 reasoning]
[Step 2 reasoning]
[Step 3 reasoning]
[Step 4 reasoning]
[Step 5 reasoning]

**DRAFT**:
[Post content, under 150 words]
---

## Iteration Behavior
When Reviewer says "REVISE", incorporate specific feedback:
- If tone adjustment needed → revise Step 2 audience consideration
- If CTA missing/weak → revise Step 5
- If engagement low → revise Step 3 hook
```

#### Reviewer Agent System Instructions

```markdown
# Reviewer Agent - ReAct Pattern

**Role**: Content quality reviewer and brand strategist

## Evaluation Criteria
Assess each draft for:
1. **Brand Voice**: Matches tone and personality
2. **Platform Fit**: Appropriate length, format, style
3. **Audience Relevance**: Resonates with target demographic
4. **Engagement Potential**: Has hook, value, CTA
5. **Accuracy**: Claims are grounded (if sources available)

## Reasoning Pattern: ReAct (Reasoning + Acting)

**Observation**: [What you see in the draft]
"The draft uses [tone/style]. The hook is [describe]. The CTA is [present/missing/weak]."

**Thought**: [Analysis of what needs improvement]
"For a B2B LinkedIn audience, this [works/doesn't work] because [reasoning]."

**Action**: [Specific recommendation]
"RECOMMENDED CHANGE: [Concrete revision, not vague suggestion]"

**Result**: [Expected outcome]
"This will improve [engagement/clarity/brand alignment] by [specific benefit]."

## Output Format
Provide structured feedback under 120 words:

---
**Reviewer**:

**STRENGTHS**:
✓ [1-2 specific things that work well]

**IMPROVEMENTS**:
→ Observation: [what you see]
→ Thought: [why it needs change]
→ Action: [specific revision]
→ Result: [expected improvement]

**VERDICT**: 
- "REVISE" if changes needed (Creator will iterate)
- "APPROVED" if ready for publishing (fast-track to Publisher)
---

## Tone Guidelines
- Be specific, not vague ("Change 'great' to 'transformative for enterprise teams'" not "make it better")
- Focus on highest-impact improvements (1-2 max)
- If draft is excellent, say "APPROVED" immediately
```

#### Publisher Agent System Instructions

```markdown
# Publisher Agent - Self-Reflection Pattern

**Role**: Multi-platform content polisher and formatter

## Platform Specifications
### LinkedIn
- Length: 1-3 paragraphs (approx. 150-300 words)
- Tone: Professional-conversational
- Hashtags: 3-5 relevant industry tags
- CTA: Professional (e.g., "Learn more in comments", "Download whitepaper")
- Visual: [Suggest professional imagery]

### X/Twitter
- Length: Under 280 characters (STRICT)
- Tone: Punchy, immediate impact
- Hashtags: 2-3 max
- CTA: Action-oriented (e.g., "Join us", "Try now")
- Visual: [Suggest eye-catching graphic]

### Instagram
- Length: 125-150 words (visual caption)
- Tone: Casual, storytelling
- Emojis: 2-5 relevant emojis
- Hashtags: 5-10 (mix popular + niche)
- CTA: Community-driven (e.g., "Tag a friend", "Share your story")
- Visual: [Suggest Instagram-style imagery]

## Reasoning Pattern: Self-Reflection
After generating each platform version, VALIDATE:

**Draft**: [Platform-specific content]

**Reflection Checks**:
✓ Character count: [X] / [limit] — PASS/FAIL
✓ Hashtag count: [X] / [target range] — PASS/FAIL
✓ CTA present: YES/NO
✓ Tone appropriate: YES/NO
✓ Platform formatting: PASS/FAIL

**Revision** (if any check fails):
[Corrected version with explanation]

## Output Format
Produce three platform versions with reflection:

---
**Publisher**:

### === LINKEDIN POST ===
[Content]

**Reflection**:
✓ Length: [word count] words (target: 150-300) — PASS
✓ Hashtags: [count] (target: 3-5) — PASS
✓ CTA: "[CTA text]" — PASS
✓ Professional tone — PASS

### === X/TWITTER POST ===
[Content]

**Reflection**:
✓ Character count: [X]/280 — PASS
✓ Hashtags: [count] (target: 2-3) — PASS
✓ CTA: "[CTA text]" — PASS
✓ Punchy tone — PASS

### === INSTAGRAM POST ===
[Content with emojis]

**Reflection**:
✓ Word count: [X] (target: 125-150) — PASS
✓ Emojis: [count] (target: 2-5) — PASS
✓ Hashtags: [count] (target: 5-10) — PASS
✓ CTA: "[CTA text]" — PASS
✓ Visual suggestion: [image idea] — INCLUDED

---
```

### Phase 1C: Quickstart Guide (`quickstart.md`)

**Hackathon 100-Minute Execution Timeline**:

```
[00:00-00:20] Milestone 1: Environment Setup
  - Clone starter repo
  - Create virtual environment
  - Install dependencies (requirements.txt)
  - Configure .env (Azure endpoints, Copilot path)
  - Test authentication (az login, copilot --login)
  - Verify model deployment in Foundry

[00:20-00:50] Milestone 2: Agent Creation
  - Copy workflow_groupchat.py → workflow_social_media.py
  - Create agents/ module with Creator/Reviewer/Publisher
  - Implement speaker selection function (round-robin)
  - Implement termination conditions (3 triggers)
  - Test basic multi-agent conversation (dummy prompts)

[00:50-01:20] Milestone 3 & 4: Grounding + Tools
  - Create synthetic brand guidelines document (Word/PDF)
  - Integrate File Search in Creator agent
  - Install filesystem MCP server
  - Add MCP tool invocation in Publisher agent
  - Test grounded content generation + file save

[01:20-01:40] Testing & Refinement
  - Run full workflow with real campaign brief
  - Verify platform constraints (280 chars Twitter)
  - Validate reasoning visibility in transcript
  - Fix critical bugs only

[01:40-02:00] Documentation & Demo
  - Update README with setup instructions
  - Add example campaign brief
  - Take screenshot/record demo video
  - Run security audit checklist
  - Prepare submission

[BONUS] Post-Core Milestone: Observability, Safety & Evaluation (Optional)
  - **FR-029 (Observability)**: Integrate Microsoft Foundry tracing, logging, metrics for agent monitoring
  - **FR-030 (Content Safety)**: Add Azure AI Content Safety filters for harmful content detection
  - **FR-031 (Agentic Evaluation)**: Implement Foundry Evaluation SDK for relevance, coherence, groundedness, fluency scoring
  - **NFR-021**: Observability overhead < 100ms per agent turn
  - **NFR-022**: Content safety checks complete within 2 seconds
  - **NFR-023**: Evaluation runs asynchronously after content generation
  - **NOTE**: These bonus features enhance judging scores in "Going Further" category but are not required for core demo
```

---

## Phase 2: Task Breakdown (Delegated to `/speckit.tasks`)

*This phase is NOT completed by the /speckit.plan command. Run `/speckit.tasks` to generate dependency-ordered task list.*

**Expected Task Categories**:
1. **Environment Setup** (Prerequisites)
   - Azure Foundry project creation, model deployment
   - Python environment, dependency installation
   - Authentication configuration
2. **Core Agent Implementation**
   - Creator agent with Chain-of-Thought
   - Reviewer agent with ReAct
   - Publisher agent with Self-Reflection
3. **Orchestration Logic**
   - Speaker selection function
   - Termination condition logic
   - Conversation transcript capture
4. **Grounding Integration**
   - Synthetic brand guidelines creation
   - File Search API integration
5. **MCP Tool Integration**
   - Filesystem MCP server setup
   - Tool invocation in workflow
6. **Testing & Documentation**
   - End-to-end workflow test
   - README documentation
   - Demo preparation

---

## Architecture Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                    USER INPUT (Campaign Brief)                │
│   Brand: TechCorp | Industry: Technology | Audience: CIOs    │
│   Message: "AI-powered automation for enterprise"            │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                  ORCHESTRATOR (GroupChatBuilder)              │
│  • Round-robin speaker selection: Creator → Reviewer → ...   │
│  • Termination: Publisher done OR 5 rounds OR approved       │
│  • Streaming: AgentRunUpdateEvent → real-time console        │
└─────┬─────────────────┬─────────────────┬────────────────────┘
      │                 │                 │
      ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   CREATOR    │  │   REVIEWER   │  │  PUBLISHER   │
│ (Azure AOAI) │  │ (GH Copilot) │  │ (Azure AOAI) │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ Reasoning:   │  │ Reasoning:   │  │ Reasoning:   │
│ Chain-of-    │  │ ReAct        │  │ Self-        │
│ Thought      │  │ (Observe→    │  │ Reflection   │
│              │  │  Think→      │  │ (Validate    │
│ Step 1: Obj  │  │  Act→Result) │  │  limits)     │
│ Step 2: Aud  │  │              │  │              │
│ Step 3: Hook │  │ Output:      │  │ Output:      │
│ Step 4: Body │  │ • Strengths  │  │ • LinkedIn   │
│ Step 5: CTA  │  │ • Improve    │  │ • Twitter    │
│              │  │ • Verdict    │  │ • Instagram  │
│ Output:      │  │   (REVISE/   │  │   (with      │
│ Draft (150w) │  │    APPROVED) │  │    hashtags, │
│              │  │              │  │    emojis)   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       │                 │                 │
       ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  GROUNDING   │  │   (No extra  │  │  MCP TOOLS   │
│ File Search  │  │   grounding  │  │ Filesystem   │
│ brand-guide  │  │   for        │  │ Save drafts  │
│ lines.docx   │  │   Reviewer)  │  │ to local     │
└──────────────┘  └──────────────┘  └──────────────┘

                             ▼
┌───────────────────────────────────────────────────────────────┐
│                      OUTPUT                                   │
│  1. CONVERSATION TRANSCRIPT (all reasoning visible)           │
│  2. FINAL POSTS:                                             │
│     - LinkedIn (professional, 3-5 hashtags)                  │
│     - Twitter (≤280 chars, 2-3 hashtags)                     │
│     - Instagram (emojis, 5-10 hashtags)                      │
│  3. METADATA: duration, rounds, grounding sources used       │
└───────────────────────────────────────────────────────────────┘
```

---

## Technology Decision Summary

| Decision Area | Choice | Rationale | Alternatives Considered |
|--------------|--------|-----------|------------------------|
| **Orchestration Framework** | Microsoft Agent Framework (`GroupChatBuilder`) | Native multi-agent support; required for hackathon track | LangChain multi-agent (more complex), CrewAI (less Azure-native) |
| **Creator/Publisher Model** | Azure OpenAI (single deployment) | Simplifies setup; one model quota pool | Separate GPT-5.1 and GPT-5.2 deployments (time-consuming) |
| **Reviewer Model** | GitHub Copilot SDK | Demonstrates hybrid provider setup; required for diversity | Azure OpenAI second deployment (less interesting demo) |
| **Grounding Method** | File Search with synthetic Word doc | Fastest path; M365 Copilot can generate brand guidelines | Bing Search (API keys), Custom index (complex setup) |
| **MCP Tool** | Filesystem server (save drafts) | Practical utility; easy setup with npm package | Microsoft Learn MCP (read-only, less utility), Custom MCP (time-consuming) |
| **Authentication** | DefaultAzureCredential | Security best practice; no hardcoded keys | API keys in .env (violates constitution), Manual token management (complex) |
| **Configuration** | python-dotenv with .env | Standard Python pattern; .gitignore friendly | Config files (harder to secure), Command-line args (verbose) |
| **Streaming** | AgentRunUpdateEvent handler | Real-time feedback; better UX | Batch output after completion (poor demo experience) |
| **Error Handling** | Basic try/catch + clear messages | Sufficient for 100-minute demo | Comprehensive retry logic (over-engineering for hackathon) |
| **Testing** | Manual testing only | Time constraint; judging via demo | pytest suite (post-hackathon improvement) |

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|---------------------|
| **Azure OpenAI quota exhausted** | Medium | High (demo fails) | Pre-allocate 200k+ TPM; test quota before event; prepare demo video backup |
| **GitHub Copilot auth fails** | Medium | Medium (Reviewer unavailable) | Implement graceful degradation (skip review step); document manual re-auth; test CLI path detection |
| **File Search integration time overrun** | High | Medium (miss milestone 3) | Pre-create synthetic brand doc; simplify File Search to basic attachment; fallback to in-prompt grounding |
| **MCP server connection issues** | Medium | Low (miss milestone 4 only) | Test filesystem server installation pre-event; fallback to console-only output; keep MCP as optional |
| **Conversation loops (no termination)** | Low | High (workflow hangs) | Strict 5-round limit enforced; test all 3 termination paths; add timeout safeguard |
| **Twitter 280-char violations** | Low | Medium (invalid output) | Publisher Self-Reflection catches violations; add automatic truncation fallback |
| **Hardcoded secrets in code** | Low | Critical (disqualification) | Pre-submission security audit mandatory; peer review before final commit; git log scan |
| **Starter code API changes** | Low | High (rewrite needed) | Clone starter repo pre-event; test basic workflow; avoid bleeding-edge framework versions |

---

## Judging Criteria Alignment

| Criterion (Weight) | Implementation Strategy | Success Metric |
|-------------------|------------------------|----------------|
| **Accuracy & Relevance (25%)** | • File Search grounding in brand guidelines<br>• Creator cites grounding sources in reasoning<br>• Reviewer validates factual claims | • 100% of posts reference brand context<br>• Zero hallucinated data in final output<br>• Clear source citations in transcript |
| **Reasoning & Multi-step Thinking (25%)** | • Creator: Visible 5-step Chain-of-Thought<br>• Reviewer: ReAct format (Observe→Think→Act→Result)<br>• Publisher: Self-Reflection validation checks | • All reasoning steps in transcript<br>• Judges can trace decision path<br>• Revision iterations show improvement |
| **Creativity & Originality (20%)** | • Multi-agent collaboration (not single LLM)<br>• Hybrid providers (Azure + GitHub)<br>• Platform-specific adaptation (3 formats)<br>• Practical MCP integration (file save) | • Unique group chat demo<br>• Clear value over single-prompt<br>• Polished platform outputs |
| **User Experience & Presentation (15%)** | • Real-time streaming output<br>• Clear README with example<br>• Demo video/screenshot<br>• Actionable error messages | • Setup in <10 minutes<br>• Workflow completes in <3 minutes<br>• Demo clearly shows agents |
| **Technical Implementation (15%)** | • Microsoft Agent Framework<br>• Proper authentication (DefaultAzureCredential)<br>• File Search + MCP integration<br>• Clean code structure (PEP 8) | • All 4 hackathon milestones met<br>• Zero security violations<br>• Code readable during review |

**Total Score Target**: 80-90% (aim for top quartile)

---

## Post-Phase 1 Agent Context Update

After generating design artifacts (data-model.md, contracts/, quickstart.md), update GitHub Copilot context:

```powershell
.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot
```

This will add:
- Microsoft Agent Framework patterns
- Multi-agent orchestration concepts
- Reasoning pattern examples (Chain-of-Thought, ReAct, Self-Reflection)
- Azure AI Foundry terminology
- MCP integration knowledge

**Context file location**: `.github/copilot-instructions.md` (if GitHub Copilot Workspace) or appropriate agent context file.

---

## Next Steps

1. ✅ **Phase 0 Complete**: Run this plan command to generate `research.md` resolving all NEEDS CLARIFICATION items
2. ✅ **Phase 1 Complete**: This plan includes `data-model.md`, `contracts/`, and `quickstart.md` content
3. ⏭️ **Phase 2**: Run `/speckit.tasks` to generate dependency-ordered task breakdown for implementation
4. ⏭️ **Implementation**: Run `/speckit.implement` to execute tasks within 100-minute timeline
5. ⏭️ **Security Audit**: Complete constitutional checklist before submission
6. ⏭️ **Demo Prep**: Screenshot + README finalization

**Estimated Time to Implementation-Ready**: Plan complete; ready for task generation.
