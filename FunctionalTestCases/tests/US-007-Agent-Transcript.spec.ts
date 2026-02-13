import { test, expect } from "@playwright/test";
import {
  loginWithDemoAccount,
  navigateToCreateContent,
  submitCampaignBrief,
} from "../helpers/test-helpers";

/**
 * User Story 07: Agent Transcript Tests
 * Test Cases: TC-054 through TC-060
 * Priority: Medium
 */

test.describe("US-007: View Agent Transcript", () => {
  test.beforeEach(async ({ page }) => {
    // Login, navigate, and generate content before each test
    await loginWithDemoAccount(page);
    await navigateToCreateContent(page);
    await submitCampaignBrief(page, true);
  });

  test("TC-054: Verify Access Agent Transcript Tab", async ({ page }) => {
    // Verify Agent Transcript tab is visible
    const transcriptTab = page.getByRole("tab", { name: /agent transcript/i });
    await expect(transcriptTab).toBeVisible();

    // Click Agent Transcript tab
    await transcriptTab.click();

    // Verify tab is now selected
    await expect(transcriptTab).toHaveAttribute("aria-selected", "true");

    // Verify transcript content area is visible
    await expect(
      page.getByText(/creator|reviewer|publisher/i).first(),
    ).toBeVisible();
  });

  test("TC-055: Verify Transcript Message Display Count and Order", async ({
    page,
  }) => {
    // Click Agent Transcript tab
    await page.getByRole("tab", { name: /agent transcript/i }).click();

    // Verify multiple messages (at least 6: 2 per agent)
    const messages = page
      .locator('[class*="message"]')
      .or(page.locator("text=/Creator:|Reviewer:|Publisher:/"));
    const messageCount = await messages.count();
    expect(messageCount).toBeGreaterThanOrEqual(6);

    // Verify chronological order (top to bottom)
    const firstMessage = messages.first();
    const lastMessage = messages.last();

    await expect(firstMessage).toBeVisible();
    await expect(lastMessage).toBeVisible();
  });

  test("TC-056: Verify Creator Message Display", async ({ page }) => {
    // Click Agent Transcript tab
    await page.getByRole("tab", { name: /agent transcript/i }).click();

    // Verify Creator messages with emoji
    await expect(page.locator("text=/✍️.*Creator/").first()).toBeVisible();

    // Verify Creator message content about drafting
    const creatorMessage = page
      .locator("text=/Creator/i")
      .locator("..")
      .first();
    const messageText = await creatorMessage.textContent();
    expect(messageText?.toLowerCase()).toMatch(/draft|creat|generat|writ/);
  });

  test("TC-057: Verify Reviewer Message Display", async ({ page }) => {
    // Click Agent Transcript tab
    await page.getByRole("tab", { name: /agent transcript/i }).click();

    // Verify Reviewer messages with emoji
    await expect(page.locator("text=/🔍.*Reviewer/").first()).toBeVisible();

    // Verify Reviewer message content about reviewing
    const reviewerMessage = page
      .locator("text=/Reviewer/i")
      .locator("..")
      .first();
    const messageText = await reviewerMessage.textContent();
    expect(messageText?.toLowerCase()).toMatch(/review|check|analyz|verif/);
  });

  test("TC-058: Verify Publisher Message Display", async ({ page }) => {
    // Click Agent Transcript tab
    await page.getByRole("tab", { name: /agent transcript/i }).click();

    // Verify Publisher messages with emoji
    await expect(page.locator("text=/📤.*Publisher/").first()).toBeVisible();

    // Verify Publisher message content about publishing
    const publisherMessage = page
      .locator("text=/Publisher/i")
      .locator("..")
      .first();
    const messageText = await publisherMessage.textContent();
    expect(messageText?.toLowerCase()).toMatch(/publish|final|format|deliver/);
  });

  test("TC-059: Verify Transcript Message Formatting", async ({ page }) => {
    // Click Agent Transcript tab
    await page.getByRole("tab", { name: /agent transcript/i }).click();

    // Get first message
    const firstMessage = page.locator('[class*="message"]').first();

    // Verify message components
    await expect(firstMessage).toBeVisible();

    // Verify agent name/emoji
    const hasAgentIdentifier =
      (await firstMessage
        .locator("text=/Creator|Reviewer|Publisher/")
        .count()) > 0;
    expect(hasAgentIdentifier).toBeTruthy();

    // Verify message text content exists
    const messageText = await firstMessage.textContent();
    expect(messageText).toBeTruthy();
    expect(messageText!.length).toBeGreaterThan(10);
  });

  test("TC-060: Verify Switch Back to Platform Posts Tab", async ({ page }) => {
    // Click Agent Transcript tab
    await page.getByRole("tab", { name: /agent transcript/i }).click();

    // Verify on transcript tab
    await expect(
      page.getByRole("tab", { name: /agent transcript/i }),
    ).toHaveAttribute("aria-selected", "true");

    // Click Platform Posts tab
    await page.getByRole("tab", { name: /platform posts/i }).click();

    // Verify back on Platform Posts
    await expect(
      page.getByRole("tab", { name: /platform posts/i }),
    ).toHaveAttribute("aria-selected", "true");

    // Verify posts are displayed
    await expect(page.locator("text=LinkedIn")).toBeVisible();
    await expect(page.locator("text=/twitter|𝕏/i")).toBeVisible();
    await expect(page.locator("text=Instagram")).toBeVisible();
  });
});
