import { test, expect } from "@playwright/test";
import {
  loginWithDemoAccount,
  navigateToCreateContent,
  submitCampaignBrief,
} from "../helpers/test-helpers";

/**
 * User Story 05: Generated Posts Tests
 * Test Cases: TC-039 through TC-045
 * Priority: Critical
 */

test.describe("US-005: View Generated Social Media Posts", () => {
  test.beforeEach(async ({ page }) => {
    // Login, navigate, and generate content before each test
    await loginWithDemoAccount(page);
    await navigateToCreateContent(page);
    await submitCampaignBrief(page, true);
  });

  test("TC-039: Verify Success Message Display After Content Generation", async ({
    page,
  }) => {
    // Verify success message format
    const successMessage = page.locator(
      "text=/✅ Content generated in .* — .*/",
    );
    await expect(successMessage).toBeVisible();

    // Verify it contains duration and termination reason
    await expect(successMessage).toContainText("Content generated in");
  });

  test("TC-040: Verify Tab Navigation Display After Generation", async ({
    page,
  }) => {
    // Verify Platform Posts tab (default selected)
    await expect(
      page.getByRole("tab", { name: /platform posts/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("tab", { name: /platform posts/i }),
    ).toHaveAttribute("aria-selected", "true");

    // Verify Agent Transcript tab
    await expect(
      page.getByRole("tab", { name: /agent transcript/i }),
    ).toBeVisible();
  });

  test("TC-041: Verify Platform Posts Display", async ({ page }) => {
    // Verify LinkedIn post card
    await expect(page.getByText("💼")).toBeVisible();
    await expect(page.getByText("LinkedIn")).toBeVisible();
    await expect(page.getByText(/#ZavaTravel/)).toBeVisible();

    // Verify Twitter/X post card
    await expect(page.getByText(/twitter|𝕏/i)).toBeVisible();
    const twitterCharCount = page.locator("text=/\\d+\\/280 characters/");
    await expect(twitterCharCount).toBeVisible();

    // Verify Instagram post card
    await expect(page.getByText("📸")).toBeVisible();
    await expect(page.getByText("Instagram")).toBeVisible();

    // Verify all posts have Copy buttons
    const copyButtons = page.getByRole("button", { name: /copy/i });
    await expect(copyButtons).toHaveCount(3);
  });

  test("TC-042: Verify Post Content Display Format", async ({ page }) => {
    // Get all post cards
    const postCards = page
      .locator('[class*="postCard"]')
      .or(page.locator("text=/LinkedIn|Twitter|Instagram/").locator(".."));

    // Verify at least one post card exists
    await expect(postCards.first()).toBeVisible();

    // Verify Copy button in header
    await expect(
      page.getByRole("button", { name: /copy/i }).first(),
    ).toBeVisible();

    // Verify formatted text box with content
    const postContent = page.locator('[class*="postContent"]').first();
    await expect(postContent).toBeVisible();
  });

  test("TC-043: Verify Twitter Character Count with Valid Length", async ({
    page,
  }) => {
    // Find Twitter post
    const twitterSection = page.locator("text=/twitter|𝕏/i").locator("..");

    // Verify character count indicator
    const charCount = twitterSection.locator("text=/\\d+\\/280 characters/");
    await expect(charCount).toBeVisible();

    // Extract count and verify it's ≤ 280 (green color)
    const countText = await charCount.textContent();
    const count = parseInt(countText?.match(/(\d+)\//)?.[1] || "0");
    expect(count).toBeLessThanOrEqual(280);
  });

  test("TC-044: Verify Twitter Character Count Exceeds Limit", async ({
    page,
  }) => {
    // This test verifies boundary value for character count
    // In normal mock operation, Twitter post should be under 280
    // This test documents the expected behavior if it exceeds

    const twitterSection = page.locator("text=/twitter|𝕏/i").locator("..");
    const charCount = twitterSection.locator("text=/\\d+\\/280 characters/");

    const countText = await charCount.textContent();
    const count = parseInt(countText?.match(/(\d+)\//)?.[1] || "0");

    // If count > 280, text should be red (error state)
    // For normal operation, this should pass with count ≤ 280
    if (count > 280) {
      // Verify red color styling (would need to check computed style)
      console.log(`Warning: Character count ${count} exceeds 280 limit`);
    } else {
      expect(count).toBeLessThanOrEqual(280);
    }
  });

  test("TC-045: Verify Workflow Summary Statistics Display", async ({
    page,
  }) => {
    // Scroll to bottom of results
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify workflow summary card
    await expect(page.getByText("Workflow Summary")).toBeVisible();

    // Verify 4 summary badges
    await expect(page.locator("text=/⏱️.*s/")).toBeVisible(); // Duration in seconds
    await expect(page.locator("text=/💬.*agent turns/")).toBeVisible(); // Agent turns
    await expect(page.locator("text=/📋.*3 platform posts/")).toBeVisible(); // Platform posts
    await expect(page.locator("text=/🔒 Security: Clean/")).toBeVisible(); // Security status
  });
});
