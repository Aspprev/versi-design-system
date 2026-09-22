import type { Meta, StoryObj } from "@storybook/react-vite";
import { useGlobals } from "storybook/preview-api";
import {
  AccessibilityPreferencesPanel,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  HighContrastToggle,
  type AccessibilityPreferences,
} from "../src";

const meta = {
  title: "Components/Accessibility/AccessibilityPreferencesPanel",
  component: AccessibilityPreferencesPanel,
  tags: ["autodocs"],
  args: {
    preferences: DEFAULT_ACCESSIBILITY_PREFERENCES,
    onPreferencesChange: () => undefined,
    onReset: () => undefined,
  },
} satisfies Meta<typeof AccessibilityPreferencesPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

type StorybookPreferencesGlobals = {
  colorScheme?: unknown;
  contrast?: unknown;
  fontScale?: unknown;
  motion?: unknown;
  emphasizeFocus?: unknown;
  underlineLinks?: unknown;
};

function readPreferences(
  globals: StorybookPreferencesGlobals,
): AccessibilityPreferences {
  const isEnabled = (value: unknown) => value === true || value === "true";
  const colorScheme = ["system", "light", "dark"].includes(
    String(globals.colorScheme),
  )
    ? (globals.colorScheme as AccessibilityPreferences["colorScheme"])
    : "light";
  const fontScale = ["default", "large", "extra-large"].includes(
    String(globals.fontScale),
  )
    ? ((globals.fontScale === "default"
        ? "standard"
        : globals.fontScale) as AccessibilityPreferences["fontScale"])
    : "standard";

  return {
    ...DEFAULT_ACCESSIBILITY_PREFERENCES,
    emphasizeFocus: isEnabled(globals.emphasizeFocus),
    underlineLinks: isEnabled(globals.underlineLinks),
    colorScheme,
    highContrast: globals.contrast === "high",
    highContrastTheme: colorScheme === "dark" ? "dark" : "light",
    fontScale,
    reduceMotion: globals.motion === "reduce",
  };
}

function renderPreferencesStory() {
  const [globals, updateGlobals] = useGlobals();
  const preferences = readPreferences(globals);

  const updatePreferences = (changes: Partial<AccessibilityPreferences>) => {
    const globalChanges: Record<string, string> = {};
    if (changes.colorScheme) globalChanges.colorScheme = changes.colorScheme;
    if (typeof changes.highContrast === "boolean") {
      globalChanges.contrast = changes.highContrast ? "high" : "normal";
    }
    if (changes.fontScale) {
      globalChanges.fontScale =
        changes.fontScale === "standard" ? "default" : changes.fontScale;
    }
    if (typeof changes.reduceMotion === "boolean") {
      globalChanges.motion = changes.reduceMotion ? "reduce" : "full";
    }
    if (typeof changes.emphasizeFocus === "boolean") {
      globalChanges.emphasizeFocus = String(changes.emphasizeFocus);
    }
    if (typeof changes.underlineLinks === "boolean") {
      globalChanges.underlineLinks = String(changes.underlineLinks);
    }
    if (Object.keys(globalChanges).length > 0) updateGlobals(globalChanges);
  };

  return (
    <div className="flex flex-col gap-4">
      <AccessibilityPreferencesPanel
        preferences={preferences}
        onPreferencesChange={updatePreferences}
        onReset={() => {
          updateGlobals({
            colorScheme: "light",
            contrast: "normal",
            fontScale: "default",
            motion: "full",
            emphasizeFocus: "false",
            underlineLinks: "false",
          });
        }}
      />
      <HighContrastToggle
        checked={preferences.highContrast}
        onChange={(highContrast) =>
          updateGlobals({ contrast: highContrast ? "high" : "normal" })
        }
      />
    </div>
  );
}

export const Default: Story = {
  render: renderPreferencesStory,
};

export const DarkHighContrast: Story = {
  globals: {
    colorScheme: "dark",
    contrast: "high",
    fontScale: "large",
  },
  render: renderPreferencesStory,
};
