import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,   // subido de 30000: con slowMo 500 y 5 navegadores, algunos tests pueden pasarse de 30s
  retries: 1,
  workers: 1,       // con headless: false, varias ventanas en paralelo causan timeouts

  use: {
    baseURL: 'https://www.demoblaze.com',
    headless: false,

    screenshot: 'on',
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 }
    },
    trace: 'on',
    launchOptions: {
      slowMo: 500   // ralentiza cada acción 500 ms para ver bien los videos
    }
  },

  projects: [
    // Clase 10: multi-browser (3 motores de escritorio + 2 móviles)
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
});