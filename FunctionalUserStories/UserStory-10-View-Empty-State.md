# User Story 10: View Empty State on Create Content Page

## Story ID

US-010

## Title

View Empty State Before Content Generation

## As a

Content Creator or Social Media Manager

## I want to

See a helpful empty state message when no content has been generated yet

## So that

I understand what to do next and know the page is working correctly

## Acceptance Criteria

### AC1: Initial Page Load Empty State

- **Given** I navigate to the Create Content page
- **When** No content has been generated yet
- **And** No generation is in progress
- **Then** I should see an empty state card in the results area displaying:
  - Large airplane emoji: ✈️ (48px font size)
  - Title: "Ready to Create" (in gray color #94A3B8)
  - Description: "Fill in the campaign brief and click 'Generate Content' to start the multi-agent workflow"
  - Dashed border (2px, gray #CBD5E1)
  - Centered content

### AC2: Empty State Styling

- **Given** I am viewing the empty state
- **When** The card is rendered
- **Then** The card should have:
  - Large padding: 60px
  - Text alignment: center
  - Border radius: 12px
  - Dashed border style (not solid)
  - Border color: #CBD5E1 (neutral gray)
  - White background

### AC3: Empty State Visibility Conditions

- **Given** I am on the Create Content page
- **When** The following conditions are met:
  - `result === null` (no generated content)
  - `isGenerating === false` (not currently generating)
- **Then** The empty state should be visible
- **And** The loading state should NOT be visible
- **And** The results tabs should NOT be visible

### AC4: Empty State Disappears on Generation Start

- **Given** I am viewing the empty state
- **When** I click "Generate Content"
- **Then** The empty state should immediately disappear
- **And** The loading state should be displayed instead

### AC5: Empty State Returns After Page Refresh

- **Given** I have viewed generated content
- **When** I refresh the page (or navigate away and back)
- **Then** The empty state should be displayed again
- **And** Previous results should NOT persist

### AC6: Form Still Visible with Empty State

- **Given** I am viewing the empty state
- **When** I look at the page layout
- **Then** The campaign brief form should still be visible on the left
- **And** The form should be pre-filled with default values
- **And** The "Generate Content" button should be enabled

## Priority

Low

## Estimated Story Points

1

## Dependencies

- Create Content page must be accessible (US-003)
- State management for result and isGenerating

## Technical Notes

- Empty state is conditionally rendered:
  ```typescript
  {!result && !isGenerating && (
    <Card>Empty State Content</Card>
  )}
  ```
- No API calls or complex logic required
- Pure presentational component
- Part of the three-state system:
  1. Empty (no results yet)
  2. Loading (generation in progress)
  3. Results (content generated)

## UI Components

- Fluent UI components: Card, Title2, Body1
- Emoji: ✈️ (matches Zava Travel brand)
- Color scheme:
  - Text: #94A3B8 (neutral gray)
  - Border: #CBD5E1 (light gray)
  - Background: white

## User Experience Purpose

- Reduces confusion for first-time users
- Provides clear call-to-action guidance
- Indicates the page is ready and functioning
- Sets expectations for the workflow
- Maintains consistent branding with airplane emoji

## Accessibility

- Semantic HTML structure
- Sufficient color contrast for gray text
- Clear, readable instructions
- Descriptive text alternatives for visual elements
