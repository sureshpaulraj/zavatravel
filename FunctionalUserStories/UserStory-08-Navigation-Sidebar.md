# User Story 08: Navigate Using Sidebar

## Story ID

US-008

## Title

Navigate Application Using Sidebar Menu

## As a

Authenticated user

## I want to

Navigate between different pages using the sidebar menu

## So that

I can easily access Dashboard and Create Content features

## Acceptance Criteria

### AC1: Sidebar Display

- **Given** I am logged in
- **When** I view any page in the application
- **Then** I should see a sidebar on the left side containing:
  - Zava Travel logo (airplane icon ✈️ + "Zava Travel" text)
  - Navigation menu with 2 items
  - User profile section at bottom
  - Gradient background (Navy #1E3A5F to Teal #0891B2)

### AC2: Navigation Menu Items

- **Given** I am viewing the sidebar
- **When** I look at the navigation menu
- **Then** I should see 2 navigation items:
  1. 🏠 Dashboard (HomeRegular icon)
  2. ➕ Create Content (AddRegular icon)

### AC3: Navigate to Dashboard

- **Given** I am on any page
- **When** I click the "Dashboard" menu item
- **Then** I should be navigated to the Dashboard page (/)
- **And** The Dashboard menu item should be highlighted with:
  - White background overlay (20% opacity)
  - Bold font weight (600)
  - Full white color

### AC4: Navigate to Create Content

- **Given** I am on any page
- **When** I click the "Create Content" menu item
- **Then** I should be navigated to the Create Content page (/create)
- **And** The Create Content menu item should be highlighted

### AC5: Active Page Indicator

- **Given** I am on a specific page
- **When** I view the sidebar
- **Then** The corresponding menu item should show active state:
  - Background: rgba(255,255,255,0.2)
  - Text color: white
  - Font weight: 600
- **And** Other menu items should show default state:
  - No background
  - Text color: rgba(255,255,255,0.8)
  - Normal font weight

### AC6: Menu Item Hover State

- **Given** I am viewing the sidebar
- **When** I hover over any menu item (not active)
- **Then** The menu item should show hover state:
  - Background: rgba(255,255,255,0.15)
  - Text color: white
  - Smooth transition effect

### AC7: Logo Click Navigation

- **Given** I am on any page
- **When** I click the Zava Travel logo at the top of the sidebar
- **Then** I should be navigated to the Dashboard page (/)

### AC8: User Profile Section Display

- **Given** I am logged in
- **When** I view the bottom of the sidebar
- **Then** I should see:
  - Border separator line (white, 20% opacity)
  - User avatar (emoji icon)
  - User display name (e.g., "Sarah Chen")
  - User role (e.g., "Content Lead")
  - Logout button

## Priority

High

## Estimated Story Points

3

## Dependencies

- User authentication (US-001)
- React Router navigation
- AuthContext providing user data
- Layout component wrapping authenticated routes

## Technical Notes

- Sidebar width: 260px
- Fixed position on left side
- Uses `useLocation()` hook to determine active page
- Navigation items array:
  ```typescript
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <HomeRegular /> },
    { path: '/create', label: 'Create Content', icon: <AddRegular /> }
  ]
  ```
- Active state determined by: `location.pathname === item.path`

## UI Components

- Fluent UI components: Button, Title3, Body1, Caption1, Avatar, Tooltip
- Icons: AirplaneRegular, HomeRegular, AddRegular, SignOutRegular
- Gradient: `linear-gradient(180deg, #1E3A5F 0%, #0891B2 100%)`

## Responsive Behavior

- Desktop: Sidebar always visible (260px fixed width)
- Tablet/Mobile: Not specified in current implementation (potential future enhancement)

## Accessibility

- Keyboard navigation support through Fluent UI Button components
- ARIA labels should be added for screen readers
- Focus indicators provided by Fluent UI
