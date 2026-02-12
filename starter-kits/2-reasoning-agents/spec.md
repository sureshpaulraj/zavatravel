# 🧠 Feature Spec: Zava Travel Inc. — Social Media Content Agent (Multi-Agent Group Chat)

## 1. Overview

**Track**: Reasoning Agents with Microsoft Foundry (Scenario #2)  
**Time Limit**: 100 minutes  
**Company**: Zava Travel Inc. (zavatravel.com)  
**Industry**: Travel — Budget-Friendly Adventure & Curated Itineraries  
**Starter Code**: [aiagent-maf-githubcopilotsdk](https://github.com/sureshpaulraj/aiagent-maf-githubcopilotsdk) — `workflow_groupchat.py`

### Objective

Build an AI-powered **social media content creation system** for **Zava Travel Inc.** using a multi-agent group chat workflow. The system assists Zava Travel's communication team in generating, reviewing, and finalizing social media posts for multiple platforms (LinkedIn, X/Twitter, Instagram) — targeting Millennials & Gen-Z adventure seekers with an adventurous & inspiring brand voice.

### Brand Profile

| Attribute | Value |
|-----------|-------|
| **Company** | Zava Travel Inc. |
| **Website** | zavatravel.com |
| **Offering** | Budget-friendly adventure travel & curated itineraries |
| **Audience** | Millennials & Gen-Z adventure seekers |
| **Tone** | Adventurous & Inspiring |
| **Brand Colors** | Teal/ocean blue + sunset orange |
| **Destinations** | Bali, Patagonia, Iceland, Vietnam, Costa Rica |
| **Hashtags** | #ZavaTravel #WanderMore #AdventureAwaits #TravelOnABudget |
| **Competitors** | VoyageNow, CookTravel, WanderPath (fictitious) |
| **Demo Campaign** | Summer adventure — "Wander More, Spend Less" |

### Key Value Proposition

Instead of a single prompt → response model, this system uses **three specialized agents** collaborating in a structured conversation — mirroring how real content teams work: a **Creator** drafts, a **Reviewer** critiques, and a **Publisher** polishes and formats for each platform.

---

## 2. Architecture

### Multi-Agent Group Chat Pattern

```
┌──────────────────────────────────────────────────────────┐
│                   ORCHESTRATOR                           │
│          (Round-Robin Speaker Selection)                 │
│                                                          │
│   Round 1: Creator → Round 2: Reviewer → Round 3: Creator│
│   Round 4: Reviewer → Round 5: Publisher                 │
└──────────────────────────────────────────────────────────┘
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   CREATOR    │  │   REVIEWER   │  │  PUBLISHER   │
│ (Azure AOAI) │  │ (GH Copilot) │  │ (Azure AOAI) │
│              │  │              │  │              │
│ • Ideation   │  │ • Brand      │  │ • Platform   │
│ • Drafting   │  │   alignment  │  │   formatting │
│ • Iteration  │  │ • Tone check │  │ • Hashtags   │
│              │  │ • Feedback   │  │ • Final copy │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Orchestration | Microsoft Agent Framework (`GroupChatBuilder`) | Multi-agent coordination |
| Creator Agent | Azure OpenAI via `AzureOpenAIChatClient` | Content generation & iteration |
| Reviewer Agent | GitHub Copilot SDK via `GitHubCopilotAgent` | Quality review & feedback |
| Publisher Agent | Azure OpenAI via `AzureOpenAIChatClient` | Platform-specific formatting |
| Authentication | `DefaultAzureCredential` + GitHub Copilot CLI | Secure credential management |
| Configuration | `python-dotenv` + `.env` | Environment-based config |

---

## 3. Agent Specifications

### 3.1 Creator Agent (Azure OpenAI)

**Role**: Social media content creator and copywriter  
**Model**: Reasoning-capable model deployed in Foundry (e.g., GPT-5.1, GPT-5.2)

**System Instructions**:
```
You are a creative social media content creator for Zava Travel Inc., a budget-friendly 
adventure travel company targeting Millennials & Gen-Z adventure seekers.

Your responsibilities:
- Generate engaging social media posts based on the given topic or campaign brief
- Tailor content to the brand voice: Adventurous & Inspiring
- Target audience: Millennials & Gen-Z who seek authentic, affordable travel experiences
- Highlight destinations like Bali, Patagonia, Iceland, Vietnam, Costa Rica
- Include calls-to-action (book now, explore itineraries, visit zavatravel.com)
- When you receive feedback from the Reviewer, incorporate it into an improved version
- Never mention competitors (VoyageNow, CookTravel, WanderPath) positively

Reasoning approach (Chain-of-Thought):
1. First, identify the campaign objective and key destination/message
2. Consider the audience's wanderlust, budget concerns, and adventure interests
3. Draft content with an attention-grabbing travel hook
4. Build the body with experiential value and destination highlights
5. Close with a clear call-to-action tied to zavatravel.com

Use approved hashtags: #ZavaTravel #WanderMore #AdventureAwaits #TravelOnABudget
Brand colors reference: teal/ocean blue + sunset orange
Keep each post draft under 150 words.
```

### 3.2 Reviewer Agent (GitHub Copilot)

**Role**: Content quality reviewer and brand alignment checker  
**Engine**: GitHub Copilot SDK

**System Instructions**:
```
You are a social media content reviewer and brand strategist for Zava Travel Inc.

Evaluate each post for:
- Brand voice consistency — Does it match Zava Travel's adventurous & inspiring tone?
- Platform appropriateness — Is the length, format, and style right for the target platform?
- Audience relevance — Will this resonate with Millennials & Gen-Z adventure seekers?
- Engagement potential — Does it have a travel hook, experiential value, and CTA?
- Factual accuracy — Are destination claims and pricing references substantiated?
- Competitor awareness — Ensure no positive mentions of VoyageNow, CookTravel, WanderPath

Provide structured feedback:
- STRENGTHS: What works well (1-2 points)
- IMPROVEMENTS: Specific, actionable changes (1-2 points)
- VERDICT: "REVISE" with reasoning, or "APPROVED" if ready for publishing

Keep feedback under 120 words.
```

### 3.3 Publisher Agent (Azure OpenAI)

**Role**: Final content polisher and multi-platform formatter  
**Model**: Same deployment as Creator

**System Instructions**:
```
You are a social media publisher for Zava Travel Inc. who creates the final, platform-ready versions.

Take the approved content and produce polished versions for:
- LinkedIn: Professional-adventurous tone, 1-3 paragraphs, 3-5 hashtags including #ZavaTravel
- X/Twitter: Concise (under 280 chars), punchy, 2-3 hashtags, link to zavatravel.com
- Instagram: Visual-friendly caption, travel emojis (✈️🌍🏔️🌅), 5-10 hashtags

For each platform version:
1. Adapt the tone and length appropriately
2. Add platform-specific formatting (hashtags, emojis, line breaks)
3. Include a suggested call-to-action (explore itineraries, book at zavatravel.com)
4. Note image/visual suggestions in [brackets] — e.g., [Hero shot: sunset over Bali rice terraces]
5. Reference brand colors (teal/ocean blue + sunset orange) for visual alignment

Use approved hashtags: #ZavaTravel #WanderMore #AdventureAwaits #TravelOnABudget
Keep total output under 300 words.
```

---

## 4. Workflow Logic

### Orchestration: Round-Robin with Termination

```python
def speaker_selector(state: GroupChatState) -> str:
    """Creator → Reviewer → Creator → Reviewer → Publisher"""
    order = ["Creator", "Reviewer", "Creator", "Reviewer", "Publisher"]
    return order[state.current_round % len(order)]
```

### Termination Conditions

The workflow terminates when:
1. The **Publisher** has spoken (content is finalized), OR
2. **5 rounds** have completed (prevents infinite loops), OR
3. The Reviewer says **"APPROVED"** (fast-track to Publisher)

### Input Format

The user provides a **campaign brief**:
```
Create social media content for Zava Travel's Summer Adventure Campaign.
Brand: Zava Travel Inc.
Industry: Travel — Budget-Friendly Adventure
Target Audience: Millennials & Gen-Z adventure seekers
Key Message: "Wander More, Spend Less" — affordable curated itineraries to dream destinations
Destinations: Bali, Patagonia, Iceland, Vietnam, Costa Rica
Platforms: LinkedIn, X/Twitter, Instagram
```

### Output Format

The system produces:
1. **Conversation transcript** — Full agent collaboration visible
2. **Final platform-ready posts** — Formatted for each social platform
3. **Review summary** — Key decisions and feedback incorporated

---

## 5. Grounding & Data Sources

### Option A: Synthetic Brand Guidelines (Recommended for Hackathon)

Create a Zava Travel Inc. brand guidelines document (Word/PDF) using Copilot/M365 and attach via **File Search**:
- Brand voice: Adventurous & Inspiring tone guide
- Visual identity: Teal/ocean blue + sunset orange palette
- Approved hashtags: #ZavaTravel #WanderMore #AdventureAwaits #TravelOnABudget
- Messaging pillars: affordable adventure, curated itineraries, authentic experiences
- Key destinations: Bali, Patagonia, Iceland, Vietnam, Costa Rica
- Competitor differentiation: VoyageNow, CookTravel, WanderPath (avoid positive mentions)
- Sample posts for reference

### Option B: Web-Based Research

Use **Bing Search tool** integration to:
- Research trending travel destinations and seasonal deals
- Analyze competitor social media strategies (Viator, Thomas Cook, Intrepid)
- Find relevant travel news and trending hashtags

### Option C: MCP Server Integration

Connect to external tools via MCP:
- [Microsoft Learn MCP Server](https://github.com/microsoftdocs/mcp) — for travel tech content grounding
- [Filesystem MCP Server](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem) — save Zava Travel content drafts locally

---

## 6. Reasoning Patterns

### Chain-of-Thought (Creator Agent)

The Creator uses step-by-step reasoning to generate content:
```
Step 1: Identify the campaign objective and key message
Step 2: Consider the target audience's interests and language
Step 3: Draft an attention-grabbing hook
Step 4: Build the body with value and relevance
Step 5: Close with a clear call-to-action
```

### ReAct Pattern (Reviewer Agent)

The Reviewer combines observation with action:
```
Observation: The draft mentions "cheap travel" which feels discount-bin rather than adventurous
Thought: Zava Travel's brand voice is "adventurous & inspiring" — budget-friendly should feel empowering
Action: Recommend replacing "cheap" with "budget-savvy" or "affordable adventure"
Result: Revised draft maintains aspirational tone while communicating value
```

### Self-Reflection (Publisher Agent)

The Publisher checks its own formatting:
```
Draft: [formatted post]
Check: Is this under 280 chars for Twitter? ✓
Check: Are hashtags relevant and not excessive? ✓
Check: Does the CTA match the campaign objective? ✓
Final: [polished post]
```

---

## 7. Hackathon Milestone Mapping

| Milestone | Deliverable | Status |
|-----------|-------------|--------|
| 1. Set up environment | Foundry project + model deployment + env config | Required |
| 2. Create your agent | 3 agents (Creator, Reviewer, Publisher) with instructions & reasoning | Required |
| 3. Add grounding knowledge | Brand guidelines via File Search or Bing Search | Required |
| 4. Add external tools | MCP server integration (Microsoft Learn, filesystem) | Required |

### Bonus Objectives

- **Observability**: Agent monitoring via Microsoft Foundry platform — tracing, logging, performance metrics (FR-029)
- **Content Safety & Guardrails**: Azure AI Content Safety integration — filter harmful/brand-inappropriate content (FR-030)
- **Agentic Evaluation**: Foundry Evaluation SDK — measure relevance, coherence, groundedness, fluency (FR-031)
- **Multi-agent extension**: Add a Scheduler agent for post timing optimization

---

## 8. Setup & Configuration

### Prerequisites

| Requirement | Details |
|-------------|---------|
| Python | 3.10+ |
| Azure Subscription | With reasoning model quota (100k–300k TPM) |
| Azure CLI | Authenticated (`az login`) |
| GitHub Copilot | CLI installed and authenticated |
| VS Code | Recommended editor |

### Environment Variables (`.env`)

```env
# Azure AI Foundry
AZURE_AI_FOUNDRY_PROJECT_ENDPOINT=https://<resource>.services.ai.azure.com/api/projects/<project>

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://<resource>.services.ai.azure.com
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=<your-reasoning-model>

# GitHub Copilot CLI
COPILOT_CLI_PATH=C:\Users\<username>\AppData\Roaming\npm\copilot.cmd
```

### Dependencies (`requirements.txt`)

```
agent-framework
agent-framework-azure
agent-framework-github-copilot --pre
azure-identity
python-dotenv
```

### Quick Start

```powershell
# 1. Clone the starter repo
git clone https://github.com/sureshpaulraj/aiagent-maf-githubcopilotsdk.git
cd aiagent-maf-githubcopilotsdk

# 2. Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
copy .env.sample .env
# Edit .env with your Azure and Copilot settings

# 5. Authenticate
az login
copilot  # then /login

# 6. Run the group chat workflow
python workflow_groupchat.py
```

---

## 9. Starter Code Reference

The `workflow_groupchat.py` in the starter repo demonstrates the exact pattern needed. To adapt it for the social media scenario:

1. **Rename agents**: Writer → Creator, Reviewer → Reviewer, Editor → Publisher
2. **Update instructions**: Replace marketing slogan instructions with social media content instructions (see Section 3)
3. **Customize the prompt**: Change from "Create a slogan for an eco-friendly electric vehicle" to a campaign brief format
4. **Add grounding**: Integrate File Search or Bing Search for brand context
5. **Add MCP tools**: Connect external data sources for enriched content

### Key Code Patterns from Starter

```python
# Group chat with round-robin orchestration
workflow = (
    GroupChatBuilder()
    .with_orchestrator(selection_func=speaker_selector)
    .participants([creator, reviewer, publisher])
    .with_termination_condition(termination_check)
    .build()
)

# Stream responses in real-time
async for event in workflow.run_stream(campaign_brief):
    # Handle AgentRunUpdateEvent for streaming text
    # Handle WorkflowOutputEvent for final conversation
```

---

## 10. Judging Criteria Alignment

| Criterion | Weight | How This Project Addresses It |
|-----------|--------|-------------------------------|
| **Accuracy** | 25% | Grounded content via File Search/Bing; factual review by Reviewer agent |
| **Reasoning** | 25% | Chain-of-Thought (Creator), ReAct (Reviewer), Self-Reflection (Publisher) |
| **Creativity** | 20% | Multi-platform adaptation; industry-specific voice; collaborative refinement |
| **User Experience** | 15% | Real-time streaming output; structured campaign brief input; platform-ready output |
| **Technical** | 15% | Multi-agent orchestration; GitHub Copilot + Azure AOAI; MCP integration |

---

## 11. Security Compliance

- ✅ No hardcoded API keys — uses `DefaultAzureCredential` and `.env`
- ✅ No PII or customer data — uses synthetic brand data
- ✅ No Microsoft Confidential content — all content is General-level
- ✅ `.env` excluded via `.gitignore`
- ✅ `.env.sample` provides placeholder configuration
- ✅ All Azure resource names are parameterized

---

*Spec Version: 1.0 | Created for TechConnect Hackathon — Reasoning Agents Track*
