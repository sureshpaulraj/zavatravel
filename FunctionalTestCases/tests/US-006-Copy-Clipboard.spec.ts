import { test, expect } from "@playwright/test";
import {
  loginWithDemoAccount,
  navigateToCreateContent,
  submitCampaignBrief,
} from "../helpers/test-helpers";

/**
 * User Story 06: Copy to Clipboard Tests
 * Test Cases: TC-046 through TC-053
 * Priority: High
 */

test.describe("US-006: Copy Social Media Posts to Clipboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login, navigate, and generate content before each test
    await loginWithDemoAccount(page);
    await navigateToCreateContent(page);
    await submitCampaignBrief(page, true);
  });

  test("TC-046: Verify Copy Button Display on All Posts", async ({ page }) => {
    // Wait for posts to be visible
    await expect(page.getByText("LinkedIn")).toBeVisible({ timeout: 15000 });

    // Verify copy buttons are present (at least one per post)
    const copyButtons = page.getByRole("button", { name: /copy/i });
    await expect(copyButtons.first()).toBeVisible();

    // Verify each button is visible and enabled
    const buttons = await copyButtons.all();
    expect(buttons.length).toBeGreaterThanOrEqual(3);
    for (const button of buttons.slice(0, 3)) {
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
  });

  test("TC-047: Verify Copy to Clipboard for LinkedIn Post", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Wait for LinkedIn post to be visible
    await expect(page.getByText("LinkedIn")).toBeVisible({ timeout: 15000 });

    // Find and click LinkedIn post copy button
    const linkedInSection = page
      .getByText("LinkedIn")
      .locator("..")
      .locator("..");
    const copyButton = linkedInSection
      .getByRole("button", { name: /copy/i })
      .first();
    await copyButton.click();

    // Verify button changes to "Copied!" (with timeout)
    await expect(
      page.getByRole("button", { name: /copied/i }).first(),
    ).toBeVisible({ timeout: 3000 });

    // Verify clipboard content (check it's not empty)
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBeTruthy();
    expect(clipboardText.length).toBeGreaterThan(0);
  });

  test("TC-048: Verify Copy to Clipboard for Twitter Post", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Wait for Twitter/X post to be visible
    await expect(page.getByText(/twitter|𝕏|x/i)).toBeVisible({
      timeout: 15000,
    });

    // Find and click Twitter post copy button
    const twitterSection = page
      .getByText(/twitter|𝕏|x/i)
      .locator("..")
      .locator("..");
    const copyButton = twitterSection
      .getByRole("button", { name: /copy/i })
      .first();
    await copyButton.click();

    // Verify button changes to "Copied!"
    await expect(
      page.getByRole("button", { name: /copied/i }).first(),
    ).toBeVisible({ timeout: 3000 });

    // Verify clipboard content
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBeTruthy();
    expect(clipboardText.length).toBeGreaterThan(0);
  });

  test("TC-049: Verify Copy to Clipboard for Instagram Post", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Wait for Instagram post to be visible
    await expect(page.getByText("Instagram")).toBeVisible({ timeout: 15000 });

    // Find and click Instagram post copy button
    const instagramSection = page
      .getByText("Instagram")
      .locator("..")
      .locator("..");
    const copyButton = instagramSection
      .getByRole("button", { name: /copy/i })
      .first();
    await copyButton.click();

    // Verify button changes to "Copied!"
    await expect(
      page.getByRole("button", { name: /copied/i }).first(),
    ).toBeVisible({ timeout: 3000 });

    // Verify clipboard content
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBeTruthy();
    expect(clipboardText.length).toBeGreaterThan(0);
  });

  test("TC-050: Verify Copy Confirmation Timeout", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Wait for posts to load
    await expect(page.getByText("LinkedIn")).toBeVisible({ timeout: 15000 });

    // Click copy button
    const copyButton = page.getByRole("button", { name: /copy/i }).first();
    await copyButton.click();

    // Verify "Copied!" state appears
    await expect(
      page.getByRole("button", { name: /copied/i }).first(),
    ).toBeVisible({ timeout: 3000 });

    // Wait for timeout (button should revert after ~2s)
    await page.waitForTimeout(3000);

    // Verify button reverts to "Copy" (check that copied is gone)
    await expect(
      page.getByRole("button", { name: /^copy$/i }).first(),
    ).toBeVisible({ timeout: 2000 });
  });

  test("TC-051: Verify Independent Copy States", async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Wait for posts to load
    await expect(page.getByText("LinkedIn")).toBeVisible({ timeout: 15000 });

    // Click copy on LinkedIn post
    const linkedInSection = page
      .getByText("LinkedIn")
      .locator("..")
      .locator("..");
    const linkedInCopy = linkedInSection
      .getByRole("button", { name: /copy/i })
      .first();
    await linkedInCopy.click();

    // Verify LinkedIn shows "Copied!"
    await expect(
      page.getByRole("button", { name: /copied/i }).first(),
    ).toBeVisible({ timeout: 3000 });

    // Verify Twitter still shows "Copy" (not affected) - check for other copy buttons
    const allCopyButtons = await page
      .getByRole("button", { name: /^copy$/i })
      .all();
    expect(allCopyButtons.length).toBeGreaterThanOrEqual(2); // At least 2 other copy buttons should still say "Copy"
  });

  test("TC-052: Verify Copy Content Preservation - Line Breaks", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Wait for posts to load
    await expect(page.getByText("LinkedIn")).toBeVisible({ timeout: 15000 });

    // Get LinkedIn post content (typically multi-line)
    const linkedInSection = page.getByText("LinkedIn").locator("..").locator("..");
    const postContent = linkedInSection
      .locator('[class*="content"]')
      .first();
    const originalText = await postContent.textContent();

    // Click copy button
    const copyButton = linkedInSection
      .getByRole("button", { name: /copy/i })
      .first();
    await copyButton.click();

    // Get clipboard content
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );

    // Verify content includes line breaks/formatting (check for newlines)
    expect(clipboardText).toContain("\n");
    expect(clipboardText.length).toBeGreaterThan(50); // Multi-line content
  });

  test("TC-053: Verify Copy Content Preservation - Special Characters", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Wait for posts to load
    await expect(
      page.getByText("LinkedIn").or(page.getByText("Twitter")).first(),
    ).toBeVisible({ timeout: 15000 });

    // Click copy on any post
    const copyButton = page.getByRole("button", { name: /copy/i }).first();
    await copyButton.click();

    // Get clipboard content
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );

    // Verify special characters are preserved (#hashtags, emojis, etc.)
    // Check for common travel-related hashtags
    expect(clipboardText).toMatch(/#\w+/); // Contains hashtags
  });
});
