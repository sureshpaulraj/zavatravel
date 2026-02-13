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
    // Verify all 3 platform posts have Copy buttons
    const copyButtons = page.getByRole("button", { name: /copy/i });
    await expect(copyButtons).toHaveCount(3);

    // Verify each button is visible and enabled
    const buttons = await copyButtons.all();
    for (const button of buttons) {
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

    // Find and click LinkedIn post copy button
    const linkedInSection = page
      .locator("text=💼")
      .or(page.locator("text=LinkedIn"))
      .locator("..");
    const copyButton = linkedInSection
      .getByRole("button", { name: /copy/i })
      .first();
    await copyButton.click();

    // Verify button changes to "Copied!"
    await expect(
      linkedInSection.getByRole("button", { name: /copied/i }),
    ).toBeVisible({ timeout: 2000 });

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

    // Find and click Twitter post copy button
    const twitterSection = page.locator("text=/twitter|𝕏/i").locator("..");
    const copyButton = twitterSection
      .getByRole("button", { name: /copy/i })
      .first();
    await copyButton.click();

    // Verify button changes to "Copied!"
    await expect(
      twitterSection.getByRole("button", { name: /copied/i }),
    ).toBeVisible({ timeout: 2000 });

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

    // Find and click Instagram post copy button
    const instagramSection = page
      .locator("text=📸")
      .or(page.locator("text=Instagram"))
      .locator("..");
    const copyButton = instagramSection
      .getByRole("button", { name: /copy/i })
      .first();
    await copyButton.click();

    // Verify button changes to "Copied!"
    await expect(
      instagramSection.getByRole("button", { name: /copied/i }),
    ).toBeVisible({ timeout: 2000 });

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

    // Click copy button
    const copyButton = page.getByRole("button", { name: /copy/i }).first();
    await copyButton.click();

    // Verify "Copied!" state appears
    await expect(
      page.getByRole("button", { name: /copied/i }).first(),
    ).toBeVisible();

    // Wait for 2 seconds
    await page.waitForTimeout(2000);

    // Verify button reverts to "Copy"
    await expect(copyButton).toHaveText(/copy/i);
  });

  test("TC-051: Verify Independent Copy States", async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Click copy on LinkedIn post
    const linkedInCopy = page
      .locator("text=LinkedIn")
      .locator("..")
      .getByRole("button", { name: /copy/i })
      .first();
    await linkedInCopy.click();

    // Verify LinkedIn shows "Copied!"
    await expect(
      page
        .locator("text=LinkedIn")
        .locator("..")
        .getByRole("button", { name: /copied/i }),
    ).toBeVisible();

    // Verify Twitter still shows "Copy" (not affected)
    const twitterCopy = page
      .locator("text=/twitter|𝕏/i")
      .locator("..")
      .getByRole("button", { name: /copy/i })
      .first();
    await expect(twitterCopy).toBeVisible();
    await expect(twitterCopy).toHaveText(/copy/i);
  });

  test("TC-052: Verify Copy Content Preservation - Line Breaks", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Get LinkedIn post content (typically multi-line)
    const postContent = page
      .locator("text=LinkedIn")
      .locator("..")
      .locator('[class*="content"]')
      .first();
    const originalText = await postContent.textContent();

    // Click copy button
    const copyButton = page
      .locator("text=LinkedIn")
      .locator("..")
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
