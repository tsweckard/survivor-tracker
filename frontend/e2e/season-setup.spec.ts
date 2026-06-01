import { test, expect } from '@playwright/test';

test.describe('Season Setup', () => {
  test('can create a new season', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /new season/i }).click();

    await page.getByLabel(/season name/i).fill('Survivor: Testing Island');
    await page.getByLabel(/location/i).fill('Test Island');

    await page.getByRole('button', { name: /create season/i }).click();

    await expect(page.getByText('Survivor: Testing Island')).toBeVisible();
  });

  test('seasons list is visible on home page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /seasons/i })).toBeVisible();
  });
});
