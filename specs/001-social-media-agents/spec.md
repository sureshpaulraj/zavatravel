# Feature Specification: Multi-Agent Social Media Content Creation System

**Feature Branch**: `001-social-media-agents`  
**Created**: 2025-01-23  
**Updated**: 2025-07-14  
**Status**: Implemented  
**Governing Document**: [constitution.md](../../constitution.md)  
**Technical Reference**: [starter-kits/2-reasoning-agents/spec.md](../../starter-kits/2-reasoning-agents/spec.md)  
**Input**: "A multi-agent social media content creation system for the Reasoning Agents track of the TechConnect Hackathon. The system uses Microsoft Foundry + Microsoft Agent Framework + GitHub Copilot SDK to build a group chat workflow where Creator, Reviewer, and Publisher agents collaborate to produce platform-ready social media posts (LinkedIn, X/Twitter, Instagram) for a chosen brand/industry."

**Implementation Notes**: All core features (US1-US5) and all bonus features (US6-US8) have been fully implemented. Additional features beyond the original spec have been delivered: full-stack web application (FastAPI + React), AI image generation (gpt-image-1.5), Playwright automated testing (84 test cases), Orchestrator/Router reasoning pattern, managed identity authentication, and PII scrubbing middleware.

## User Scenarios & Testing

### User Story 1 - Generate Multi-Platform Content from Campaign Brief (Priority: P1)

As a communication team member, I need to provide a campaign brief and receive platform-ready social media posts for LinkedIn, X/Twitter, and Instagram, so that I can quickly produce consistent content across multiple channels without manually adapting each post.

**Why this priority**: This is the core value proposition. Delivering working multi-platform content generation proves the concept and provides immediate utility. This story alone constitutes a viable MVP.

**Independent Test**: Can be fully tested by submitting a campaign brief (topic, brand, audience, message) and receiving three platform-specific posts with appropriate formatting, character limits, and hashtags.

**Acceptance Scenarios**:

1. **Given** a campaign brief with brand name (Zava Travel Inc.), industry (budget-friendly adventure travel), target audience (millennials & Gen-Z), and key message ("Wander More, Spend Less"), **When** the user submits the brief to the system, **Then** the system generates three distinct posts optimized for LinkedIn (professional tone, 1-3 paragraphs, 3-5 hashtags), X/Twitter (under 280 characters, punchy, 2-3 hashtags), and Instagram (visual-friendly, emojis, 5-10 hashtags)

2. **Given** a campaign brief for Zava Travel Inc. promoting adventure travel destinations targeting millennial travelers, **When** the system generates content, **Then** all posts maintain an adventurous and inspiring tone appropriate for budget-conscious adventure seekers and include relevant travel hashtags (#ZavaTravel, #WanderMore, #AdventureAwaits, #TravelOnABudget)

3. **Given** a campaign brief requesting content about the "Wander More, Spend Less" summer adventure campaign, **When** the system completes generation, **Then** each platform version includes a clear call-to-action relevant to the campaign objective (e.g., "Book your adventure today at zavatravel.com")

---

### User Story 2 - View Agent Collaboration Reasoning Process (Priority: P1)

As a communication team member, I need to see the conversation between the Creator, Reviewer, and Publisher agents showing their reasoning steps, so that I understand how the content was developed and can verify quality control was applied.

**Why this priority**: Transparency in agent reasoning is a core judging criterion (25% of score) and builds user trust. This differentiates the multi-agent approach from single-prompt generation.

**Independent Test**: Can be tested by running the workflow and verifying that a complete conversation transcript is displayed showing Creator's ideation steps, Reviewer's feedback with observations and improvements, and Publisher's platform adaptation decisions.

**Acceptance Scenarios**:

1. **Given** the system is processing a campaign brief, **When** the Creator agent generates initial content, **Then** the output displays visible Chain-of-Thought reasoning steps (identifying objective, considering audience, drafting hook, building body, adding CTA)

2. **Given** the Reviewer agent is evaluating content, **When** the review is completed, **Then** the output displays structured ReAct feedback showing Observations about the content, Thoughts on improvements, Actions recommended, and expected Results

3. **Given** the Publisher agent is formatting final posts, **When** platform versions are created, **Then** the output displays Self-Reflection validation checks confirming character limits, hashtag relevance, and CTA presence for each platform

---

### User Story 3 - Iterative Content Refinement Through Agent Feedback (Priority: P2)

As a communication team member, I need the Reviewer agent to provide specific improvement suggestions that the Creator agent incorporates, so that the final content is higher quality than a single-pass generation.

**Why this priority**: Demonstrates the value of multi-agent collaboration and improves output quality. This is differentiating but not essential for basic functionality.

**Independent Test**: Can be tested by comparing the Creator's initial draft with the revised version after Reviewer feedback, verifying that specific suggested improvements (tone adjustments, stronger CTAs, audience alignment) were incorporated.

**Acceptance Scenarios**:

1. **Given** the Creator generates initial content with overly formal language, **When** the Reviewer identifies tone mismatch for Zava Travel Inc.'s adventurous and inspiring brand voice, **Then** the Creator produces a revised version with appropriate adventurous and budget-friendly tone

2. **Given** the Creator's initial post lacks a clear call-to-action, **When** the Reviewer flags this as missing, **Then** the Creator incorporates a specific CTA in the next iteration (e.g., "Start your adventure at zavatravel.com")

3. **Given** the Reviewer approves content quality, **When** the approval verdict is communicated, **Then** the workflow fast-tracks to the Publisher without additional revision rounds

---

### User Story 4 - Brand-Grounded Content Generation (Priority: P2)

As a communication team member, I need the agents to reference brand guidelines and industry context when creating content, so that posts align with established brand voice, messaging pillars, and current industry trends.

**Why this priority**: Grounding is required for hackathon milestone 3 and judging criterion "Accuracy & Relevance" (25% of score). Essential for production readiness but can use synthetic data for MVP.

**Independent Test**: Can be tested by providing a brand guidelines document (or industry data source) and verifying that generated content references specific elements from those guidelines (approved hashtags, tone descriptors, messaging themes).

**Acceptance Scenarios**:

1. **Given** a Zava Travel Inc. brand guidelines document is loaded via File Search containing approved tone guidelines (adventurous, inspiring) and messaging pillars (affordability, authentic experiences), **When** the Creator generates content, **Then** the output adheres to specified tone and incorporates defined messaging pillars

2. **Given** Bing Search is configured for travel industry research, **When** the Creator generates content about trending destinations or summer travel, **Then** the content references current industry trends or destination highlights found via search

3. **Given** grounding data sources fail or are unavailable, **When** the agents attempt to generate content, **Then** the system acknowledges the limitation and generates content labeled as "ungrounded" rather than hallucinating data

---

### User Story 5 - Save and Retrieve Content Drafts Externally (Priority: P3)

As a communication team member, I need the system to save content drafts to my local filesystem using external tools, so that I can access, edit, and version control the generated posts outside the agent workflow.

**Why this priority**: Demonstrates external tool integration (hackathon milestone 4) and adds practical utility. This is a bonus feature that enhances but is not critical to core functionality.

**Independent Test**: Can be tested by running the workflow and verifying that a file is created in a specified local directory containing the generated social media posts with proper formatting.

**Acceptance Scenarios**:

1. **Given** the filesystem MCP server is configured and connected, **When** the Publisher finalizes platform-ready posts, **Then** a file (e.g., `social-posts-YYYY-MM-DD.md`) is created in the designated output directory containing all three platform versions

2. **Given** the system invokes an external tool via MCP, **When** the tool call is executed, **Then** the conversation transcript logs the tool name and result summary for debugging and judging transparency

3. **Given** the external tool integration fails (e.g., MCP server unreachable), **When** the error occurs, **Then** the system logs the failure gracefully and continues workflow completion with in-app output only

---

### User Story 6 - Agent Observability and Monitoring (Priority: P3 - Bonus — IMPLEMENTED)

As a communication team member, I need to monitor agent performance metrics and view tracing data for the workflow, so that I can understand system behavior, debug issues, and track resource usage.

**Why this priority**: This is a bonus "Going Further" feature that adds enterprise readiness. Observability demonstrates production-level thinking but is not required for core functionality demonstration.

**Independent Test**: Can be tested by running a workflow and verifying that tracing data, logs, and performance metrics are captured in Microsoft Foundry platform and viewable via dashboard or exported logs.

**Acceptance Scenarios**:

1. **Given** the observability integration is enabled, **When** the workflow executes, **Then** tracing data captures each agent turn with timestamps, model name, and token usage metrics

2. **Given** agent interactions occur during the workflow, **When** the workflow completes, **Then** logs include structured records of reasoning steps, tool invocations, and any error events

3. **Given** performance metrics are tracked, **When** viewing the Foundry dashboard, **Then** latency per agent turn and total workflow duration are displayed with visual charts

---

### User Story 7 - Content Safety and Guardrails (Priority: P3 - Bonus — IMPLEMENTED)

As a communication team member, I need the system to automatically screen generated content for harmful, offensive, or brand-inappropriate material, so that only safe and on-brand content reaches final output.

**Why this priority**: This is a bonus "Going Further" feature that adds safety/compliance readiness. Content safety demonstrates responsible AI practices but is not required for basic hackathon demonstration.

**Independent Test**: Can be tested by intentionally providing campaign briefs that might generate edge-case content and verifying that Azure AI Content Safety filters appropriately flag or reject problematic material.

**Acceptance Scenarios**:

1. **Given** Azure AI Content Safety integration is configured, **When** content is generated, **Then** all posts pass through safety screening before display checking for hate speech, violence, self-harm, and sexual content

2. **Given** generated content is flagged as harmful or offensive, **When** the safety check completes, **Then** the content is rejected with a clear explanation of the safety violation and no unsafe content is displayed

3. **Given** content includes competitor brand mentions or off-brand tone, **When** brand-appropriateness checks run, **Then** the system flags the content with a warning and suggests revisions

---

### User Story 8 - Automated Quality Evaluation (Priority: P3 - Bonus — IMPLEMENTED)

As a communication team member, I need the system to automatically evaluate the quality of generated content using standardized metrics, so that I can objectively assess content effectiveness and track quality trends.

**Why this priority**: This is a bonus "Going Further" feature that adds evaluation/analytics capabilities. Automated evaluation demonstrates advanced AI practices but is not required for basic content generation.

**Independent Test**: Can be tested by running the workflow and verifying that Foundry Evaluation SDK generates quality scores for relevance, coherence, groundedness, and fluency with results logged and displayed.

**Acceptance Scenarios**:

1. **Given** the Foundry Evaluation SDK is integrated, **When** final posts are generated, **Then** automated evaluation measures relevance (0-5), coherence (0-5), groundedness (0-5), and fluency (0-5) for each platform post

2. **Given** evaluation completes, **When** results are available, **Then** per-platform scores and aggregate quality metrics are logged and displayed in the output

3. **Given** content scores below quality threshold (any metric < 3), **When** evaluation detects low scores, **Then** a warning flag is displayed recommending manual review or regeneration

---

### User Story 9 - AI Image Generation for Social Media Posts (Priority: P3 - Bonus — IMPLEMENTED)

As a communication team member, I need the system to automatically generate visual content (images) tailored to each social media platform alongside text posts, so that I receive complete, ready-to-publish content packages without relying on separate design tools.

**Why this priority**: This is a bonus feature that significantly enhances content quality and completeness. Visual content drives higher engagement on all social platforms.

**Independent Test**: Can be tested by selecting "image" content type in the API request and verifying that platform-appropriate images are generated via Azure OpenAI gpt-image-1.5 deployment.

**Acceptance Scenarios**:

1. **Given** the content_type is set to "image" in the API request, **When** the workflow completes, **Then** the system generates AI images via gpt-image-1.5 tailored to each platform (square for Instagram, landscape for LinkedIn/Twitter)

2. **Given** the image generation API call fails, **When** the error occurs, **Then** the system degrades gracefully and returns text-only content with a warning message

3. **Given** generated images contain content, **When** brand guidelines are loaded, **Then** images reflect Zava Travel Inc. brand aesthetics (adventure travel, vibrant destinations)

**Implementation Details**: Azure OpenAI gpt-image-1.5 deployment, integrated into `api_server.py` with content_type selector, base64 image encoding in API response.

---

### User Story 10 - Full-Stack Web Application (Priority: P3 - Bonus — IMPLEMENTED)

As a communication team member, I need a web-based interface to submit campaign briefs and view generated content, so that I can interact with the system through a modern UI instead of the command line.

**Why this priority**: This is a bonus feature that dramatically improves user experience and presentation for judging.

**Independent Test**: Can be tested by starting the FastAPI server and React frontend, submitting a campaign brief through the UI, and viewing generated content with agent transcripts.

**Acceptance Scenarios**:

1. **Given** the FastAPI API server is running, **When** a POST request is sent to `/api/generate` with a campaign brief JSON, **Then** the server returns generated content with agent transcript, reasoning patterns, safety results, and evaluation scores

2. **Given** the React frontend is running, **When** the user fills in the campaign form, **Then** the UI displays a content type selector (text/image), platform options, and submits to the API server

3. **Given** the API server has a `/api/health` endpoint, **When** a GET request is sent, **Then** the server returns health status with uptime and configuration details

**Implementation Details**: FastAPI backend (`api_server.py`) with CORS, React 19 + Vite 7 frontend with Fluent UI v9 (Zava Travel ocean-teal theme), OpenAPI spec at `/docs`.

---

### User Story 11 - Automated Functional Testing with Playwright (Priority: P3 - Bonus — IMPLEMENTED)

As a development team member, I need automated end-to-end tests for the API server, so that I can verify system functionality across all endpoints, content types, and error scenarios.

**Why this priority**: This is a bonus feature demonstrating software engineering best practices and test coverage for the hackathon submission.

**Independent Test**: Can be tested by running `npx playwright test` against the running API server and verifying all 84 test cases pass.

**Acceptance Scenarios**:

1. **Given** the API server is running, **When** `npx playwright test` is executed, **Then** all 84 test cases pass covering health endpoint, content generation, error handling, content safety, and evaluation

2. **Given** a test scenario tests the `/api/generate` endpoint, **When** a valid campaign brief is submitted, **Then** the response contains platform posts, agent transcript with reasoning patterns, and status 200

3. **Given** a test scenario tests error handling, **When** invalid input is submitted (missing fields, empty brief), **Then** the API returns appropriate error codes (400, 422) with clear error messages

**Implementation Details**: Playwright Test framework, 84 test cases in `FunctionalTestCases/tests/`, covering health, generation, safety, evaluation, and edge cases.

---

### Edge Cases

- **What happens when the Reviewer and Creator enter an endless revision loop?** The system terminates after 5 conversation rounds maximum to prevent infinite loops, producing the best available version at that point.

- **How does the system handle brand guidelines documents in unsupported formats?** The File Search integration only accepts Word (.docx) and PDF formats. If unsupported formats are provided, the system returns a clear error message specifying accepted formats.

- **What if the campaign brief is too vague or missing critical information?** The Creator agent makes reasonable assumptions based on Zava Travel Inc.'s established brand guidelines (adventurous tone, budget-friendly focus, millennial/Gen-Z audience) and documents these assumptions in its reasoning output. The system does not block generation but flags assumptions for user review.

- **How does the system handle character limit violations for Twitter/X?** The Publisher agent uses Self-Reflection to validate character counts and automatically revises content that exceeds 280 characters, logging the revision in the conversation transcript.

- **What happens if GitHub Copilot authentication fails during Reviewer invocation?** The system detects the authentication failure, logs the error, and either: (a) attempts to re-authenticate using the configured Copilot CLI path, or (b) gracefully degrades by skipping the review step and logging a warning that content was not reviewed.

- **How does the system handle simultaneous requests from multiple users?** The hackathon scope is single-user, single-session. Multi-user concurrency is out of scope; the system processes one campaign brief at a time sequentially.

- **What if the Azure OpenAI deployment quota is exhausted mid-workflow?** The system catches the quota exceeded error, logs it clearly, and terminates gracefully with a message indicating which agent was unable to complete due to quota limits.

- **How does the system handle competitor brand mentions in generated content?** If bonus content safety (FR-030) is implemented, competitor mentions (VoyageNow, CookTravel, WanderPath) are flagged and filtered. Without the bonus feature, the Reviewer agent provides feedback to remove competitor references.

## Requirements

### Functional Requirements

#### Core Workflow

- **FR-001**: System MUST accept a campaign brief input containing brand name (Zava Travel Inc.), industry (travel), target audience (millennials & Gen-Z adventure seekers), key message (e.g., "Wander More, Spend Less"), and target platforms (LinkedIn, X/Twitter, Instagram)

- **FR-002**: System MUST implement a multi-agent group chat orchestrator using round-robin speaker selection in the sequence: Creator → Reviewer → Creator → Reviewer → Publisher

- **FR-003**: System MUST terminate the workflow when (a) the Publisher has produced final output, OR (b) 5 conversation rounds are completed, OR (c) the Reviewer says "APPROVED"

- **FR-004**: System MUST output a complete conversation transcript showing all agent messages with visible reasoning steps

- **FR-005**: System MUST produce three distinct social media posts formatted for LinkedIn, X/Twitter, and Instagram platforms

#### Agent Capabilities

- **FR-006**: Creator agent MUST implement Chain-of-Thought reasoning pattern with visible steps: identify objective → consider audience → draft hook → build body → add CTA

- **FR-007**: Reviewer agent MUST implement ReAct reasoning pattern with structured feedback: Observation → Thought → Action → Result

- **FR-008**: Publisher agent MUST implement Self-Reflection pattern validating: character limits, hashtag counts, CTA presence, and platform-specific formatting

- **FR-009**: Creator agent MUST generate initial content drafts under 150 words per platform

- **FR-010**: Reviewer agent MUST provide feedback under 120 words containing Strengths (1-2 points), Improvements (1-2 specific actions), and Verdict (REVISE or APPROVED)

- **FR-011**: Publisher agent MUST ensure LinkedIn posts are 1-3 paragraphs with 3-5 hashtags, X/Twitter posts are under 280 characters with 2-3 hashtags, and Instagram posts include emojis with 5-10 hashtags

- **FR-012**: Creator agent MUST incorporate Reviewer feedback in subsequent revisions when REVISE verdict is provided

#### Grounding & Knowledge

- **FR-013**: System MUST integrate at least one grounding data source: File Search (for brand guidelines documents), Bing Search (for industry trends), or custom knowledge base

- **FR-014**: System MUST accept Word (.docx) or PDF brand guidelines documents via File Search for content grounding

- **FR-015**: When grounding sources are referenced, agents MUST cite the source in their reasoning output (e.g., "Based on brand guidelines: [reference]")

- **FR-016**: If grounding sources fail or return no results, agents MUST acknowledge the limitation and label content as "ungrounded" rather than hallucinating information

#### External Tools

- **FR-017**: System MUST integrate at least one external tool via Model Context Protocol (MCP) or API integration

- **FR-018**: When external tools are invoked, the system MUST log the tool name, input parameters, and result summary in the conversation transcript

- **FR-019**: If external tool integration fails, the system MUST handle the error gracefully without terminating the entire workflow

#### Security & Configuration

- **FR-020**: System MUST use DefaultAzureCredential for Azure service authentication (no hardcoded API keys or connection strings)

- **FR-021**: System MUST load configuration from environment variables via .env file (excluded from version control)

- **FR-022**: System MUST provide a .env.sample file with placeholder values for all required configuration parameters

- **FR-023**: System MUST NOT commit or expose Azure subscription IDs, tenant IDs, API keys, tokens, or connection strings in the public repository

- **FR-024**: System MUST NOT include PII, customer data, or Microsoft Confidential information in any committed files, logs, or screenshots

#### Platform-Specific Constraints

- **FR-025**: System MUST enforce LinkedIn post format: professional tone, paragraph structure, 3-5 relevant hashtags, clear value proposition

- **FR-026**: System MUST enforce X/Twitter post format: under 280 characters (strict limit), punchy tone, 2-3 hashtags, immediate hook

- **FR-027**: System MUST enforce Instagram post format: visual-friendly captions, appropriate emoji usage, 5-10 hashtags, storytelling approach

- **FR-028**: Publisher agent MUST validate and revise any content that violates platform-specific character limits or formatting rules

#### Bonus Features (Priority P3 — ALL IMPLEMENTED)

- **FR-029 (Observability — IMPLEMENTED)**: System integrates OpenTelemetry + Azure Monitor for distributed tracing with per-agent child spans tracking turn duration, token estimates, reasoning patterns, and tool invocations. Implementation: `monitoring/tracing.py`, `monitoring/agent_middleware.py`, `monitoring/pii_middleware.py`.

- **FR-030 (Content Safety — IMPLEMENTED)**: System integrates Azure AI Content Safety (two-layer shield) with ManagedIdentityCredential for input and output screening. Brand filters check for competitor mentions and off-brand content. 25/25 brand filter tests pass. Implementation: `safety/content_shield.py`, `safety/brand_filters.py`.

- **FR-031 (Agentic Evaluation — IMPLEMENTED)**: System implements 5 evaluators via azure-ai-evaluation SDK: TaskAdherence, Coherence, Relevance, Groundedness, PlatformCompliance. Evaluation runs on test briefs from `evaluation/eval_dataset.jsonl`. Implementation: `evaluation/quality_metrics.py`, `evaluation/agent_runner.py`.

#### Extended Features (Beyond Original Spec — ALL IMPLEMENTED)

- **FR-032 (Image Generation)**: System generates AI images via Azure OpenAI gpt-image-1.5 deployment when content_type is "image". Images are tailored per platform with base64 encoding in API response. Implementation: `api_server.py` image generation endpoint.

- **FR-033 (FastAPI Backend)**: System provides a RESTful API via FastAPI with endpoints `/api/health` (GET) and `/api/generate` (POST). CORS enabled, OpenAPI spec at `/docs`. Integrates all agents, safety, evaluation in single workflow. Implementation: `api_server.py`.

- **FR-034 (React Frontend)**: System provides a React 19 + Vite 7 web application with Fluent UI v9 components, Zava Travel ocean-teal theme, content type selector (text/image), campaign brief form, and result display. Implementation: `frontend/`.

- **FR-035 (Playwright Testing)**: System has 84 automated end-to-end tests covering health endpoint, content generation, error handling, content safety, evaluation, and edge cases. Implementation: `FunctionalTestCases/tests/`.

- **FR-036 (Orchestrator/Router Pattern)**: System labels the orchestrator with "Router" reasoning pattern in agent transcripts, API responses, and monitoring spans. Router pattern: inspects conversation state → decides route → dispatches to appropriate agent. Implementation: `orchestration/speaker_selection.py`, labeling in `api_server.py`, `monitoring/agent_middleware.py`.

- **FR-037 (Managed Identity Authentication)**: System uses ManagedIdentityCredential with specific client_id for Azure AI Content Safety, with fallback to DefaultAzureCredential. Three-tier auth: API Key → ManagedIdentity → DefaultAzureCredential. Implementation: `safety/content_shield.py`.

- **FR-038 (PII Scrubbing Middleware)**: System includes PII scrubbing middleware in the monitoring pipeline to redact sensitive data from telemetry spans before export. Implementation: `monitoring/pii_middleware.py`.

**Acceptance Criteria for FR-029 (Observability)**:
- Tracing data captures each agent turn with timestamps, model invocations, and token usage
- Logs include reasoning steps, tool invocations, and error events structured for analysis
- Performance metrics track latency per agent and total workflow duration
- Observability data is viewable in Microsoft Foundry portal or exported for analysis

**Acceptance Criteria for FR-030 (Content Safety)**:
- All generated content passes through Azure AI Content Safety API before display
- Content flagged as harmful, offensive, or inappropriate triggers rejection with clear explanation
- Safety categories checked include hate speech, violence, self-harm, and sexual content
- Brand-inappropriate content (off-brand tone, competitor mentions) is detected and flagged

**Acceptance Criteria for FR-031 (Agentic Evaluation)**:
- Evaluation runs automatically on final generated posts using Foundry Evaluation SDK
- Metrics measured include: Relevance (0-5), Coherence (0-5), Groundedness (0-5), Fluency (0-5)
- Evaluation results are logged with per-platform scores and aggregate quality score
- Low-scoring content (any metric < 3) triggers warning flag for manual review

### Non-Functional Requirements

#### Performance

- **NFR-001**: System MUST complete the entire workflow (input to final output) within 3 minutes for typical campaign briefs under normal Azure API response times

- **NFR-002**: System MUST stream agent responses in real-time as they are generated (not batch-display after completion) for user feedback during generation

- **NFR-003**: Each agent response MUST begin within 5 seconds of being selected as the next speaker

#### Reliability

- **NFR-004**: System MUST handle Azure OpenAI API rate limit errors gracefully with clear error messages indicating quota exhaustion

- **NFR-005**: System MUST handle GitHub Copilot authentication failures with retry logic (one automatic retry) before failing gracefully

- **NFR-006**: System MUST validate environment configuration at startup and fail fast with actionable error messages for missing required variables

#### Usability

- **NFR-007**: System MUST provide clear console output distinguishing between agent messages, reasoning steps, and system status messages

- **NFR-008**: Campaign brief input format MUST be documented with an example template in the README

- **NFR-009**: Error messages MUST be actionable, specifying what went wrong and how to resolve it (e.g., "Missing AZURE_OPENAI_ENDPOINT in .env. Add your Azure OpenAI endpoint to the .env file.")

- **NFR-010**: Final output MUST clearly separate the three platform versions with headers indicating "=== LinkedIn Post ===", "=== X/Twitter Post ===", "=== Instagram Post ==="

#### Security

- **NFR-011**: System MUST complete a pre-submission security audit checklist verifying no secrets in git history (`git log --all --full-history --source --find-object`)

- **NFR-012**: .gitignore MUST explicitly exclude .env, .env.local, __pycache__, venv/, and any Azure configuration files

- **NFR-013**: All Azure resource references MUST use parameterized environment variables, never hardcoded values

#### Maintainability

- **NFR-014**: Agent system instructions MUST be externalized as constants or configuration (not embedded in orchestrator logic) for easy modification

- **NFR-015**: Speaker selection function MUST be clearly documented with the exact agent sequence and termination logic

- **NFR-016**: Code MUST follow Python PEP 8 style guidelines for readability during judging review

#### Hackathon Constraints

- **NFR-017**: System MUST be implementable within the 100-minute hackathon time limit using the provided starter code as a foundation

- **NFR-018**: System MUST build upon the `workflow_groupchat.py` starter code from [aiagent-maf-githubcopilotsdk](https://github.com/sureshpaulraj/aiagent-maf-githubcopilotsdk) repository, not rewrite from scratch

- **NFR-019**: Documentation MUST include setup instructions (prerequisites, environment variables), how to run, example campaign brief, and demo output (screenshot or video)

- **NFR-020**: System scope MUST be limited to three platforms (LinkedIn, X/Twitter, Instagram), one campaign brief format, and single-user operation (no authentication or multi-user support)

#### Bonus Non-Functional Requirements (Priority P3)

- **NFR-021 (Bonus - Observability)**: Observability integration SHOULD add minimal performance overhead (< 100ms per agent turn) and not impact workflow completion time

- **NFR-022 (Bonus - Content Safety)**: Content safety checks SHOULD complete within 2 seconds per content screening to maintain acceptable user experience

- **NFR-023 (Bonus - Agentic Evaluation)**: Evaluation SHOULD run asynchronously after content generation completes to avoid blocking final output display

### Key Entities

- **Campaign Brief**: Input provided by user containing brand identity (Zava Travel Inc., travel industry, budget-friendly adventure focus), target audience definition (millennials & Gen-Z adventure seekers), campaign objective (awareness, engagement, conversion), key message or value proposition (e.g., "Wander More, Spend Less"), destination highlights (Bali, Patagonia, Iceland, Vietnam, Costa Rica), and target platforms (LinkedIn, X/Twitter, Instagram)

- **Agent Message**: Communication unit within the group chat containing agent identifier (Creator/Reviewer/Publisher), message content (draft text or feedback), reasoning steps (visible Chain-of-Thought, ReAct, or Self-Reflection), timestamp, and round number

- **Social Media Post**: Platform-specific content output containing post body text, platform identifier (LinkedIn/Twitter/Instagram), formatting elements (hashtags, emojis, line breaks), character count, call-to-action, and platform-specific validation status

- **Conversation Transcript**: Complete record of the multi-agent workflow containing all agent messages in chronological order, reasoning steps for each agent turn, tool invocation logs (if external tools used), termination reason, and workflow metadata (start time, duration, rounds completed)

- **Brand Guidelines Document**: Optional grounding data source for Zava Travel Inc. containing brand voice and tone specifications (adventurous, inspiring), visual identity guidelines (teal/ocean blue, sunset orange), approved messaging pillars (affordability, authentic experiences, millennial/Gen-Z appeal), hashtag vocabulary (#ZavaTravel, #WanderMore, #AdventureAwaits, #TravelOnABudget), and destination highlights for Bali, Patagonia, Iceland, Vietnam, Costa Rica

## Success Criteria

### Measurable Outcomes

#### Functional Completeness (Aligned with Hackathon Milestones)

- **SC-001**: System successfully generates three platform-ready social media posts (LinkedIn, X/Twitter, Instagram) from a single campaign brief input

- **SC-002**: All three agent roles (Creator, Reviewer, Publisher) participate in the workflow with visible, distinct contributions

- **SC-003**: Conversation transcript displays reasoning patterns for all agents: Chain-of-Thought for Creator, ReAct for Reviewer, Self-Reflection for Publisher

- **SC-004**: At least one grounding data source is integrated and demonstrates content influenced by external knowledge (brand guidelines or industry research)

- **SC-005**: At least one external tool is integrated via MCP and successfully invoked during the workflow with logged results

#### Content Quality (Judging Criterion: Accuracy & Relevance 25%)

- **SC-006**: Generated posts maintain consistent brand voice across all three platforms while adapting tone appropriately (professional for LinkedIn, punchy for Twitter, casual-visual for Instagram)

- **SC-007**: All platform-specific constraints are satisfied: LinkedIn posts 1-3 paragraphs with 3-5 hashtags, Twitter posts under 280 characters with 2-3 hashtags, Instagram posts with emojis and 5-10 hashtags

- **SC-008**: 100% of generated posts include a clear call-to-action relevant to the campaign objective

- **SC-009**: When grounding sources are available, 100% of agent reasoning outputs cite sources for factual claims

#### Reasoning Transparency (Judging Criterion: Reasoning & Multi-step Thinking 25%)

- **SC-010**: Creator agent displays all five Chain-of-Thought steps in visible output for every content generation turn

- **SC-011**: Reviewer agent structures 100% of feedback messages using the ReAct format (Observation → Thought → Action → Result)

- **SC-012**: Publisher agent performs and logs platform validation checks for character limits, hashtag counts, and CTAs for all three outputs

- **SC-013**: Conversation transcript preserves the complete multi-agent dialogue viewable for demonstration and judging review

#### Workflow Robustness (Judging Criterion: Technical Implementation 15%)

- **SC-014**: Workflow terminates correctly under all three conditions: Publisher completion, 5-round limit, or Reviewer approval

- **SC-015**: System handles Azure OpenAI API errors gracefully with clear error messages and does not crash mid-workflow

- **SC-016**: System handles GitHub Copilot authentication failures without terminating the entire workflow (graceful degradation)

#### Security Compliance (Constitutional Principle I)

- **SC-017**: 100% of security audit checklist items pass: no secrets in git history, .env in .gitignore, DefaultAzureCredential used, all endpoints parameterized

- **SC-018**: Zero instances of PII, customer data, or Microsoft Confidential information in any committed files

#### User Experience (Judging Criterion: User Experience & Presentation 15%)

- **SC-019**: Users can understand how to run the system by following README instructions without external assistance

- **SC-020**: Demo output (screenshot or video) clearly shows the multi-agent conversation and final platform-ready posts

- **SC-021**: Campaign brief input format is documented with at least one complete example template

- **SC-022**: System completes workflow execution from input submission to final output display within 3 minutes

#### Hackathon Readiness (Constitutional Principle V)

- **SC-023**: System is implementable within 100 minutes using the starter code as a foundation (verified through time-boxed pilot run)

- **SC-024**: README includes all required sections: setup instructions, how to run, example input, and demo output

- **SC-025**: Code quality is sufficient for judging review: readable structure, comments on key logic, no obvious bugs in demonstration

#### Bonus Success Criteria (Priority P3 - "Going Further" Features)

- **SC-026 (Bonus - Observability)**: Agent monitoring dashboard in Microsoft Foundry displays tracing data with agent turns, token usage, and performance metrics for the workflow

- **SC-027 (Bonus - Content Safety)**: All generated posts pass through Azure AI Content Safety screening with flagged content rejected and logged appropriately

- **SC-028 (Bonus - Agentic Evaluation)**: Automated evaluation generates quality scores (relevance, coherence, groundedness, fluency) for all platform posts with aggregate metrics logged

## Confirmed Brand Context

This specification is tailored for **Zava Travel Inc.**, a budget-friendly adventure travel company.

### Brand Identity

- **Company Name**: Zava Travel Inc.
- **Website**: zavatravel.com
- **Industry**: Travel — budget-friendly adventure travel & curated itineraries
- **Target Audience**: Millennials & Gen-Z adventure seekers
- **Brand Tone**: Adventurous & Inspiring
- **Brand Colors**: Teal/ocean blue + sunset orange
- **Primary Platforms**: LinkedIn, X/Twitter, Instagram

### Competitive Landscape (Fictitious References)

- **VoyageNow** (inspired by Viator) — activity & experience marketplace
- **CookTravel** (inspired by Thomas Cook) — packaged holiday tours
- **WanderPath** (inspired by Intrepid Travel) — group adventure tours

### Demo Campaign Context

- **Campaign Theme**: Summer adventure — "Wander More, Spend Less"
- **Key Destinations**: Bali, Patagonia, Iceland, Vietnam, Costa Rica
- **Campaign Hashtags**: #ZavaTravel #WanderMore #AdventureAwaits #TravelOnABudget

### Brand Guidelines Integration

The brand guidelines document for File Search grounding should include:
- Tone specifications: Adventurous, inspiring, budget-conscious
- Visual identity: Teal/ocean blue primary, sunset orange accent
- Approved messaging pillars: Affordability, authentic experiences, millennial/Gen-Z appeal
- Hashtag vocabulary: Campaign-specific tags listed above
- Sample destination highlights for the five key destinations

## Assumptions

The following assumptions were made to fill gaps in the feature description:

1. **Single-User Scope**: The system is designed for single-session, single-user operation. No authentication, user accounts, or multi-user concurrency support is required for the hackathon demonstration.

2. **Synthetic Brand Guidelines**: For hackathon demonstration, a synthetic brand guidelines document for Zava Travel Inc. created with Microsoft 365 Copilot is sufficient for grounding. Integration with real travel booking APIs or authenticated services is out of scope.

3. **Reasoning Model Deployment**: The system assumes a reasoning-capable model (GPT-5.1, GPT-5.2, Claude Opus 4.5, or equivalent) is already deployed in Azure AI Foundry with sufficient quota (100k-300k TPM). Model deployment is a prerequisite, not part of the system scope.

4. **~~Local Execution Environment~~**: ~~The system runs locally on the developer's machine using Python 3.10+. Cloud deployment, containerization, or web interface are out of scope.~~ **SUPERSEDED**: Full-stack web application implemented with FastAPI backend and React frontend (FR-033, FR-034).

5. **GitHub Copilot CLI Availability**: GitHub Copilot CLI is installed, authenticated, and accessible via command line. The system does not handle Copilot installation or initial setup.

6. **English Language Only**: All content generation, agent instructions, and campaign briefs are in English. Multi-language support is out of scope.

7. **~~Text-Only Output~~**: ~~The system generates text content for social media posts. Visual content creation is out of scope.~~ **SUPERSEDED**: AI image generation implemented via gpt-image-1.5 deployment (FR-032). System supports both text and image content types.

8. **No Scheduling or Publishing**: The system generates platform-ready content but does not schedule posts or integrate with social media platform APIs for direct publishing. Output is saved locally or displayed for manual copying.

9. **~~Standard Azure Authentication~~**: ~~The system assumes standard Azure authentication patterns. Complex authentication scenarios are simplified for hackathon scope.~~ **SUPERSEDED**: Three-tier auth implemented: API Key → ManagedIdentityCredential (client_id) → DefaultAzureCredential (FR-037).

10. **~~Error Recovery Simplicity~~**: ~~Error handling is basic. Advanced retry logic, exponential backoff, and comprehensive observability are bonus features, not baseline requirements.~~ **SUPERSEDED**: Full observability implemented with OpenTelemetry + Azure Monitor, distributed tracing, PII scrubbing middleware, and graceful degradation patterns (FR-029, FR-038).

11. **Performance Baseline**: Success criteria for "3 minutes completion time" assumes normal Azure OpenAI API response times (1-5 seconds per agent turn). Extreme latency scenarios are out of scope.

## Dependencies & Constraints

### Technical Dependencies

- **Python 3.10+**: Required runtime environment
- **Azure Subscription**: With reasoning model quota allocated (100k-300k TPM)
- **Azure AI Foundry Project**: Deployed reasoning model instance (GPT-5.1, GPT-5.2, or equivalent)
- **Azure CLI**: Installed and authenticated (`az login`) for DefaultAzureCredential
- **GitHub Copilot CLI**: Installed and authenticated for Reviewer agent
- **Microsoft Agent Framework**: Python packages (`agent-framework`, `agent-framework-azure`, `agent-framework-github-copilot`)
- **Starter Code Repository**: [aiagent-maf-githubcopilotsdk](https://github.com/sureshpaulraj/aiagent-maf-githubcopilotsdk) as foundation

**Bonus Feature Dependencies (Priority P3 — ALL IMPLEMENTED)**:
- **Azure Monitor OpenTelemetry**: `azure-monitor-opentelemetry>=1.8.6`, `opentelemetry-api>=1.39.0`, `opentelemetry-sdk>=1.39.0` for distributed tracing
- **Azure AI Content Safety**: `azure-ai-contentsafety>=1.0.0` with ManagedIdentityCredential (client_id=5e928186-625b-4a62-89ca-f4533b6e30d1), endpoint: `https://zava-content-safety.cognitiveservices.azure.com/`
- **Azure AI Evaluation SDK**: `azure-ai-evaluation>=1.15.0` with 5 evaluators (TaskAdherence, Coherence, Relevance, Groundedness, PlatformCompliance)
- **FastAPI + Uvicorn**: `fastapi>=0.128.8`, `uvicorn>=0.34.1` for API server
- **React + Vite**: React 19 + Vite 7 + Fluent UI v9 for frontend
- **Playwright**: `@playwright/test` for 84 automated end-to-end tests
- **Azure OpenAI Image**: `gpt-image-1.5` deployment for AI image generation

### External Constraints

- **Hackathon Time Limit**: 100 minutes from start to code freeze
- **Public Repository Security**: All code must be free of credentials, PII, and confidential information per [DISCLAIMER.md](../../DISCLAIMER.md) and Constitutional Principle I
- **Judging Criteria Weights**: Accuracy (25%), Reasoning (25%), Creativity (20%), User Experience (15%), Technical Implementation (15%)
- **Platform API Constraints**: Twitter/X 280-character limit strictly enforced; LinkedIn and Instagram best practices for length and hashtags
- **Azure Quota Limits**: System performance dependent on available Azure OpenAI TPM quota

### Scope Boundaries

**In Scope (ALL IMPLEMENTED)**:
- Three platforms: LinkedIn, X/Twitter, Instagram
- Four components: Orchestrator (Router), Creator, Reviewer, Publisher
- One grounding source (File Search with Zava Travel brand guidelines)
- One external tool integration via MCP (filesystem server)
- Single campaign brief format
- Text and image content generation (gpt-image-1.5)
- Full-stack web application (FastAPI + React frontend)
- API server with OpenAPI spec
- **Bonus features (ALL IMPLEMENTED)**: Observability monitoring (OpenTelemetry + Azure Monitor), content safety guardrails (two-layer shield), automated quality evaluation (5 evaluators), AI image generation, Playwright automated testing (84 tests), managed identity auth, PII scrubbing middleware

**Out of Scope**:
- Additional platforms (Facebook, TikTok, YouTube, etc.)
- Video content generation
- Direct publishing to social media platforms via APIs
- Post scheduling or calendar management
- Multi-user authentication or collaboration
- Real-time collaboration or shared drafts
- Content analytics or performance tracking
- A/B testing or content optimization
- Multi-language support
- Production deployment (containers, cloud hosting, CI/CD)

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Azure OpenAI quota exhaustion mid-demo | High - workflow terminates | Test with lower quota, implement clear error messages, prepare backup demo video |
| GitHub Copilot authentication failure | Medium - Reviewer unavailable | Implement retry logic, graceful degradation (skip review), document manual re-auth steps |
| Grounding source integration time overrun | Medium - miss hackathon milestone 3 | Prioritize File Search with synthetic document over complex API integrations |
| Multi-agent conversation loops | Medium - workflow doesn't terminate | Enforce strict 5-round limit, test termination conditions thoroughly |
| Platform character limit violations | Low - output invalid | Publisher Self-Reflection catches and revises violations automatically |
| Hardcoded secrets accidentally committed | Critical - disqualification | Mandatory pre-submission security audit, git history scan, peer review |

## Alignment with Constitutional Principles

This specification directly implements the five core principles established in [constitution.md](../../constitution.md):

### Principle I: Security-First Development

- **FR-020 to FR-024**: Mandatory DefaultAzureCredential, environment variables, .env exclusion, no hardcoded secrets
- **NFR-011 to NFR-013**: Pre-submission security audit, .gitignore enforcement, parameterized resources
- **SC-017 to SC-018**: 100% security compliance verification

### Principle II: Multi-Agent Collaboration Architecture

- **FR-002**: Round-robin group chat orchestrator with defined speaker selection
- **FR-006 to FR-012**: Three distinct agent roles (Creator, Reviewer, Publisher) with specialized instructions
- **FR-003**: Clear termination conditions (Publisher completion, 5 rounds, or approval)
- **SC-002**: All three agents participate with distinct contributions

### Principle III: Reasoning-Driven Design

- **FR-006**: Creator implements Chain-of-Thought reasoning pattern
- **FR-007**: Reviewer implements ReAct reasoning pattern
- **FR-008**: Publisher implements Self-Reflection pattern
- **SC-010 to SC-012**: 100% visible reasoning steps in output

### Principle IV: Grounded & Extensible Agent Capabilities

- **FR-013 to FR-016**: At least one grounding source (File Search, Bing Search, or custom knowledge base)
- **FR-017 to FR-019**: At least one external tool via MCP integration
- **SC-004 to SC-005**: Grounding and tool integration demonstrated
- **SC-009**: Source citations for factual claims when grounding available

### Principle V: Hackathon-Ready Execution

- **NFR-017 to NFR-020**: 100-minute time limit, starter code foundation, limited scope
- **SC-023**: Implementable within time constraint (verified through pilot)
- **SC-024 to SC-025**: Documentation and demo output for judging
- **Assumptions 1-12**: Simplified scope decisions prioritizing working demonstration over production features

## Hackathon Milestone Mapping

| Milestone | Requirements Coverage | Success Criteria |
|-----------|----------------------|------------------|
| **1. Set up environment** | NFR-006 (config validation), FR-020 to FR-022 (authentication), Prerequisites in dependencies | N/A (infrastructure setup) |
| **2. Create your agent** | FR-002 (orchestrator), FR-006 to FR-012 (agent capabilities), NFR-014 to NFR-015 (agent instructions) | SC-002 (three agents), SC-010 to SC-012 (reasoning patterns) |
| **3. Add grounding knowledge** | FR-013 to FR-016 (grounding sources), User Story 4 | SC-004 (grounding integrated), SC-009 (source citations) |
| **4. Add external tools** | FR-017 to FR-019 (MCP integration), User Story 5 | SC-005 (tool invoked), FR-018 (tool logging) |

## Next Steps

1. **Specification Review**: Team reviews this specification for alignment with hackathon goals and constitutional principles
2. **Clarification Phase** (Optional): If any requirements need user input, run `/speckit.clarify` to resolve unclear areas
3. **Implementation Planning**: Run `/speckit.plan` to create technical design and task breakdown
4. **Task Execution**: Run `/speckit.implement` to execute the 100-minute hackathon build
5. **Bonus Features** (Time Permitting): After core functionality is complete and tested, implement bonus features (FR-029 Observability, FR-030 Content Safety, FR-031 Agentic Evaluation) to enhance judging scores in the "Going Further" category
6. **Security Audit**: Complete pre-submission security checklist (Principle I compliance verification)
7. **Demo Preparation**: Create demo video or screenshots showing multi-agent conversation and final outputs for Zava Travel Inc. "Wander More, Spend Less" campaign
