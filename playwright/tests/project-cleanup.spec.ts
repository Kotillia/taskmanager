import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('Zarządzanie Projektami i Zadaniami (CRUD)', () => {

  test('Blokada, usuwanie taska i usuwanie projektu', async ({ page }) => {
    await page.goto('/dashboard');
    const projectName = fs.readFileSync('test-project-name.txt', 'utf8');
    await page.getByRole('button').filter({ hasText: projectName }).click();
    
    await page.getByRole('combobox').nth(2).selectOption('BLOCKED');
    await page.getByRole('textbox', { name: 'I don\'t know what to do...' }).fill('I dont');
    await page.getByText('Block Task').click();
    await expect(page.getByText('I dont')).toBeVisible();

    await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
    
    
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.getByRole('button', { name: 'Delete Project' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    if (fs.existsSync('test-project-name.txt')) {
    fs.unlinkSync('test-project-name.txt');
    console.log('Plik tymczasowy usunięty.');
    }
    if (fs.existsSync('name.txt')) {
    fs.unlinkSync('name.txt');
    console.log('Plik tymczasowy usunięty.');
    }
  });
});