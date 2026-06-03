import { test, expect } from '@playwright/test';
import { SPONSOR_AUTH } from './global.setup';

test.describe('Marketplace — unauthenticated', () => {
  test('shows the Marketplace heading', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page.getByRole('heading', { name: 'Marketplace', exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('unauthenticated user sees sign-in prompt instead of ad slots', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page.getByText(/sign in to browse/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Marketplace — authenticated sponsor', () => {
  test.use({ storageState: SPONSOR_AUTH });

  test('shows available ad slots', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page.getByRole('heading', { name: 'Marketplace' })).toBeVisible();
    await expect(
      page.locator('a[href^="/marketplace/"]').first()
        .or(page.getByText(/no ad slots available/i))
    ).toBeVisible({ timeout: 10000 });
  });

  test('clicking an ad slot navigates to its detail page', async ({ page }) => {
    await page.goto('/marketplace');
    const firstCard = page.locator('a[href^="/marketplace/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    const href = await firstCard.getAttribute('href');
    expect(href).toMatch(/^\/marketplace\/.+/);
    await firstCard.click();
    await expect(page).toHaveURL(new RegExp('/marketplace/.+'), { timeout: 5000 });
  });
});
