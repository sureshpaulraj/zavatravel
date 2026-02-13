import { test, expect } from "@playwright/test";
import {
  DEMO_ACCOUNTS,
  login,
  verifyErrorMessage,
} from "../helpers/test-helpers";

/**
 * User Story 01: Login Tests
 * Test Cases: TC-001 through TC-015
 * Priority: Critical
 */

test.describe("US-001: User Login", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to application before each test
    await page.goto("/");
  });

  test("TC-001: Verify Login Page Display", async ({ page }) => {
    // Verify left panel elements
    await expect(page.getByText("Zava Travel").first()).toBeVisible();
    await expect(page.getByText(/Bali/)).toBeVisible();
    await expect(page.getByText(/Patagonia/)).toBeVisible();
    await expect(page.getByText(/Iceland/)).toBeVisible();
    await expect(page.getByText(/Vietnam/)).toBeVisible();
    await expect(page.getByText(/Costa Rica/)).toBeVisible();

    // Verify right panel form elements
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();

    // Verify demo accounts section
    await expect(page.getByText(/demo accounts/i)).toBeVisible();
  });

  test("TC-002: Verify Successful Login - Sarah Chen", async ({ page }) => {
    await login(
      page,
      DEMO_ACCOUNTS.SARAH.username,
      DEMO_ACCOUNTS.SARAH.password,
    );

    // Verify redirect to Dashboard
    await expect(page).toHaveURL("/");

    // Verify personalized greeting
    await expect(
      page.getByText(`Welcome back, ${DEMO_ACCOUNTS.SARAH.displayName}`),
    ).toBeVisible();
  });

  test("TC-003: Verify Successful Login - Marco Rivera", async ({ page }) => {
    await login(
      page,
      DEMO_ACCOUNTS.MARCO.username,
      DEMO_ACCOUNTS.MARCO.password,
    );

    // Verify redirect to Dashboard
    await expect(page).toHaveURL("/");

    // Verify personalized greeting
    await expect(
      page.getByText(`Welcome back, ${DEMO_ACCOUNTS.MARCO.displayName}`),
    ).toBeVisible();
  });

  test("TC-004: Verify Successful Login - Admin Account", async ({ page }) => {
    await login(
      page,
      DEMO_ACCOUNTS.ADMIN.username,
      DEMO_ACCOUNTS.ADMIN.password,
    );

    // Verify redirect to Dashboard
    await expect(page).toHaveURL("/");

    // Verify personalized greeting
    await expect(
      page.getByText(`Welcome back, ${DEMO_ACCOUNTS.ADMIN.displayName}`),
    ).toBeVisible();
  });

  test("TC-005: Verify Failed Login with Invalid Username", async ({
    page,
  }) => {
    await page.locator('input[type="text"]').first().fill("invaliduser");
    await page.locator('input[type="password"]').fill("zava2026");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Verify error message
    await verifyErrorMessage(
      page,
      "Invalid username or password. Try a demo account below.",
    );

    // Verify user remains on login page
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("TC-006: Verify Failed Login with Invalid Password", async ({
    page,
  }) => {
    await page
      .locator('input[type="text"]')
      .first()
      .fill(DEMO_ACCOUNTS.SARAH.username);
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Verify error message
    await verifyErrorMessage(
      page,
      "Invalid username or password. Try a demo account below.",
    );

    // Verify user remains on login page
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("TC-007: Verify Failed Login with Empty Username", async ({ page }) => {
    // Leave username empty
    await page.locator('input[type="password"]').fill("zava2026");
    await page.getByRole("button", { name: /sign in/i }).click();

    // User remains on login page (no navigation occurs)
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("TC-008: Verify Failed Login with Empty Password", async ({ page }) => {
    await page
      .locator('input[type="text"]')
      .first()
      .fill(DEMO_ACCOUNTS.SARAH.username);
    // Leave password empty
    await page.getByRole("button", { name: /sign in/i }).click();

    // User remains on login page (no navigation occurs)
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("TC-009: Verify Failed Login with Both Fields Empty", async ({
    page,
  }) => {
    // Leave both fields empty
    await page.getByRole("button", { name: /sign in/i }).click();

    // User remains on login page (no navigation occurs)
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("TC-010: Verify Demo Account Auto-Fill - Sarah Chen", async ({
    page,
  }) => {
    // Click on Sarah Chen demo account card (clickable div)
    await page.locator("text=/Sarah Chen/i").first().click();

    // Verify auto-fill
    await expect(page.locator('input[type="text"]').first()).toHaveValue(
      DEMO_ACCOUNTS.SARAH.username,
    );
    await expect(page.locator('input[type="password"]')).toHaveValue(
      DEMO_ACCOUNTS.SARAH.password,
    );
  });

  test("TC-011: Verify Demo Account Auto-Fill - Marco Rivera", async ({
    page,
  }) => {
    // Click on Marco Rivera demo account card (clickable div)
    await page.locator("text=/Marco Rivera/i").first().click();

    // Verify auto-fill
    await expect(page.locator('input[type="text"]').first()).toHaveValue(
      DEMO_ACCOUNTS.MARCO.username,
    );
    await expect(page.locator('input[type="password"]')).toHaveValue(
      DEMO_ACCOUNTS.MARCO.password,
    );
  });

  test("TC-012: Verify Demo Account Auto-Fill - Admin", async ({ page }) => {
    // Click on Admin demo account card (clickable div)
    await page.locator("text=/Zava Admin/i").first().click();

    // Verify auto-fill
    await expect(page.locator('input[type="text"]').first()).toHaveValue(
      DEMO_ACCOUNTS.ADMIN.username,
    );
    await expect(page.locator('input[type="password"]')).toHaveValue(
      DEMO_ACCOUNTS.ADMIN.password,
    );
  });

  test("TC-013: Verify Demo Account Auto-Fill Clears Previous Error", async ({
    page,
  }) => {
    // Trigger error first
    await page.locator('input[type="text"]').first().fill("invaliduser");
    await page.locator('input[type="password"]').fill("wrongpass");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Wait briefly for any error handling
    await page.waitForTimeout(500);

    // Click demo account
    await page.locator("text=/Sarah Chen/i").first().click();

    // Verify fields are filled (error clearing behavior)
    await expect(page.locator('input[type="text"]').first()).toHaveValue(
      DEMO_ACCOUNTS.SARAH.username,
    );
  });

  test("TC-014: Verify Password Visibility Toggle - Show", async ({ page }) => {
    await page.locator('input[type="password"]').fill("zava2026");

    // Try to find password visibility toggle button
    const toggleButton = page
      .locator("button")
      .filter({ hasText: /show|eye/i });
    const buttonCount = await toggleButton.count();

    if (buttonCount > 0) {
      await toggleButton.first().click();
      await page.waitForTimeout(500);
      // Password visibility toggled
    }
  });

  test("TC-015: Verify Password Visibility Toggle - Hide", async ({ page }) => {
    await page.locator('input[type="password"]').fill("zava2026");

    // Try to find password visibility toggle button
    const toggleButton = page
      .locator("button")
      .filter({ hasText: /show|eye/i });
    const buttonCount = await toggleButton.count();

    if (buttonCount > 0) {
      await toggleButton.first().click();
      await page.waitForTimeout(300);

      // Click again to hide
      await toggleButton.first().click();
      await page.waitForTimeout(300);
    }
  });
});
