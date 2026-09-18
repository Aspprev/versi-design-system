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
  },
  globalTypes: {
    colorScheme: {
      description: "Esquema de cores",
      defaultValue: "light",
      toolbar: { icon: "circlehollow", items: ["light", "dark"] },
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
    motion: {
      description: "Movimento",
      defaultValue: "full",
      toolbar: { icon: "transfer", items: ["full", "reduce"] },
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof document !== "undefined") {
        document.documentElement.dataset.colorScheme =
          context.globals.colorScheme;
        document.documentElement.dataset.dsTheme = context.globals.dsTheme;
        document.documentElement.dataset.contrast = context.globals.contrast;
        document.documentElement.dataset.contrastTheme =
          context.globals.colorScheme;
        document.documentElement.dataset.fontScale = context.globals.fontScale;
        document.documentElement.dataset.motion = context.globals.motion;
      }

      return (
        <main className="bg-surface-card p-8 text-content-primary">
          <Story />
        </main>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    // A suíte Playwright executa o Axe explicitamente para evitar duas
    // análises concorrentes no mesmo iframe. O painel do addon continua
    // disponível para inspeção manual no Storybook.
    a11y: { test: "off" },
  },
};

export default preview;
