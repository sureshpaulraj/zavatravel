# User Story 09: User Logout

## Story ID

US-009

## Title

Logout from Zava Travel Content Studio

## As a

Authenticated user

## I want to

Logout of the application when I'm done

## So that

I can securely end my session and prevent unauthorized access to my account

## Acceptance Criteria

### AC1: Logout Button Display

- **Given** I am logged in
- **When** I view the sidebar
- **Then** I should see a user profile section at the bottom containing:
  - User avatar (emoji icon, e.g., 🧭, 🌍, ⚙️)
  - User display name (e.g., "Sarah Chen")
  - User role (e.g., "Content Lead")
  - "Sign Out" button with sign-out icon

### AC2: Initiate Logout

- **Given** I am logged in on any page
- **When** I click the "Sign Out" button in the sidebar
- **Then** The logout action should be triggered

### AC3: Session Termination

- **Given** I have clicked "Sign Out"
- **When** The logout completes
- **Then** My user session should be terminated
- **And** User data should be cleared from AuthContext
- **And** `isAuthenticated` should become `false`

### AC4: Redirect to Login

- **Given** I have successfully logged out
- **When** The session is terminated
- **Then** I should be immediately redirected to the Login page
- **And** I should see the full login screen (left panel + right panel)
- **And** Username and password fields should be empty

### AC5: Navigation Prevention After Logout

- **Given** I have logged out
- **When** I try to navigate to protected routes (e.g., /dashboard, /create)
- **Then** I should be redirected to the Login page
- **And** I should not be able to access authenticated content

### AC6: Re-login After Logout

- **Given** I have logged out
- **When** I enter valid credentials on the Login page
- **And** I click "Sign In"
- **Then** I should be able to log back in successfully
- **And** Be redirected to the Dashboard

### AC7: Logout Button Appearance

- **Given** I am viewing the user profile section
- **When** I look at the logout button
- **Then** It should:
  - Have a "subtle" appearance (not prominent)
  - Display "Sign Out" text
  - Show a SignOutRegular icon
  - Have a hover effect (slight color change)

## Priority

High

## Estimated Story Points

2

## Dependencies

- User must be authenticated (US-001)
- AuthContext must provide logout() function
- React Router for redirection
- Layout component displaying logout button

## Technical Notes

- Logout function in AuthContext:
  ```typescript
  const logout = () => setUser(null);
  ```
- No backend API call needed (demo mode with client-side auth)
- Session data stored only in React state (not persisted)
- After logout, app re-renders with `isAuthenticated === false`
- App.tsx checks authentication and shows LoginPage if false:
  ```typescript
  if (!isAuthenticated) {
    return <LoginPage />
  }
  ```

## UI Components

- Fluent UI components: Button (subtle appearance), Avatar, Body1, Caption1
- Icons: SignOutRegular
- User section styling:
  - Border top: 1px solid rgba(255,255,255,0.2)
  - Padding top: 16px
  - Display: flex with 12px gap

## Security Considerations

- No session persistence (state cleared on page refresh)
- No local storage or session storage used
- In production, would include:
  - Token invalidation
  - Backend session cleanup
  - Secure HTTP-only cookies removal

## User Experience

- Logout is instant (no loading state needed)
- No confirmation dialog (future enhancement opportunity)
- Clean transition back to login page
- No error handling needed for demo mode
