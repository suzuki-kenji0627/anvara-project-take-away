import { test, expect } from '@playwright/test';

test.describe('Marketplace', () => {
  test('shows the Marketplace heading regardless of auth state', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page.getByRole('heading', { name: 'Marketplace' })).toBeVisible();
  });

  test('unauthenticated user sees sign-in prompt instead of ad slots', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/marketplace');
    // Server component: 401 from backend → renders sign-in prompt
    await expect(page.getByText(/sign in to browse/i)).toBeVisible({ timeout: 5000 });
  });

  test('authenticated sponsor sees ad slots in the marketplace', async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByRole('combobox').selectOption('sponsor');
    await page.getByRole('button', { name: /login as sponsor/i }).click();
    await expect(page).toHaveURL('/dashboard/sponsor', { timeout: 10000 });

    // Navigate to marketplace — should show available ad slots
    await page.goto('/marketplace');
    await expect(page.getByRole('heading', { name: 'Marketplace' })).toBeVisible();
    // Either ad slots load, or the "no ad slots" empty state appears
    await expect(
      page.locator('a[href^="/marketplace/"]').first()
        .or(page.getByText(/no ad slots available/i))
    ).toBeVisible({ timeout: 10000 });
  });

  test('authenticated user can navigate to an ad slot detail page', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('combobox').selectOption('sponsor');
    await page.getByRole('button', { name: /login as sponsor/i }).click();
    await expect(page).toHaveURL('/dashboard/sponsor', { timeout: 10000 });

    await page.goto('/marketplace');
    const firstCard = page.locator('a[href^="/marketplace/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    const href = await firstCard.getAttribute('href');
    expect(href).toMatch(/^\/marketplace\/.+/);
    await firstCard.click();
    await expect(page).toHaveURL(new RegExp('/marketplace/.+'), { timeout: 5000 });
  });
});
