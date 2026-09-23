import eslint from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "storybook-static/**",
      "playwright-report/**",
      "test-results/**",
      "node_modules/**",
      "examples/pilot/dist/**",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: [
      "src/**/*.{ts,tsx}",
      "stories/**/*.{ts,tsx}",
      ".storybook/**/*.{ts,tsx}",
      "tests/**/*.{ts,tsx}",
      "scripts/**/*.mjs",
      "playwright.config.ts",
      "playwright.pilot.config.ts",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      "no-console": "off",
      "no-control-regex": "warn",
      "no-empty": "warn",
      "no-extra-boolean-cast": "warn",
      "no-useless-assignment": "warn",
      "prefer-const": "warn",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
);
