// @ts-check
const { defineConfig } = require('@playwright/test');

require('dotenv').config();

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: `http://localhost:${process.env.PORT || 3000}`,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  /* Start the MindBridge server before running tests */
  webServer: {
    command: 'node server.js',
    port: Number(process.env.PORT) || 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 10_000,
  },
});
