import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SPONSOR_AUTH = path.join(__dirname, '.auth/sponsor.json');
export const PUBLISHER_AUTH = path.join(__dirname, '.auth/publisher.json');

/**
 * Runs once before the test suite.
 * Logs in as each demo account and saves the browser storage state so individual
 * tests can reuse the session without re-authenticating (which would hit the backend's
 * auth rate limiter).
 */
export default async function globalSetup() {
  const browser = await chromium.launch();

  async function saveAuth(role: 'sponsor' | 'publisher', outputPath: string) {
    const page = await browser.newPage();
    await page.goto('http://localhost:3847/login');
    await page.getByRole('combobox').selectOption(role);
    await page.getByRole('button', { name: new RegExp(`login as ${role}`, 'i') }).click();
    await page.waitForURL(new RegExp(`/dashboard/${role}`), { timeout: 15000 });
    await page.context().storageState({ path: outputPath });
    await page.close();
  }

  await saveAuth('sponsor', SPONSOR_AUTH);
  await saveAuth('publisher', PUBLISHER_AUTH);

  await browser.close();
}
