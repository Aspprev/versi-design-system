/// <reference types="vite/client" />

import { CLIENT_THEMES } from "../src/theme-presets";
import { FocusNavigationMode } from "../src/components/focus-navigation/FocusNavigationMode";
import type { Preview } from "@storybook/react-vite";
import { ComponentDocumentation, DocumentationContainer } from "./ComponentDocumentation";
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
      toolbar: { icon: "circlehollow", dynamicTitle: true, items: [{ value: "light", title: "Claro" }, { value: "dark", title: "Escuro" }, { value: "system", title: "Sistema" }] },
    },
    dsTheme: {
      description: "Preset de tema do Design System",
      defaultValue: "default",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "default", title: "Padrão" },
          { value: "azul1", title: "Azul 1" }, { value: "azul2", title: "Azul 2" }, { value: "azul3", title: "Azul 3" },
          { value: "laranja1", title: "Laranja 1" }, { value: "laranja2", title: "Laranja 2" },
          { value: "verde1", title: "Verde 1" }, { value: "verde2", title: "Verde 2" }, { value: "verde3", title: "Verde 3" }, { value: "verde4", title: "Verde 4" },
          { value: "rosa1", title: "Rosa 1" },
          ...CLIENT_THEMES.map(theme => ({ value: theme.id, title: "Tema · " + theme.label })),
        ],
      },
    },
    contrast: {
      description: "Contraste",
      defaultValue: "normal",
      toolbar: { icon: "contrast", dynamicTitle: true, items: [{ value: "normal", title: "Contraste normal" }, { value: "high", title: "Alto contraste" }] },
    },
    fontScale: {
      description: "Escala de fonte",
      defaultValue: "default",
      toolbar: { icon: "zoom", items: [{ value: "default", title: "Fonte padrão" }, { value: "large", title: "Fonte grande" }, { value: "extra-large", title: "Fonte muito grande" }] },
    },
    emphasizeFocus: {
      description: "Ênfase de foco",
      defaultValue: false,
      toolbar: { icon: "accessibility", items: [{ value: "false", title: "Foco padrão" }, { value: "true", title: "Foco reforçado" }] },
    },
    underlineLinks: {
      description: "Ênfase de links",
      defaultValue: false,
      toolbar: { icon: "link", items: [{ value: "false", title: "Links padrão" }, { value: "true", title: "Sublinhar links" }] },
    },
    motion: {
      description: "Movimento",
      defaultValue: "full",
      toolbar: { icon: "transfer", items: [{ value: "full", title: "Movimento normal" }, { value: "reduce", title: "Movimento reduzido" }] },
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
        <div className="versi-story-shell bg-surface-card text-content-primary">
          <FocusNavigationMode />
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    docs: { container: DocumentationContainer, page: ComponentDocumentation, toc: true, source: { type: "dynamic", language: "tsx" } },
    controls: { expanded: true, sort: "requiredFirst" },
    options: {
      storySort: {
        order: [
          "Getting Started",
          ["Introduction", "Installation", "Contributing", "Usage"],
          "Foundations",
          "Components",
          ["Overview", "Actions", "Forms", "Data Display", "Feedback", "Navigation", "Layout", "Documents", "Overlay", "Accessibility", "Utilities"],
          "Patterns",
          "Themes",
          "Guidelines",
          "Laboratory",
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
