import { addons } from "storybook/manager-api";
import { create, themes } from "storybook/theming";

addons.setConfig({
  theme: create(
    {
      ...themes.light,
      base: "light",
      brandTitle: "Versi Design System",
      brandUrl: "/",
      brandImage: "/brand/versi-logo-primary.svg",
      colorPrimary: "#0f62c1",
      colorSecondary: "#07448a",
      appBg: "#f4f7f8",
      appContentBg: "#ffffff",
      appBorderColor: "#c9ced4",
      barBg: "#ffffff",
      barTextColor: "#5c5c5c",
      barSelectedColor: "#0f62c1",
      textMutedColor: "#707780",
      inputBg: "#ffffff",
      inputBorder: "#c9ced4",
      inputTextColor: "#181818",
      fontBase: '"Nunito Sans", system-ui, sans-serif',
      fontCode: '"IBM Plex Mono", ui-monospace, monospace',
    },
    { brandTarget: "_self" },
  ),
});
