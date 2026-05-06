import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from './constants';
import fs from 'fs';
import path from 'path';

setup('authenticate', async ({ page }) => {
  const dir = path.dirname(STORAGE_STATE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  
  const uniqueId = Date.now();
  const email = `testuser_${uniqueId}@example.com`;
  fs.writeFileSync('name.txt', `Tester_${uniqueId}`);
  await page.goto('/register');
  await page.getByPlaceholder(/Username/i).fill(`Tester_${uniqueId}`);
  await page.getByPlaceholder(/Email/i).fill(email);
  await page.getByPlaceholder(/Password/i).fill('Password123!');
  await page.getByRole('button', { name: /Register/i }).click();

  
  await expect(page).toHaveURL(/\/dashboard/);

  
  await page.context().storageState({ path: STORAGE_STATE });
});