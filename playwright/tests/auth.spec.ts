import { test, expect } from '@playwright/test';

test.describe('Autentykacja i Rejestracja', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Powinien zarejestrować nowego użytkownika i wejść do dashboardu', async ({ page }) => {
    await page.goto('/register');
    await page.getByPlaceholder(/Username/i).fill('tester' + Date.now());
    await page.getByPlaceholder(/Email/i).fill('test' + Date.now() + '@example.com');
    await page.getByPlaceholder(/Password/i).fill('Password123!');
    await page.getByRole('button', { name: /Register/i }).click();

    
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Powinien zalogować istniejącego użytkownika', async ({ page }) => {
    
    const email = `login-test-${Date.now()}@example.com`;
    await page.goto('/register');
    await page.getByPlaceholder(/Username/i).fill('UserToLogin');
    await page.getByPlaceholder(/Email/i).fill(email);
    await page.getByPlaceholder(/Password/i).fill('Password123!');
    await page.getByRole('button', { name: /Register/i }).click();
    
    
    await page.getByRole('button', { name: /Log Out/i }).click();

    
    await page.goto('/login');
    await page.getByPlaceholder(/example@email.com/i).fill(email);
    await page.locator('input[type="password"]').fill('Password123!');
    await page.getByRole('button', { name: /Log in!/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
  });
});