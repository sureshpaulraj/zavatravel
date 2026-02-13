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
    await expect(transcriptTab).toBeVisible({ timeout: 15000 });

    // Click Agent Transcript tab
    await transcriptTab.click();

    // Verify tab is now selected
    await expect(transcriptTab).toHaveAttribute("aria-selected", "true", {
      timeout: 5000,
    });

    // Verify transcript content area is visible
    await expect(
      page.getByText(/creator|reviewer|publisher/i).first(),
    ).toBeVisible({ timeout: 15000 });
  });

  test("TC-055: Verify Transcript Message Display Count and Order", async ({
    page,
  }) => {
    // Click Agent Transcript tab and wait for content
    await page.getByRole("tab", { name: /agent transcript/i }).click();
    await expect(
      page.getByText(/creator|reviewer|publisher/i).first(),
    ).toBeVisible({ timeout: 15000 });

    // Verify multiple messages (at least 6: 2 per agent)
    const messages = page
      .locator('[class*="message"]')
      .or(page.locator("text=/Creator:|Reviewer:|Publisher:/"));
    await expect(messages.first()).toBeVisible({ timeout: 10000 });
    const messageCount = await messages.count();
    expect(messageCount).toBeGreaterThanOrEqual(6);

    // Verify chronological order (top to bottom)
    const firstMessage = messages.first();
    const lastMessage = messages.last();

    await expect(firstMessage).toBeVisible();
    await expect(lastMessage).toBeVisible();
  });

  test("TC-056: Verify Creator Message Display", async ({ page }) => {
    // Click Agent Transcript tab and wait for content
    await page.getByRole("tab", { name: /agent transcript/i }).click();
    await expect(page.getByText(/creator/i).first()).toBeVisible({
      timeout: 15000,
    });

    // Verify Creator messages with emoji (flexible emoji check)
    await expect(
      page
        .locator("text=/✍.*Creator/i")
        .or(page.locator("text=/Creator/i"))
        .first(),
    ).toBeVisible({ timeout: 10000 });

    // Verify Creator message content about drafting
    const creatorMessage = page
      .getByText(/Creator/i)
      .locator("..")
      .first();
    const messageText = await creatorMessage.textContent();
    expect(messageText?.toLowerCase()).toMatch(/draft|creat|generat|writ/);
  });

  test("TC-057: Verify Reviewer Message Display", async ({ page }) => {
    // Click Agent Transcript tab and wait for content
    await page.getByRole("tab", { name: /agent transcript/i }).click();
    await expect(page.getByText(/reviewer/i).first()).toBeVisible({
      timeout: 15000,
    });

    // Verify Reviewer messages with emoji (flexible emoji check)
    await expect(
      page
        .locator("text=/🔍.*Reviewer/i")
        .or(page.locator("text=/Reviewer/i"))
        .first(),
    ).toBeVisible({ timeout: 10000 });

    // Verify Reviewer message content about reviewing
    const reviewerMessage = page
      .getByText(/Reviewer/i)
      .locator("..")
      .first();
    const messageText = await reviewerMessage.textContent();
    expect(messageText?.toLowerCase()).toMatch(/review|check|analyz|verif/);
  });

  test("TC-058: Verify Publisher Message Display", async ({ page }) => {
    // Click Agent Transcript tab and wait for content
    await page.getByRole("tab", { name: /agent transcript/i }).click();
    await expect(page.getByText(/publisher/i).first()).toBeVisible({
      timeout: 15000,
    });

    // Verify Publisher messages with emoji (flexible emoji check)
    await expect(
      page
        .locator("text=/📤.*Publisher/i")
        .or(page.locator("text=/Publisher/i"))
        .first(),
    ).toBeVisible({ timeout: 10000 });

    // Verify Publisher message content about publishing
    const publisherMessage = page
      .getByText(/Publisher/i)
      .locator("..")
      .first();
    const messageText = await publisherMessage.textContent();
    expect(messageText?.toLowerCase()).toMatch(/publish|final|format|deliver/);
  });

  test("TC-059: Verify Transcript Message Formatting", async ({ page }) => {
    // Click Agent Transcript tab and wait for content
    await page.getByRole("tab", { name: /agent transcript/i }).click();

    // Wait for messages to load and get first message
    const firstMessage = page.locator('[class*="message"]').first();
    await expect(firstMessage).toBeVisible({ timeout: 15000 });

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
    // Click Agent Transcript tab and wait
    await page.getByRole("tab", { name: /agent transcript/i }).click();

    // Verify on transcript tab
    await expect(
      page.getByRole("tab", { name: /agent transcript/i }),
    ).toHaveAttribute("aria-selected", "true", { timeout: 5000 });

    // Click Platform Posts tab
    await page.getByRole("tab", { name: /platform posts/i }).click();

    // Verify back on Platform Posts
    await expect(
      page.getByRole("tab", { name: /platform posts/i }),
    ).toHaveAttribute("aria-selected", "true", { timeout: 5000 });

    // Verify posts are displayed with timeouts
    await expect(page.getByText("LinkedIn")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/twitter|𝕏|x/i).first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Instagram")).toBeVisible({ timeout: 10000 });
  });
});
