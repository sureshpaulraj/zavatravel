# User Story 06: Copy Posts to Clipboard

## Story ID

US-006

## Title

Copy Generated Posts to Clipboard

## As a

Content Creator or Social Media Manager

## I want to

Copy individual platform posts to my clipboard with a single click

## So that

I can easily paste the content into LinkedIn, Twitter, or Instagram for publishing

## Acceptance Criteria

### AC1: Copy Button Display

- **Given** I am viewing generated platform posts
- **When** I look at any post card header
- **Then** I should see a "Copy" button with a document copy icon (📋)

### AC2: Copy to Clipboard Action

- **Given** I am viewing a generated post
- **When** I click the "Copy" button
- **Then** The full post content should be copied to my system clipboard
- **And** The button should change to show:
  - Checkmark icon (✓)
  - Text: "Copied!"
  - Visual feedback of successful copy

### AC3: Copy Confirmation Timeout

- **Given** I have clicked "Copy" on a post
- **When** The button shows "Copied!" confirmation
- **Then** After 2 seconds, the button should revert to:
  - Original document copy icon
  - Text: "Copy"

### AC4: Independent Copy States

- **Given** I have copied one platform post (e.g., LinkedIn)
- **When** I click "Copy" on another post (e.g., Twitter)
- **Then** Only the Twitter button should show "Copied!"
- **And** The LinkedIn button should revert to "Copy"

### AC5: Copy Content Preservation

- **Given** I have copied a post to clipboard
- **When** I paste the content elsewhere (e.g., Notepad, Twitter composer)
- **Then** The pasted content should:
  - Match the displayed post content exactly
  - Preserve all line breaks
  - Preserve all emojis, hashtags, and special characters
  - Not include any HTML or markdown formatting

### AC6: Copy Functionality for All Platforms

- **Given** I am viewing generated posts
- **When** I test the copy functionality
- **Then** Each platform post should be independently copyable:
  - LinkedIn post (typically 350-500 chars)
  - Twitter post (typically 180-280 chars)
  - Instagram post (typically 600-800 chars)

## Priority

High

## Estimated Story Points

2

## Dependencies

- Generated posts must be displayed (US-005)
- Browser clipboard API must be available (navigator.clipboard)
- Modern browser support (Chrome 63+, Firefox 53+, Safari 13.1+)

## Technical Notes

- Uses `navigator.clipboard.writeText()` API
- Copy state tracked with React state: `const [copied, setCopied] = useState<string | null>(null)`
- Timeout: `setTimeout(() => setCopied(null), 2000)`
- If clipboard API unavailable, button should be disabled or hidden
- Implementation:
  ```typescript
  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };
  ```

## UI Components

- Fluent UI components: Button (subtle appearance)
- Icons: DocumentCopyRegular, CheckmarkRegular
- Button styling: Subtle appearance, transitions smoothly between states

## Browser Compatibility

- Requires HTTPS or localhost (clipboard API security requirement)
- Fallback: None specified in current implementation (production should include one)
- Mobile: Works on iOS Safari 13.1+ and Android Chrome 63+
