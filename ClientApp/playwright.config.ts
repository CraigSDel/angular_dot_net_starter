import { defineConfig, devices } from '@playwright/test';
import { unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const e2eDatabasePath = process.env.E2E_DATABASE_PATH ?? join(tmpdir(), `user-task-management-e2e-${process.pid}.db`);
const e2ePort = process.env.E2E_PORT ?? '5010';
for (const suffix of ['', '-wal', '-shm']) {
  try { unlinkSync(`${e2eDatabasePath}${suffix}`); } catch { /* The file may not exist on the first run. */ }
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['line']] : 'list',
  use: {
    baseURL: process.env.BASE_URL ?? `http://127.0.0.1:${e2ePort}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  ...(process.env.CI ? {} : {
    webServer: {
      command: `cd .. && dotnet bin/Release/net10.0/user-task-management.dll --urls http://127.0.0.1:${e2ePort}`,
      url: `http://127.0.0.1:${e2ePort}`,
      reuseExistingServer: true,
      timeout: 120_000,
      env: {
        ASPNETCORE_ENVIRONMENT: process.env.ASPNETCORE_ENVIRONMENT ?? 'Development',
        ConnectionStrings__DefaultConnection: `Data Source=${e2eDatabasePath}`
      }
    }
  }),
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
