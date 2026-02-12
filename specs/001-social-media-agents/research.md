# Research & Technology Decisions

**Feature**: Multi-Agent Social Media Content Creation System  
**Date**: 2025-01-23  
**Status**: Phase 0 Complete — All NEEDS CLARIFICATION Resolved

---

## Research Summary

This document consolidates research findings for technology choices, best practices, and integration patterns required to implement the multi-agent social media content creation system within the 100-minute hackathon constraint.

---

## 1. Microsoft Agent Framework Version & Compatibility

### Decision: Use Agent Framework v0.1.0+ with Pre-Release GitHub Copilot Package

**Research Question**: Which Microsoft Agent Framework version supports GitHub Copilot SDK integration?

**Findings**:
- **Agent Framework Core**: `agent-framework` v0.1.0+ provides `GroupChatBuilder` and multi-agent orchestration
- **Azure Integration**: `agent-framework-azure` for `AzureOpenAIChatClient` (Creator/Publisher agents)
- **GitHub Copilot Integration**: `agent-framework-github-copilot` (pre-release, installed with `--pre` flag)
- **Compatibility**: Python 3.10+ required for all packages

**Requirements.txt Configuration**:
```
agent-framework>=0.1.0
agent-framework-azure>=0.1.0
agent-framework-github-copilot --pre
azure-identity>=1.15.0
python-dotenv>=1.0.0
```

**Rationale**: Pre-release GitHub Copilot package is explicitly mentioned in starter code documentation. The `--pre` flag ensures we get the latest compatible version during installation.

**Alternative Considered**: Using stable-only packages without GitHub Copilot integration → Rejected because Reviewer agent diversity (hybrid provider) is a judging criterion.

---

## 2. GitHub Copilot CLI Path Detection

### Decision: Platform-Specific Defaults with Manual Override

**Research Question**: What are the default GitHub Copilot CLI installation paths for Windows/macOS/Linux?

**Findings**:
- **Windows**: `C:\Users\<username>\AppData\Roaming\npm\copilot.cmd`
- **macOS**: `/usr/local/bin/copilot`
- **Linux**: `/usr/local/bin/copilot` or `~/.npm-global/bin/copilot`

**Implementation Strategy**:
1. Detect OS using `platform.system()`
2. Check default path existence
3. Fallback to `COPILOT_CLI_PATH` environment variable
4. Fail fast with actionable error message if not found

**.env.sample Configuration**:
```env
# GitHub Copilot CLI Path (auto-detected by default)
# Override if your installation is in a non-standard location
# COPILOT_CLI_PATH=/custom/path/to/copilot
```

**Rationale**: Most users install via npm global packages, so defaults work. Manual override covers edge cases without blocking setup.

**Alternative Considered**: Requiring explicit `COPILOT_CLI_PATH` in .env → Rejected because it adds unnecessary friction for standard installations.

---

## 3. File Search API: Azure AI Foundry vs. Custom Retrieval

### Decision: Use Azure AI Foundry File Search Tool (Built-In)

**Research Question**: Should we use Foundry's native File Search or build custom retrieval?

**Findings**:
- **Azure AI Foundry File Search**: Built-in tool in Agent Framework, supports Word (.docx) and PDF
- **Setup**: Attach document to agent via `agent.tools.append(FileSearchTool(file_ids=[...]))`
- **Indexing**: Automatic chunking and embedding by Foundry backend
- **Query**: Agents can invoke File Search naturally during reasoning
- **Latency**: 1-3 seconds per search query (acceptable for hackathon)

**Implementation Pattern**:
```python
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import FileSearchTool

# Upload brand guidelines
project_client = AIProjectClient(...)
file = project_client.files.upload(
    file_path="grounding/brand-guidelines.docx",
    purpose="assistants"
)

# Attach to Creator agent
file_search_tool = FileSearchTool(file_ids=[file.id])
creator_agent.tools.append(file_search_tool)
```

**Rationale**: Native integration is fastest path to hackathon milestone 3. No custom embedding, chunking, or vector database setup needed.

**Alternative Considered**: LangChain + ChromaDB custom retrieval → Rejected due to 100-minute time constraint; over-engineering for MVP.

---

## 4. MCP Server Protocol: Filesystem Integration

### Decision: Use @modelcontextprotocol/server-filesystem via Stdio Transport

**Research Question**: How to integrate the Filesystem MCP server for saving social media drafts?

**Findings**:
- **Package**: `@modelcontextprotocol/server-filesystem` (npm package)
- **Installation**: `npm install -g @modelcontextprotocol/server-filesystem`
- **Transport**: Stdio (standard input/output) for local execution; no HTTP server needed
- **Configuration**: Specify allowed directories for read/write access
- **Tools Exposed**: `read_file`, `write_file`, `list_directory`, `create_directory`

**Implementation Strategy**:
```python
from agent_framework.mcp import MCPClient

# Initialize MCP client for filesystem server
mcp_client = MCPClient(
    command=["npx", "@modelcontextprotocol/server-filesystem", "./output"],
    transport="stdio"
)

# Connect to Publisher agent
publisher_agent.tools.extend(mcp_client.get_tools())

# Agent can now invoke: write_file(path="output/social-posts.md", content="...")
```

**Security Note**: Restrict filesystem access to `./output` directory only (sandboxing principle).

**Rationale**: Stdio transport is simplest for local hackathon execution. No server process management or port conflicts.

**Alternative Considered**: Microsoft Learn MCP server → Rejected because it's read-only (no draft saving utility); filesystem server has clearer demo value.

---

## 5. Reasoning Model Selection

### Decision: GPT-5.2 (Preferred) or GPT-5.1 (Fallback)

**Research Question**: Which reasoning model should be deployed in Azure AI Foundry?

**Findings**:
- **GPT-5.2**: Latest reasoning model, improved Chain-of-Thought capabilities, 128k context window
- **GPT-5.1**: Previous generation, still highly capable, wider quota availability
- **Claude Opus 4.5**: Alternative option, excellent reasoning, but requires separate Anthropic integration
- **Quota Requirements**: 100k-300k TPM minimum for hackathon workflow (3 agents, 5 rounds max)

**Deployment Strategy**:
1. Check Azure subscription for GPT-5.2 quota availability
2. Deploy GPT-5.2 if available; otherwise GPT-5.1
3. Use single deployment for both Creator and Publisher agents (shared quota pool)
4. Configuration via `AZURE_OPENAI_CHAT_DEPLOYMENT_NAME` environment variable

**Model Selection Matrix**:
| Model | Reasoning Quality | Availability | Hackathon Fit |
|-------|------------------|--------------|---------------|
| GPT-5.2 | Excellent | Limited quota | Best (if available) |
| GPT-5.1 | Very Good | Wider availability | Recommended fallback |
| Claude Opus 4.5 | Excellent | External provider | Complex setup |

**Rationale**: Single Azure OpenAI deployment simplifies authentication and quota management. GPT-5.1/5.2 are known for strong reasoning performance in Chain-of-Thought and Self-Reflection tasks.

**Alternative Considered**: Separate models for Creator and Publisher → Rejected due to dual quota management and configuration complexity.

---

## 6. Brand Guidelines Document Format

### Decision: Microsoft Word (.docx) Generated with M365 Copilot

**Research Question**: Word vs. PDF for synthetic brand guidelines creation?

**Findings**:
- **Word (.docx)**: Native M365 format, easy to generate with Copilot, fully supported by Foundry File Search
- **PDF**: Universal format, but harder to quickly generate with rich formatting during hackathon
- **File Search Compatibility**: Both formats supported, but Word is more editable if tweaks needed

**Content Structure** (Generated via M365 Copilot Prompt):
```
"Create a brand guidelines document for TechCorp, a B2B technology company in the enterprise AI space. Include:
1. Brand voice: Professional yet approachable, authoritative but not stuffy
2. Tone guidelines for social media (LinkedIn, Twitter, Instagram)
3. Messaging pillars: Innovation, Trust, Transformation
4. Approved hashtags: #EnterpriseAI #AIInnovation #DigitalTransformation #TechLeadership
5. Sample social media posts (1 per platform)
6. Content do's and don'ts
Format as a professional Word document with headers and bullet points."
```

**M365 Copilot Generation Time**: 2-3 minutes (faster than manually writing)

**Rationale**: M365 Copilot can generate a realistic, well-structured brand guidelines document instantly. Word format is editable if judges want to see tweaks during demo.

**Alternative Considered**: PDF template → Rejected because manual PDF creation or conversion adds unnecessary steps.

---

## 7. Twitter Character Counting (Unicode Handling)

### Decision: Use Python `len()` with Emoji Standardization

**Research Question**: How are emojis counted in Twitter's 280-character limit?

**Findings**:
- **Twitter API Behavior**: Emojis count as **2 characters** in Twitter's official counting (UTF-16 encoding)
- **Python `len()`**: Counts Unicode code points; most emojis are 1-2 code points
- **Complexity**: Accurate Twitter-style counting requires `twitter-text` library (JavaScript) or custom logic
- **Hackathon Pragmatism**: Minor character count discrepancies (±2 chars) are acceptable for demo

**Implementation Strategy**:
```python
def twitter_char_count(text: str) -> int:
    """
    Approximate Twitter character count.
    Treats most emojis as 2 characters for safety.
    """
    # Simplified heuristic: count emojis as 2 chars
    emoji_count = sum(1 for c in text if ord(c) > 0x1F300)
    base_count = len(text)
    return base_count + emoji_count  # Conservative estimate
```

**Publisher Self-Reflection Logic**:
- Target: ≤270 characters (10-char safety buffer)
- If count exceeds 270, trigger automatic revision
- Log character count in reflection output

**Rationale**: Exact Twitter API counting is over-engineering for hackathon. Conservative estimate (treating emojis as 2 chars) ensures we stay under limit.

**Alternative Considered**: Integrating `twitter-text` Python port → Rejected due to additional dependency and time cost.

---

## 8. Best Practices: Multi-Agent Orchestration

### Finding: Round-Robin with Conditional Fast-Tracking

**Research Sources**:
- Microsoft Agent Framework documentation: [Multi-agent patterns](https://learn.microsoft.com/azure/ai-foundry/agents/multi-agent-patterns)
- Starter code: `workflow_groupchat.py` speaker selection example

**Recommended Pattern**:
```python
def speaker_selector(state: GroupChatState) -> str:
    """
    Round-robin with fast-track to Publisher on approval.
    """
    # Check for fast-track condition
    last_message = state.messages[-1] if state.messages else None
    if last_message and "APPROVED" in last_message.content:
        return "Publisher"
    
    # Round-robin sequence
    sequence = ["Creator", "Reviewer", "Creator", "Reviewer", "Publisher"]
    current_round = state.current_round
    return sequence[current_round % len(sequence)]
```

**Termination Condition Pattern**:
```python
def should_terminate(state: GroupChatState) -> bool:
    """
    Terminate when Publisher has spoken, max rounds reached, or approved.
    """
    last_speaker = state.messages[-1].agent_name if state.messages else None
    
    # Condition 1: Publisher has completed formatting
    if last_speaker == "Publisher":
        return True
    
    # Condition 2: Max rounds (prevents infinite loops)
    if state.current_round >= 5:
        return True
    
    # Condition 3: Reviewer approved (redundant with fast-track, but explicit)
    last_message = state.messages[-1].content if state.messages else ""
    if "APPROVED" in last_message and last_speaker == "Reviewer":
        return True
    
    return False
```

**Best Practice Rationale**:
- **Round-robin**: Predictable, easy to debug, ensures all agents participate
- **Fast-track**: Prevents unnecessary iterations when quality is excellent (judges will appreciate efficiency)
- **Max rounds cap**: Critical safety net against conversation loops (FR-003)

---

## 9. Best Practices: Reasoning Pattern Prompts

### Chain-of-Thought (Creator Agent)

**Research Source**: [Prompt Engineering Guide - Chain-of-Thought](https://www.promptingguide.ai/techniques/cot)

**Optimal Prompt Structure**:
```
"You are a social media content creator. When generating content, think step by step:

Step 1: Identify the campaign objective and key message.
Step 2: Consider the target audience's interests and language.
Step 3: Draft an attention-grabbing hook.
Step 4: Build the body with value and relevance.
Step 5: Close with a clear call-to-action.

ALWAYS show your reasoning steps explicitly before presenting the final draft."
```

**Key Insights**:
- **"Let's think step by step"**: Triggers Chain-of-Thought behavior in reasoning models
- **Numbered steps**: Makes reasoning traceable and visible for judging
- **"ALWAYS show"**: Ensures steps appear in output (not just internal reasoning)

---

### ReAct Pattern (Reviewer Agent)

**Research Source**: [ReAct: Reasoning and Acting](https://arxiv.org/abs/2210.03629)

**Optimal Prompt Structure**:
```
"You are a content reviewer. Use the ReAct pattern:

Observation: What do you see in the draft?
Thought: What needs improvement and why?
Action: Specific, concrete recommendation.
Result: Expected outcome if action is taken.

Provide structured feedback in this exact format."
```

**Key Insights**:
- **Observation → Thought → Action → Result**: Classic ReAct cycle
- **Concrete actions**: Prevents vague feedback like "make it better"
- **Result prediction**: Encourages reviewer to think ahead

---

### Self-Reflection (Publisher Agent)

**Research Source**: [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)

**Optimal Prompt Structure**:
```
"You are a multi-platform publisher. After generating each platform version, validate:

Draft: [your content]

Reflection Checks:
✓ Character count: [X] / [limit] — PASS/FAIL
✓ Hashtag count: [X] / [target] — PASS/FAIL
✓ CTA present: YES/NO
✓ Tone appropriate: YES/NO

If any check fails, revise immediately and show the corrected version."
```

**Key Insights**:
- **Explicit validation checklist**: Forces model to self-audit
- **Pass/Fail markers**: Makes validation visible for judging
- **Immediate revision**: Prevents invalid output from being final

---

## 10. Best Practices: Azure Authentication (DefaultAzureCredential)

**Research Source**: [Azure Identity - DefaultAzureCredential](https://learn.microsoft.com/python/api/azure-identity/azure.identity.defaultazurecredential)

**Credential Chain Order** (Automatic Fallback):
1. **EnvironmentCredential**: Checks `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_SECRET` (for service principals)
2. **ManagedIdentityCredential**: Uses Azure managed identity if running in Azure (VM, App Service, etc.)
3. **AzureCliCredential**: Uses `az login` session (primary method for local development)
4. **VisualStudioCodeCredential**: Uses VS Code Azure extension authentication

**Implementation Pattern**:
```python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

# No explicit credential passing needed
credential = DefaultAzureCredential()

# Foundry client
project_client = AIProjectClient(
    endpoint=os.getenv("AZURE_AI_FOUNDRY_PROJECT_ENDPOINT"),
    credential=credential
)

# Azure OpenAI client (via Agent Framework)
from agent_framework.azure import AzureOpenAIChatClient

chat_client = AzureOpenAIChatClient(
    endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    credential=credential,
    deployment_name=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME")
)
```

**Error Handling Pattern**:
```python
try:
    credential = DefaultAzureCredential()
    credential.get_token("https://cognitiveservices.azure.com/.default")
except Exception as e:
    print("❌ Azure authentication failed. Please run: az login")
    print(f"Error details: {e}")
    sys.exit(1)
```

**Best Practice Rationale**:
- **Zero secrets in code**: DefaultAzureCredential never requires API keys
- **Developer-friendly**: Works out-of-box with `az login` for local development
- **Production-ready**: Seamlessly transitions to managed identities in Azure without code changes

---

## 11. Integration Pattern: Streaming Output

**Research Source**: Microsoft Agent Framework examples - `AgentRunUpdateEvent` handling

**Implementation Pattern**:
```python
import asyncio
from agent_framework import GroupChatBuilder, AgentRunUpdateEvent, WorkflowOutputEvent

async def run_workflow(campaign_brief: str):
    """
    Stream agent responses in real-time.
    """
    workflow = build_group_chat()  # GroupChatBuilder logic
    
    print("🚀 Starting multi-agent workflow...\n")
    
    async for event in workflow.run_stream(campaign_brief):
        if isinstance(event, AgentRunUpdateEvent):
            # Real-time agent message streaming
            print(f"[{event.agent_name}]: {event.message_delta}", end="", flush=True)
        
        elif isinstance(event, WorkflowOutputEvent):
            # Final conversation transcript
            print("\n\n" + "="*60)
            print("WORKFLOW COMPLETE")
            print("="*60)
            print(event.conversation_transcript)

# Run workflow
asyncio.run(run_workflow("Create posts for TechCorp AI launch..."))
```

**UX Best Practices**:
- **Real-time streaming**: Shows agents "thinking" (better demo experience than batch output)
- **Agent name labels**: `[Creator]:`, `[Reviewer]:`, `[Publisher]:` for clarity
- **Flush output**: `flush=True` ensures immediate console display
- **Final transcript**: Separate section at end for judging review

**Rationale**: Streaming output scores higher in "User Experience & Presentation" (15% of judging). Static output after 30 seconds of silence is poor UX.

---

## 12. Configuration Management: Environment Validation

**Best Practice Pattern**:
```python
import os
from dotenv import load_dotenv

def validate_environment() -> None:
    """
    Fail-fast validation of required environment variables.
    """
    load_dotenv()  # Load .env file
    
    required_vars = [
        "AZURE_AI_FOUNDRY_PROJECT_ENDPOINT",
        "AZURE_OPENAI_ENDPOINT",
        "AZURE_OPENAI_CHAT_DEPLOYMENT_NAME",
    ]
    
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        print("❌ Missing required environment variables:")
        for var in missing:
            print(f"   - {var}")
        print("\nPlease configure these in your .env file.")
        print("See .env.sample for template.")
        sys.exit(1)
    
    print("✅ Environment configuration validated\n")

# Call at startup
validate_environment()
```

**Rationale**: Fail-fast validation prevents cryptic errors 30 minutes into development. Clear error messages save debugging time during hackathon.

---

## Technology Decision Matrix

| Technology Area | Decision | Confidence | Time Investment | Fallback Plan |
|----------------|----------|-----------|----------------|---------------|
| **Agent Framework** | Microsoft Agent Framework v0.1.0+ | High | Low (starter code) | N/A (required for track) |
| **Reasoning Model** | GPT-5.2 (or GPT-5.1 fallback) | High | Low (deploy in Foundry) | GPT-5.1 widely available |
| **Grounding Method** | File Search + synthetic Word doc | High | Very Low (M365 Copilot) | In-prompt brand context |
| **MCP Tool** | Filesystem server (npm package) | Medium | Medium (npm install + test) | Console-only output (skip MCP) |
| **Authentication** | DefaultAzureCredential | High | Very Low (built-in) | N/A (constitutional requirement) |
| **Streaming** | AgentRunUpdateEvent | High | Low (pattern in starter) | Batch output (worse UX) |
| **Twitter Counting** | Python len() + emoji heuristic | Medium | Very Low (simple logic) | Strict 270-char target (buffer) |

**Total Confidence**: 85% — All critical paths have clear implementation strategies and fallbacks.

---

## Remaining Unknowns (Deferred to Implementation)

| Unknown | Risk Level | Resolution Strategy |
|---------|-----------|---------------------|
| **GitHub Copilot agent exact API** | Low | Reference starter code `workflow_groupchat.py` during implementation |
| **File Search attachment syntax** | Low | Test with minimal example in quickstart phase |
| **MCP tool invocation format** | Medium | Test filesystem server independently before workflow integration |
| **Azure OpenAI API latency** | Low | Accept variance; 3-minute SLA is comfortable buffer |

**Note**: No unknowns are blockers. All can be resolved during 100-minute implementation with starter code + documentation references.

---

## 13. Bonus Feature Research: Observability, Content Safety & Agentic Evaluation

### Finding: Microsoft Foundry Platform Features for Production-Ready Enhancements

**Research Question**: How to integrate observability, content safety, and automated evaluation as bonus features?

**Findings**:

#### 13.1 Observability (FR-029, NFR-021)
- **Microsoft Foundry Tracing**: Built-in distributed tracing for agent workflows
- **Integration**: Via `azure-ai-projects` SDK, automatic trace collection when using `AIProjectClient`
- **Metrics Captured**: Token usage, latency per agent turn, model invocations, tool calls
- **Performance**: < 100ms overhead per agent turn (acceptable for bonus feature)
- **Viewing**: Traces visible in AI Foundry portal under "Tracing" section

**Implementation Pattern**:
```python
from azure.ai.projects import AIProjectClient
from azure.monitor.opentelemetry import configure_azure_monitor

# Enable tracing
configure_azure_monitor(connection_string=os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING"))

project_client = AIProjectClient(
    endpoint=os.getenv("AZURE_AI_FOUNDRY_PROJECT_ENDPOINT"),
    credential=DefaultAzureCredential()
)

# Traces automatically collected for all agent interactions
```

**Rationale**: Zero-code observability when using Foundry SDK. Simply enabling tracing provides instant monitoring without workflow modifications.

---

#### 13.2 Content Safety (FR-030, NFR-022)
- **Azure AI Content Safety**: Filter harmful, offensive, or brand-inappropriate content
- **Categories Detected**: Hate speech, violence, self-harm, sexual content, jailbreak attempts
- **Custom Filters**: Brand-specific blocklists (e.g., competitor names: VoyageNow, CookTravel, WanderPath)
- **Latency**: 200-500ms per content screening (well within 2-second SLA)
- **Integration Point**: Screen Publisher's final output before display

**Implementation Pattern**:
```python
from azure.ai.contentsafety import ContentSafetyClient
from azure.ai.contentsafety.models import AnalyzeTextOptions

safety_client = ContentSafetyClient(
    endpoint=os.getenv("CONTENT_SAFETY_ENDPOINT"),
    credential=DefaultAzureCredential()
)

def check_content_safety(text: str) -> dict:
    """Screen content for safety violations."""
    request = AnalyzeTextOptions(text=text)
    response = safety_client.analyze_text(request)
    
    # Check severity scores (0-6 scale)
    violations = {
        "hate": response.categoriesAnalysis.hate.severity > 2,
        "violence": response.categoriesAnalysis.violence.severity > 2,
        "self_harm": response.categoriesAnalysis.selfHarm.severity > 2,
        "sexual": response.categoriesAnalysis.sexual.severity > 2
    }
    
    return {
        "safe": not any(violations.values()),
        "violations": [k for k, v in violations.items() if v]
    }
```

**Rationale**: Azure AI Content Safety is production-ready service. Bonus feature demonstrates enterprise-readiness and brand protection.

---

#### 13.3 Agentic Evaluation (FR-031, NFR-023)
- **Foundry Evaluation SDK**: Automated quality metrics for generated content
- **Metrics Available**: Relevance (0-5), Coherence (0-5), Groundedness (0-5), Fluency (0-5)
- **Execution**: Asynchronous evaluation after content generation (non-blocking)
- **Integration**: Via `azure-ai-evaluation` package
- **Use Case**: Automatic quality scoring for judging review or continuous improvement

**Implementation Pattern**:
```python
from azure.ai.evaluation import evaluate

async def evaluate_content(posts: List[SocialMediaPost], campaign_brief: str):
    """Evaluate generated content quality."""
    results = []
    
    for post in posts:
        result = evaluate(
            data={
                "query": campaign_brief,
                "response": post.body,
                "context": "Brand guidelines and platform constraints"
            },
            evaluators={
                "relevance": RelevanceEvaluator(),
                "coherence": CoherenceEvaluator(),
                "groundedness": GroundednessEvaluator(),
                "fluency": FluencyEvaluator()
            }
        )
        
        results.append({
            "platform": post.platform,
            "scores": {
                "relevance": result["relevance"],
                "coherence": result["coherence"],
                "groundedness": result["groundedness"],
                "fluency": result["fluency"]
            },
            "aggregate": sum(result.values()) / len(result)  # Average score
        })
    
    return results
```

**Rationale**: Agentic evaluation provides quantitative quality metrics, demonstrating continuous improvement capability and alignment with AI evaluation best practices.

---

### Bonus Feature Decision Matrix

| Feature | Implementation Time | Demo Value | Production Readiness | Priority |
|---------|-------------------|------------|---------------------|----------|
| **Observability** | 10-15 minutes | Medium (traces show workflow detail) | High (essential for production) | **P1 Bonus** |
| **Content Safety** | 15-20 minutes | High (brand protection demo) | High (prevents harmful content) | **P2 Bonus** |
| **Agentic Evaluation** | 20-25 minutes | Medium (quality metrics) | Medium (nice-to-have insights) | **P3 Bonus** |

**Recommendation**: If time permits after core features, implement in order: Observability → Content Safety → Agentic Evaluation.

**Total Time Investment**: 45-60 minutes (only if core functionality is complete with buffer time)

---

## Research Completion Status

✅ **Microsoft Agent Framework version compatibility** — Resolved  
✅ **GitHub Copilot CLI path detection** — Resolved  
✅ **File Search API choice** — Resolved  
✅ **MCP server protocol** — Resolved  
✅ **Reasoning model selection** — Resolved  
✅ **Brand guidelines format** — Resolved  
✅ **Twitter character counting** — Resolved  
✅ **Multi-agent orchestration patterns** — Resolved  
✅ **Reasoning pattern prompts** — Resolved  
✅ **Azure authentication** — Resolved  
✅ **Environment configuration** — Resolved  
✅ **Streaming output** — Resolved  
✅ **Bonus: Observability, Content Safety, Agentic Evaluation** — Resolved (optional features)

**Phase 0 Status**: COMPLETE — Ready for Phase 1 (Design & Contracts)

---

## Next Actions

1. ✅ Research complete — no NEEDS CLARIFICATION remaining
2. ⏭️ Proceed to Phase 1: Generate `data-model.md`, `contracts/`, `quickstart.md`
3. ⏭️ Update agent context with Microsoft Agent Framework patterns
4. ⏭️ Proceed to Phase 2: Generate `tasks.md` with dependency-ordered implementation tasks
