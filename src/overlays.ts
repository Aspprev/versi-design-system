/** Overlays e preferências que dependem de Headless UI e do DOM. */
export { default as Modal } from "./components/Modal/Modal";
export type { ModalProps } from "./components/Modal/Modal";
export { default as InputSwitch } from "./components/InputSwitch/InputSwitch";
export type { InputSwitchProps } from "./components/InputSwitch/InputSwitch";
export {
  AccessibilityPreferencesPanel,
  HighContrastToggle,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
} from "./components/accessibility-preferences";
export type {
  AccessibilityColorScheme,
  AccessibilityFontScale,
  AccessibilityHighContrastTheme,
  AccessibilityPreferences,
  AccessibilityPreferencesPanelProps,
  HighContrastToggleProps,
} from "./components/accessibility-preferences";

