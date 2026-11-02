// tests/account_update.spec.js
// Playwright E2E – MindBridge Account Update (Happy Path)
// -------------------------------------------------------
const { test, expect } = require('@playwright/test');

// Test credentials are loaded from environment variables via dotenv
// (configured in playwright.config.js). Never hard-code passwords.
const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe('MindBridge Account Update', () => {
  test.beforeEach(async ({ page }) => {
    // ── Step 1: Navigate to the login page ──────────────────────────────
    await page.goto('/login');
    await expect(page).toHaveTitle(/Login/);
  });

  test('should update phone number and display success confirmation', async ({
    page,
  }) => {
    // ── Step 2: Log in as the test user ─────────────────────────────────
    await page.getByLabel('Email Address').fill(TEST_EMAIL);
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    // ── Step 3: Verify successful login (redirected to dashboard) ──────
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Welcome back,')).toBeVisible();

    // ── Step 4: Navigate to the Account Update page ─────────────────────
    await page.getByRole('navigation').getByRole('link', { name: 'Account' }).click();
    await expect(page).toHaveURL(/\/account/);
    await expect(
      page.getByRole('heading', { name: 'Account Update' })
    ).toBeVisible();

    // ── Step 5: Update the phone number field ───────────────────────────
    const newPhoneNumber = '555-9999';
    const phoneInput = page.getByLabel('Phone Number');
    await phoneInput.clear();
    await phoneInput.fill(newPhoneNumber);

    // ── Step 6: Submit the form ─────────────────────────────────────────
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // ── Step 7: Verify the phone number was updated ─────────────────────
    await expect(phoneInput).toHaveValue(newPhoneNumber);

    // ── Step 8: Verify success confirmation ─────────────────────────────
    await expect(
      page.getByText('Account updated successfully.')
    ).toBeVisible();
  });
});
