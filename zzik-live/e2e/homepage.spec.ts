import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('ZZIK LIVE');
  });

  test('should navigate to Salient template', async ({ page }) => {
    await page.goto('/');
    
    const salientLink = page.getByRole('link', { name: /Salient/i });
    await salientLink.click();
    
    await expect(page).toHaveURL('/salient');
    await expect(page.getByText(/카페 가서 사진만 찍으면/i)).toBeVisible();
  });

  test('should navigate to Pocket template', async ({ page }) => {
    await page.goto('/');
    
    const pocketLink = page.getByRole('link', { name: /Pocket/i });
    await pocketLink.click();
    
    await expect(page).toHaveURL('/pocket');
  });

  test('should be responsive', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
