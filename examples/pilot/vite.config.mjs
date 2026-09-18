import { defineConfig } from "vite";

export default defineConfig({
  // The consumer uses compiled CSS and must not inherit the DS build tooling.
  css: { postcss: { plugins: [] } },
});
