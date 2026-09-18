import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.STORYBOOK_DS_PORT || 6007);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/visual/design-system",
  outputDir: "test-results/design-system-visual",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  timeout: 120_000,
  reporter: process.env.CI
    ? [["line"], ["html", { open: "never", outputFolder: "playwright-report/design-system" }]]
    : [["list"], ["html", { open: "never", outputFolder: "playwright-report/design-system" }]],
  use: {
    baseURL,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    colorScheme: "light",
  },
  expect: {
    timeout: 30_000,
    toHaveScreenshot: { animations: "disabled", caret: "hide", scale: "css" },
  },
  webServer: {
    command: `npm run build-storybook && node scripts/serve-storybook.mjs ${port}`,
    cwd: ".",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
    env: { STORYBOOK_DISABLE_TELEMETRY: "1" },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"] } },
  ],
});
