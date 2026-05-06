import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('Analityka i Wykresy', () => {
  test('Powinien wyświetlić wykresy postępu i obciążenia', async ({ page }) => {
    await page.goto('/dashboard');
    const projectName = fs.readFileSync('test-project-name.txt', 'utf8');
    await page.getByRole('button').filter({ hasText: projectName }).click();
    await page.getByText('Analytics').click();


    
    const progressBar = page.locator('.bg-slate-100.rounded-full.flex');
    await expect(progressBar).toBeVisible();

    
    await expect(page.getByText(/Team Load/i)).toBeVisible();

  });
});