# User Story 01: User Login

## Story ID

US-001

## Title

Login to Zava Travel Content Studio

## As a

Content Creator or Social Media Manager

## I want to

Log into the Zava Travel Content Studio using my credentials

## So that

I can access the platform and create AI-powered social media content

## Acceptance Criteria

### AC1: Login Page Display

- **Given** I navigate to the application
- **When** I am not authenticated
- **Then** I should see:
  - Left panel with Zava Travel branding and destination badges (Bali, Patagonia, Iceland, Vietnam, Costa Rica)
  - Right panel with login form
  - Username and password input fields
  - "Sign In" button
  - Demo accounts section with 3 demo users

### AC2: Successful Login

- **Given** I am on the login page
- **When** I enter valid credentials (e.g., "sarah.explorer" / "zava2026")
- **And** I click "Sign In"
- **Then** I should be redirected to the Dashboard
- **And** I should see a personalized greeting with my display name

### AC3: Failed Login

- **Given** I am on the login page
- **When** I enter invalid credentials
- **And** I click "Sign In"
- **Then** I should see an error message: "Invalid username or password. Try a demo account below."
- **And** I should remain on the login page

### AC4: Demo Account Auto-Fill

- **Given** I am on the login page
- **When** I click on a demo account (e.g., "Sarah Chen - Content Lead")
- **Then** The username and password fields should be auto-filled
- **And** The error message (if any) should be cleared

### AC5: Password Visibility Toggle

- **Given** I am on the login page
- **When** I click the eye icon in the password field
- **Then** The password should toggle between visible and hidden

## Priority

Critical

## Estimated Story Points

3

## Dependencies

- Authentication context must be configured
- Demo accounts data must be available

## Technical Notes

- Three demo accounts available:
  1. sarah.explorer / zava2026 (Sarah Chen - Content Lead) 🧭
  2. marco.adventures / wander2026 (Marco Rivera - Social Media Manager) 🌍
  3. admin / admin (Zava Admin - Administrator) ⚙️
- Password validation is client-side only (demo mode)
- Session persists in React state (no backend authentication)

## UI Components

- Fluent UI components: Card, Input, Button, MessageBar, Badge
- Icons: PersonRegular, LockClosedRegular, AirplaneRegular, EyeOffRegular, EyeRegular
- Gradient background: linear-gradient(135deg, #0891B2 0%, #1E3A5F 50%, #F97316 100%)
