# User Story 05: View Generated Social Media Posts

## Story ID

US-005

## Title

View Platform-Ready Social Media Posts

## As a

Content Creator or Social Media Manager

## I want to

View the generated social media posts for LinkedIn, Twitter, and Instagram

## So that

I can review the AI-generated content before copying and publishing to social platforms

## Acceptance Criteria

### AC1: Success Message Display

- **Given** The content generation is complete
- **When** The results are displayed
- **Then** I should see a success MessageBar showing:
  - "✅ Content generated in {duration}s — {termination_reason}"
  - Example: "✅ Content generated in 42.5s — Reviewer approved — fast-tracked to Publisher"

### AC2: Tab Navigation Display

- **Given** Content has been generated
- **When** I view the results area
- **Then** I should see two tabs:
  1. "📝 Platform Posts" (default selected)
  2. "🧠 Agent Transcript"

### AC3: Platform Posts Display

- **Given** I am viewing the "Platform Posts" tab
- **When** The results load
- **Then** I should see 3 expandable post cards:
  1. **LinkedIn** (💼 icon, blue theme)
     - Professional-adventurous tone
     - 1-3 paragraphs
     - 3-5 hashtags including #ZavaTravel
  2. **X / Twitter** (𝕏 icon, blue theme)
     - Punchy message under 280 characters
     - Character count displayed (e.g., "198/280 characters")
     - 2-3 hashtags
  3. **Instagram** (📸 icon, pink theme)
     - Visual-friendly with emojis
     - Storytelling tone
     - 5-10 hashtags
     - Engagement prompt

### AC4: Post Content Display

- **Given** I am viewing a platform post card
- **When** The card is rendered
- **Then** Each post should display:
  - Platform icon and name in header
  - "Copy" button in header
  - Post content in a formatted text box
  - Gray background box with rounded corners
  - Preserved line breaks and formatting

### AC5: Twitter Character Count

- **Given** I am viewing the Twitter post
- **When** The post content is displayed
- **Then** I should see a character count indicator
  - Display format: "{count}/280 characters"
  - Green color if count ≤ 280
  - Red color if count > 280

### AC6: Workflow Summary Statistics

- **Given** Content has been generated
- **When** I scroll to the bottom of results
- **Then** I should see a workflow summary card with 4 badges:
  1. ⏱️ {duration}s (teal badge)
  2. 💬 {count} agent turns (green badge)
  3. 📋 3 platform posts (orange badge)
  4. 🔒 Security: Clean (purple badge)

## Priority

Critical

## Estimated Story Points

5

## Dependencies

- Content generation workflow completion (US-004)
- Mock API returning structured post data
- Tab component functionality

## Technical Notes

- Default active tab: "posts"
- Post content uses `whiteSpace: 'pre-wrap'` to preserve formatting
- Platform configuration:
  ```typescript
  {
    linkedin: { emoji: '💼', color: '#0077B5', label: 'LinkedIn' },
    twitter: { emoji: '𝕏', color: '#1DA1F2', label: 'X / Twitter' },
    instagram: { emoji: '📸', color: '#E4405F', label: 'Instagram' }
  }
  ```
- Character count is calculated client-side: `content.length`

## UI Components

- Fluent UI components: Card, Title2-3, Body2, Caption1, MessageBar, TabList, Tab, Badge
- Icons: Platform-specific emojis
- Layout: Stacked vertical cards with hover effects

## Sample Post Lengths

- LinkedIn: ~350-500 characters
- Twitter: ~180-280 characters (must be under 280)
- Instagram: ~600-800 characters with multiple emojis
