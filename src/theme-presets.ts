/** Existing presets remain available for consumers that use their original names. */
export const LEGACY_THEMES = [
  "default", "azul1", "azul2", "azul3", "laranja1", "laranja2",
  "verde1", "verde2", "verde3", "verde4", "rosa1",
] as const;

/** Client palettes are proposals for visual review, not certified brand manuals. */
export const CLIENT_THEMES = [
  { id: "custom2178", label: "custom2178" },
  { id: "custom2156", label: "custom2156" },
  { id: "custom2140", label: "custom2140" },
  { id: "custom2133", label: "custom2133" },
  { id: "custom2170", label: "custom2170" },
  { id: "custom2162", label: "custom2162" },
  { id: "custom2157", label: "custom2157" },
] as const;

export const DESIGN_SYSTEM_THEMES = [
  ...LEGACY_THEMES, ...CLIENT_THEMES.map(theme => theme.id),
] as const;
export type ClientTheme = typeof CLIENT_THEMES[number]["id"];
export type DesignSystemTheme = typeof DESIGN_SYSTEM_THEMES[number];
