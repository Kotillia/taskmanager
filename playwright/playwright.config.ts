import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { STORAGE_STATE } from '../playwright/tests/constants';


dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
  
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    storageState: STORAGE_STATE,
  },

  projects: [

    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { storageState: { cookies: [], origins: [] } },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: [
        /collaboration\.spec\.ts/,
        /project-setup\.spec\.ts/, 
        /analytics\.spec\.ts/, 
        /cleanup\.spec\.ts/
      ],
    },
    { 
      name: 'data-setup', 
      testMatch: /project-setup\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'] 
    },
    { 
      name: 'testing-analytics', 
      testMatch: /analytics\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['data-setup'] 
    },
    { 
      name: 'testing-collaboration', 
      testMatch: /collaboration\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['data-setup'] 
    },
    { 
      name: 'teardown', 
      testMatch: /cleanup\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['testing-analytics'] 
    },
    {
      name: 'public',
      testMatch: /auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], storageState: { cookies: [], origins: [] } },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    cwd: '../task-manager-frontend',
    reuseExistingServer: !process.env.CI,
  },
});