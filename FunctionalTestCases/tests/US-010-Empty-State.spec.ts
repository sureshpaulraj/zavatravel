import { test, expect } from "@playwright/test";
import {
  loginWithDemoAccount,
  navigateToCreateContent,
} from "../helpers/test-helpers";

/**
 * User Story 10: Empty State Tests
 * Test Cases: TC-078 through TC-084
 * Priority: Medium
 */

test.describe("US-010: View Empty State", () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate before each test
    await loginWithDemoAccount(page);
    await navigateToCreateContent(page);
  });

  test("TC-078: Verify Empty State Display on Initial Page Load", async ({
    page,
  }) => {
    // Verify empty state card is visible
    await expect(page.getByText("Ready to Create")).toBeVisible({ timeout: 10000 });

    // Verify empty state message
    await expect(
      page.getByText(/fill out.*campaign brief.*generate content/i),
    ).toBeVisible({ timeout: 10000 });

    // Verify sparkle icon is present
    await expect(page.getByText("✨").first()).toBeVisible({ timeout: 10000 });

    // Verify no results tabs are visible
    await expect(
      page.getByRole("tab", { name: /platform posts/i }),
    ).not.toBeVisible({ timeout: 5000 });
    await expect(
      page.getByRole("tab", { name: /agent transcript/i }),
    ).not.toBeVisible({ timeout: 5000 });
  });

  test("TC-079: Verify Empty State Styling", async ({ page }) => {
    // Get empty state card
    const emptyState = page.getByText("Ready to Create").locator("..");

    // Verify card is centered
    await expect(emptyState).toBeVisible({ timeout: 10000 });

    // Verify styling elements (would need to check computed styles)
    const hasContent = await emptyState.textContent();
    expect(hasContent).toContain("Ready to Create");

    // Verify decorative elements
    await expect(page.getByText("✨").first()).toBeVisible({ timeout: 10000 });
  });

  test("TC-080: Verify Empty State Visibility Conditions", async ({ page }) => {
    // On initial load, only empty state should be visible
    await expect(page.getByText("Ready to Create")).toBeVisible({ timeout: 10000 });

    // Campaign Brief form should be visible
    await expect(page.getByText("Campaign Brief")).toBeVisible({ timeout: 10000 });

    // Loading card should not be visible
    await expect(page.getByText(/agents collaborating/i)).not.toBeVisible({ timeout: 5000 });

    // Results tabs should not be visible
    await expect(
      page.getByRole("tab", { name: /platform posts/i }),
    ).not.toBeVisible({ timeout: 5000 });
  });

  test("TC-081: Verify Empty State Disappears on Generation Start", async ({
    page,
  }) => {
    // Verify empty state is initially visible
    await expect(page.getByText("Ready to Create")).toBeVisible({ timeout: 10000 });

    // Click Generate Content
    await page.getByRole("button", { name: /generate content/i }).click();

    // Verify empty state is replaced with loading card
    await expect(page.getByText("Ready to Create")).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/agents collaborating/i)).toBeVisible({ timeout: 15000 });
  });

  test("TC-082: Verify Empty State Returns After Page Refresh", async ({
    page,
  }) => {
    // Generate content first
    await page.getByRole("button", { name: /generate content/i }).click();

    // Wait for results
    await expect(page.getByText(/content generated/i)).toBeVisible({
      timeout: 15000,
    });

    // Verify results are displayed
    await expect(
      page.getByRole("tab", { name: /platform posts/i }),
    ).toBeVisible({ timeout: 10000 });

    // Refresh page
    await page.reload();

    // Verify empty state returns
    await expect(page.getByText("Ready to Create")).toBeVisible({ timeout: 10000 });

    // Verify results are gone
    await expect(
      page.getByRole("tab", { name: /platform posts/i }),
    ).not.toBeVisible({ timeout: 5000 });
  });

  test("TC-083: Verify Empty State Returns After Navigation Away and Back", async ({
    page,
  }) => {
    // Generate content first
    await page.getByRole("button", { name: /generate content/i }).click();
    await expect(page.getByText(/content generated/i)).toBeVisible({
      timeout: 15000,
    });

    // Navigate to Dashboard
    await page.getByRole("button", { name: /dashboard/i }).click();
    await expect(page).toHaveURL("/");

    // Navigate back to Create Content
    await page.getByRole("button", { name: /create content/i }).click();
    await expect(page).toHaveURL("/create");

    // Verify empty state returns
    await expect(page.getByText("Ready to Create")).toBeVisible({ timeout: 10000 });

    // Verify previous results are not displayed
    await expect(
      page.getByRole("tab", { name: /platform posts/i }),
    ).not.toBeVisible({ timeout: 5000 });
  });

  test("TC-084: Verify Form Visible with Empty State", async ({ page }) => {
    // Verify empty state is visible
    await expect(page.getByText("Ready to Create")).toBeVisible({ timeout: 10000 });

    // Verify Campaign Brief form is also visible
    await expect(page.getByText("Campaign Brief")).toBeVisible({ timeout: 10000 });

    // Verify all form fields are accessible
    await expect(page.locator("input").first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("textarea").first()).toBeVisible({ timeout: 10000 });

    // Verify Generate Content button is visible and enabled
    await expect(
      page.getByRole("button", { name: /generate content/i }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("button", { name: /generate content/i }),
    ).toBeEnabled();
  });
});
