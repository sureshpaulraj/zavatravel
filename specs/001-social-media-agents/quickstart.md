# Quickstart Guide: 100-Minute Hackathon Implementation

**Feature**: Multi-Agent Social Media Content Creation System  
**Time Limit**: 100 minutes (1 hour 40 minutes)  
**Track**: Reasoning Agents with Microsoft Foundry  
**Date**: 2025-01-23

---

## Overview

This quickstart guide provides a step-by-step execution plan to implement the multi-agent social media content creation system within the **100-minute hackathon time limit**. The guide is optimized for the TechConnect competition, prioritizing working demonstration over production-ready features.

**Success Criteria**:
- ✅ Functional multi-agent collaboration (Creator → Reviewer → Publisher)
- ✅ Visible reasoning patterns (Chain-of-Thought, ReAct, Self-Reflection)
- ✅ Grounded content (File Search with brand guidelines)
- ✅ External tool integration (MCP filesystem server)
- ✅ Security compliance (no credentials in repository)
- ✅ Demo-ready output (screenshot or video)

---

## Time Allocation (100 Minutes Total)

| Milestone | Time Box | Description | Output |
|-----------|----------|-------------|--------|
| **0: Pre-Hackathon Setup** | Day before | Azure resources, authentication | Environment ready |
| **1: Environment Setup** | 00:00-00:20 (20 min) | Dependencies, configuration, validation | Runnable Python environment |
| **2: Agent Creation** | 00:20-00:50 (30 min) | Three agents, orchestration, reasoning | Working multi-agent conversation |
| **3: Grounding Knowledge** | 00:50-01:10 (20 min) | Brand guidelines, File Search | Grounded content generation |
| **4: External Tools** | 01:10-01:20 (10 min) | MCP filesystem server | Draft saving to local file |
| **5: Testing & Refinement** | 01:20-01:35 (15 min) | Full workflow test, bug fixes | End-to-end demonstration |
| **6: Documentation & Demo** | 01:35-01:40 (5 min) | README, screenshot/video | Submission-ready repository |

---

## Milestone 0: Pre-Hackathon Setup (Day Before)

**Goal**: Complete all Azure provisioning and authentication before the timer starts.

### Tasks (Complete Before Hackathon Begins)

#### 1. Azure AI Foundry Project Setup
```powershell
# Login to Azure
az login

# Create resource group (if needed)
az group create --name rg-techconnect-hackathon --location eastus2

# Create AI Foundry project via portal (faster than CLI)
# Navigate to: https://ai.azure.com
# Click "New Project" → Name: "techconnect-social-agents" → Region: East US 2
```

**Record These Values** (you'll need them for `.env`):
- Project Endpoint: `https://<your-project>.services.ai.azure.com/api/projects/<project-id>`
- Subscription ID: (from Azure portal)

#### 2. Deploy Reasoning Model
```
# In AI Foundry Portal (ai.azure.com):
1. Go to "Models" → "Deploy model"
2. Select "gpt-5.2-codex" (or "gpt-5.1-codex" if 5.2 unavailable)
3. Deployment name: "social-content-model"
4. Quota: Allocate 200k-300k TPM minimum
5. Deploy → Wait 2-3 minutes
```

**Record These Values**:
- Azure OpenAI Endpoint: `https://<resource>.services.ai.azure.com`
- Deployment Name: `social-content-model`

#### 3. GitHub Copilot Setup
```powershell
# Install GitHub Copilot CLI (if not already installed)
npm install -g @githubnext/github-copilot-cli

# Authenticate
copilot
# Then run: /login
# Follow browser authentication flow
```

**Verify Installation**:
```powershell
# Test Copilot CLI
copilot "what is the square root of 144?"
# Should return: "12"
```

#### 4. Clone Starter Repository
```powershell
# Clone the starter code
git clone https://github.com/sureshpaulraj/aiagent-maf-githubcopilotsdk.git starter-code

# Review workflow_groupchat.py
cd starter-code
code workflow_groupchat.py
```

**Study the Pattern**: Understand `GroupChatBuilder`, speaker selection, and termination logic.

---

## Milestone 1: Environment Setup (00:00 - 00:20)

**Goal**: Runnable Python environment with all dependencies installed and configured.

### [00:00-00:05] Initialize Project Structure (5 min)

```powershell
# Create project directory
mkdir hackathon-social-agents
cd hackathon-social-agents

# Initialize git
git init
git branch -M main

# Create directory structure
mkdir agents orchestration grounding tools config utils output
New-Item -ItemType File .env, .gitignore, requirements.txt, README.md, workflow_social_media.py
```

### [00:05-00:10] Configure .gitignore and .env.sample (5 min)

**`.gitignore`**:
```gitignore
# Environment
.env
.env.local

# Python
__pycache__/
*.py[cod]
*$py.class
venv/
env/

# Output
output/*.md
output/*.json

# IDE
.vscode/
.idea/
*.swp
```

**`.env.sample`** (template for others):
```env
# Azure AI Foundry
AZURE_AI_FOUNDRY_PROJECT_ENDPOINT=https://<your-project>.services.ai.azure.com/api/projects/<project-id>

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://<resource>.services.ai.azure.com
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=social-content-model

# GitHub Copilot CLI
# Auto-detected by default; override if needed:
# COPILOT_CLI_PATH=/custom/path/to/copilot
```

**`.env`** (your actual config - DO NOT COMMIT):
Copy `.env.sample` and fill in your actual values from Milestone 0.

### [00:10-00:15] Install Dependencies (5 min)

**`requirements.txt`**:
```
agent-framework>=0.1.0
agent-framework-azure>=0.1.0
agent-framework-github-copilot --pre
azure-identity>=1.15.0
python-dotenv>=1.0.0
```

```powershell
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\Activate.ps1

# Activate (macOS/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### [00:15-00:20] Validate Environment (5 min)

Create `config/env_loader.py`:
```python
import os
from dotenv import load_dotenv
import sys

def validate_environment():
    """Fail-fast validation of required environment variables."""
    load_dotenv()
    
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
        print("\nConfigure these in your .env file (see .env.sample)")
        sys.exit(1)
    
    print("✅ Environment configuration validated")
    return True

if __name__ == "__main__":
    validate_environment()
```

**Test**:
```powershell
python config/env_loader.py
# Should output: ✅ Environment configuration validated
```

**✅ Milestone 1 Complete**: You have a configured Python environment. **Time Check**: 00:20

---

## Milestone 2: Agent Creation (00:20 - 00:50)

**Goal**: Working multi-agent group chat with Creator, Reviewer, Publisher agents and visible reasoning.

### [00:20-00:30] Copy & Adapt Starter Code (10 min)

1. **Copy `workflow_groupchat.py` → `workflow_social_media.py`**

2. **Update imports and client initialization**:
```python
import os
import asyncio
from dotenv import load_dotenv
from azure.identity import DefaultAzureCredential
from agent_framework import GroupChatBuilder, AgentRunUpdateEvent, WorkflowOutputEvent
from agent_framework.azure import AzureOpenAIChatClient
from agent_framework.github import GitHubCopilotAgent

load_dotenv()

# Azure OpenAI client (for Creator and Publisher)
credential = DefaultAzureCredential()
azure_client = AzureOpenAIChatClient(
    endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    credential=credential,
    deployment_name=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME")
)

# GitHub Copilot client (for Reviewer)
copilot_client = GitHubCopilotAgent()
```

### [00:30-00:40] Create Agent Instruction Files (10 min)

**`agents/creator.py`** (summary of contract):
```python
CREATOR_INSTRUCTIONS = """
You are a social media content creator.

**Reasoning Pattern: Chain-of-Thought (5 steps)**

Step 1: Identify the Objective
Step 2: Consider the Audience
Step 3: Draft the Hook
Step 4: Build the Body
Step 5: Add Call-to-Action

ALWAYS show your reasoning steps explicitly, then provide a draft under 150 words.

When Reviewer says REVISE, incorporate feedback in your next iteration.
"""
```

**`agents/reviewer.py`** (summary of contract):
```python
REVIEWER_INSTRUCTIONS = """
You are a content quality reviewer.

**Reasoning Pattern: ReAct**

Observation: What you see in the draft
Thought: Your analysis
Action: Specific recommendation
Result: Expected outcome

Provide feedback under 120 words with:
- STRENGTHS (1-2 points)
- IMPROVEMENTS (Observation → Thought → Action → Result)
- VERDICT: REVISE or APPROVED
"""
```

**`agents/publisher.py`** (summary of contract):
```python
PUBLISHER_INSTRUCTIONS = """
You are a multi-platform publisher.

**Reasoning Pattern: Self-Reflection**

Generate three platform versions:
1. LinkedIn (1-3 paragraphs, 3-5 hashtags, professional)
2. Twitter (≤280 chars, 2-3 hashtags, punchy)
3. Instagram (125-150 words, 5-10 hashtags, 2-5 emojis, visual suggestion)

After each version, validate:
✓ Character/word count
✓ Hashtag count
✓ CTA present
✓ Tone appropriate

If any check FAILS, provide REVISED version immediately.
"""
```

### [00:40-00:50] Build Group Chat Workflow (10 min)

**`orchestration/speaker_selection.py`**:
```python
def speaker_selector(state):
    """Round-robin with fast-track on approval."""
    last_message = state.messages[-1] if state.messages else None
    
    # Fast-track to Publisher if Reviewer approves
    if last_message and "APPROVED" in last_message.content:
        return "Publisher"
    
    # Round-robin sequence
    sequence = ["Creator", "Reviewer", "Creator", "Reviewer", "Publisher"]
    return sequence[state.current_round % len(sequence)]
```

**`orchestration/termination.py`**:
```python
def should_terminate(state):
    """Terminate on Publisher completion, max rounds, or approval."""
    if not state.messages:
        return False
    
    last_speaker = state.messages[-1].agent_name
    
    # Condition 1: Publisher finished
    if last_speaker == "Publisher":
        return True
    
    # Condition 2: Max rounds (safety)
    if state.current_round >= 5:
        return True
    
    # Condition 3: Reviewer approved
    if "APPROVED" in state.messages[-1].content and last_speaker == "Reviewer":
        return True
    
    return False
```

**`workflow_social_media.py`** (main workflow):
```python
from agents.creator import CREATOR_INSTRUCTIONS
from agents.reviewer import REVIEWER_INSTRUCTIONS
from agents.publisher import PUBLISHER_INSTRUCTIONS
from orchestration.speaker_selection import speaker_selector
from orchestration.termination import should_terminate

# Create agents
creator = azure_client.create_agent(
    name="Creator",
    instructions=CREATOR_INSTRUCTIONS
)

reviewer = copilot_client.create_agent(
    name="Reviewer",
    instructions=REVIEWER_INSTRUCTIONS
)

publisher = azure_client.create_agent(
    name="Publisher",
    instructions=PUBLISHER_INSTRUCTIONS
)

# Build group chat
workflow = (
    GroupChatBuilder()
    .with_orchestrator(selection_func=speaker_selector)
    .participants([creator, reviewer, publisher])
    .with_termination_condition(should_terminate)
    .build()
)

# Campaign brief input
campaign_brief = """
Create social media content for Zava Travel Inc.'s "Wander More, Spend Less" summer adventure campaign.

Brand: Zava Travel Inc. (zavatravel.com)
Industry: Budget-friendly adventure travel & curated itineraries
Target Audience: Millennials & Gen-Z adventure seekers looking for authentic experiences on a budget
Key Message: Affordable adventure travel to dream destinations like Bali, Patagonia, Iceland, Vietnam, and Costa Rica. Experience more, spend less.
Tone: Adventurous and inspiring
Brand Colors: Teal/ocean blue + sunset orange
Approved Hashtags: #ZavaTravel #WanderMore #AdventureAwaits #TravelOnABudget
Competitors to avoid mentioning: VoyageNow, CookTravel, WanderPath
Platforms: LinkedIn, X/Twitter, Instagram
"""

# Run workflow
async def main():
    print("🚀 Starting multi-agent workflow...\n")
    
    async for event in workflow.run_stream(campaign_brief):
        if isinstance(event, AgentRunUpdateEvent):
            print(f"[{event.agent_name}]: {event.message_delta}", end="", flush=True)
        elif isinstance(event, WorkflowOutputEvent):
            print("\n\n" + "="*60)
            print("WORKFLOW COMPLETE")
            print("="*60)

if __name__ == "__main__":
    asyncio.run(main())
```

**Test**:
```powershell
python workflow_social_media.py
```

**Expected Output**: Multi-agent conversation with Creator → Reviewer → Creator → Reviewer → Publisher sequence.

**✅ Milestone 2 Complete**: Working multi-agent workflow with reasoning. **Time Check**: 00:50

---

## Milestone 3: Grounding Knowledge (00:50 - 01:10)

**Goal**: Brand guidelines document integrated via File Search.

### [00:50-01:00] Create Synthetic Brand Guidelines (10 min)

**Option A: Use Microsoft 365 Copilot** (fastest):
1. Open Word or Copilot chat
2. Prompt: "Create a brand guidelines document for Zava Travel Inc., a budget-friendly adventure travel company targeting millennials and Gen-Z. Include: brand voice (adventurous and inspiring), tone for LinkedIn/Twitter/Instagram, visual identity (teal/ocean blue, sunset orange), messaging pillars (Affordability, Authentic Experiences, Millennial/Gen-Z Appeal), approved hashtags (#ZavaTravel, #WanderMore, #AdventureAwaits, #TravelOnABudget), destination highlights (Bali, Patagonia, Iceland, Vietnam, Costa Rica), and sample social media posts for the 'Wander More, Spend Less' campaign."
3. Save as: `grounding/brand-guidelines.docx`

**Option B: Manual creation** (if M365 unavailable):
Create `grounding/brand-guidelines.docx` with:
```
Zava Travel Inc. Brand Guidelines

BRAND VOICE: Adventurous and Inspiring
TONE:
- LinkedIn: Professional yet exciting — showcase transformative experiences
- Twitter: Energetic, wanderlust-driven, budget-conscious
- Instagram: Storytelling, aspirational, community-focused

VISUAL IDENTITY:
- Primary Colors: Teal/Ocean Blue, Sunset Orange
- Visual Style: Vibrant destinations, authentic travel moments, diverse travelers

MESSAGING PILLARS:
1. Affordability — Budget-friendly without compromising quality
2. Authentic Experiences — Curated itineraries for genuine cultural immersion
3. Millennial/Gen-Z Appeal — Social, shareable, Instagram-worthy adventures

DESTINATIONS:
Bali, Patagonia, Iceland, Vietnam, Costa Rica

APPROVED HASHTAGS:
#ZavaTravel #WanderMore #AdventureAwaits #TravelOnABudget

COMPETITORS (DO NOT MENTION):
VoyageNow, CookTravel, WanderPath

SAMPLE LINKEDIN POST:
"Adventure doesn't have to break the bank. At Zava Travel, we curate authentic experiences in Bali, Patagonia, Iceland, and beyond — all within your budget. Wander more, spend less. #ZavaTravel #AdventureAwaits"
```

### [01:00-01:10] Integrate File Search (10 min)

**Update `agents/creator.py`**:
```python
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import FileSearchTool

def create_creator_agent_with_grounding(azure_client):
    """Create Creator agent with File Search grounding."""
    
    # Upload brand guidelines
    project_client = AIProjectClient(
        endpoint=os.getenv("AZURE_AI_FOUNDRY_PROJECT_ENDPOINT"),
        credential=DefaultAzureCredential()
    )
    
    file = project_client.files.upload(
        file_path="grounding/brand-guidelines.docx",
        purpose="assistants"
    )
    
    # Create agent with File Search tool
    creator = azure_client.create_agent(
        name="Creator",
        instructions=CREATOR_INSTRUCTIONS + "\n\nUse File Search to reference brand guidelines when generating content."
    )
    
    creator.tools.append(FileSearchTool(file_ids=[file.id]))
    
    return creator
```

**Update `workflow_social_media.py`**:
```python
# Replace:
# creator = azure_client.create_agent(...)
# With:
from agents.creator import create_creator_agent_with_grounding
creator = create_creator_agent_with_grounding(azure_client)
```

**Test**:
```powershell
python workflow_social_media.py
```

**Expected**: Creator agent references brand guidelines in reasoning (e.g., "Step 2: Based on brand guidelines, using professional yet approachable tone...").

**✅ Milestone 3 Complete**: Grounded content generation. **Time Check**: 01:10

---

## Milestone 4: External Tools (01:10 - 01:20)

**Goal**: MCP filesystem server integration for saving drafts.

### [01:10-01:15] Install MCP Filesystem Server (5 min)

```powershell
# Install globally via npm
npm install -g @modelcontextprotocol/server-filesystem

# Verify installation
npx @modelcontextprotocol/server-filesystem --help
```

### [01:15-01:20] Integrate MCP Tool (5 min)

**`tools/filesystem_mcp.py`**:
```python
from agent_framework.mcp import MCPClient

def get_filesystem_tools():
    """Initialize MCP filesystem client for draft saving."""
    mcp_client = MCPClient(
        command=["npx", "@modelcontextprotocol/server-filesystem", "./output"],
        transport="stdio"
    )
    return mcp_client.get_tools()
```

**Update `workflow_social_media.py`**:
```python
from tools.filesystem_mcp import get_filesystem_tools

# Add to Publisher agent
publisher = azure_client.create_agent(
    name="Publisher",
    instructions=PUBLISHER_INSTRUCTIONS + "\n\nAfter generating platform posts, save them to 'output/social-posts.md' using the write_file tool."
)

publisher.tools.extend(get_filesystem_tools())
```

**Test**:
```powershell
python workflow_social_media.py
```

**Expected**: File `output/social-posts.md` created with final platform posts.

**✅ Milestone 4 Complete**: External tool integration. **Time Check**: 01:20

---

## Milestone 5: Testing & Refinement (01:20 - 01:35)

**Goal**: End-to-end workflow validation and critical bug fixes.

### [01:20-01:30] Full Workflow Test (10 min)

**Test Cases**:
1. **Normal flow**: Creator → Reviewer (REVISE) → Creator → Reviewer (APPROVED) → Publisher
2. **Fast-track**: Creator → Reviewer (APPROVED immediately) → Publisher
3. **Max rounds**: Creator ↔ Reviewer (5 rounds) → Publisher (forced termination)

**Validation Checklist**:
- [ ] All three agents participate
- [ ] Creator shows Chain-of-Thought (5 steps)
- [ ] Reviewer shows ReAct (Observation → Thought → Action → Result)
- [ ] Publisher shows Self-Reflection (validation checks)
- [ ] Three platform posts generated (LinkedIn, Twitter, Instagram)
- [ ] Twitter post ≤280 characters
- [ ] File saved to `output/social-posts.md`
- [ ] Workflow terminates correctly

### [01:30-01:35] Critical Bug Fixes Only (5 min)

**Common Issues**:
- **Twitter exceeds 280 chars**: Ensure Publisher Self-Reflection catches and revises
- **File Search not working**: Check file upload success, verify `file.id` is valid
- **MCP server timeout**: Increase timeout or fallback to console-only output
- **Workflow doesn't terminate**: Verify termination conditions in `should_terminate()`

**Fix Priorities** (in order):
1. Workflow termination (critical)
2. Twitter character limit (demo blocker)
3. Reasoning visibility (judging criterion)
4. File save (nice-to-have, not critical)

**✅ Milestone 5 Complete**: End-to-end demonstration working. **Time Check**: 01:35

---

## Milestone 6: Documentation & Demo (01:35 - 01:40)

**Goal**: README complete, demo captured, submission-ready.

### [01:35-01:37] Update README (2 min)

**`README.md`** (minimal but complete):
```markdown
# TechConnect Hackathon — Multi-Agent Social Media Content Creation

**Track**: Reasoning Agents with Microsoft Foundry

## Quick Start

### Prerequisites
- Python 3.10+
- Azure subscription with deployed reasoning model
- GitHub Copilot CLI authenticated

### Setup
```bash
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Configure environment
cp .env.sample .env
# Edit .env with your Azure endpoints
```

### Run
```bash
python workflow_social_media.py
```

## Example Campaign Brief
See `workflow_social_media.py` for the example Zava Travel Inc. "Wander More, Spend Less" summer adventure campaign brief.

## Output
- Console: Full conversation transcript with reasoning
- File: `output/social-posts.md` with platform-ready posts

## Architecture
- **Creator Agent**: Chain-of-Thought reasoning (Azure OpenAI)
- **Reviewer Agent**: ReAct feedback (GitHub Copilot)
- **Publisher Agent**: Self-Reflection formatting (Azure OpenAI)
- **Grounding**: File Search with brand guidelines
- **Tools**: MCP filesystem server for draft saving

## Security
✅ No credentials in repository (DefaultAzureCredential)
✅ .env excluded via .gitignore
```

### [01:37-01:40] Capture Demo (3 min)

**Option A: Screenshot** (fastest):
1. Run `python workflow_social_media.py`
2. Take screenshot showing:
   - Agent names and reasoning steps
   - Creator's Chain-of-Thought
   - Reviewer's ReAct feedback
   - Publisher's three platform posts
3. Save as `demo-screenshot.png` in root

**Option B: Screen Recording** (better):
1. Start screen recording
2. Run `python workflow_social_media.py`
3. Narrate: "Three agents collaborating — Creator generates, Reviewer evaluates, Publisher formats for LinkedIn, Twitter, Instagram"
4. Show final output in `output/social-posts.md`
5. Save as `demo-video.mp4`

**✅ Milestone 6 Complete**: Submission-ready repository. **Time Check**: 01:40

---

## Final Security Audit (Before Submission)

**CRITICAL**: Run this checklist before final commit.

```powershell
# 1. Verify .env is NOT committed
git status
# Should NOT show .env in changes

# 2. Check git history for secrets
git log --all --full-history --source --grep="AZURE"
# Should find nothing

# 3. Verify .gitignore includes .env
cat .gitignore | Select-String ".env"
# Should show: .env

# 4. Scan all Python files for hardcoded endpoints
Get-ChildItem -Recurse -Filter *.py | Select-String -Pattern "https://"
# Should only show os.getenv() calls, no hardcoded URLs
```

**Commit & Submit**:
```powershell
git add .
git commit -m "TechConnect Hackathon submission: Multi-agent social media content creation"
git remote add origin <your-repo-url>
git push -u origin main
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Missing AZURE_OPENAI_ENDPOINT"** | Check `.env` file exists and variables are set (no quotes around values) |
| **"DefaultAzureCredential failed"** | Run `az login` again; verify you're logged in with `az account show` |
| **GitHub Copilot auth fails** | Run `copilot` then `/login` to re-authenticate |
| **File Search returns no results** | Verify file uploaded successfully; check `file.id` is valid |
| **MCP server not found** | Run `npm install -g @modelcontextprotocol/server-filesystem` again |
| **Twitter post exceeds 280 chars** | Ensure Publisher Self-Reflection is revising automatically; check reflection output |
| **Workflow loops forever** | Verify `should_terminate()` has all three conditions; add debug prints |

---

## Time-Saving Tips

1. **Use M365 Copilot** for brand guidelines generation (2-3 min vs. 10 min manual)
2. **Copy-paste contracts** from `/specs/001-social-media-agents/contracts/` instead of retyping
3. **Test incrementally**: Don't wait until end to run full workflow (catch bugs early)
4. **Fallback to simpler grounding**: If File Search is problematic, hardcode brand context in Creator instructions
5. **Skip MCP if stuck**: File save is nice-to-have; console output is sufficient for demo
6. **Pre-commit .env.sample**: Having a good template saves configuration time

---

## Success Metrics

**Functional**:
- [x] Three agents participate with distinct roles
- [x] All reasoning patterns visible (Chain-of-Thought, ReAct, Self-Reflection)
- [x] Three platform posts generated (LinkedIn, Twitter, Instagram)
- [x] Twitter post ≤280 characters
- [x] Workflow terminates correctly

**Security**:
- [x] No credentials in git history
- [x] .env in .gitignore
- [x] DefaultAzureCredential used
- [x] All endpoints parameterized

**Demo**:
- [x] README with setup instructions
- [x] Example campaign brief documented
- [x] Screenshot or video of working system
- [x] Conversation transcript visible

---

**Congratulations!** You've completed the 100-minute hackathon implementation. 🎉

**Submission Checklist**:
- [ ] Code committed to GitHub repository
- [ ] README.md complete
- [ ] .env excluded (security audit passed)
- [ ] Demo screenshot/video included
- [ ] All four hackathon milestones met

**Now present your demo and good luck! 🚀**
