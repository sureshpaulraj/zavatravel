# Zava Travel Content Studio - Automated Functional Tests

Comprehensive Playwright test suite covering all 84 functional test cases across 10 user stories.

## 📋 Test Coverage

| User Story | Test Cases       | Description                  | Status         |
| ---------- | ---------------- | ---------------------------- | -------------- |
| US-001     | TC-001 to TC-015 | User Login                   | ✅ Implemented |
| US-002     | TC-016 to TC-021 | View Dashboard               | ✅ Implemented |
| US-003     | TC-022 to TC-033 | Submit Campaign Brief        | ✅ Implemented |
| US-004     | TC-034 to TC-038 | Agent Collaboration Progress | ✅ Implemented |
| US-005     | TC-039 to TC-045 | View Generated Posts         | ✅ Implemented |
| US-006     | TC-046 to TC-053 | Copy to Clipboard            | ✅ Implemented |
| US-007     | TC-054 to TC-060 | Agent Transcript             | ✅ Implemented |
| US-008     | TC-061 to TC-069 | Sidebar Navigation           | ✅ Implemented |
| US-009     | TC-070 to TC-077 | Logout                       | ✅ Implemented |
| US-010     | TC-078 to TC-084 | Empty State                  | ✅ Implemented |

**Total**: 84 test cases

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Application running at URL defined in `.env` as `WEBSITE_ENTRY_POINT`

### Installation

```powershell
# Navigate to test directory
cd FunctionalTestCases

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Environment Configuration

The tests automatically read the `WEBSITE_ENTRY_POINT` variable from the parent `.env` file:

```env
WEBSITE_ENTRY_POINT=http://localhost:5173/
```

**Important**: Do not hardcode URLs in tests - they use the environment variable for flexibility.

## 🧪 Running Tests

### Run All Tests

```powershell
npm test
```

### Run Tests by User Story

```powershell
npm run test:us001  # Login tests
npm run test:us002  # Dashboard tests
npm run test:us003  # Campaign Brief tests
npm run test:us004  # Agent Collaboration tests
npm run test:us005  # Generated Posts tests
```

### Run Tests by Browser

```powershell
npm run test:chromium  # Chrome/Edge
npm run test:firefox   # Firefox
npm run test:webkit    # Safari
npm run test:mobile    # Mobile browsers
```

### Debug Mode

```powershell
npm run test:debug
```

### UI Mode (Interactive)

```powershell
npm run test:ui
```

### Headed Mode (See Browser)

```powershell
npm run test:headed
```

## 📊 Test Reports

After running tests, view the HTML report:

```powershell
npm run report
```

Reports are generated in:

- `playwright-report/` - HTML report
- `test-results/` - JSON and JUnit reports

## 🏗️ Project Structure

```
FunctionalTestCases/
├── tests/                          # Test specifications
│   ├── US-001-Login.spec.ts       # Login tests (TC-001 to TC-015)
│   ├── US-002-Dashboard.spec.ts   # Dashboard tests (TC-016 to TC-021)
│   ├── US-003-Campaign-Brief.spec.ts
│   ├── US-004-Agent-Collaboration.spec.ts
│   ├── US-005-Generated-Posts.spec.ts
│   ├── US-006-Copy-Clipboard.spec.ts      # Copy functionality (TC-046 to TC-053)
│   ├── US-007-Agent-Transcript.spec.ts    # Transcript tab (TC-054 to TC-060)
│   ├── US-008-Navigation.spec.ts          # Sidebar navigation (TC-061 to TC-069)
│   ├── US-009-Logout.spec.ts              # Logout flows (TC-070 to TC-077)
│   └── US-010-Empty-State.spec.ts         # Empty state (TC-078 to TC-084)
├── helpers/
│   └── test-helpers.ts            # Reusable functions
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Dependencies & scripts
├── Functional-Test-Cases.json     # Source test case specifications
├── Functional-Test-Cases.csv      # Excel-readable test cases
└── README.md                      # This file
```

## 🔧 Test Helpers

Common functions in `helpers/test-helpers.ts`:

- `login()` - Login with credentials
- `loginWithDemoAccount()` - Quick login with demo account
- `navigateToCreateContent()` - Navigate to Create Content page
- `fillCampaignBrief()` - Fill campaign brief form
- `submitCampaignBrief()` - Submit form and wait for generation
- `logout()` - Logout from application
- `verifySidebarDisplay()` - Verify sidebar elements

## 📝 Demo Accounts

| User         | Username         | Password   | Role                 |
| ------------ | ---------------- | ---------- | -------------------- |
| Sarah Chen   | sarah.explorer   | zava2026   | Content Lead         |
| Marco Rivera | marco.adventures | wander2026 | Social Media Manager |
| Admin        | admin            | admin      | Administrator        |

## ✅ Test Design Principles

1. **No Hardcoded URLs** - All URLs use `baseURL` from config which reads from `.env`
2. **Test Independence** - Each test can run in isolation
3. **Clear Naming** - Test IDs match functional test cases (TC-001, TC-002, etc.)
4. **Reusable Helpers** - Common actions extracted to helper functions
5. **Comprehensive Assertions** - Multiple verifications per test
6. **Wait Strategies** - Proper waits for dynamic content (3s generation time)

## 🐛 Debugging Tips

1. **Use UI Mode**: `npm run test:ui` for interactive debugging
2. **Use Debug Mode**: `npm run test:debug` to step through tests
3. **Check Screenshots**: Failed tests auto-capture screenshots
4. **Check Videos**: Failed tests record video
5. **Check Traces**: View detailed trace with `npx playwright show-trace trace.zip`

## 📈 Continuous Integration

Configure in CI/CD pipelines:

```yaml
- name: Run Playwright Tests
  run: |
    cd FunctionalTestCases
    npm ci
    npx playwright install --with-deps
    npm test
```

## 🔒 Test Data

Test data is defined in `helpers/test-helpers.ts`:

- `DEMO_ACCOUNTS` - User credentials
- `DEFAULT_CAMPAIGN_BRIEF` - Form default values

## 📞 Support

For questions or issues:

1. Check Playwright documentation: https://playwright.dev
2. Review test case specifications in `Functional-Test-Cases.json`
3. Check functional test instructions in `.github/instructions/FunctionalTestInstructions.md`

## ✅ Implementation Complete

All 84 functional test cases across 10 user stories have been successfully implemented:

- ✅ **15 Login tests** (US-001): Authentication, demo accounts, form validation
- ✅ **6 Dashboard tests** (US-002): Hero section, statistics, agent team, destinations
- ✅ **12 Campaign Brief tests** (US-003): Form display, editing, submission
- ✅ **5 Agent Collaboration tests** (US-004): Loading states, progress tracking, duration
- ✅ **7 Generated Posts tests** (US-005): Content display, tabs, character counts
- ✅ **8 Copy to Clipboard tests** (US-006): All platforms, validation, content preservation
- ✅ **7 Agent Transcript tests** (US-007): Message display, formatting, tab navigation
- ✅ **9 Navigation tests** (US-008): Sidebar, routing, active states, logo navigation
- ✅ **8 Logout tests** (US-009): Session termination, redirect, re-login
- ✅ **7 Empty State tests** (US-010): Visibility conditions, state transitions

### Test Quality Standards

Each test implementation follows best practices:

- ✅ Uses functional test case specifications from JSON
- ✅ Implements reusable helper functions for common actions
- ✅ Includes comprehensive assertions matching acceptance criteria
- ✅ Supports multi-browser testing (Chrome, Firefox, Safari, Mobile)
- ✅ Properly waits for async operations (agent generation ~3s)
- ✅ No hardcoded URLs - uses environment variables
- ✅ Independent tests that can run in any order
- ✅ Clear test names matching TC-### format

### Ready to Run

The complete test suite is ready for:

- ✅ Local development testing
- ✅ CI/CD pipeline integration
- ✅ Cross-browser validation
- ✅ Regression testing
- ✅ Quality assurance workflows

See [QUICKSTART.md](QUICKSTART.md) for installation and usage instructions.
