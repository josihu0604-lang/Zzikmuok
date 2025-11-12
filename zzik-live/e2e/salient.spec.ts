import { test, expect } from '@playwright/test';

test.describe('Salient Template', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/salient');
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.getByText(/카페 가서 사진만 찍으면/i)).toBeVisible();
    await expect(page.getByText(/15,000원/i)).toBeVisible();
  });

  test('should have working CTA button', async ({ page }) => {
    const ctaButton = page.getByRole('link', { name: /지금 무료로 시작하기/i });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('href');
  });

  test('should display income calculator', async ({ page }) => {
    // Check for calculator presence
    const calculator = page.locator('text=/수익/i').first();
    await expect(calculator).toBeVisible();
  });

  test('should display testimonials', async ({ page }) => {
    // Scroll to testimonials section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    
    // Check for testimonials
    await expect(page.locator('[class*="testimonial"]').first()).toBeVisible({ timeout: 5000 });
  });
});
