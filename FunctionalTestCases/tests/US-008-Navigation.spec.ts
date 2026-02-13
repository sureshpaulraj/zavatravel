import { test, expect } from "@playwright/test";
import {
  loginWithDemoAccount,
  verifySidebarDisplay,
  DEMO_ACCOUNTS,
} from "../helpers/test-helpers";

/**
 * User Story 08: Navigation Sidebar Tests
 * Test Cases: TC-061 through TC-069
 * Priority: High
 */

test.describe("US-008: Navigation Sidebar", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginWithDemoAccount(page);
  });

  test("TC-061: Verify Sidebar Display After Login", async ({ page }) => {
    // Verify sidebar is visible
    await verifySidebarDisplay(page);

    // Verify logo
    await expect(page.getByText("Zava Travel")).toBeVisible();

    // Verify navigation items
    await expect(
      page.getByRole("button", { name: /dashboard/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /create content/i }),
    ).toBeVisible();

    // Verify user profile section
    await expect(page.getByText(DEMO_ACCOUNTS.SARAH.displayName)).toBeVisible();

    // Verify Sign Out button
    await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
  });

  test("TC-062: Verify Navigation Menu Items Display", async ({ page }) => {
    // Verify Dashboard menu item
    const dashboardItem = page.getByRole("button", { name: /dashboard/i });
    await expect(dashboardItem).toBeVisible();
    await expect(dashboardItem).toContainText("Dashboard");

    // Verify Create Content menu item
    const createContentItem = page.getByRole("button", {
      name: /create content/i,
    });
    await expect(createContentItem).toBeVisible();
    await expect(createContentItem).toContainText("Create Content");

    // Verify icons are present (🏠 for Dashboard, ✨ for Create Content)
    await expect(page.locator("text=🏠")).toBeVisible();
    await expect(page.locator("text=✨")).toBeVisible();
  });

  test("TC-063: Verify Navigate to Dashboard from Create Content Page", async ({
    page,
  }) => {
    // Navigate to Create Content first
    await page.goto("/create");
    await expect(page).toHaveURL("/create");

    // Click Dashboard menu item
    await page.getByRole("button", { name: /dashboard/i }).click();

    // Verify navigation to Dashboard
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Zava Travel Content Studio")).toBeVisible();
  });

  test("TC-064: Verify Navigate to Create Content from Dashboard", async ({
    page,
  }) => {
    // Ensure on Dashboard
    await page.goto("/");

    // Click Create Content menu item
    await page.getByRole("button", { name: /create content/i }).click();

    // Verify navigation to Create Content
    await expect(page).toHaveURL("/create");
    await expect(page.getByText("Campaign Brief")).toBeVisible();
  });

  test("TC-065: Verify Active Page Indicator on Dashboard", async ({
    page,
  }) => {
    // Navigate to Dashboard
    await page.goto("/");

    // Verify Dashboard menu item has active state
    const dashboardItem = page.getByRole("button", { name: /dashboard/i });

    // Check for active styling (aria-current or class)
    const hasActiveState = await dashboardItem.evaluate((el) => {
      const hasAriaCurrent = el.getAttribute("aria-current") === "page";
      const hasActiveClass =
        el.className.includes("active") ||
        el.className.includes("selected") ||
        el.parentElement?.className.includes("active");
      return hasAriaCurrent || hasActiveClass;
    });

    expect(hasActiveState).toBeTruthy();
  });

  test("TC-066: Verify Active Page Indicator on Create Content Page", async ({
    page,
  }) => {
    // Navigate to Create Content
    await page.goto("/create");

    // Verify Create Content menu item has active state
    const createContentItem = page.getByRole("button", {
      name: /create content/i,
    });

    // Check for active styling
    const hasActiveState = await createContentItem.evaluate((el) => {
      const hasAriaCurrent = el.getAttribute("aria-current") === "page";
      const hasActiveClass =
        el.className.includes("active") ||
        el.className.includes("selected") ||
        el.parentElement?.className.includes("active");
      return hasAriaCurrent || hasActiveClass;
    });

    expect(hasActiveState).toBeTruthy();
  });

  test("TC-067: Verify Menu Item Hover State", async ({ page }) => {
    // Get Dashboard menu item
    const dashboardItem = page.getByRole("button", { name: /dashboard/i });

    // Hover over menu item
    await dashboardItem.hover();

    // Verify item is still visible and interactive
    await expect(dashboardItem).toBeVisible();

    // Wait briefly to observe hover state
    await page.waitForTimeout(500);

    // Click should still work after hover
    await expect(dashboardItem).toBeEnabled();
  });

  test("TC-068: Verify Logo Click Navigation", async ({ page }) => {
    // Navigate to Create Content first
    await page.goto("/create");

    // Click on logo
    await page.getByText("Zava Travel").click();

    // Verify navigation to Dashboard
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Zava Travel Content Studio")).toBeVisible();
  });

  test("TC-069: Verify User Profile Section Display in Sidebar", async ({
    page,
  }) => {
    // Verify user profile section at bottom of sidebar
    await expect(page.getByText(DEMO_ACCOUNTS.SARAH.displayName)).toBeVisible();
    await expect(page.getByText(DEMO_ACCOUNTS.SARAH.role)).toBeVisible();

    // Verify avatar/emoji
    await expect(
      page.locator(`text=${DEMO_ACCOUNTS.SARAH.avatar}`),
    ).toBeVisible();

    // Verify Sign Out button is in same section
    const signOutButton = page.getByRole("button", { name: /sign out/i });
    await expect(signOutButton).toBeVisible();
  });
});
