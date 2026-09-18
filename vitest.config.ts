import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/design-system/standalone*.test.ts", "tests/design-system/standalone*.test.tsx"],
    pool: "threads",
    maxWorkers: 1,
  },
});
