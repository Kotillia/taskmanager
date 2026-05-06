import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('Start - Zarządzanie Projektami i Zadaniami (CRUD)', () => {
  const projectName = 'Automated Project ' + Date.now();
  const taskName = 'Test Task ' + Date.now();

  test('Tworzenie projektu, taska i edycja taska', async ({ page }) => {
    
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /New Project/i }).click();
    const projectInput = page.getByPlaceholder(/Name your project/i);
    await projectInput.fill(projectName);
    await page.getByRole('button', { name: /Create Project/i }).click();
    fs.writeFileSync('test-project-name.txt', projectName);
    await expect(page.getByText(projectName)).toBeVisible();
    await page.getByText(projectName).click();
    await page.getByRole('button', { name: /Tasks/i }).click();
    await page.getByText('New Task').click();
    await page.locator('div').filter({ hasText: /^Title$/ }).locator('input').fill(taskName);
    await page.getByText('Create a task').click();
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();
    await page.locator('form input[type="text"]').click();
    await page.locator('form input[type="text"]').fill(taskName + ' UPDATED');
    await page.locator('textarea').click();
    await page.locator('textarea').fill('Edited');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText(taskName + ' UPDATED')).toBeVisible();
      });
});