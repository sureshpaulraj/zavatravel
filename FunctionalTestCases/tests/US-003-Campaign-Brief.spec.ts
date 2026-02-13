import { test, expect } from "@playwright/test";
import {
  loginWithDemoAccount,
  navigateToCreateContent,
  DEFAULT_CAMPAIGN_BRIEF,
  fillCampaignBrief,
  clearAllFormFields,
} from "../helpers/test-helpers";

/**
 * User Story 03: Campaign Brief Tests
 * Test Cases: TC-022 through TC-033
 * Priority: Critical
 */

test.describe("US-003: Submit Campaign Brief", () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to Create Content page before each test
    await loginWithDemoAccount(page);
    await navigateToCreateContent(page);
  });

  test("TC-022: Verify Campaign Brief Form Display", async ({ page }) => {
    // Verify form title
    await expect(page.getByText("Campaign Brief").first()).toBeVisible();

    // Verify all form fields are present
    await expect(page.getByText(/brand/i).first()).toBeVisible();
    await expect(page.getByText(/industry/i).first()).toBeVisible();
    await expect(page.getByText(/target audience/i).first()).toBeVisible();
    await expect(page.getByText(/key message/i).first()).toBeVisible();
    await expect(page.getByText(/destinations/i).first()).toBeVisible();

    // Verify Generate Content button with sparkle icon
    await expect(
      page.getByRole("button", { name: /generate content/i }),
    ).toBeVisible();
  });

  test("TC-023: Verify Pre-filled Default Values in Campaign Brief", async ({
    page,
  }) => {
    // Get all input fields
    const brandInput = page.locator("input").nth(0);
    const industryInput = page.locator("input").nth(1);
    const audienceInput = page.locator("input").nth(2);
    const messageTextarea = page.locator("textarea").first();
    const destinationsInput = page.locator("input").nth(3);

    // Verify pre-filled values
    await expect(brandInput).toHaveValue(DEFAULT_CAMPAIGN_BRIEF.brand);
    await expect(industryInput).toHaveValue(DEFAULT_CAMPAIGN_BRIEF.industry);
    await expect(audienceInput).toHaveValue(
      DEFAULT_CAMPAIGN_BRIEF.targetAudience,
    );
    await expect(messageTextarea).toContainText("Wander More, Spend Less");
    await expect(destinationsInput).toHaveValue(
      DEFAULT_CAMPAIGN_BRIEF.destinations,
    );
  });

  test("TC-024: Verify Form Field Editing - Brand Field", async ({ page }) => {
    const brandInput = page.locator("input").nth(0);

    await brandInput.click();
    await brandInput.clear();
    await brandInput.fill("New Brand Name");

    // Verify field updated
    await expect(brandInput).toHaveValue("New Brand Name");

    // Verify Generate Content button remains enabled
    await expect(
      page.getByRole("button", { name: /generate content/i }),
    ).toBeEnabled();
  });

  test("TC-025: Verify Form Field Editing - Industry Field", async ({
    page,
  }) => {
    const industryInput = page.locator("input").nth(1);

    await industryInput.click();
    await industryInput.clear();
    await industryInput.fill("Modified Industry");

    // Verify field updated
    await expect(industryInput).toHaveValue("Modified Industry");

    // Verify Generate Content button remains enabled
    await expect(
      page.getByRole("button", { name: /generate content/i }),
    ).toBeEnabled();
  });

  test("TC-026: Verify Form Field Editing - Target Audience Field", async ({
    page,
  }) => {
    const audienceInput = page.locator("input").nth(2);

    await audienceInput.click();
    await audienceInput.clear();
    await audienceInput.fill("Modified Audience");

    // Verify field updated
    await expect(audienceInput).toHaveValue("Modified Audience");

    // Verify button remains enabled
    await expect(
      page.getByRole("button", { name: /generate content/i }),
    ).toBeEnabled();
  });

  test("TC-027: Verify Form Field Editing - Key Message Field", async ({
    page,
  }) => {
    const messageTextarea = page.locator("textarea").first();

    await messageTextarea.click();
    await messageTextarea.clear();
    await messageTextarea.fill("Modified key message content");

    // Verify field updated
    await expect(messageTextarea).toHaveValue("Modified key message content");

    // Verify button remains enabled
    await expect(
      page.getByRole("button", { name: /generate content/i }),
    ).toBeEnabled();
  });

  test("TC-028: Verify Form Field Editing - Destinations Field", async ({
    page,
  }) => {
    const destinationsInput = page.locator("input").nth(3);

    await destinationsInput.click();
    await destinationsInput.clear();
    await destinationsInput.fill("Modified Destinations");

    // Verify field updated
    await expect(destinationsInput).toHaveValue("Modified Destinations");

    // Verify button remains enabled
    await expect(
      page.getByRole("button", { name: /generate content/i }),
    ).toBeEnabled();
  });

  test("TC-029: Verify Submit Campaign Brief with Default Values", async ({
    page,
  }) => {
    // Click Generate Content button
    await page.getByRole("button", { name: /generate content/i }).click();

    // Verify button changes to "Agents Working..."
    await expect(
      page.getByRole("button", { name: /agents working/i }),
    ).toBeVisible();

    // Verify button is disabled
    await expect(
      page.getByRole("button", { name: /agents working/i }),
    ).toBeDisabled();

    // Verify loading card appears
    await expect(page.getByText(/agents collaborating/i)).toBeVisible();
    await expect(page.getByText(/creator.*reviewer.*publisher/i)).toBeVisible();
  });

  test("TC-030: Verify Submit Campaign Brief with Modified Values", async ({
    page,
  }) => {
    // Modify form values
    await fillCampaignBrief(page, {
      brand: "Custom Travel Co",
      industry: "Luxury Travel",
    });

    // Click Generate Content button
    await page.getByRole("button", { name: /generate content/i }).click();

    // Verify button state changes
    await expect(
      page.getByRole("button", { name: /agents working/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /agents working/i }),
    ).toBeDisabled();

    // Verify loading card appears
    await expect(page.getByText(/agents collaborating/i)).toBeVisible();
  });

  test("TC-031: Verify Empty Form Submission", async ({ page }) => {
    // Clear all form fields
    await clearAllFormFields(page);

    // Click Generate Content button
    await page.getByRole("button", { name: /generate content/i }).click();

    // Verify submission is triggered (no validation error in demo mode)
    await expect(page.getByText(/agents collaborating/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("TC-032: Verify Navigate to Create Content from Sidebar", async ({
    page,
  }) => {
    // Navigate to Dashboard first using button
    await page.getByRole("button", { name: /dashboard/i }).click();
    await page.waitForURL("/", { timeout: 5000 });

    // Click Create Content in sidebar
    await page.getByRole("button", { name: /create content/i }).click();

    // Verify navigation
    await expect(page).toHaveURL("/create");
    await expect(page.getByText("Campaign Brief").first()).toBeVisible();
  });

  test("TC-033: Verify Navigate to Create Content from Dashboard Button", async ({
    page,
  }) => {
    // Navigate to Dashboard using button
    await page.getByRole("button", { name: /dashboard/i }).click();
    await page.waitForURL("/", { timeout: 5000 });

    // Click Create New Content button
    await page.getByRole("button", { name: /create new content/i }).click();

    // Verify navigation
    await expect(page).toHaveURL("/create");
    await expect(page.getByText("Campaign Brief").first()).toBeVisible();
  });
});
