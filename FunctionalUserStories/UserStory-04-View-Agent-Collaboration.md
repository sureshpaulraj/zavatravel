# User Story 04: View Agent Collaboration Progress

## Story ID

US-004

## Title

View Real-Time Agent Collaboration Progress

## As a

Content Creator or Social Media Manager

## I want to

See the AI agents collaborating in real-time during content generation

## So that

I understand the multi-agent workflow process and know the system is actively working on my request

## Acceptance Criteria

### AC1: Loading State Display

- **Given** I have submitted a campaign brief
- **When** The content generation process starts
- **Then** I should see a loading card displaying:
  - Large spinner animation
  - Title: "Agents Collaborating..."
  - Subtitle: "Creator → Reviewer → Publisher working on your Zava Travel content"
  - Three agent status badges

### AC2: Agent Status Badges During Generation

- **Given** Content generation is in progress
- **When** I view the loading card
- **Then** I should see 3 status badges:
  1. **Creator** (Blue, Filled): ✍️ Creator: Drafting...
  2. **Reviewer** (Orange, Outline): 🔍 Reviewer: Waiting
  3. **Publisher** (Green, Outline): 📤 Publisher: Waiting

### AC3: Generation Duration

- **Given** I have clicked "Generate Content"
- **When** The mock workflow executes
- **Then** The loading state should display for approximately 3 seconds
- **And** Then transition to the results view

### AC4: Generate Button State During Loading

- **Given** Content is being generated
- **When** The agents are collaborating
- **Then** The "Generate Content" button should:
  - Display text: "Agents Working..."
  - Show a spinner icon
  - Be disabled (cannot click again)

### AC5: Loading State Prevention

- **Given** Content generation is in progress
- **When** The loading state is displayed
- **Then** I should not see the empty state placeholder or previous results
- **And** Only the loading card should be visible in the results area

## Priority

Medium

## Estimated Story Points

2

## Dependencies

- Campaign brief submission functionality (US-003)
- React transition hooks for smooth loading states
- Mock API response timing (3 seconds simulated delay)

## Technical Notes

- Uses React `useTransition` hook for non-blocking state updates
- Loading state is shown while `isGenerating === true`
- Simulated delay: `setTimeout(() => setResult(getMockResult()), 3000)`
- In production, this would show real-time updates from Azure agent workflow via WebSocket or Server-Sent Events

## UI Components

- Fluent UI components: Card, Spinner, Title3, Body2, Badge
- Agent status colors:
  - Creator: #0891B2 (teal)
  - Reviewer: #F97316 (orange)
  - Publisher: #059669 (green)

## Visual States

1. **Idle**: Form visible, results area shows empty state
2. **Loading**: Form visible (sticky), results area shows collaboration card
3. **Complete**: Form visible (sticky), results area shows generated posts
