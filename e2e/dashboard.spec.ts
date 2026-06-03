import { test, expect, type Page } from '@playwright/test';

async function loginAs(page: Page, role: 'sponsor' | 'publisher') {
  await page.context().clearCookies();
  await page.goto('/login');
  await page.getByRole('combobox').selectOption(role);
  await page.getByRole('button', { name: new RegExp(`login as ${role}`, 'i') }).click();
  await page.waitForURL(new RegExp(`/dashboard/${role}`), { timeout: 10000 });
}

test.describe('Sponsor Dashboard', () => {
  test('authenticated sponsor sees "My Campaigns" heading', async ({ page }) => {
    await loginAs(page, 'sponsor');
    await expect(page.getByRole('heading', { name: 'My Campaigns' })).toBeVisible();
  });

  test('campaign list or empty state is visible after login', async ({ page }) => {
    await loginAs(page, 'sponsor');
    await expect(
      page.getByText(/no campaigns yet/i).or(page.locator('.grid').first())
    ).toBeVisible({ timeout: 10000 });
  });

  test('sponsor visiting /dashboard/publisher is redirected to home', async ({ page }) => {
    await loginAs(page, 'sponsor');
    await page.goto('/dashboard/publisher');
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });
});

test.describe('Publisher Dashboard', () => {
  test('authenticated publisher sees "My Ad Slots" heading', async ({ page }) => {
    await loginAs(page, 'publisher');
    await expect(page.getByRole('heading', { name: 'My Ad Slots' })).toBeVisible();
  });

  test('ad slot list or empty state is visible after login', async ({ page }) => {
    await loginAs(page, 'publisher');
    await expect(
      page.getByText(/no ad slots yet/i).or(page.locator('.grid').first())
    ).toBeVisible({ timeout: 10000 });
  });

  test('publisher visiting /dashboard/sponsor is redirected to home', async ({ page }) => {
    await loginAs(page, 'publisher');
    await page.goto('/dashboard/sponsor');
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });
});
