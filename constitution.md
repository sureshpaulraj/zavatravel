# Project Constitution
**TechConnect Hackathon — Social Media Content Agent System**

---

## Project Identity

**Project Name**: Zava Travel Inc. — Multi-Agent Social Media Content Agent  
**Company**: Zava Travel Inc. (zavatravel.com)  
**Industry**: Travel — Budget-Friendly Adventure & Curated Itineraries  
**Track**: Reasoning Agents with Microsoft Foundry  
**Competition**: Agents League @ TechConnect  
**Repository**: agentsleague-techconnect-main  
**Primary Specification**: `specs/001-social-media-agents/spec.md`  
**Technical Reference**: `starter-kits/2-reasoning-agents/spec.md`

---

## Constitutional Metadata

| Field | Value |
|-------|-------|
| **Constitution Version** | 1.0.0 |
| **Ratification Date** | 2025-01-23 |
| **Last Amended Date** | 2025-01-23 |
| **Governance Model** | Hackathon Rapid Development |
| **Scope** | TechConnect Hackathon Submission (100-minute build constraint) |

---

## Core Mission

Build an **AI-powered social media content creation system** for **Zava Travel Inc.** using a multi-agent group chat workflow that assists the communication team in generating, reviewing, and finalizing platform-ready social media posts for LinkedIn, X/Twitter, and Instagram — targeting Millennials & Gen-Z adventure seekers with an adventurous & inspiring brand voice.

**Success Criteria**:
- ✅ Functional multi-agent collaboration (Creator → Reviewer → Publisher)
- ✅ Reasoning patterns demonstrated (Chain-of-Thought, ReAct, Self-Reflection)
- ✅ Grounded content via File Search or Bing Search
- ✅ External tool integration via MCP servers
- ✅ Security compliance (no credentials, PII, or confidential data in public repository)
- ✅ Submission meets judging criteria: Accuracy (25%), Reasoning (25%), Creativity (20%), UX (15%), Technical (15%)

---

## Principle I: Security-First Development

**Statement**: All code and artifacts in this public repository MUST be free of credentials, API keys, PII, customer data, and Microsoft Confidential information. Authentication MUST use secure, credential-free patterns.

### Non-Negotiable Rules

1. **No Hardcoded Secrets**: API keys, passwords, tokens, connection strings, or service principal credentials are PROHIBITED from being committed to version control.

2. **DefaultAzureCredential Pattern**: All Azure service authentication MUST use `DefaultAzureCredential` from `azure-identity` library for local development and managed identities for production.

3. **Environment Variables Only**: Configuration MUST be externalized via `.env` files (excluded via `.gitignore`) with `.env.sample` providing placeholder examples.

4. **Resource Name Parameterization**: Azure subscription IDs, tenant IDs, resource group names, and endpoint URLs MUST be parameterized and never hardcoded.

5. **Pre-Commit Security Scan**: Before every commit, developers MUST verify:
   - `.env` is in `.gitignore`
   - No secrets in code, config files, or screenshots
   - All endpoints are parameterized
   - No customer data or PII exists in test files

6. **Public Repository Awareness**: Every file committed MUST be suitable for public visibility. When in doubt, exclude it.

### Rationale

This is a **public repository** for a Microsoft hackathon. Security violations could lead to:
- Disqualification from the competition
- Credential compromise and unauthorized resource access
- Privacy violations (GDPR, CCPA)
- Breach of Microsoft confidentiality policies

**Compliance Check**: Before submission, run `git log --all --full-history --source --find-object` to verify no secrets were historically committed.

---

## Principle II: Multi-Agent Collaboration Architecture

**Statement**: The system MUST implement a multi-agent group chat pattern with distinct, specialized agents coordinated through an orchestrator following the round-robin speaker selection model.

### Non-Negotiable Rules

1. **Three Agent Roles**:
   - **Creator Agent** (Azure OpenAI): Content generation and iteration with Chain-of-Thought reasoning
   - **Reviewer Agent** (GitHub Copilot SDK): Quality review and brand alignment with ReAct pattern
   - **Publisher Agent** (Azure OpenAI): Platform-specific formatting and final polish with Self-Reflection

2. **Group Chat Orchestration**: Agents MUST interact via `GroupChatBuilder` from Microsoft Agent Framework with a defined speaker selection function (not ad-hoc message passing).

3. **Termination Conditions**: Workflow MUST terminate when:
   - Publisher has spoken (content finalized), OR
   - 5 rounds completed (prevents infinite loops), OR
   - Reviewer says "APPROVED" (fast-track to Publisher)

4. **Conversation Transparency**: Full agent conversation transcript MUST be preserved and visible in output for judging/debugging purposes.

5. **Agent Independence**: Each agent MUST have its own system instructions, reasoning pattern, and output constraints as defined in `spec.md` Section 3.

### Rationale

Multi-agent collaboration demonstrates:
- Separation of concerns (ideation vs. critique vs. production)
- Reasoning across multiple perspectives
- Real-world team workflow simulation
- Complexity expected by the "Reasoning Agents" track judging criteria

**Technical Debt Boundary**: Agent communication MUST NOT exceed 5 rounds; beyond this suggests poor termination logic requiring refactoring.

---

## Principle III: Reasoning-Driven Design

**Statement**: All agents MUST implement explicit reasoning patterns (Chain-of-Thought, ReAct, Self-Reflection) as defined in the specification. Reasoning steps MUST be visible in agent outputs.

### Non-Negotiable Rules

1. **Creator Agent — Chain-of-Thought**:
   - MUST follow 5-step reasoning: Identify objective → Consider audience → Draft hook → Build body → Close with CTA
   - Reasoning steps MUST appear in output (e.g., "Step 1: Identifying campaign objective...")

2. **Reviewer Agent — ReAct Pattern**:
   - MUST structure feedback as: Observation → Thought → Action → Result
   - MUST provide actionable improvements (not vague suggestions like "make it better")

3. **Publisher Agent — Self-Reflection**:
   - MUST validate its own output against platform constraints (character limits, hashtag counts, CTA presence)
   - Reflection checks MUST be documented (e.g., "✓ Under 280 chars for Twitter")

4. **Explicit Reasoning Visibility**: Reasoning steps MUST be preserved in conversation logs (not hidden in internal model reasoning tokens).

5. **Model Selection**: Agents MUST use reasoning-capable models (GPT-5.1, GPT-5.2, Claude Opus 4.5, or equivalent) deployed in Azure AI Foundry.

### Rationale

The "Reasoning Agents" track explicitly judges **Reasoning & Multi-step Thinking (25%)** of the total score. Without visible reasoning patterns, the project fails its primary category.

**Anti-Pattern Warning**: Avoid prompt patterns like "Just write a LinkedIn post" — this shows no reasoning process. Always include "Let's think step by step" or equivalent.

---

## Principle IV: Grounded & Extensible Agent Capabilities

**Statement**: Agents MUST be grounded in external knowledge sources and capable of invoking external tools. Content MUST NOT be generated purely from model training data.

### Non-Negotiable Rules

1. **Grounding Requirement**: At least ONE of the following MUST be implemented:
   - **File Search**: Brand guidelines document (Word/PDF) indexed for retrieval
   - **Bing Search**: Web research for trending topics or competitor analysis
   - **Custom Knowledge Base**: Synthetic dataset created with M365 Copilot

2. **MCP Server Integration**: At least ONE external tool integration via Model Context Protocol (MCP) MUST be implemented, such as:
   - [Microsoft Learn MCP Server](https://github.com/microsoftdocs/mcp) for tech industry grounding
   - [Filesystem MCP Server](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem) for saving drafts locally
   - Custom MCP server for social media scheduling APIs (e.g., LinkedIn API)

3. **Tool Invocation Visibility**: When agents call external tools, the tool name and result summary MUST be logged in the conversation transcript.

4. **Fallback Handling**: If a grounding source or tool fails (e.g., Bing API timeout), agent MUST degrade gracefully and acknowledge the limitation rather than hallucinating.

5. **No Hallucination Tolerance**: If an agent makes a factual claim (e.g., "This product was launched in 2023"), it MUST be grounded in retrieved data or acknowledged as speculative.

### Rationale

The judging criterion **Accuracy & Relevance (25%)** penalizes unsupported claims. Grounding demonstrates:
- Integration with Azure AI Foundry's retrieval capabilities
- Real-world applicability (agents need data beyond training cutoffs)
- Technical sophistication (MCP integration shows ecosystem understanding)

**Milestone Dependency**: This principle aligns with Hackathon Milestones 3 (grounding) and 4 (external tools) from `spec.md`.

---

## Principle V: Hackathon-Ready Execution

**Statement**: Given the 100-minute time constraint, the project MUST prioritize working prototypes over production-ready perfection. Code quality MUST be sufficient for demonstration and judging, not enterprise deployment.

### Non-Negotiable Rules

1. **Scope Limitation**: The system MUST support:
   - Three platforms (LinkedIn, X/Twitter, Instagram)
   - One campaign brief input format
   - One industry/brand vertical (chosen by team)
   - No user authentication or multi-user support required

2. **Starter Code Adaptation**: The project MUST build upon the `workflow_groupchat.py` starter code from [aiagent-maf-githubcopilotsdk](https://github.com/sureshpaulraj/aiagent-maf-githubcopilotsdk), not rewrite from scratch.

3. **Synthetic Data Preference**: For grounding, PREFER creating a synthetic brand guidelines document with M365 Copilot over integrating real APIs that require authentication setup.

4. **Error Handling**: Basic error handling (try/catch for API calls) is REQUIRED, but comprehensive retry logic and observability are OPTIONAL (bonus points).

5. **Documentation Minimum**: README MUST include:
   - Setup instructions (prerequisite software, environment variables)
   - How to run the workflow
   - Example campaign brief input
   - Screenshot or demo video of output

6. **Submission Deadline**: Code freeze at 100 minutes; use remaining time for documentation and demo preparation, not feature additions.

### Rationale

Hackathon judging values **working demonstrations** over architectural purity. The rubric rewards:
- **User Experience (15%)**: Clear documentation and demo
- **Technical Implementation (15%)**: Solid patterns, not over-engineering

**Time Allocation Guidance**:
- Minutes 0-20: Environment setup and model deployment
- Minutes 20-50: Agent creation and reasoning patterns
- Minutes 50-80: Grounding and tool integration
- Minutes 80-100: Testing, documentation, and demo preparation

---

## Governance & Compliance

### Amendment Process

This constitution may be amended under the following conditions:

1. **Pre-Hackathon Amendments** (Before competition start):
   - Changes to project scope, technology choices, or team structure
   - Requires team consensus and update to `spec.md` reference

2. **During-Hackathon Amendments** (Within 100-minute window):
   - Scope reductions (e.g., removing Instagram support to prioritize LinkedIn/Twitter)
   - Allowed only if original scope proves infeasible
   - MUST NOT violate security principles (Principle I)

3. **Post-Hackathon Amendments** (After submission, before judging):
   - PROHIBITED — project is frozen at submission time
   - Exceptions: Security fixes (secret removal) if discovered post-submission

### Version Semantics

- **MAJOR** (X.0.0): Backward incompatible changes (e.g., removing a principle, changing agent architecture)
- **MINOR** (1.X.0): Adding principles, expanding scope, new capabilities
- **PATCH** (1.0.X): Clarifications, typo fixes, non-semantic refinements

### Compliance Verification

Before submission, the following checklist MUST be completed:

- [ ] **Security Audit**: No secrets in `git log --all` history
- [ ] **Principle I Compliance**: `.env.sample` exists, `.env` is gitignored, `DefaultAzureCredential` used
- [ ] **Principle II Compliance**: Three agents implemented, group chat orchestrator configured
- [ ] **Principle III Compliance**: Reasoning patterns visible in output logs
- [ ] **Principle IV Compliance**: At least one grounding source + one MCP tool integrated
- [ ] **Principle V Compliance**: README includes setup, run instructions, and demo

**Review Cadence**: Continuous during development; formal check at minute 90 before final submission.

### Escalation Path

If a principle conflict arises (e.g., time constraint vs. security requirement):

1. **Security principles (I) always take precedence** — never compromise security for speed
2. **Reasoning principles (II, III) are next priority** — they define the track's core criteria
3. **Grounding/tooling (IV) can be minimized** — one source + one tool is sufficient
4. **Documentation (V) is last resort cut** — but submission requires a demo

**Decision Authority**: Team consensus; if tied, defer to security-first interpretation.

---

## Template Alignment

This constitution governs the following project artifacts:

### Primary Specification
- **File**: `starter-kits/2-reasoning-agents/spec.md`
- **Role**: Authoritative technical specification for agent architecture, workflow, and judging criteria
- **Sync Status**: ✅ Constitution derived from spec v1.0

### README Documentation
- **Files**: `README.md`, `starter-kits/2-reasoning-agents/README.md`
- **Role**: Hackathon rules, security guidelines, resource links
- **Sync Status**: ✅ Security principles aligned with DISCLAIMER.md requirements

### Project Templates (if applicable)
- **`.specify/templates/spec-template.md`**: Feature specification template
- **`.specify/templates/plan-template.md`**: Implementation planning template
- **`.specify/templates/tasks-template.md`**: Task breakdown template
- **Status**: Not yet initialized (project in initial setup phase)
- **Action Required**: If project adopts SpecKit workflow post-hackathon, templates should inherit principles from this constitution

---

## Sync Impact Report

<!-- Constitution Creation Report -->
**Action**: Initial constitution creation  
**Version**: 1.0.0 (initial ratification)  
**Date**: 2025-01-23  

**Principles Established**:
1. Security-First Development
2. Multi-Agent Collaboration Architecture
3. Reasoning-Driven Design
4. Grounded & Extensible Agent Capabilities
5. Hackathon-Ready Execution

**Dependencies**:
- Primary specification: `starter-kits/2-reasoning-agents/spec.md` (aligned)
- Security guidelines: `DISCLAIMER.md` (referenced)
- Starter code: `workflow_groupchat.py` from aiagent-maf-githubcopilotsdk (external)

**Follow-Up Actions**:
- [ ] Create `.env.sample` with placeholder values for Azure endpoints
- [ ] Initialize `.specify/` directory if adopting SpecKit workflow (optional)
- [ ] Create brand guidelines document for File Search grounding (Milestone 3)
- [ ] Identify MCP server for external tool integration (Milestone 4)

**No Deferred Placeholders**: All constitutional fields populated with project-specific values.

---

## Appendix: Key References

### Hackathon Resources
- **Competition**: [TechConnect Agents League](https://github.com/microsoft/agentsleague-techconnect)
- **Track Details**: Reasoning Agents with Microsoft Foundry
- **Starter Code**: [aiagent-maf-githubcopilotsdk](https://github.com/sureshpaulraj/aiagent-maf-githubcopilotsdk)
- **Documentation**: [Microsoft Foundry Agents Overview](https://learn.microsoft.com/azure/ai-foundry/agents/overview)

### Technology Stack
- **Orchestration**: Microsoft Agent Framework (`agent-framework`, `agent-framework-azure`)
- **Creator/Publisher**: Azure OpenAI via `AzureOpenAIChatClient`
- **Reviewer**: GitHub Copilot SDK via `GitHubCopilotAgent`
- **Authentication**: `azure-identity` (`DefaultAzureCredential`)
- **Configuration**: `python-dotenv`
- **MCP Integration**: Model Context Protocol servers

### Judging Rubric
| Criterion | Weight | Alignment |
|-----------|--------|-----------|
| Accuracy & Relevance | 25% | Principle IV (Grounded & Extensible) |
| Reasoning & Multi-step Thinking | 25% | Principle III (Reasoning-Driven Design) |
| Creativity & Originality | 20% | Principle II (Multi-Agent Collaboration) |
| User Experience & Presentation | 15% | Principle V (Documentation & Demo) |
| Technical Implementation | 15% | Principles II & IV (Architecture & Tools) |

---

**Constitution Status**: ✅ RATIFIED  
**Next Review**: Post-hackathon retrospective (if project continues beyond competition)  
**Maintainer**: TechConnect Hackathon Team

*This constitution serves as the governing document for the Social Media Content Agent project, ensuring alignment with hackathon requirements, security standards, and judging criteria.*
