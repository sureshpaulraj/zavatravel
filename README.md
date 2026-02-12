# 🧠 Zava Travel Inc. — Multi-Agent Social Media Content Creator

**Track**: Reasoning Agents with Microsoft Foundry | **Hackathon**: Agents League @ TechConnect

> Three AI agents collaborate in a group chat to generate, review, and publish platform-ready social media content for Zava Travel Inc.

---

## 🏗️ Architecture

```
Campaign Brief (User Input)
        │
        ▼
┌─────────────────────────────────────────────────┐
│         GROUP CHAT ORCHESTRATOR                  │
│         (Round-Robin Speaker Selection)          │
│                                                  │
│   Creator → Reviewer → Creator → Reviewer → Publisher
└─────────────────────────────────────────────────┘
     │              │              │
     ▼              ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ CREATOR  │ │ REVIEWER │ │PUBLISHER │
│(Azure AI)│ │(Copilot) │ │(Azure AI)│
│          │ │          │ │          │
│ Chain-of │ │  ReAct   │ │  Self-   │
│ Thought  │ │ Pattern  │ │Reflection│
└──────────┘ └──────────┘ └──────────┘
                                │
                                ▼
                    3 Platform-Ready Posts
                  (LinkedIn, Twitter, Instagram)
```

| Agent | Engine | Reasoning Pattern | Role |
|-------|--------|-------------------|------|
| **Creator** | Azure OpenAI (GPT-5.x) | Chain-of-Thought (5 steps) | Drafts content with visible reasoning |
| **Reviewer** | GitHub Copilot SDK | ReAct (Observe → Think → Act → Result) | Reviews brand alignment & quality |
| **Publisher** | Azure OpenAI (GPT-5.x) | Self-Reflection (validate constraints) | Formats for LinkedIn, Twitter, Instagram |

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Azure Subscription with AI Foundry project & deployed reasoning model
- Azure CLI (`az login`)
- GitHub Copilot CLI (authenticated with `/login`)

### Setup

```powershell
# 1. Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
copy .env.sample .env
# Edit .env with your Azure endpoints

# 4. Authenticate
az login

# 5. Run the workflow
python workflow_social_media.py
```

### Environment Variables (`.env`)

```env
AZURE_AI_FOUNDRY_PROJECT_ENDPOINT=https://<resource>.services.ai.azure.com/api/projects/<project>
AZURE_OPENAI_ENDPOINT=https://<resource>.services.ai.azure.com
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=<your-deployed-model>
```

---

## 📋 Demo Campaign

The default campaign showcases Zava Travel's **"Wander More, Spend Less"** summer adventure:

| Attribute | Value |
|-----------|-------|
| **Company** | Zava Travel Inc. (zavatravel.com) |
| **Industry** | Budget-friendly adventure travel |
| **Audience** | Millennials & Gen-Z adventure seekers |
| **Tone** | Adventurous & Inspiring |
| **Destinations** | Bali, Patagonia, Iceland, Vietnam, Costa Rica |
| **Hashtags** | #ZavaTravel #WanderMore #AdventureAwaits #TravelOnABudget |

### Example Output

The system produces three platform-ready posts:

- **LinkedIn**: Professional-adventurous, 1-3 paragraphs, 3-5 hashtags
- **X/Twitter**: Under 280 characters, punchy, 2-3 hashtags
- **Instagram**: Visual-friendly, emojis, 5-10 hashtags, image suggestions

---

## 📁 Project Structure

```
├── workflow_social_media.py        # Main entry point
├── agents/
│   ├── creator.py                  # Chain-of-Thought agent instructions
│   ├── reviewer.py                 # ReAct agent instructions
│   └── publisher.py                # Self-Reflection agent instructions
├── orchestration/
│   ├── speaker_selection.py        # Round-robin + fast-track logic
│   └── termination.py              # 3 termination conditions
├── grounding/
│   ├── file_search.py              # Azure File Search integration
│   └── brand-guidelines.md         # Zava Travel brand guidelines
├── tools/
│   └── filesystem_mcp.py           # MCP filesystem integration
├── utils/
│   ├── formatting.py               # Platform validation
│   ├── transcript_formatter.py     # Conversation display
│   └── markdown_formatter.py       # Export to markdown
├── config/
│   └── env_loader.py               # Environment validation
├── test-data/                      # Synthetic test data
│   ├── campaign-briefs/            # 5 campaign brief inputs
│   ├── expected-outputs/           # Golden reference posts
│   ├── grounding/                  # Brand guidelines document
│   ├── safety-tests/               # 16 content safety test cases
│   ├── evaluation-baselines/       # Quality score thresholds
│   └── edge-cases/                 # 8 edge case inputs
├── output/                         # Generated posts saved here
├── .env.sample                     # Environment template
├── requirements.txt                # Python dependencies
└── constitution.md                 # Project governing principles
```

---

## 🧠 Reasoning Patterns

### Creator — Chain-of-Thought
```
Step 1: Identify the campaign objective
Step 2: Consider audience interests and pain points
Step 3: Draft an attention-grabbing hook
Step 4: Build the body with value and destination highlights
Step 5: Close with a clear call-to-action
```

### Reviewer — ReAct
```
Observation: The draft uses "cheap travel" language
Thought:    Zava's brand voice is "adventurous & inspiring" — should feel empowering
Action:     Recommend replacing "cheap" with "budget-savvy adventure"
Result:     Revised draft maintains aspirational tone while communicating value
```

### Publisher — Self-Reflection
```
Draft:  [formatted LinkedIn post]
Check:  Professional-adventurous tone? ✓
Check:  3-5 hashtags including #ZavaTravel? ✓
Check:  CTA with zavatravel.com? ✓
Final:  [polished post ready for publication]
```

---

## 🔒 Security

- ✅ `DefaultAzureCredential` — no hardcoded API keys
- ✅ `.env` excluded via `.gitignore`
- ✅ `.env.sample` with placeholders only
- ✅ No PII, customer data, or confidential content
- ✅ All Azure resource names parameterized

---

## 🎯 Hackathon Milestones

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Environment setup (Foundry + model deployment) | ✅ |
| 2 | Agent creation (Creator, Reviewer, Publisher) | ✅ |
| 3 | Grounding knowledge (File Search + brand guidelines) | ✅ |
| 4 | External tools (MCP filesystem integration) | ✅ |

### Bonus Features (Optional)

| Feature | Package | Status |
|---------|---------|--------|
| Observability | `azure-monitor-opentelemetry` | 📋 Ready |
| Content Safety | `azure-ai-contentsafety` | 📋 Ready |
| Agentic Evaluation | `azure-ai-evaluation` | 📋 Ready |

---

## 📚 Resources

- [Microsoft Foundry Documentation](https://learn.microsoft.com/azure/ai-foundry/)
- [Microsoft Agent Framework](https://github.com/microsoft/agent-framework)
- [GitHub Copilot SDK](https://github.com/github/copilot-sdk)
- [Starter Code Repository](https://github.com/sureshpaulraj/aiagent-maf-githubcopilotsdk)

---

⚠️ **Security Notice**: This is a PUBLIC repository. See [DISCLAIMER.md](DISCLAIMER.md) for guidelines. See also the [original hackathon README](README_OLD.md) for competition rules.

**Good luck! Wander More, Spend Less 🌍✈️**
