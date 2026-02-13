import { Page, expect } from "@playwright/test";

/**
 * Test Helper Functions for Zava Travel Content Studio
 * Common utilities used across multiple test cases
 */

/**
 * Demo Account Credentials from User Story US-001
 */
export const DEMO_ACCOUNTS = {
  SARAH: {
    username: "sarah.explorer",
    password: "zava2026",
    displayName: "Sarah Chen",
    role: "Content Lead",
    avatar: "🧭",
  },
  MARCO: {
    username: "marco.adventures",
    password: "wander2026",
    displayName: "Marco Rivera",
    role: "Social Media Manager",
    avatar: "🌍",
  },
  ADMIN: {
    username: "admin",
    password: "admin",
    displayName: "Zava Admin",
    role: "Administrator",
    avatar: "⚙️",
  },
};

/**
 * Default Campaign Brief Values from User Story US-003
 */
export const DEFAULT_CAMPAIGN_BRIEF = {
  brand: "Zava Travel Inc.",
  industry: "Travel — Budget-Friendly Adventure",
  targetAudience: "Millennials & Gen-Z adventure seekers",
  keyMessage:
    "Wander More, Spend Less — affordable curated itineraries to dream destinations starting at $699",
  destinations: "Bali, Patagonia, Iceland, Vietnam, Costa Rica",
};

/**
 * Login to the application with specified credentials
 * @param page - Playwright Page object
 * @param username - Username for login
 * @param password - Password for login
 */
export async function login(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await page.goto("/");

  // Wait for login page to load
  await expect(page.locator('input[type="text"]').first()).toBeVisible();

  // Enter credentials
  await page.locator('input[type="text"]').first().fill(username);
  await page.locator('input[type="password"]').fill(password);

  // Click Sign In button
  await page.getByRole("button", { name: /sign in/i }).click();

  // Wait for navigation to dashboard (successful login)
  await page.waitForURL("/", { timeout: 5000 });
}

/**
 * Login with demo account (Sarah Chen by default)
 * @param page - Playwright Page object
 * @param account - Demo account to use (default: SARAH)
 */
export async function loginWithDemoAccount(
  page: Page,
  account: (typeof DEMO_ACCOUNTS)[keyof typeof DEMO_ACCOUNTS] = DEMO_ACCOUNTS.SARAH,
): Promise<void> {
  await login(page, account.username, account.password);
}

/**
 * Navigate to Create Content page
 * Assumes user is already logged in
 * @param page - Playwright Page object
 */
export async function navigateToCreateContent(page: Page): Promise<void> {
  // Click Create Content in sidebar or use direct navigation
  await page.goto("/create");
  await page.waitForLoadState("networkidle");
}

/**
 * Fill campaign brief form
 * @param page - Playwright Page object
 * @param brief - Campaign brief data
 */
export async function fillCampaignBrief(
  page: Page,
  brief: Partial<typeof DEFAULT_CAMPAIGN_BRIEF>,
): Promise<void> {
  if (brief.brand !== undefined) {
    const brandInput = page
      .locator("input")
      .filter({ hasText: /brand/i })
      .or(
        page.locator('label:has-text("Brand")').locator("..").locator("input"),
      )
      .first();
    await brandInput.clear();
    await brandInput.fill(brief.brand);
  }

  if (brief.industry !== undefined) {
    const industryInput = page
      .locator("input")
      .filter({ hasText: /industry/i })
      .or(
        page
          .locator('label:has-text("Industry")')
          .locator("..")
          .locator("input"),
      )
      .first();
    await industryInput.clear();
    await industryInput.fill(brief.industry);
  }

  if (brief.targetAudience !== undefined) {
    const audienceInput = page
      .locator("input")
      .filter({ hasText: /target audience/i })
      .or(
        page
          .locator('label:has-text("Target Audience")')
          .locator("..")
          .locator("input"),
      )
      .first();
    await audienceInput.clear();
    await audienceInput.fill(brief.targetAudience);
  }

  if (brief.keyMessage !== undefined) {
    const messageInput = page
      .locator("textarea")
      .filter({ hasText: /key message/i })
      .or(
        page
          .locator('label:has-text("Key Message")')
          .locator("..")
          .locator("textarea"),
      )
      .first();
    await messageInput.clear();
    await messageInput.fill(brief.keyMessage);
  }

  if (brief.destinations !== undefined) {
    const destinationsInput = page
      .locator("input")
      .filter({ hasText: /destinations/i })
      .or(
        page
          .locator('label:has-text("Destinations")')
          .locator("..")
          .locator("input"),
      )
      .first();
    await destinationsInput.clear();
    await destinationsInput.fill(brief.destinations);
  }
}

/**
 * Submit campaign brief and wait for content generation
 * @param page - Playwright Page object
 * @param waitForCompletion - Whether to wait for generation to complete (default: true)
 */
export async function submitCampaignBrief(
  page: Page,
  waitForCompletion: boolean = true,
): Promise<void> {
  // Click Generate Content button
  await page.getByRole("button", { name: /generate content/i }).click();

  if (waitForCompletion) {
    // Wait for loading state to appear
    await expect(page.getByText(/agents collaborating/i)).toBeVisible({
      timeout: 5000,
    });

    // Wait for results to appear (approximately 3 seconds + buffer)
    await expect(page.getByText(/content generated/i)).toBeVisible({
      timeout: 10000,
    });
  }
}

/**
 * Logout from the application
 * @param page - Playwright Page object
 */
export async function logout(page: Page): Promise<void> {
  // Click Sign Out button in sidebar
  await page.getByRole("button", { name: /sign out/i }).click();

  // Wait for redirect to login page
  await page.waitForURL("/", { timeout: 5000 });

  // Verify login page is displayed
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
}

/**
 * Verify sidebar is displayed with correct elements
 * @param page - Playwright Page object
 */
export async function verifySidebarDisplay(page: Page): Promise<void> {
  // Verify logo
  await expect(page.getByText("Zava Travel")).toBeVisible();

  // Verify navigation items
  await expect(page.getByRole("button", { name: /dashboard/i })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /create content/i }),
  ).toBeVisible();
}

/**
 * Wait for page to be fully loaded
 * @param page - Playwright Page object
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
  await page.waitForLoadState("domcontentloaded");
}

/**
 * Take screenshot with custom name
 * @param page - Playwright Page object
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

/**
 * Verify error message is displayed
 * @param page - Playwright Page object
 * @param expectedMessage - Expected error message text
 */
export async function verifyErrorMessage(
  page: Page,
  expectedMessage: string,
): Promise<void> {
  await expect(page.getByText(expectedMessage)).toBeVisible();
}

/**
 * Clear all form fields
 * @param page - Playwright Page object
 */
export async function clearAllFormFields(page: Page): Promise<void> {
  const inputs = await page.locator('input[type="text"]').all();
  for (const input of inputs) {
    await input.clear();
  }

  const textareas = await page.locator("textarea").all();
  for (const textarea of textareas) {
    await textarea.clear();
  }
}
