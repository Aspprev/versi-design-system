import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    server: {
      ...viteConfig.server,
      watch: {
        ...viteConfig.server?.watch,
        ignored: ["**/node_modules/**", "**/dist/**", "**/storybook-static/**", "**/playwright-report/**", "**/test-results/**", "**/coverage/**"],
      },
    },
  }),
};

export default config;
