export type AccessibilityColorScheme = "system" | "light" | "dark";
export type AccessibilityHighContrastTheme = "light" | "dark";
export type AccessibilityFontScale = "standard" | "large" | "extra-large";

export interface AccessibilityPreferences {
  colorScheme: AccessibilityColorScheme;
  highContrast: boolean;
  highContrastTheme: AccessibilityHighContrastTheme;
  fontScale: AccessibilityFontScale;
  reduceMotion: boolean;
  emphasizeFocus: boolean;
  underlineLinks: boolean;
}

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  colorScheme: "light",
  highContrast: false,
  highContrastTheme: "light",
  fontScale: "standard",
  reduceMotion: false,
  emphasizeFocus: false,
  underlineLinks: false,
};
