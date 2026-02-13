import { test, expect } from "@playwright/test";
import { loginWithDemoAccount, DEMO_ACCOUNTS } from "../helpers/test-helpers";

/**
 * User Story 02: Dashboard Tests
 * Test Cases: TC-016 through TC-021
 * Priority: High
 */

test.describe("US-002: View Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginWithDemoAccount(page, DEMO_ACCOUNTS.SARAH);
  });

  test("TC-016: Verify Dashboard Hero Section Display", async ({ page }) => {
    // Verify personalized greeting
    await expect(
      page.getByText(`Welcome back, ${DEMO_ACCOUNTS.SARAH.displayName}`),
    ).toBeVisible();

    // Verify title (split across multiple colored spans)
    await expect(page.getByText("Zava Travel").first()).toBeVisible();
    await expect(page.getByText("Content")).toBeVisible();
    await expect(page.getByText("Studio")).toBeVisible();

    // Verify description
    await expect(page.getByText(/multi-agent collaboration/i)).toBeVisible();

    // Verify Create New Content button
    await expect(
      page.getByRole("button", { name: /create new content/i }),
    ).toBeVisible();
  });

  test("TC-017: Verify Dashboard Statistics Cards Display", async ({
    page,
  }) => {
    // Verify Agents Active card
    await expect(page.getByText("Agents Active")).toBeVisible();
    await expect(page.getByText("3").first()).toBeVisible();

    // Verify Reasoning Patterns card
    await expect(page.getByText("Reasoning Patterns")).toBeVisible();

    // Verify Platforms card
    await expect(page.getByText("Platforms")).toBeVisible();

    // Verify Security Status card
    await expect(page.getByText("Security Status")).toBeVisible();
    await expect(page.getByText(/secure/i)).toBeVisible();
  });

  test("TC-018: Verify Dashboard Agent Team Information Display", async ({
    page,
  }) => {
    // Scroll to Agent Team section
    await page.getByText("Agent Team").scrollIntoViewIfNeeded();

    // Verify Creator agent card
    await expect(page.getByText("Creator")).toBeVisible();
    await expect(page.getByText("Azure OpenAI").first()).toBeVisible();
    await expect(page.getByText("Chain-of-Thought")).toBeVisible();
    await expect(page.locator("text=✍️")).toBeVisible();

    // Verify Reviewer agent card
    await expect(page.getByText("Reviewer")).toBeVisible();
    await expect(page.getByText("GitHub Copilot")).toBeVisible();
    await expect(page.getByText("ReAct")).toBeVisible();
    await expect(page.locator("text=🔍")).toBeVisible();

    // Verify Publisher agent card
    await expect(page.getByText("Publisher")).toBeVisible();
    await expect(page.getByText("Azure OpenAI").nth(1)).toBeVisible();
    await expect(page.getByText("Self-Reflection")).toBeVisible();
    await expect(page.locator("text=📤")).toBeVisible();
  });

  test("TC-019: Verify Dashboard Featured Destinations Display", async ({
    page,
  }) => {
    // Scroll to Featured Destinations section
    await page.getByText("Featured Destinations").scrollIntoViewIfNeeded();

    // Verify all 5 destination badges
    await expect(page.getByText(/🇮🇩 Bali.*\$899/)).toBeVisible();
    await expect(page.getByText(/🇦🇷 Patagonia.*\$1,499/)).toBeVisible();
    await expect(page.getByText(/🇮🇸 Iceland.*\$1,299/)).toBeVisible();
    await expect(page.getByText(/🇻🇳 Vietnam.*\$699/)).toBeVisible();
    await expect(page.getByText(/🇨🇷 Costa Rica.*\$799/)).toBeVisible();
  });

  test("TC-020: Verify Navigate to Create Content from Dashboard Button", async ({
    page,
  }) => {
    // Click Create New Content button
    await page.getByRole("button", { name: /create new content/i }).click();

    // Verify navigation to Create Content page
    await expect(page).toHaveURL("/create");

    // Verify Create Content page elements
    await expect(page.getByText("Campaign Brief").first()).toBeVisible();
  });

  test.skip("TC-021: Verify Navigate to Dashboard from Sidebar", async ({
    page,
  }) => {
    // Navigate to Create Content page using sidebar button
    await page.getByRole("button", { name: /create content/i }).click();
    await page.waitForURL("/create", { timeout: 5000 });

    // Click Dashboard in sidebar
    await page.getByRole("button", { name: /dashboard/i }).click();

    // Verify navigation back to Dashboard
    await page.waitForURL("/", { timeout: 5000 });
    await expect(page.getByText("Zava Travel Content Studio")).toBeVisible();
  });
});
