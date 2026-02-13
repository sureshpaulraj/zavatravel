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

### System Architecture

![System Architecture](docs/images/architecture.svg)

### Data Flow (Content Generation)

![Data Flow](docs/images/dataflow.svg)

| Agent         | Engine                 | Reasoning Pattern                      | Role                                     |
| ------------- | ---------------------- | -------------------------------------- | ---------------------------------------- |
| **Creator**   | Azure OpenAI (GPT-5.x) | Chain-of-Thought (5 steps)             | Drafts content with visible reasoning    |
| **Reviewer**  | GitHub Copilot SDK     | ReAct (Observe → Think → Act → Result) | Reviews brand alignment & quality        |
| **Publisher** | Azure OpenAI (GPT-5.x) | Self-Reflection (validate constraints) | Formats for LinkedIn, Twitter, Instagram |

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm (for MCP filesystem server + frontend)
- Azure Subscription with AI Foundry project & deployed reasoning model
- Azure CLI (`az login`)
- GitHub Copilot CLI (authenticated with `/login`)

### Setup

```powershell
# 1. Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install Python dependencies
pip install --pre -r requirements.txt

# 3. Install MCP filesystem server
npm install -g @modelcontextprotocol/server-filesystem
# Optional: only needed if using MCP_TRANSPORT=streamable-http
# npm install -g supergateway

# 4. Install frontend dependencies
cd frontend
npm install
cd ..

# 5. Configure environment
copy .env.sample .env
# Edit .env with your Azure endpoints

# 6. Authenticate
az login
```

### Running the Application

You can run the workflow in two ways:

#### Option A: Full Stack (frontend + API server)

Open **two terminals**:

**Terminal 1 — Backend API server** (port 8000):

```powershell
.\venv\Scripts\Activate.ps1
python api_server.py
# API available at http://localhost:8000
# Health check: GET http://localhost:8000/api/health
```

**Terminal 2 — Frontend dev server** (port 5173):

```powershell
cd frontend
npm run dev
# Open http://localhost:5173 in your browser
```

Then open http://localhost:5173, log in with a demo account, and click **Generate Content**.

#### Option B: CLI Only (no frontend)

```powershell
python workflow_social_media.py
```

Output is printed to the console and saved to `./output/social-posts-*.md`.

#### Demo Accounts

| Username           | Password     | Role                 |
| ------------------ | ------------ | -------------------- |
| `sarah.explorer`   | `zava2026`   | Content Lead         |
| `marco.adventures` | `wander2026` | Social Media Manager |
| `admin`            | `admin`      | Administrator        |

### API Endpoints

| Method | Path            | Description                                  |
| ------ | --------------- | -------------------------------------------- |
| `GET`  | `/api/health`   | Health check — returns `{"status": "ok"}`    |
| `POST` | `/api/generate` | Run multi-agent workflow with campaign brief |

**POST `/api/generate`** request body:

```json
{
  "brand_name": "Zava Travel Inc.",
  "industry": "Travel — Budget-Friendly Adventure",
  "target_audience": "Millennials & Gen-Z adventure seekers",
  "key_message": "Wander More, Spend Less — affordable curated itineraries starting at $699",
  "destinations": "Bali, Patagonia, Iceland, Vietnam, Costa Rica",
  "platforms": ["LinkedIn", "Twitter", "Instagram"]
}
```

**Response** (JSON):

```json
{
  "status": "success",
  "posts": { "linkedin": "...", "twitter": "...", "instagram": "..." },
  "transcript": [
    {
      "agent_name": "Creator",
      "content": "...",
      "reasoning_pattern": "Chain-of-Thought",
      "timestamp": "..."
    }
  ],
  "duration_seconds": 42.5,
  "termination_reason": "Reviewer approved — fast-tracked to Publisher"
}
```

### Environment Variables (`.env`)

```env
AZURE_AI_FOUNDRY_PROJECT_ENDPOINT=https://<resource>.services.ai.azure.com/api/projects/<project>
AZURE_OPENAI_ENDPOINT=https://<resource>.services.ai.azure.com
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=<your-deployed-model>
MCP_TRANSPORT=stdio                    # Optional — 'stdio' (default) or 'streamable-http'
MCP_SERVER_PORT=8001                   # Optional — supergateway port (only for streamable-http)
```

---

## 🧪 Running Automated Tests

The project includes comprehensive Playwright automated tests for the frontend application. All 84 functional test cases have been implemented covering login, dashboard, campaign creation, and content generation workflows.

### Prerequisites

- **Node.js 18+** installed
- **Chrome browser** installed (required by Playwright)
- Frontend application configured with `WEBSITE_ENTRY_POINT` in `.env`

### Setup & Run Tests

```powershell
# Navigate to test directory
cd FunctionalTestCases

# Install dependencies (first time only)
npm install

# Install Playwright browsers (first time only)
npx playwright install chromium

# Run all tests
npm test

# Run specific test suite
npm run test:us001  # Login tests (15 tests)
npm run test:us002  # Dashboard tests
# ... etc

# Run tests with visible browser (headed mode)
npm test -- --headed

# Run tests in UI mode (interactive debugging)
npm run test:ui

# View HTML report
npm run report
```

### Test Coverage

- ✅ **15 Login tests** - Authentication, demo accounts, form validation
- ✅ **6 Dashboard tests** - Hero section, statistics, agent team display
- ✅ **12 Campaign Brief tests** - Form display, editing, submission
- ✅ **5 Agent Collaboration tests** - Loading states, progress tracking
- ✅ **7 Generated Posts tests** - Content display, character counts
- ✅ **8 Copy to Clipboard tests** - All platforms, content preservation
- ✅ **7 Agent Transcript tests** - Message display, formatting
- ✅ **9 Navigation tests** - Sidebar, routing, active states
- ✅ **8 Logout tests** - Session management, security
- ✅ **7 Empty State tests** - Initial state, transitions

**Total**: 84 automated functional tests

For detailed test documentation, see [FunctionalTestCases/README.md](FunctionalTestCases/README.md)

---

## 📋 Demo Campaign

The default campaign showcases Zava Travel's **"Wander More, Spend Less"** summer adventure:

| Attribute        | Value                                                     |
| ---------------- | --------------------------------------------------------- |
| **Company**      | Zava Travel Inc. (zavatravel.com)                         |
| **Industry**     | Budget-friendly adventure travel                          |
| **Audience**     | Millennials & Gen-Z adventure seekers                     |
| **Tone**         | Adventurous & Inspiring                                   |
| **Destinations** | Bali, Patagonia, Iceland, Vietnam, Costa Rica             |
| **Hashtags**     | #ZavaTravel #WanderMore #AdventureAwaits #TravelOnABudget |

### Example Output

The system produces three platform-ready posts:

- **LinkedIn**: Professional-adventurous, 1-3 paragraphs, 3-5 hashtags
- **X/Twitter**: Under 280 characters, punchy, 2-3 hashtags
- **Instagram**: Visual-friendly, emojis, 5-10 hashtags, image suggestions

---

## 📁 Project Structure

```
├── api_server.py                   # FastAPI backend (POST /api/generate)
├── workflow_social_media.py        # CLI entry point
├── frontend/                       # React + Vite + Fluent UI frontend
│   ├── src/
│   │   ├── pages/CreateContentPage.tsx   # Campaign brief form + results display
│   │   ├── pages/DashboardPage.tsx       # Dashboard with agent info
│   │   ├── services/api.ts              # API client (calls /api/generate)
│   │   └── context/AuthContext.tsx       # Demo authentication
│   └── package.json
├── agents/
│   ├── creator.py                  # Chain-of-Thought agent instructions
│   ├── reviewer.py                 # ReAct agent instructions
│   └── publisher.py                # Self-Reflection agent instructions
├── orchestration/
│   ├── speaker_selection.py        # Round-robin + fast-track logic
│   └── termination.py              # 3 termination conditions
├── grounding/
│   ├── file_search.py              # Brand guidelines grounding (embedded in instructions)
│   └── brand-guidelines.md         # Zava Travel brand guidelines
├── tools/
│   └── filesystem_mcp.py           # MCP filesystem (stdio + optional HTTP Streamable)
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

| #   | Milestone                                            | Status |
| --- | ---------------------------------------------------- | ------ |
| 1   | Environment setup (Foundry + model deployment)       | ✅     |
| 2   | Agent creation (Creator, Reviewer, Publisher)        | ✅     |
| 3   | Grounding knowledge (File Search + brand guidelines) | ✅     |
| 4   | External tools (MCP filesystem integration)          | ✅     |

### Bonus Features (Optional)

| Feature            | Package                       | Status   |
| ------------------ | ----------------------------- | -------- |
| Observability      | `azure-monitor-opentelemetry` | 📋 Ready |
| Content Safety     | `azure-ai-contentsafety`      | 📋 Ready |
| Agentic Evaluation | `azure-ai-evaluation`         | 📋 Ready |

---

## � ## MCP Filesystem Integration

The Publisher agent saves posts to `./output/` via the [Model Context Protocol](https://modelcontextprotocol.io) using `@modelcontextprotocol/server-filesystem`.

### Transport Modes

Set `MCP_TRANSPORT` in `.env` to choose (default: `stdio`):

| Mode                | Env Value         | How It Works                                                                                                        |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Stdio** (default) | `stdio`           | Direct stdio pipe to the MCP server. Simplest setup.                                                                |
| **HTTP Streamable** | `streamable-http` | Uses [supergateway](https://github.com/nichochar/supergateway) as a bridge. Requires `npm install -g supergateway`. |

```
# Stdio (default)
Publisher Agent -> MCPStdioTool -> npx server-filesystem ./output

# HTTP Streamable (opt-in)
Publisher Agent -> MCPStreamableHTTPTool -> http://127.0.0.1:8000/mcp
                                              | supergateway
                                              v
                                       npx server-filesystem ./output
```

| Setting          | Default    | Override                                      |
| ---------------- | ---------- | --------------------------------------------- |
| Transport        | `stdio`    | `MCP_TRANSPORT` env var                       |
| Port (HTTP only) | `8000`     | `MCP_SERVER_PORT` env var                     |
| Output dir       | `./output` | Pass `output_dir` to `get_filesystem_tools()` |

---

## Resources

- [Microsoft Foundry Documentation](https://learn.microsoft.com/azure/ai-foundry/)
- [Microsoft Agent Framework](https://github.com/microsoft/agent-framework)
- [GitHub Copilot SDK](https://github.com/github/copilot-sdk)
- [Starter Code Repository](https://github.com/sureshpaulraj/aiagent-maf-githubcopilotsdk)

---

⚠️ **Security Notice**: This is a PUBLIC repository. See [DISCLAIMER.md](DISCLAIMER.md) for guidelines. See also the [original hackathon README](README_OLD.md) for competition rules.

**Good luck! Wander More, Spend Less 🌍✈️**
