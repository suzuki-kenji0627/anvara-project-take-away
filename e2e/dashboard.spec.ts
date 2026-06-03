import { test, expect } from '@playwright/test';
import { SPONSOR_AUTH, PUBLISHER_AUTH } from './global.setup';

test.describe('Sponsor Dashboard', () => {
  test.use({ storageState: SPONSOR_AUTH });

  test('authenticated sponsor sees "My Campaigns" heading', async ({ page }) => {
    await page.goto('/dashboard/sponsor');
    await expect(page.getByRole('heading', { name: 'My Campaigns' })).toBeVisible();
  });

  test('campaign list or empty state is visible', async ({ page }) => {
    await page.goto('/dashboard/sponsor');
    await expect(
      page.getByText(/no campaigns yet/i).or(page.locator('.grid').first())
    ).toBeVisible({ timeout: 10000 });
  });

  test('sponsor visiting /dashboard/publisher is redirected to home', async ({ page }) => {
    await page.goto('/dashboard/publisher');
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });
});

test.describe('Publisher Dashboard', () => {
  test.use({ storageState: PUBLISHER_AUTH });

  test('authenticated publisher sees "My Ad Slots" heading', async ({ page }) => {
    await page.goto('/dashboard/publisher');
    await expect(page.getByRole('heading', { name: 'My Ad Slots' })).toBeVisible();
  });

  test('ad slot list or empty state is visible', async ({ page }) => {
    await page.goto('/dashboard/publisher');
    await expect(
      page.getByText(/no ad slots yet/i).or(page.locator('.grid').first())
    ).toBeVisible({ timeout: 10000 });
  });

  test('publisher visiting /dashboard/sponsor is redirected to home', async ({ page }) => {
    await page.goto('/dashboard/sponsor');
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });
});
