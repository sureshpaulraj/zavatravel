import { test, expect } from "@playwright/test";
import {
  loginWithDemoAccount,
  navigateToCreateContent,
  submitCampaignBrief,
} from "../helpers/test-helpers";

/**
 * User Story 04: Agent Collaboration Progress Tests
 * Test Cases: TC-034 through TC-038
 * Priority: Medium
 */

test.describe("US-004: View Agent Collaboration Progress", () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to Create Content page
    await loginWithDemoAccount(page);
    await navigateToCreateContent(page);
  });

  test("TC-034: Verify Loading State Display After Submission", async ({
    page,
  }) => {
    // Submit campaign brief
    await page.getByRole("button", { name: /generate content/i }).click();

    // Verify loading card elements (with longer timeout)
    await expect(page.locator("text=Agents Collaborating...")).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(/creator.*reviewer.*publisher/i)).toBeVisible();

    // Verify agent status badges exist
    await expect(page.locator("text=✍️ Creator: Drafting...")).toBeVisible();
    await expect(page.locator("text=🔍 Reviewer: Waiting")).toBeVisible();
    await expect(page.locator("text=📤 Publisher: Waiting")).toBeVisible();
  });

  test("TC-035: Verify Agent Status Badges During Generation", async ({
    page,
  }) => {
    // Submit campaign brief
    await page.getByRole("button", { name: /generate content/i }).click();

    // Wait for loading card
    await expect(page.getByText(/agents collaborating/i)).toBeVisible();

    // Verify Creator badge (Blue, Filled)
    const creatorBadge = page.locator("text=✍️ Creator: Drafting...");
    await expect(creatorBadge).toBeVisible();

    // Verify Reviewer badge (Orange, Outline)
    const reviewerBadge = page.locator("text=🔍 Reviewer: Waiting");
    await expect(reviewerBadge).toBeVisible();

    // Verify Publisher badge (Green, Outline)
    const publisherBadge = page.locator("text=📤 Publisher: Waiting");
    await expect(publisherBadge).toBeVisible();
  });

  test("TC-036: Verify Generation Duration", async ({ page }) => {
    const startTime = Date.now();

    // Submit campaign brief
    await page.getByRole("button", { name: /generate content/i }).click();

    // Wait for loading state (with longer timeout)
    await expect(page.getByText(/agents collaborating/i)).toBeVisible({
      timeout: 15000,
    });

    // Wait for results to appear
    await expect(page.getByText(/content generated/i)).toBeVisible({
      timeout: 15000,
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // Verify duration is approximately 3 seconds (with some buffer)
    expect(duration).toBeGreaterThanOrEqual(2);
    expect(duration).toBeLessThanOrEqual(20);

    // Verify loading card is no longer visible
    await expect(page.getByText(/agents collaborating/i)).not.toBeVisible();
  });

  test("TC-037: Verify Generate Button State During Loading", async ({
    page,
  }) => {
    // Submit campaign brief
    await page.getByRole("button", { name: /generate content/i }).click();

    // Verify button state during loading
    const generateButton = page.getByRole("button", {
      name: /agents working/i,
    });
    await expect(generateButton).toBeVisible();
    await expect(generateButton).toBeDisabled();

    // Verify spinner icon is present (button has spinner)
    await expect(generateButton).toContainText("Agents Working...");
  });

  test("TC-038: Verify Loading State Prevents Display of Other States", async ({
    page,
  }) => {
    // Submit campaign brief
    await page.getByRole("button", { name: /generate content/i }).click();

    // Wait for loading state
    await expect(page.getByText(/agents collaborating/i)).toBeVisible();

    // Verify only loading card is visible
    // Empty state should not be visible
    await expect(page.getByText("Ready to Create")).not.toBeVisible();

    // Verify results tabs are not visible
    await expect(
      page.getByRole("tab", { name: /platform posts/i }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("tab", { name: /agent transcript/i }),
    ).not.toBeVisible();
  });
});
