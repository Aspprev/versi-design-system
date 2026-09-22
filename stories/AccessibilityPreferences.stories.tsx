import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
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

function PreferencesPreview({
  initial = DEFAULT_ACCESSIBILITY_PREFERENCES,
}: {
  initial?: AccessibilityPreferences;
}) {
  const [preferences, setPreferences] = useState(initial);
  return (
    <div className="flex flex-col gap-4">
      <AccessibilityPreferencesPanel
        preferences={preferences}
        onPreferencesChange={(changes) =>
          setPreferences((current) => ({ ...current, ...changes }))
        }
        onReset={() => setPreferences(DEFAULT_ACCESSIBILITY_PREFERENCES)}
      />
      <HighContrastToggle
        checked={preferences.highContrast}
        onChange={(highContrast) =>
          setPreferences((current) => ({ ...current, highContrast }))
        }
      />
    </div>
  );
}

export const Default: Story = { render: () => <PreferencesPreview /> };
export const DarkHighContrast: Story = {
  render: () => (
    <PreferencesPreview
      initial={{
        ...DEFAULT_ACCESSIBILITY_PREFERENCES,
        colorScheme: "dark",
        highContrast: true,
        highContrastTheme: "dark",
        fontScale: "large",
      }}
    />
  ),
};

