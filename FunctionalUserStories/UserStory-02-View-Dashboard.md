# User Story 02: View Dashboard

## Story ID

US-002

## Title

View Zava Travel Content Studio Dashboard

## As a

Authenticated user (Content Creator, Social Media Manager, or Administrator)

## I want to

View the main dashboard after logging in

## So that

I can see an overview of the AI agent system, featured destinations, and access content creation features

## Acceptance Criteria

### AC1: Hero Section Display

- **Given** I am logged in
- **When** I view the Dashboard
- **Then** I should see a hero section containing:
  - Personalized greeting: "Welcome back, {displayName}"
  - Title: "Zava Travel Content Studio"
  - Description of the multi-agent collaboration system
  - "Create New Content" button
  - Gradient background with airplane emoji overlay

### AC2: Statistics Cards Display

- **Given** I am on the Dashboard
- **When** the page loads
- **Then** I should see 4 statistics cards displaying:
  1. Agents Active: 3 (with team icon)
  2. Reasoning Patterns: 3 (with brain circuit icon)
  3. Platforms: 3 (with globe icon)
  4. Security Status: ✓ Secure (with shield checkmark icon)

### AC3: Agent Team Information

- **Given** I am on the Dashboard
- **When** I scroll to the "Agent Team" section
- **Then** I should see 3 agent cards displaying:
  - **Creator** (Azure OpenAI)
    - Emoji: ✍️
    - Pattern: Chain-of-Thought
    - Description of drafting capabilities
  - **Reviewer** (GitHub Copilot)
    - Emoji: 🔍
    - Pattern: ReAct
    - Description of review capabilities
  - **Publisher** (Azure OpenAI)
    - Emoji: 📤
    - Pattern: Self-Reflection
    - Description of formatting capabilities

### AC4: Featured Destinations Display

- **Given** I am on the Dashboard
- **When** I view the "Featured Destinations" section
- **Then** I should see 5 destination badges:
  1. 🇮🇩 Bali — from $899
  2. 🇦🇷 Patagonia — from $1,499
  3. 🇮🇸 Iceland — from $1,299
  4. 🇻🇳 Vietnam — from $699
  5. 🇨🇷 Costa Rica — from $799

### AC5: Navigate to Create Content

- **Given** I am on the Dashboard
- **When** I click the "Create New Content" button
- **Then** I should be navigated to the Create Content page (/create)

### AC6: Dashboard Navigation

- **Given** I am on any page in the application
- **When** I click "Dashboard" in the sidebar navigation
- **Then** I should be navigated back to the Dashboard

## Priority

High

## Estimated Story Points

3

## Dependencies

- User must be authenticated
- AuthContext must provide user information (displayName, role)
- Layout component with sidebar navigation

## Technical Notes

- Dashboard route: "/"
- Stats are static values (not fetched from API in demo mode)
- Agent information is hardcoded configuration data
- Destination pricing is display-only (no e-commerce functionality)

## UI Components

- Fluent UI components: Card, Title1-3, Body1-2, Caption1, Button, Badge, Divider
- Icons: AddRegular, PeopleTeamRegular, BrainCircuitRegular, GlobeRegular, ShieldCheckmarkRegular
- Color scheme: Teal (#0891B2), Navy (#1E3A5F), Orange (#F97316)
