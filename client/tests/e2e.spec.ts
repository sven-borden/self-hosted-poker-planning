import { test, expect } from '@playwright/test';

test('smoke – create room flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('input', 'Alice');
  await page.click('text=Create Room');
  await expect(page).toHaveURL(/room\//);
});
