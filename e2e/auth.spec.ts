import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('login page renders with role selector and submit button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Login to Anvara' })).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
    await expect(page.getByRole('option', { name: /sponsor/i })).toBeAttached();
    await expect(page.getByRole('option', { name: /publisher/i })).toBeAttached();
  });

  test('sponsor logs in and is redirected to /dashboard/sponsor', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('combobox').selectOption('sponsor');
    await page.getByRole('button', { name: /login as sponsor/i }).click();
    await expect(page).toHaveURL('/dashboard/sponsor', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'My Campaigns' })).toBeVisible();
  });

  test('publisher logs in and is redirected to /dashboard/publisher', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('combobox').selectOption('publisher');
    await page.getByRole('button', { name: /login as publisher/i }).click();
    await expect(page).toHaveURL('/dashboard/publisher', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'My Ad Slots' })).toBeVisible();
  });

  test('unauthenticated visit to /dashboard/sponsor redirects to /login', async ({ page }) => {
    await page.goto('/dashboard/sponsor');
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('unauthenticated visit to /dashboard/publisher redirects to /login', async ({ page }) => {
    await page.goto('/dashboard/publisher');
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });
});
