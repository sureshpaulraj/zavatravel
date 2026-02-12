# Tasks: Multi-Agent Social Media Content Creation System

**Feature**: 001-social-media-agents  
**Timeline**: 100-minute hackathon execution  
**Input**: Design documents from `/specs/001-social-media-agents/`  
**Prerequisites**: constitution.md, plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

---

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: User story this task belongs to (US1-US5)
- All file paths are absolute from repository root

---

## Phase 1: Setup & Environment (00:00-00:20) - 20 minutes

**Purpose**: Project initialization, dependency installation, and security configuration

**Critical Path**: All tasks must complete before any agent implementation can begin

- [ ] T001 Create project directory structure: hackathon-social-agents/ with subdirectories agents/, orchestration/, grounding/, tools/, config/, utils/, output/
- [ ] T002 [P] Initialize Git repository with `git init` and set main branch with `git branch -M main`
- [ ] T003 [P] Create .gitignore file with entries: .env, .env.local, __pycache__/, *.py[cod], venv/, env/, output/*.md, output/*.json, .vscode/, .idea/, *.swp
- [ ] T004 [P] Create .env.sample with placeholders: AZURE_AI_FOUNDRY_PROJECT_ENDPOINT, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_CHAT_DEPLOYMENT_NAME, COPILOT_CLI_PATH (commented as optional)
- [ ] T005 Create requirements.txt with dependencies: agent-framework>=0.1.0, agent-framework-azure>=0.1.0, agent-framework-github-copilot --pre, azure-identity>=1.15.0, python-dotenv>=1.0.0
- [ ] T006 Create Python virtual environment: `python -m venv venv` in hackathon-social-agents/
- [ ] T007 Activate virtual environment and install dependencies: `pip install -r requirements.txt`
- [ ] T008 Create config/env_loader.py with validate_environment() function that checks required env vars and fails fast with clear error messages
- [ ] T009 Copy .env.sample to .env and populate with actual values from Azure resources (Azure AI Foundry endpoint, Azure OpenAI endpoint, deployment name)
- [ ] T010 Test environment validation by running: `python config/env_loader.py` and verify ✅ output

**Checkpoint**: Environment configured, dependencies installed, security patterns in place - Ready for agent implementation

---

## Phase 2: Foundational Infrastructure (00:20-00:30) - 10 minutes

**Purpose**: Core scaffolding that ALL user stories depend on - orchestration framework and workflow skeleton

**⚠️ CRITICAL**: No user story work can begin until this phase completes

- [ ] T011 Create empty __init__.py files in: agents/, orchestration/, grounding/, tools/, config/, utils/
- [ ] T012 Create orchestration/speaker_selection.py with speaker_selector(state) function implementing round-robin: Creator → Reviewer → Creator → Reviewer → Publisher with fast-track logic for "APPROVED" verdict
- [ ] T013 Create orchestration/termination.py with should_terminate(state) function checking: (a) last speaker is Publisher, (b) current_round >= 5, (c) last message contains "APPROVED" and last speaker is Reviewer
- [ ] T014 Create workflow_social_media.py main entry point with imports for: dotenv, asyncio, DefaultAzureCredential, GroupChatBuilder, AgentRunUpdateEvent, WorkflowOutputEvent
- [ ] T015 In workflow_social_media.py, implement validate_environment() call at startup and define campaign_brief example string for Zava Travel Inc. with brand="Zava Travel Inc.", industry="budget-friendly adventure travel", audience="Millennials & Gen-Z adventure seekers", message="Wander More, Spend Less - affordable adventure to Bali, Patagonia, Iceland, Vietnam, Costa Rica", platforms=["LinkedIn", "Twitter", "Instagram"]
- [ ] T016 In workflow_social_media.py, implement main() async function with basic workflow skeleton: credential setup, client placeholders, workflow builder structure (no agents yet)

**Checkpoint**: Foundation ready - agent creation can now begin in parallel

---

## Phase 3: User Story 1 - Generate Multi-Platform Content (Priority P1) 🎯 MVP

**Goal**: Accept campaign brief input and produce three platform-ready social media posts (LinkedIn, X/Twitter, Instagram) with proper formatting, character limits, and hashtags

**Independent Test**: Submit campaign brief with brand="TechCorp", industry="Technology", audience="Enterprise CIOs", message="AI automation reduces costs 40%", platforms=["LinkedIn", "Twitter", "Instagram"] and verify three distinct posts are generated with platform-specific constraints satisfied

### Agent Implementation for User Story 1

- [ ] T017 [P] [US1] Create agents/creator.py with CREATOR_INSTRUCTIONS constant containing Chain-of-Thought pattern (5 steps: objective → audience → hook → body → CTA) from contracts/creator-instructions.md
- [ ] T018 [P] [US1] Create agents/reviewer.py with REVIEWER_INSTRUCTIONS constant containing ReAct pattern (Observation → Thought → Action → Result) from contracts/reviewer-instructions.md
- [ ] T019 [P] [US1] Create agents/publisher.py with PUBLISHER_INSTRUCTIONS constant containing Self-Reflection pattern (platform validation checks) from contracts/publisher-instructions.md
- [ ] T020 [US1] In workflow_social_media.py, instantiate AzureOpenAIChatClient with DefaultAzureCredential, endpoint from env, and deployment_name from env
- [ ] T021 [US1] In workflow_social_media.py, create Creator agent using azure_client.create_agent() with name="Creator" and instructions from agents/creator.py
- [ ] T022 [US1] In workflow_social_media.py, instantiate GitHubCopilotAgent for Reviewer agent with instructions from agents/reviewer.py
- [ ] T023 [US1] In workflow_social_media.py, create Publisher agent using azure_client.create_agent() with name="Publisher" and instructions from agents/publisher.py
- [ ] T024 [US1] In workflow_social_media.py, build GroupChat workflow using GroupChatBuilder with orchestrator selection_func from orchestration/speaker_selection.py
- [ ] T025 [US1] In workflow_social_media.py, add participants [creator, reviewer, publisher] to workflow and set termination condition from orchestration/termination.py
- [ ] T026 [US1] Implement workflow streaming in main() with async for event in workflow.run_stream(campaign_brief), handling AgentRunUpdateEvent for real-time output and WorkflowOutputEvent for completion

### Platform Formatting & Validation for User Story 1

- [ ] T027 [P] [US1] Create utils/formatting.py with twitter_char_count(text) function that counts characters including emojis as 2 chars (conservative estimate)
- [ ] T028 [P] [US1] In utils/formatting.py, add validate_linkedin_post(post) function checking: 3-5 hashtags, professional tone indicators, paragraph structure (newlines present)
- [ ] T029 [P] [US1] In utils/formatting.py, add validate_twitter_post(post) function checking: ≤280 characters strict, 2-3 hashtags, punchy tone (no paragraphs)
- [ ] T030 [P] [US1] In utils/formatting.py, add validate_instagram_post(post) function checking: 2-5 emojis present, 5-10 hashtags, visual suggestion in [brackets]
- [ ] T031 [US1] Update agents/publisher.py PUBLISHER_INSTRUCTIONS to include explicit Self-Reflection checklist format showing PASS/FAIL for each platform constraint

### Testing & Validation for User Story 1

- [ ] T032 [US1] Test full workflow with Zava Travel Inc. "Wander More, Spend Less" campaign brief: Run `python workflow_social_media.py` and verify Creator generates draft with visible 5-step Chain-of-Thought
- [ ] T033 [US1] Verify Reviewer provides ReAct feedback (Observation → Thought → Action → Result) with REVISE verdict for first draft, ensuring adventurous and inspiring tone for Zava Travel brand
- [ ] T034 [US1] Verify Creator incorporates Reviewer feedback in second iteration with Zava Travel brand voice and Reviewer then provides APPROVED verdict
- [ ] T035 [US1] Verify Publisher generates three platform posts for Zava Travel: LinkedIn (check 3-5 hashtags including #ZavaTravel, professional yet exciting tone), Twitter (verify ≤280 chars with twitter_char_count()), Instagram (verify 5-10 hashtags, emojis present, adventure destinations mentioned)
- [ ] T036 [US1] Verify workflow terminates correctly after Publisher completes (termination_reason: "publisher_completion")
- [ ] T037 [US1] Test termination edge case: Modify Reviewer to always say REVISE and verify workflow terminates after 5 rounds (termination_reason: "max_rounds_reached")

**Checkpoint**: User Story 1 complete - System generates three platform-ready posts from campaign brief with multi-agent reasoning visible

---

## Phase 4: User Story 2 - View Agent Reasoning Process (Priority P1)

**Goal**: Display complete conversation transcript showing Creator's Chain-of-Thought, Reviewer's ReAct feedback, and Publisher's Self-Reflection validations

**Independent Test**: Run workflow and verify console output shows all agent reasoning steps with clear labels ([Creator], [Reviewer], [Publisher]) and reasoning patterns are visible in output

### Implementation for User Story 2

- [ ] T038 [P] [US2] In workflow_social_media.py, enhance AgentRunUpdateEvent handler to print agent name prefix: `print(f"[{event.agent_name}]: {event.message_delta}", end="", flush=True)`
- [ ] T039 [P] [US2] In workflow_social_media.py, add separator lines between agent messages: print "\n" + "-"*60 + "\n" after each agent completes
- [ ] T040 [US2] In workflow_social_media.py, enhance WorkflowOutputEvent handler to display final transcript with headers: "="*60, "WORKFLOW COMPLETE", "="*60
- [ ] T041 [US2] Create utils/transcript_formatter.py with format_conversation_transcript(messages) function that structures output with round numbers and agent names
- [ ] T042 [US2] In workflow_social_media.py, after workflow completes, call format_conversation_transcript() and display structured conversation history

### Reasoning Visibility Enhancements for User Story 2

- [ ] T043 [US2] Update agents/creator.py to ensure reasoning steps are prefixed with "**Step 1:**", "**Step 2:**", etc. for clear visibility
- [ ] T044 [US2] Update agents/reviewer.py to ensure ReAct structure uses bold headers: "**Observation:**", "**Thought:**", "**Action:**", "**Result:**"
- [ ] T045 [US2] Update agents/publisher.py to ensure Self-Reflection uses checkmark format: "✓ Character count: X/Y — PASS/FAIL"

### Testing for User Story 2

- [ ] T046 [US2] Test conversation transcript display: Run workflow and verify all 5 Chain-of-Thought steps are visible in Creator output
- [ ] T047 [US2] Verify Reviewer ReAct pattern is clearly displayed with all four components (Observation, Thought, Action, Result)
- [ ] T048 [US2] Verify Publisher Self-Reflection shows validation checks for all three platforms with PASS/FAIL status
- [ ] T049 [US2] Test streaming output: Verify agent messages appear in real-time (not batch at end), showing "thinking" process during workflow
- [ ] T050 [US2] Verify final transcript includes metadata: total rounds, termination reason, and duration

**Checkpoint**: User Story 2 complete - Full reasoning transparency demonstrated with visible agent collaboration process

---

## Phase 5: User Story 3 - Iterative Refinement (Priority P2)

**Goal**: Demonstrate Reviewer feedback influencing Creator revisions, showing multi-agent collaboration value

**Independent Test**: Run workflow with deliberately weak initial brief (vague message) and verify Creator's second draft incorporates Reviewer's specific improvement suggestions

### Implementation for User Story 3

- [ ] T051 [US3] In agents/creator.py, add explicit feedback incorporation logic in system instructions: "When Reviewer says REVISE, reference the feedback in your reasoning (e.g., 'Step 3: Based on Reviewer feedback about weak hook...')"
- [ ] T052 [US3] In agents/reviewer.py, ensure STRENGTHS section always lists 1-2 specific positive elements to reinforce good practices
- [ ] T053 [US3] In agents/reviewer.py, ensure IMPROVEMENTS section provides concrete, actionable changes (e.g., "Replace 'great' with 'transformative 40% cost reduction'")
- [ ] T054 [US3] In orchestration/speaker_selection.py, verify fast-track logic: if last message contains "APPROVED", next speaker is Publisher (bypasses additional Creator-Reviewer cycles)

### Iteration Patterns for User Story 3

- [ ] T055 [US3] Create test campaign brief with weak hook: "Our travel packages are great" and verify Reviewer identifies this as vague for Zava Travel brand
- [ ] T056 [US3] Verify Creator's second iteration explicitly references Reviewer feedback in reasoning steps (check for "Based on Reviewer feedback..." in Step 3 or Step 4) and improves adventure positioning
- [ ] T057 [US3] Test Reviewer approval fast-track: Provide strong initial campaign brief (specific destinations like "Bali adventure packages starting at $899", clear value prop) and verify Reviewer says "APPROVED" after first draft
- [ ] T058 [US3] When Reviewer approves, verify workflow skips additional Creator iterations and goes directly to Publisher

### Edge Case Testing for User Story 3

- [ ] T059 [US3] Test max rounds termination: Ensure that if Creator and Reviewer cycle through 5 rounds without approval, workflow terminates gracefully with "max_rounds_reached"
- [ ] T060 [US3] Verify termination message explains outcome: "Workflow completed after 5 rounds. Publisher formatting best available draft."

**Checkpoint**: User Story 3 complete - Iterative improvement and fast-track approval demonstrated

---

## Phase 6: User Story 4 - Brand-Grounded Content (Priority P2)

**Goal**: Integrate brand guidelines document via File Search and demonstrate agents referencing grounding sources in reasoning

**Independent Test**: Upload brand guidelines document, run workflow, and verify Creator reasoning includes citations like "Based on brand guidelines: tone is professional yet approachable"

### Brand Guidelines Creation for User Story 4

- [ ] T061 [US4] Create grounding/brand-guidelines.docx with sections: Brand Voice (adventurous and inspiring), Tone Guidelines (LinkedIn: professional yet exciting, Twitter: energetic and wanderlust-driven, Instagram: storytelling and aspirational), Messaging Pillars (Affordability, Authentic Experiences, Millennial/Gen-Z Appeal), Destinations (Bali, Patagonia, Iceland, Vietnam, Costa Rica), Approved Hashtags (#ZavaTravel, #WanderMore, #AdventureAwaits, #TravelOnABudget), Competitor Exclusions (VoyageNow, CookTravel, WanderPath), Sample Posts for "Wander More, Spend Less" campaign (1 per platform)
- [ ] T062 [US4] Alternative: If Word unavailable, create grounding/brand-guidelines.md with same structure as plain text markdown for Zava Travel Inc. brand identity

### File Search Integration for User Story 4

- [ ] T063 [P] [US4] Create grounding/file_search.py with upload_brand_guidelines(project_client, file_path) function using project_client.files.upload() with purpose="assistants"
- [ ] T064 [P] [US4] In grounding/file_search.py, create attach_file_search_tool(agent, file_id) function that creates FileSearchTool(file_ids=[file_id]) and appends to agent.tools
- [ ] T065 [US4] In workflow_social_media.py, instantiate AIProjectClient with endpoint from env and DefaultAzureCredential
- [ ] T066 [US4] In workflow_social_media.py, call upload_brand_guidelines() before creating Creator agent to get file_id
- [ ] T067 [US4] In workflow_social_media.py, after creating Creator agent, call attach_file_search_tool(creator, file_id) to enable grounding
- [ ] T068 [US4] Update agents/creator.py CREATOR_INSTRUCTIONS to add: "Use File Search to reference brand guidelines when generating content. Cite specific elements in your reasoning."

### Grounding Validation for User Story 4

- [ ] T069 [US4] Test File Search integration: Run workflow and verify Zava Travel Inc. brand guidelines document uploads successfully (check for file_id in logs)
- [ ] T070 [US4] Verify Creator reasoning includes citations: Check for "Based on Zava Travel brand guidelines..." or "According to the brand voice document..." in Step 2 (audience consideration)
- [ ] T071 [US4] Test hashtag grounding: Verify generated posts use hashtags from Zava Travel brand guidelines (#ZavaTravel, #WanderMore, #AdventureAwaits, #TravelOnABudget)
- [ ] T072 [US4] Test tone alignment: Compare generated content tone against Zava Travel brand guidelines specifications (adventurous and inspiring for all platforms, with professional yet exciting tone for LinkedIn, energetic for Twitter, storytelling for Instagram)
- [ ] T073 [US4] Test competitor exclusion grounding: Verify generated posts do NOT mention competitor brands (VoyageNow, CookTravel, WanderPath) as specified in brand guidelines
- [ ] T074 [US4] Test graceful degradation: Temporarily remove brand-guidelines.docx and verify workflow continues with "File Search unavailable; using campaign brief context only" acknowledgment

**Checkpoint**: User Story 4 complete - Grounded content generation with Zava Travel brand guidelines via File Search integration demonstrated

---

## Phase 7: User Story 5 - External Tool Integration (Priority P3)

**Goal**: Save generated content to local filesystem using MCP filesystem server, demonstrating external tool integration

**Independent Test**: Run workflow, verify file output/social-posts-[timestamp].md is created with all three platform posts formatted in markdown

### MCP Server Setup for User Story 5

- [ ] T075 [US5] Install MCP filesystem server globally: `npm install -g @modelcontextprotocol/server-filesystem`
- [ ] T076 [US5] Verify MCP server installation: `npx @modelcontextprotocol/server-filesystem --help` (should display help text)
- [ ] T077 [US5] Create output/ directory in hackathon-social-agents/ root if it doesn't exist

### Filesystem MCP Integration for User Story 5

- [ ] T078 [P] [US5] Create tools/filesystem_mcp.py with get_filesystem_tools() function that instantiates MCPClient with command=["npx", "@modelcontextprotocol/server-filesystem", "./output"] and transport="stdio"
- [ ] T079 [P] [US5] In tools/filesystem_mcp.py, add error handling for MCP server connection failures (try/except with graceful degradation message)
- [ ] T080 [US5] In workflow_social_media.py, import get_filesystem_tools from tools/filesystem_mcp.py
- [ ] T081 [US5] In workflow_social_media.py, after creating Publisher agent, call publisher.tools.extend(get_filesystem_tools()) to attach MCP tools
- [ ] T082 [US5] Update agents/publisher.py PUBLISHER_INSTRUCTIONS to add: "After generating platform posts, save them to 'output/social-posts-[timestamp].md' using the write_file tool."

### File Output Formatting for User Story 5

- [ ] T083 [US5] Create utils/markdown_formatter.py with format_posts_to_markdown(linkedin_post, twitter_post, instagram_post, transcript) function
- [ ] T084 [US5] In utils/markdown_formatter.py, implement markdown structure: Title "# Social Media Content - Zava Travel Inc.", Platform sections with "## LinkedIn", "## X/Twitter", "## Instagram", each with post body, hashtags, CTA, and metadata (character count, validation status)
- [ ] T085 [US5] In workflow_social_media.py, after workflow completes, generate markdown content and log instruction for Publisher to save (or manually save if MCP tool not invoked)

### Testing for User Story 5

- [ ] T086 [US5] Test MCP server connection: Run workflow and verify no errors during Publisher agent tool attachment
- [ ] T087 [US5] Test file creation: After workflow completes, verify output/social-posts-[timestamp].md exists in hackathon-social-agents/output/ directory
- [ ] T088 [US5] Test file content: Open generated markdown file and verify it contains all three Zava Travel platform posts with proper formatting (headings, hashtags, CTAs)
- [ ] T089 [US5] Test tool invocation logging: Verify conversation transcript includes tool call entry showing "write_file" invocation with file path
- [ ] T090 [US5] Test graceful failure: Stop MCP server process and verify workflow continues with console-only output + error message about file save failure

**Checkpoint**: User Story 5 complete - External tool integration via MCP demonstrated with local file persistence

---

## Phase 9: Bonus Features - Observability, Content Safety & Evaluation (Priority P3) 🎁 OPTIONAL

**Purpose**: Production-ready enhancements demonstrating enterprise capabilities: distributed tracing, content safety guardrails, and automated quality evaluation

**⚠️ IMPORTANT**: Execute this phase ONLY if Phases 1-7 are complete AND you have 45+ minutes remaining. These are bonus features that enhance the demo but are not required for core functionality.

**Goal**: Integrate three Microsoft Foundry platform features to demonstrate production readiness and AI best practices

**Independent Test**: Enable all three features, run workflow, verify: (1) traces appear in Foundry portal, (2) content passes safety checks with no violations, (3) evaluation scores are generated for all three platform posts

### Bonus Feature 1: Observability (FR-029, NFR-021) - 10-15 minutes

**Purpose**: Enable distributed tracing for agent workflows to monitor token usage, latency, and tool invocations

- [ ] T112 [P] [P3] Install Azure Monitor OpenTelemetry package: Add `azure-monitor-opentelemetry>=1.0.0` to requirements.txt and run `pip install azure-monitor-opentelemetry`
- [ ] T113 [P] [P3] In .env.sample and .env, add optional entry: `APPLICATIONINSIGHTS_CONNECTION_STRING` (commented as bonus feature - optional)
- [ ] T114 [P3] Create monitoring/tracing.py with enable_foundry_tracing() function that calls configure_azure_monitor() with connection string from environment
- [ ] T115 [P3] In workflow_social_media.py, import enable_foundry_tracing from monitoring/tracing.py and call it before workflow initialization (wrap in try/except for graceful degradation if not configured)
- [ ] T116 [P3] Update README.md Bonus Features section: Document how to enable tracing by setting APPLICATIONINSIGHTS_CONNECTION_STRING in .env and viewing traces in AI Foundry portal under "Tracing" section
- [ ] T117 [P3] Test tracing integration: Run workflow with Application Insights configured and verify traces are collected (check Foundry portal or logs for trace IDs)
- [ ] T118 [P3] Test graceful degradation: Run workflow WITHOUT Application Insights configured and verify workflow continues with console message "Tracing not enabled (APPLICATIONINSIGHTS_CONNECTION_STRING not set)"

### Bonus Feature 2: Content Safety (FR-030, NFR-022) - 15-20 minutes

**Purpose**: Integrate Azure AI Content Safety to filter harmful content and enforce brand-specific blocklists (competitor names)

- [ ] T119 [P] [P3] Install Azure AI Content Safety package: Add `azure-ai-contentsafety>=1.0.0` to requirements.txt and run `pip install azure-ai-contentsafety`
- [ ] T120 [P] [P3] In .env.sample and .env, add optional entry: `CONTENT_SAFETY_ENDPOINT` (commented as bonus feature - optional)
- [ ] T121 [P3] Create safety/content_safety.py with check_content_safety(text, client) function that calls ContentSafetyClient.analyze_text() and returns dict with {safe: bool, violations: List[str], severity_scores: dict}
- [ ] T122 [P3] In safety/content_safety.py, add create_safety_client() function that instantiates ContentSafetyClient with endpoint from env and DefaultAzureCredential
- [ ] T123 [P3] In safety/content_safety.py, add check_competitor_mentions(text) function that scans for Zava Travel competitors (VoyageNow, CookTravel, WanderPath) and returns True if found
- [ ] T124 [P3] In workflow_social_media.py, after Publisher generates final posts, call check_content_safety() for each platform post and log results (safety scores and any violations)
- [ ] T125 [P3] In workflow_social_media.py, after safety checks, call check_competitor_mentions() for each post and log warning if competitors are mentioned (per Zava Travel brand guidelines)
- [ ] T126 [P3] Update README.md Bonus Features section: Document Content Safety integration, how to configure endpoint, and what violations are checked (hate, violence, self-harm, sexual content, competitor mentions)
- [ ] T127 [P3] Test content safety with safe content: Run workflow with normal Zava Travel campaign brief and verify all posts pass safety checks (safe: True, no violations)
- [ ] T128 [P3] Test competitor blocklist: Manually edit a generated post to include "VoyageNow" and verify check_competitor_mentions() flags it with warning message
- [ ] T129 [P3] Test graceful degradation: Run workflow WITHOUT Content Safety endpoint configured and verify workflow continues with console message "Content Safety not enabled (CONTENT_SAFETY_ENDPOINT not set)"

### Bonus Feature 3: Agentic Evaluation (FR-031, NFR-023) - 20-25 minutes

**Purpose**: Automated quality assessment using Foundry Evaluation SDK to score content relevance, coherence, groundedness, and fluency

- [ ] T130 [P] [P3] Install Azure AI Evaluation package: Add `azure-ai-evaluation>=1.0.0` to requirements.txt and run `pip install azure-ai-evaluation`
- [ ] T131 [P3] Create evaluation/quality_metrics.py with evaluate_content(posts, campaign_brief, project_client) async function that uses Foundry Evaluation SDK
- [ ] T132 [P3] In evaluation/quality_metrics.py, define evaluation metrics: RelevanceEvaluator (0-5), CoherenceEvaluator (0-5), GroundednessEvaluator (0-5), FluencyEvaluator (0-5)
- [ ] T133 [P3] In evaluation/quality_metrics.py, implement evaluate_content() to iterate through posts, evaluate each with all metrics, calculate aggregate score (average), return List[dict] with platform, scores, aggregate
- [ ] T134 [P3] Create evaluation/evaluation_formatter.py with format_evaluation_results(results) function that creates markdown table showing scores per platform and overall statistics
- [ ] T135 [P3] In workflow_social_media.py, after Publisher completes and safety checks pass, call evaluate_content() asynchronously to generate quality scores for all three posts
- [ ] T136 [P3] In workflow_social_media.py, after evaluation completes, display formatted evaluation results: "Evaluation Scores: LinkedIn (Avg: 4.2/5), Twitter (Avg: 4.5/5), Instagram (Avg: 4.3/5)"
- [ ] T137 [P3] Update README.md Bonus Features section: Document Agentic Evaluation integration, explain the four metrics (relevance, coherence, groundedness, fluency), and note that scores are generated automatically for quality tracking
- [ ] T138 [P3] Test evaluation integration: Run workflow and verify evaluation scores are generated for all three posts with values between 0-5 for each metric
- [ ] T139 [P3] Verify evaluation output: Check that aggregate scores are displayed in console and logged in final transcript for demo purposes
- [ ] T140 [P3] Test graceful degradation: If evaluation fails (API error, timeout), verify workflow continues with console message "Evaluation skipped due to error: [error details]"

### Bonus Phase Testing & Integration

- [ ] T141 [P3] Integration test: Run workflow with ALL three bonus features enabled (tracing + safety + evaluation) and verify: (1) traces logged to Application Insights, (2) safety checks pass with no violations, (3) evaluation scores generated
- [ ] T142 [P3] Test combined output: Verify final console output includes: conversation transcript, three platform posts, safety check results (PASS/FAIL per post), evaluation scores (4 metrics + aggregate per post), trace ID for debugging
- [ ] T143 [P3] Performance test: Measure workflow duration with all bonus features enabled and verify total time is under 3 minutes (Content Safety adds ~200-500ms per post, Evaluation adds ~1-2 seconds total)
- [ ] T144 [P3] Update workflow_social_media.py: Add command-line flags or environment variables to enable/disable bonus features individually (e.g., ENABLE_TRACING=true, ENABLE_SAFETY=true, ENABLE_EVALUATION=true)
- [ ] T145 [P3] Documentation: Add bonus features section to README.md with prerequisites (Application Insights, Content Safety endpoint), setup instructions, and expected output format

**Checkpoint**: Bonus Phase complete - Production-ready observability, content safety, and automated evaluation features demonstrated (execute only if ahead of schedule)

---

## Phase 8: Documentation & Demo Preparation (01:35-01:40) - 5 minutes

**Purpose**: README, security audit, and demo capture for submission

- [ ] T091 [P] Create README.md with sections: Project title "Zava Travel Inc. Multi-Agent Social Media Content Creation", Track (Reasoning Agents with Microsoft Foundry), Prerequisites (Python 3.10+, Azure subscription, GitHub Copilot CLI), Setup instructions (virtual env, dependencies, .env configuration)
- [ ] T092 [P] In README.md, add How to Run section with example: `python workflow_social_media.py`, Example Campaign Brief section with Zava Travel Inc. "Wander More, Spend Less" summer adventure campaign sample
- [ ] T093 [P] In README.md, add Output section describing console transcript and output/social-posts-[timestamp].md file with Zava Travel branded content
- [ ] T094 [P] In README.md, add Architecture section listing: Creator Agent (Chain-of-Thought, Azure OpenAI), Reviewer Agent (ReAct, GitHub Copilot), Publisher Agent (Self-Reflection, Azure OpenAI), Grounding (File Search with Zava Travel brand guidelines), Tools (MCP filesystem server)
- [ ] T095 [P] In README.md, add Security section confirming: No credentials in repository (DefaultAzureCredential), .env excluded via .gitignore, placeholder .env.sample provided
- [ ] T096 [P] Update .gitignore to ensure output/*.md is excluded if it contains test data (keep output/ directory structure but ignore generated files)

### Security Audit for Submission

- [ ] T097 Run security checklist: `git status` to verify .env is NOT in staged files
- [ ] T098 Check git history for secrets: `git log --all --full-history --source` and search for AZURE, ENDPOINT, KEY (should find none)
- [ ] T099 Verify .gitignore entries: `cat .gitignore` and confirm .env, .env.local, venv/, __pycache__/ are present
- [ ] T100 Scan all Python files for hardcoded URLs: `Get-ChildItem -Recurse -Filter *.py | Select-String -Pattern "https://"` and verify only os.getenv() calls (no hardcoded Azure endpoints)
- [ ] T101 Final review: Ensure no Azure subscription IDs, tenant IDs, resource group names, or API keys exist in any committed file

### Demo Capture

- [ ] T102 [P] Run final workflow execution: `python workflow_social_media.py` with polished Zava Travel Inc. "Wander More, Spend Less" campaign brief
- [ ] T103 [P] Take screenshot of console output showing: Agent names ([Creator], [Reviewer], [Publisher]), visible reasoning steps (5-step Chain-of-Thought, ReAct feedback, Self-Reflection checks), final three Zava Travel platform posts
- [ ] T104 [P] Save screenshot as demo-screenshot.png in hackathon-social-agents/ root
- [ ] T105 [P] (Optional) Record 30-60 second screen video showing workflow execution from start to final Zava Travel content output, narrating agent collaboration
- [ ] T106 Verify output/social-posts-[timestamp].md is correctly formatted with Zava Travel branding and displays well as demo artifact

### Final Commit & Submission

- [ ] T107 Stage all files: `git add .` (verify .env is NOT included - should be in .gitignore)
- [ ] T108 Commit with message: `git commit -m "TechConnect Hackathon submission: Zava Travel Inc. multi-agent social media content creation with Chain-of-Thought, ReAct, Self-Reflection reasoning patterns"`
- [ ] T109 Create remote repository and push: `git remote add origin [URL]` then `git push -u origin main`
- [ ] T110 Verify GitHub repository displays: README.md correctly with Zava Travel branding, .env.sample present, .env absent, demo-screenshot.png visible
- [ ] T111 Submit repository URL to TechConnect Hackathon portal with required metadata (team name, track, demo screenshot/video link)

**Checkpoint**: Submission complete - Repository public, secure, documented, and demo-ready with Zava Travel Inc. branding

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Must complete before all other phases
   ↓
Phase 2 (Foundation) → BLOCKS all user story work
   ↓
Phases 3-7 (User Stories) → Can proceed sequentially or in parallel after Phase 2 completes
   ↓
Phase 8 (Documentation) → Depends on Phase 3 (MVP) minimum; ideally all user stories complete
```

### User Story Dependencies

**Independent Implementation Order** (priority-based):
1. **Phase 3 (US1)**: Core functionality - Generate multi-platform content (MVP)
2. **Phase 4 (US2)**: Reasoning visibility - Required for judging (25% of score)
3. **Phase 5 (US3)**: Iterative refinement - Demonstrates multi-agent value
4. **Phase 6 (US4)**: Brand grounding - Hackathon milestone 3 requirement
5. **Phase 7 (US5)**: External tools - Hackathon milestone 4 requirement
6. **Phase 9 (BONUS)**: Observability, Content Safety, Evaluation - Production-ready enhancements (OPTIONAL)

**Critical Path for MVP** (100-minute time limit):
- Phases 1-2 (30 min) + Phase 3 (30 min) + Phase 4 (10 min) + Phase 8 (5 min) = 75 minutes
- Remaining 25 minutes: Phase 6 (grounding) for judging "Accuracy" criterion

**Parallel Opportunities**:
- Within Phase 1: T002, T003, T004, T005 (setup tasks) can run in parallel
- Within Phase 3: T017, T018, T019 (agent creation), T027, T028, T029, T030 (validation utils) can run in parallel
- Within Phase 4: T063, T064 (grounding utilities) can run in parallel
- Within Phase 5: T077, T078 (MCP integration) can run in parallel
- Within Phase 8: T091-T096 (documentation), T102-T106 (demo capture) can run in parallel
- **Within Phase 9 (BONUS)**: T112, T113 (tracing setup), T119, T120 (safety setup), T130 (evaluation setup) can run in parallel

---

## Parallel Example: Phase 3 Agent Creation

```bash
# Launch all three agent file creation tasks simultaneously:
Task T017: "Create agents/creator.py with Chain-of-Thought instructions"
Task T018: "Create agents/reviewer.py with ReAct instructions"
Task T019: "Create agents/publisher.py with Self-Reflection instructions"

# Then launch all validation utilities in parallel:
Task T027: "Create utils/formatting.py with twitter_char_count()"
Task T028: "Add validate_linkedin_post() to utils/formatting.py"
Task T029: "Add validate_twitter_post() to utils/formatting.py"
Task T030: "Add validate_instagram_post() to utils/formatting.py"
```

---

## Implementation Strategy

### MVP First (Minimum Viable Demo)

**Recommended for 100-minute constraint**:
1. Complete Phase 1 (Setup) - 20 minutes
2. Complete Phase 2 (Foundation) - 10 minutes
3. Complete Phase 3 (US1) - 30 minutes
4. Complete Phase 4 (US2) - 10 minutes
5. **STOP and VALIDATE**: Test end-to-end workflow with campaign brief
6. Add Phase 6 (US4 - Grounding) if time permits - 20 minutes
7. Complete Phase 8 (Documentation) - 5 minutes
8. **Total: 95 minutes** (5-minute buffer)

**This MVP delivers**:
- ✅ Working multi-agent collaboration (3 agents with visible reasoning)
- ✅ Three platform-ready posts (LinkedIn, Twitter, Instagram)
- ✅ Reasoning transparency (Chain-of-Thought, ReAct, Self-Reflection)
- ✅ Iterative refinement (Creator incorporates Reviewer feedback)
- ✅ Grounding (brand guidelines via File Search)
- ⚠️ Missing: External tool integration (US5 - deprioritize if time-constrained)

### Incremental Delivery (If Ahead of Schedule)

If Phase 3 + 4 complete with time remaining:
1. **Add Phase 5 (US3)** - Iteration enhancements (10 min): Improves multi-agent value demonstration
2. **Add Phase 6 (US4)** - Brand grounding (20 min): Required for "Accuracy & Relevance" judging (25% of score)
3. **Add Phase 7 (US5)** - MCP tools (10 min): Hackathon milestone 4 requirement
4. **Add Phase 9 (BONUS)** - Observability, Safety, Evaluation (45-60 min): Production-ready features demonstrating enterprise capabilities (ONLY if 45+ minutes remaining after completing Phases 1-7)
5. Each addition is independently testable and adds judging value

### Time-Saving Shortcuts

If behind schedule at minute 70:
- **Skip Phase 7 (US5)**: External tool integration is bonus, not core demo
- **Simplify Phase 6 (US4)**: Use inline brand context in Creator instructions instead of File Search
- **Reduce testing**: Test only happy path (strong campaign brief → approval → three posts)
- **Defer documentation**: Write minimal README (setup + run instructions only)

---

## Validation Checkpoints

### After Phase 3 (US1 - Core Functionality)

**Test**: Run `python workflow_social_media.py`
- ✓ Creator generates initial draft with 5-step Chain-of-Thought visible
- ✓ Reviewer provides ReAct feedback (Observation → Thought → Action → Result)
- ✓ Creator incorporates feedback in second iteration
- ✓ Reviewer approves with "APPROVED" verdict
- ✓ Publisher generates three posts: LinkedIn (3-5 hashtags), Twitter (≤280 chars), Instagram (5-10 hashtags, emojis)
- ✓ Workflow terminates with "publisher_completion"

**If any check fails**: Debug before proceeding to Phase 4

### After Phase 4 (US2 - Reasoning Visibility)

**Test**: Review console output
- ✓ All agent names prefixed: [Creator], [Reviewer], [Publisher]
- ✓ Creator reasoning shows **Step 1**, **Step 2**, **Step 3**, **Step 4**, **Step 5**
- ✓ Reviewer feedback shows **Observation**, **Thought**, **Action**, **Result**
- ✓ Publisher shows ✓ validation checks with PASS/FAIL for each platform
- ✓ Final transcript displays with clear separation between agents

**If any check fails**: Update agent instructions or formatting before continuing

### After Phase 6 (US4 - Brand Grounding)

**Test**: Check grounding citations
- ✓ Brand guidelines document uploads successfully (file_id logged)
- ✓ Creator reasoning includes "Based on brand guidelines..." citations
- ✓ Generated hashtags match those in brand-guidelines.docx
- ✓ Tone aligns with brand voice specifications (professional yet approachable)

**If any check fails**: Verify File Search attachment and agent instructions

### Final Submission Validation (After Phase 8)

**Test**: Repository and demo readiness
- ✓ README.md complete with setup, run instructions, example input
- ✓ .env NOT committed (check `git status` and `git log`)
- ✓ .env.sample present with placeholders
- ✓ demo-screenshot.png shows full workflow output
- ✓ All agents participate with visible reasoning
- ✓ Three platform posts generated with correct formatting

**If any check fails**: Fix before final commit and push

---

## Success Metrics (Aligned with Judging Criteria)

### Accuracy & Relevance (25%)

- [ ] Generated posts maintain consistent brand voice across all platforms while adapting tone appropriately
- [ ] All platform-specific constraints satisfied (LinkedIn 3-5 hashtags, Twitter ≤280 chars, Instagram emojis + 5-10 hashtags)
- [ ] 100% of posts include clear call-to-action relevant to campaign objective
- [ ] Grounding sources cited in agent reasoning when available

### Reasoning & Multi-step Thinking (25%)

- [ ] Creator displays all 5 Chain-of-Thought steps in every content generation turn
- [ ] Reviewer structures 100% of feedback using ReAct format (Observation → Thought → Action → Result)
- [ ] Publisher performs and logs Self-Reflection validation checks for all three platform outputs
- [ ] Complete conversation transcript preserved and visible for demonstration

### Creativity & Originality (20%)

- [ ] Multi-agent collaboration pattern demonstrates separation of concerns (ideation vs. critique vs. production)
- [ ] Platform-specific adaptation shows creative tailoring (professional LinkedIn vs. punchy Twitter vs. visual Instagram)
- [ ] Iterative refinement produces noticeably improved content in second Creator draft

### User Experience & Presentation (15%)

- [ ] Real-time streaming output shows agents "thinking" (not batch display)
- [ ] Clear console formatting with agent name prefixes and separators
- [ ] README documentation enables setup and execution without external guidance
- [ ] Demo screenshot or video clearly demonstrates workflow from input to output

### Technical Implementation (15%)

- [ ] Multi-agent orchestration with GroupChatBuilder and round-robin speaker selection
- [ ] Triple termination condition logic prevents infinite loops
- [ ] Azure OpenAI + GitHub Copilot SDK hybrid agent architecture
- [ ] File Search integration for brand grounding
- [ ] MCP external tool integration (if time permits)
- [ ] Security compliance (DefaultAzureCredential, no secrets in repository)

---

## Notes

- **[P] tasks** = Can run in parallel (different files, no blocking dependencies)
- **[P3] tasks** = Bonus features (Priority P3) - Execute ONLY if ahead of schedule with 45+ minutes remaining
- **[Story] labels** = Map tasks to specific user stories for traceability
- **Absolute file paths**: All paths relative to hackathon-social-agents/ project root
- **100-minute constraint**: Phases 1-4 + 8 = MVP (75 min), Phases 5-7 optional if time permits
- **Bonus features (Phase 9)**: Observability (FR-029), Content Safety (FR-030), Agentic Evaluation (FR-031) - demonstrate production readiness
- **Zava Travel Inc. branding**: All content references budget-friendly adventure travel industry, "Wander More, Spend Less" campaign
- **Commit frequency**: Commit after each phase completion or logical group (e.g., after T010, T016, T037, T050, etc.)
- **Stop at checkpoints**: Validate functionality before proceeding to next phase
- **Priority order**: US1 (core) > US2 (reasoning) > US4 (grounding) > US3 (iteration) > US5 (tools) > BONUS (production features)

---

## Timeline Summary

| Phase | Time | Tasks | Purpose | Status |
|-------|------|-------|---------|--------|
| Phase 1: Setup | 00:00-00:20 (20 min) | T001-T010 | Environment, dependencies, security | ⏳ |
| Phase 2: Foundation | 00:20-00:30 (10 min) | T011-T016 | Orchestration skeleton | ⏳ |
| Phase 3: US1 (MVP) | 00:30-01:00 (30 min) | T017-T037 | Core multi-agent workflow | ⏳ |
| Phase 4: US2 | 01:00-01:10 (10 min) | T038-T050 | Reasoning visibility | ⏳ |
| Phase 5: US3 | 01:10-01:20 (10 min) | T051-T060 | Iterative refinement | Optional |
| Phase 6: US4 | 01:20-01:30 (10 min) | T061-T074 | Brand grounding (Zava Travel) | Recommended |
| Phase 7: US5 | 01:30-01:35 (5 min) | T075-T090 | External tools | Optional |
| **Phase 9: Bonus (P3)** | **(IF 45+ min remain)** | **T112-T145** | **Observability, Safety, Evaluation** | **OPTIONAL** |
| Phase 8: Documentation | 01:35-01:40 (5 min) | T091-T111 | README, security, demo | ⏳ |
| **Total (Core)** | **100 minutes** | **111 tasks** | **Complete system** | |
| **Total (w/ Bonus)** | **145-160 minutes** | **145 tasks** | **Production-ready** | |

**Recommended Execution**: Phases 1-4 + Phase 6 + Phase 8 = 75 minutes (25-minute buffer for debugging/testing)

**Bonus Execution**: Only attempt Phase 9 if Phases 1-7 complete with 45+ minutes remaining; demonstrates production readiness and enterprise AI best practices

---

**Status Legend**:
- ⏳ = Not started
- 🚧 = In progress
- ✅ = Complete
- ⏭️ = Skipped (time constraint or deprioritized)

**End of tasks.md** - Ready for hackathon execution! 🚀
