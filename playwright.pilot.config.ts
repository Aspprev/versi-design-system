import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/pilot",
  outputDir: "test-results/pilot",
  forbidOnly: Boolean(process.env.CI),
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/pilot" }]],
  use: { baseURL: "http://127.0.0.1:4175", locale: "pt-BR", actionTimeout: 15_000, trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: {
    command: "npm --prefix examples/pilot run preview",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: false,
    timeout: 30_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
