# User Story 03: Submit Campaign Brief

## Story ID

US-003

## Title

Submit Campaign Brief for Content Generation

## As a

Content Creator or Social Media Manager

## I want to

Fill out and submit a campaign brief form

## So that

The AI agents can generate platform-ready social media content based on my specifications

## Acceptance Criteria

### AC1: Campaign Brief Form Display

- **Given** I am on the Create Content page
- **When** the page loads
- **Then** I should see a campaign brief form with the following fields:
  - Brand (input field)
  - Industry (input field)
  - Target Audience (input field)
  - Key Message (textarea, multi-line)
  - Destinations (input field)
  - "Generate Content" button with sparkle icon

### AC2: Pre-filled Default Values

- **Given** I navigate to the Create Content page
- **When** the form loads
- **Then** The form should be pre-filled with default Zava Travel values:
  - Brand: "Zava Travel Inc."
  - Industry: "Travel — Budget-Friendly Adventure"
  - Target Audience: "Millennials & Gen-Z adventure seekers"
  - Key Message: "Wander More, Spend Less — affordable curated itineraries..."
  - Destinations: "Bali, Patagonia, Iceland, Vietnam, Costa Rica"

### AC3: Form Field Editing

- **Given** I am viewing the campaign brief form
- **When** I click on any input field
- **And** I type or modify the content
- **Then** The field value should update in real-time
- **And** The "Generate Content" button should remain enabled

### AC4: Submit Campaign Brief

- **Given** I have filled out the campaign brief form
- **When** I click the "Generate Content" button
- **Then** The button should:
  - Change text to "Agents Working..."
  - Show a spinner icon
  - Become disabled
- **And** A loading card should appear showing agent collaboration progress

### AC5: Empty Form Submission

- **Given** I am on the Create Content page
- **When** The form has empty fields
- **Then** I should still be able to click "Generate Content"
- **Note**: Form validation is not strict in demo mode

### AC6: Navigate to Create Content

- **Given** I am logged in
- **When** I click "Create Content" in the sidebar navigation or "Create New Content" on Dashboard
- **Then** I should be navigated to the Create Content page (/create)

## Priority

Critical

## Estimated Story Points

5

## Dependencies

- User must be authenticated
- Frontend routing configured for /create path
- Mock API service available (getMockResult function)

## Technical Notes

- Form uses controlled components with React state
- Submission triggers 3-second simulated workflow
- In production, form data would be sent to Python backend at /api/generate
- Default brief represents Zava Travel's "Wander More, Spend Less" campaign
- Platforms are implicitly set to: LinkedIn, Twitter, Instagram

## UI Components

- Fluent UI components: Card, Input, Textarea, Button, Caption1
- Form is sticky-positioned on left side (desktop view)
- Icons: SparkleRegular (generate), Spinner (loading)
- Primary button color: #0891B2 (teal)

## Form Fields Schema

```typescript
interface CampaignBrief {
  brand_name: string;
  industry: string;
  target_audience: string;
  key_message: string;
  destinations: string;
  platforms: string[]; // Always ['LinkedIn', 'Twitter', 'Instagram']
}
```
