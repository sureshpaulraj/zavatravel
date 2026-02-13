# Quick Start Guide - Playwright Automated Tests

This guide will help you set up and run the Playwright automated test suite for Zava Travel Content Studio.

## Prerequisites

✅ Node.js 18+ installed  
✅ Application configured with `WEBSITE_ENTRY_POINT` in parent `.env` file  
✅ Frontend application ready to run (or will auto-start)

## Step 1: Install Dependencies

Open PowerShell and navigate to the test directory:

```powershell
cd FunctionalTestCases
npm install
```

This will install:

- `@playwright/test` - Test framework
- `dotenv` - Environment variable management
- `typescript` - TypeScript compiler
- Type definitions for Node.js

## Step 2: Install Playwright Browsers

```powershell
npx playwright install
```

This downloads Chrome, Firefox, and WebKit browsers needed for testing.

**Optional**: Install only Chromium for faster setup:

```powershell
npx playwright install chromium
```

## Step 3: Verify Environment Configuration

Ensure the parent `.env` file contains:

```env
WEBSITE_ENTRY_POINT=http://localhost:5173/
```

The tests will automatically read this value - **no hardcoded URLs!**

## Step 4: Run Your First Test

Run all tests in Chromium:

```powershell
npm run test:chromium
```

Or run a specific user story:

```powershell
npm run test:us001  # Login tests
```

## Step 5: View Test Results

After tests complete, view the HTML report:

```powershell
npm run report
```

This opens an interactive report showing:

- ✅ Passed tests
- ❌ Failed tests
- Screenshots of failures
- Test execution timeline

## Common Commands

### Development & Debugging

```powershell
# Run tests with browser visible (headed mode)
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Debug a specific test
npm run test:debug

# Run specific user story
npm run test:us001   # Login
npm run test:us002   # Dashboard
npm run test:us003   # Campaign Brief
# ... etc
```

### Run Tests by Browser

```powershell
npm run test:chromium  # Chrome/Edge
npm run test:firefox   # Firefox
npm run test:webkit    # Safari
npm run test:mobile    # Mobile browsers
```

### Run All Tests

```powershell
npm test  # Run all 84 tests across all browsers
```

## Understanding Test Results

### Test Status

- ✅ **PASSED**: Test executed successfully, all assertions passed
- ❌ **FAILED**: One or more assertions failed
- ⏭️ **SKIPPED**: Test was skipped (not common in this suite)
- ⏱️ **TIMEOUT**: Test exceeded 30-second limit

### Common Issues & Solutions

#### Issue: "Cannot find module '@playwright/test'"

**Solution**: Run `npm install` in the `FunctionalTestCases` folder

#### Issue: "Error: page.goto: net::ERR_CONNECTION_REFUSED"

**Solution**: Ensure frontend is running on the URL specified in `.env`. The config will auto-start it, but check the port matches.

#### Issue: "Timeout waiting for element"

**Solution**: Check if the application loaded correctly. Try running in headed mode: `npm run test:headed`

#### Issue: Tests fail on clipboard operations

**Solution**: Clipboard tests require permissions. They auto-grant permissions, but some may fail in headless mode. Run with `--headed` flag.

## Test Organization

Tests are organized by user story:

```
tests/
├── US-001-Login.spec.ts          # 15 tests: Authentication
├── US-002-Dashboard.spec.ts      # 6 tests: Dashboard display
├── US-003-Campaign-Brief.spec.ts # 12 tests: Form handling
├── US-004-Agent-Collaboration.spec.ts # 5 tests: Loading states
├── US-005-Generated-Posts.spec.ts # 7 tests: Content display
├── US-006-Copy-Clipboard.spec.ts # 8 tests: Copy functionality
├── US-007-Agent-Transcript.spec.ts # 7 tests: Transcript view
├── US-008-Navigation.spec.ts     # 9 tests: Sidebar & routing
├── US-009-Logout.spec.ts         # 8 tests: Session management
└── US-010-Empty-State.spec.ts    # 7 tests: Empty state display
```

## Sample Test Execution

Here's what a typical test run looks like:

```powershell
PS C:\Projects\HackFest\zavatravel\FunctionalTestCases> npm test

Running 84 tests using 4 workers

  ✓ US-001: User Login (15/15)
  ✓ US-002: View Dashboard (6/6)
  ✓ US-003: Submit Campaign Brief (12/12)
  ✓ US-004: View Agent Collaboration (5/5)
  ✓ US-005: View Generated Posts (7/7)
  ✓ US-006: Copy to Clipboard (8/8)
  ✓ US-007: View Agent Transcript (7/7)
  ✓ US-008: Navigation Sidebar (9/9)
  ✓ US-009: User Logout (8/8)
  ✓ US-010: View Empty State (7/7)

  84 passed (2.3m)
```

## Next Steps

1. ✅ Run all tests: `npm test`
2. 📊 Review report: `npm run report`
3. 🐛 Debug failures: `npm run test:debug`
4. 🔄 Integrate into CI/CD pipeline
5. 📈 Monitor test trends over time

## Tips for Success

💡 **Run tests frequently** during development to catch regressions early  
💡 **Use UI mode** (`npm run test:ui`) for interactive debugging  
💡 **Check screenshots** in `test-results/` folder when tests fail  
💡 **Update tests** when UI changes to keep them synchronized  
💡 **Run specific tests** during development instead of full suite

## Getting Help

- 📖 Playwright Docs: https://playwright.dev
- 📋 Functional Test Cases: `Functional-Test-Cases.json`
- 📝 Test Instructions: `.github/instructions/FunctionalTestInstructions.md`
- 🔧 Helper Functions: `helpers/test-helpers.ts`

---

**Ready to test?** Run `npm install` and `npx playwright install` to get started! 🚀
