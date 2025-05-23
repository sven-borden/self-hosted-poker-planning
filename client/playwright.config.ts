import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'docker compose up --build --wait',
    port: 3000,
    timeout: 120000,
  },
  testDir: './tests',
});
