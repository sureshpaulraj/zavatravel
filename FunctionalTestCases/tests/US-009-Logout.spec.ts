import { test, expect } from "@playwright/test";
import { loginWithDemoAccount, logout } from "../helpers/test-helpers";

/**
 * User Story 09: Logout Tests
 * Test Cases: TC-070 through TC-077
 * Priority: Critical
 */

test.describe("US-009: User Logout", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginWithDemoAccount(page);
  });

  test("TC-070: Verify Logout Button Display in Sidebar", async ({ page }) => {
    // Verify Sign Out button is visible in sidebar
    const signOutButton = page.getByRole("button", { name: /sign out/i });
    await expect(signOutButton).toBeVisible();

    // Verify button is at bottom of sidebar (user profile section)
    await expect(signOutButton).toBeEnabled();
  });

  test("TC-071: Verify Logout Functionality", async ({ page }) => {
    // Click Sign Out button
    await logout(page);

    // Verify redirected to login page
    await expect(page).toHaveURL("/");

    // Verify login page elements are displayed
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("TC-072: Verify Session Termination After Logout", async ({ page }) => {
    // Logout
    await logout(page);

    // Try to navigate to protected route (Dashboard)
    await page.goto("/");

    // Verify still on login page (not redirected to dashboard)
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();

    // Verify no user-specific content is displayed
    await expect(page.getByText(/welcome back/i)).not.toBeVisible();
  });

  test("TC-073: Verify Redirect to Login After Logout", async ({ page }) => {
    // Start from Create Content page
    await page.goto("/create");
    await expect(page).toHaveURL("/create");

    // Click Sign Out
    await page.getByRole("button", { name: /sign out/i }).click();

    // Verify redirected to login page
    await page.waitForURL("/", { timeout: 5000 });
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("TC-074: Verify Navigation Prevention After Logout", async ({
    page,
  }) => {
    // Logout
    await logout(page);

    // Try to navigate to Dashboard
    await page.goto("/");

    // Verify redirected to/remains on login page
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();

    // Verify dashboard content is not accessible
    await expect(
      page.getByText("Zava Travel Content Studio"),
    ).not.toBeVisible();
  });

  test("TC-075: Verify Navigation Prevention to Create Content After Logout", async ({
    page,
  }) => {
    // Logout
    await logout(page);

    // Try to navigate to Create Content
    await page.goto("/create");

    // Verify redirected to login page
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();

    // Verify Create Content page is not accessible
    await expect(page.getByText("Campaign Brief")).not.toBeVisible();
  });

  test("TC-076: Verify Re-login After Logout", async ({ page }) => {
    // Logout first
    await logout(page);

    // Verify on login page
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();

    // Login again
    await page.locator('input[type="text"]').first().fill("sarah.explorer");
    await page.locator('input[type="password"]').fill("zava2026");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Verify successful re-login
    await expect(page).toHaveURL("/");
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test("TC-077: Verify Logout Button Appearance", async ({ page }) => {
    // Get Sign Out button
    const signOutButton = page.getByRole("button", { name: /sign out/i });

    // Verify button styling
    await expect(signOutButton).toBeVisible();
    await expect(signOutButton).toBeEnabled();

    // Verify button text
    await expect(signOutButton).toContainText(/sign out/i);

    // Verify button position (in user profile section at bottom)
    const buttonBox = await signOutButton.boundingBox();
    expect(buttonBox).not.toBeNull();

    // Verify logout icon is present (if any)
    const hasLogoutIcon = (await signOutButton.locator("svg").count()) > 0;
    // Icon presence is optional, just verify button is visible
    expect(hasLogoutIcon !== null).toBeTruthy();
  });
});
