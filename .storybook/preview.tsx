/// <reference types="vite/client" />

import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";
import "../src/themes.css";
import "./preview.css";

const preview: Preview = {
  initialGlobals: {
    colorScheme: "light",
    dsTheme: "default",
    contrast: "normal",
    fontScale: "default",
    motion: "full",
    emphasizeFocus: false,
    underlineLinks: false,
  },
  globalTypes: {
    colorScheme: {
      description: "Esquema de cores",
      defaultValue: "light",
      toolbar: { icon: "circlehollow", items: ["light", "dark", "system"] },
    },
    dsTheme: {
      description: "Preset de tema do Design System",
      defaultValue: "default",
      toolbar: {
        icon: "paintbrush",
        items: [
          "default",
          "azul1",
          "azul2",
          "azul3",
          "laranja1",
          "laranja2",
          "verde1",
          "verde2",
          "verde3",
          "verde4",
          "rosa1",
        ],
      },
    },
    contrast: {
      description: "Contraste",
      defaultValue: "normal",
      toolbar: { icon: "contrast", items: ["normal", "high"] },
    },
    fontScale: {
      description: "Escala de fonte",
      defaultValue: "default",
      toolbar: { icon: "zoom", items: ["default", "large", "extra-large"] },
    },
    emphasizeFocus: {
      description: "Ênfase de foco",
      defaultValue: false,
      toolbar: { icon: "accessibility", items: ["false", "true"] },
    },
    underlineLinks: {
      description: "Ênfase de links",
      defaultValue: false,
      toolbar: { icon: "link", items: ["false", "true"] },
    },
    motion: {
      description: "Movimento",
      defaultValue: "full",
      toolbar: { icon: "transfer", items: ["full", "reduce"] },
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof document !== "undefined") {
        const requestedColorScheme = context.globals.colorScheme;
        const resolvedColorScheme =
          requestedColorScheme === "system"
            ? window.matchMedia?.("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
            : requestedColorScheme;
        document.documentElement.dataset.colorScheme = resolvedColorScheme;
        document.documentElement.dataset.colorSchemePreference =
          requestedColorScheme;
        document.documentElement.dataset.dsTheme = context.globals.dsTheme;
        document.documentElement.dataset.contrast = context.globals.contrast;
        document.documentElement.dataset.contrastTheme = resolvedColorScheme;
        document.documentElement.dataset.fontScale = context.globals.fontScale;
        document.documentElement.dataset.motion = context.globals.motion;
        const isEnabled = (value: unknown) => value === true || value === "true";
        document.documentElement.dataset.focusEmphasis = isEnabled(
          context.globals.emphasizeFocus,
        )
          ? "strong"
          : "default";
        document.documentElement.dataset.linkEmphasis = isEnabled(
          context.globals.underlineLinks,
        )
          ? "underline"
          : "default";
      }

      return (
        <main className="versi-story-shell bg-surface-card p-8 text-content-primary">
          <Story />
        </main>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    options: {
      storySort: {
        order: [
          "Getting Started",
          "Foundations",
          "Components",
          "Patterns",
          "Themes",
          "Guidelines",
        ],
      },
    },
    // A suíte Playwright executa o Axe explicitamente para evitar duas
    // análises concorrentes no mesmo iframe. O painel do addon continua
    // disponível para inspeção manual no Storybook.
    a11y: { test: "off" },
  },
};

export default preview;
