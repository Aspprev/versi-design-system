import type { Meta, StoryObj } from "@storybook/react-vite";
import { useGlobals } from "storybook/preview-api";
import {
  ContrastPreference,
  FontSizePreference,
  ReadingPreferences,
  ThemePreference,
  type AccessibilityColorScheme,
  type AccessibilityFontScale,
} from "../src";

function renderThemePreference() {
  const [globals, updateGlobals] = useGlobals();
  const value = ["system", "light", "dark"].includes(String(globals.colorScheme))
    ? (globals.colorScheme as AccessibilityColorScheme)
    : "light";
  return (
    <ThemePreference
      value={value}
      onChange={(nextValue) => updateGlobals({ colorScheme: nextValue })}
    />
  );
}

function renderContrastPreference() {
  const [globals, updateGlobals] = useGlobals();
  return (
    <ContrastPreference
      checked={globals.contrast === "high"}
      onChange={(checked) =>
        updateGlobals({ contrast: checked ? "high" : "normal" })
      }
    />
  );
}

function renderFontSizePreference() {
  const [globals, updateGlobals] = useGlobals();
  const value = ["default", "large", "extra-large"].includes(
    String(globals.fontScale),
  )
    ? ((globals.fontScale === "default"
        ? "standard"
        : globals.fontScale) as AccessibilityFontScale)
    : "standard";
  return (
    <FontSizePreference
      value={value}
      onChange={(nextValue) =>
        updateGlobals({
          fontScale: nextValue === "standard" ? "default" : nextValue,
        })
      }
    />
  );
}

function renderReadingPreferences() {
  const [globals, updateGlobals] = useGlobals();
  const isEnabled = (value: unknown) => value === true || value === "true";
  return (
    <ReadingPreferences
      reduceMotion={globals.motion === "reduce"}
      emphasizeFocus={isEnabled(globals.emphasizeFocus)}
      underlineLinks={isEnabled(globals.underlineLinks)}
      onChange={(changes) => {
        const globalChanges: Record<string, string> = {};
        if (typeof changes.reduceMotion === "boolean") {
          globalChanges.motion = changes.reduceMotion ? "reduce" : "full";
        }
        if (typeof changes.emphasizeFocus === "boolean") {
          globalChanges.emphasizeFocus = String(changes.emphasizeFocus);
        }
        if (typeof changes.underlineLinks === "boolean") {
          globalChanges.underlineLinks = String(changes.underlineLinks);
        }
        updateGlobals(globalChanges);
      }}
    />
  );
}

const meta = {
  title: "Components/Accessibility/Preferences",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Theme: Story = {
  render: renderThemePreference,
};

export const ThemeDark: Story = {
  globals: { colorScheme: "dark" },
  render: renderThemePreference,
};

export const Contrast: Story = {
  globals: { contrast: "high" },
  render: renderContrastPreference,
};

export const FontSize: Story = {
  globals: { fontScale: "large" },
  render: renderFontSizePreference,
};

export const Reading: Story = {
  globals: { motion: "reduce" },
  render: renderReadingPreferences,
};
