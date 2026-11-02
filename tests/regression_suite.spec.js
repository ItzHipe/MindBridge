// tests/regression_suite.spec.js
// Extended regression test suite for MindBridge nightly runs.
// Includes: login, navigation, account update, validation, and negative cases.
// -----------------------------------------------------------------------
const { test, expect } = require('@playwright/test');

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

// ── Helper: log in and return to a known state ─────────────────────────
async function login(page) {
  await page.goto('/login');
  await page.getByLabel('Email Address').fill(TEST_EMAIL);
  await page.getByLabel('Password').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

// ═══════════════════════════════════════════════════════════════════════
// 1. Login Tests
// ═══════════════════════════════════════════════════════════════════════
test.describe('Login Tests', () => {
  test('LGN-001 – Successful login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill(TEST_EMAIL);
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Welcome back,')).toBeVisible();
  });

  test('LGN-002 – Login fails with incorrect password', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill(TEST_EMAIL);
    await page.getByLabel('Password').fill('WrongPassword123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid email or password.')).toBeVisible();
  });

  test('LGN-003 – Login fails with unregistered email', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('nobody@example.com');
    await page.getByLabel('Password').fill('SomePass123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid email or password.')).toBeVisible();
  });

  test('LGN-004 – Login page redirects authenticated user to dashboard', async ({
    page,
  }) => {
    await login(page);
    await page.goto('/login');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 2. Navigation Tests
// ═══════════════════════════════════════════════════════════════════════
test.describe('Navigation Tests', () => {
  test('NAV-001 – Dashboard links to Account page', async ({ page }) => {
    await login(page);
    await page.getByRole('navigation').getByRole('link', { name: 'Account' }).click();
    await expect(page).toHaveURL(/\/account/);
  });

  test('NAV-002 – Account page links back to Dashboard', async ({ page }) => {
    await login(page);
    await page.goto('/account');
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('NAV-003 – Logout redirects to login page', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('NAV-004 – Unauthenticated user is redirected from /account to /login', async ({
    page,
  }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/\/login/);
  });

  test('NAV-005 – Unauthenticated user is redirected from /dashboard to /login', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 3. Account Update Tests
// ═══════════════════════════════════════════════════════════════════════
test.describe('Account Update Tests', () => {
  test('ACC-001 – Update phone number shows success', async ({ page }) => {
    await login(page);
    await page.goto('/account');
    const phoneInput = page.getByLabel('Phone Number');
    await phoneInput.clear();
    await phoneInput.fill('555-9999');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Account updated successfully.')).toBeVisible();
    await expect(phoneInput).toHaveValue('555-9999');
  });

  test('ACC-002 – Update first name persists', async ({ page }) => {
    await login(page);
    await page.goto('/account');
    const firstNameInput = page.getByLabel('First Name');
    await firstNameInput.clear();
    await firstNameInput.fill('Alexander');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Account updated successfully.')).toBeVisible();
    await expect(firstNameInput).toHaveValue('Alexander');
  });

  test('ACC-003 – Form pre-fills current user data', async ({ page }) => {
    await login(page);
    await page.goto('/account');
    await expect(page.getByLabel('Email Address')).toHaveValue(TEST_EMAIL);
  });

  test('ACC-004 – Submit without required first name shows error', async ({
    page,
  }) => {
    await login(page);
    await page.goto('/account');
    const firstNameInput = page.getByLabel('First Name');
    await firstNameInput.clear();
    await page.getByRole('button', { name: 'Save Changes' }).click();
    // HTML5 validation should block submission (required attribute)
    // The input should still be on the page, and no success message
    await expect(page.getByText('Account updated successfully.')).not.toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 4. Reset test data back to baseline
// ═══════════════════════════════════════════════════════════════════════
test.describe('Data Reset', () => {
  test('RESET – Restore baseline user data for next run', async ({ page }) => {
    await login(page);
    await page.goto('/account');
    await page.getByLabel('First Name').fill('Alex');
    await page.getByLabel('Last Name').fill('Johnson');
    await page.getByLabel('Email Address').fill(TEST_EMAIL);
    await page.getByLabel('Phone Number').fill('555-0101');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Account updated successfully.')).toBeVisible();
  });
});
