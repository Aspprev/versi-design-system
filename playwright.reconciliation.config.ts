import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual/design-system",
  testMatch: ["portal-reconciliation.visual.spec.ts", "high-contrast-dark.visual.spec.ts", "secondary-action-contract.visual.spec.ts"],
  outputDir: "test-results/reconciliation",
  timeout: 120_000,
  workers: 2,
  reporter: "list",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

