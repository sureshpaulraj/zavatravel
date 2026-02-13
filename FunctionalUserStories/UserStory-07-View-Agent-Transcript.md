# User Story 07: View Agent Collaboration Transcript

## Story ID

US-007

## Title

View Agent Reasoning Transcript

## As a

Content Creator, Social Media Manager, or System Administrator

## I want to

View a detailed transcript of the agent collaboration process

## So that

I can understand how each AI agent reasoned through the content creation process and see their individual contributions

## Acceptance Criteria

### AC1: Access Agent Transcript Tab

- **Given** Content has been generated successfully
- **When** I view the results area
- **And** I click the "🧠 Agent Transcript" tab
- **Then** The tab should become active
- **And** The platform posts should be hidden
- **And** The agent transcript should be displayed

### AC2: Transcript Message Display

- **Given** I am viewing the Agent Transcript tab
- **When** The transcript loads
- **Then** I should see 3 agent messages (in order):
  1. Creator message
  2. Reviewer message
  3. Publisher message

### AC3: Creator Message Display

- **Given** I am viewing the agent transcript
- **When** I look at the Creator's message
- **Then** I should see:
  - Agent name: "Creator" (in teal color #0891B2)
  - Reasoning badge: "Chain-of-Thought" (outline style, teal)
  - Message content showing 5-step reasoning:
    - Step 1: Identify Objective
    - Step 2: Consider Audience
    - Step 3: Draft Hook
    - Step 4: Build Body
    - Step 5: Add CTA
  - Left border: Teal color (4px solid)
  - Background: Light teal (#F0FDFF)

### AC4: Reviewer Message Display

- **Given** I am viewing the agent transcript
- **When** I look at the Reviewer's message
- **Then** I should see:
  - Agent name: "Reviewer" (in orange color #F97316)
  - Reasoning badge: "ReAct" (outline style, orange)
  - Message content showing ReAct pattern:
    - Observation: Analysis of the draft
    - Thought: Evaluation reasoning
    - Action: Recommendation
    - Result: Final decision
    - Verdict: "APPROVED ✅" or "REVISION NEEDED"
  - Left border: Orange color (4px solid)
  - Background: Light orange (#FFF7ED)

### AC5: Publisher Message Display

- **Given** I am viewing the agent transcript
- **When** I look at the Publisher's message
- **Then** I should see:
  - Agent name: "Publisher" (in green color #059669)
  - Reasoning badge: "Self-Reflection" (outline style, green)
  - Message content showing validation checks:
    - Platform-specific constraint checks
    - Character count validations
    - CTA presence verification
    - Brand compliance checks
  - Left border: Green color (4px solid)
  - Background: Light green (#F0FDF4)

### AC6: Transcript Message Formatting

- **Given** I am viewing any agent message
- **When** The message is rendered
- **Then** The content should:
  - Preserve line breaks (`whiteSpace: 'pre-wrap'`)
  - Use readable font size (14px)
  - Have appropriate line height (1.6)
  - Show agent emoji/icon where applicable
  - Display timestamps (if available)

### AC7: Switch Back to Posts Tab

- **Given** I am viewing the Agent Transcript tab
- **When** I click the "📝 Platform Posts" tab
- **Then** The transcript should be hidden
- **And** The platform posts should be displayed again

## Priority

Medium

## Estimated Story Points

3

## Dependencies

- Content generation must be complete (US-004)
- Mock API must return agent transcript data
- Tab switching functionality (US-005)

## Technical Notes

- Transcript messages stored in result.transcript array
- Each message has structure:
  ```typescript
  interface AgentMessage {
    agent_name: string; // "Creator" | "Reviewer" | "Publisher"
    content: string; // Multi-line reasoning text
    reasoning_pattern: string; // "Chain-of-Thought" | "ReAct" | "Self-Reflection"
    timestamp: string; // ISO 8601 format
  }
  ```
- Agent color mapping:
  ```typescript
  const AGENT_COLORS = {
    Creator: { border: "#0891B2", bg: "#F0FDFF" },
    Reviewer: { border: "#F97316", bg: "#FFF7ED" },
    Publisher: { border: "#059669", bg: "#F0FDF4" },
  };
  ```

## UI Components

- Fluent UI components: Card, Title3, Body2, Badge, TabList, Tab
- Layout: Vertical stack of transcript messages with color-coded borders
- Message cards have 16px padding and 8px border-radius

## Educational Value

- Helps users understand AI reasoning patterns
- Demonstrates multi-agent collaboration workflow
- Shows transparency in AI decision-making
- Useful for debugging and quality assurance
