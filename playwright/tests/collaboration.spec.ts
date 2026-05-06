import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('Współpraca i Zaawansowane Funkcje', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto('/dashboard');
    const projectName = fs.readFileSync('test-project-name.txt', 'utf8');
    await page.getByRole('button').filter({ hasText: projectName }).click();
  });
  

  test('Zapraszanie i zarządzanie rolami', async ({ page }) => {
  
    await page.getByText('Team').click();
    await page.getByText('Invite').click();
    await page.getByPlaceholder(/colleague@example.com/i).fill('z123456z.ya1@gmail.com');
    await page.getByRole('combobox').selectOption('Manager');
    await page.getByText('Send Invitation').click();
  });

  test('Przypisywanie wielu osób', async ({ page }) => {
    await page.getByText('Tasks').click();
    const name = fs.readFileSync('name.txt', 'utf8');
    await page.getByRole('combobox').nth(1).selectOption(name);
    await expect(page.getByRole('button', { name: '×' })).toBeVisible();
  });

  test('Filtrowanie listy zadań', async ({ page }) => {
    await page.getByText('New Task').click();
    
    await page.locator('div').filter({ hasText: /^Title$/ }).locator('input').fill('Test Task');
    await page.getByText('Create a task').click();
    await page.getByRole('combobox').nth(2).selectOption('IN_PROGRESS');
    await page.getByRole('combobox').first().selectOption('IN_PROGRESS');
    
    
    const tasks = page.getByText('Test Task');
    for (const task of await tasks.all()) {
      await expect(task).toContainText('UPDATED');
    }
  });
});