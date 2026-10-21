/** Existing presets remain available for consumers that use their original names. */
export const LEGACY_THEMES = [
  "default", "azul1", "azul2", "azul3", "laranja1", "laranja2",
  "verde1", "verde2", "verde3", "verde4", "rosa1",
] as const;

/** Client palettes are proposals for visual review, not certified brand manuals. */
export const CLIENT_THEMES = [
  { id: "basf", label: "BASF" },
  { id: "funssest", label: "FUNSSEST" },
  { id: "maisprevidencia", label: "Mais Previdência" },
  { id: "aceprev", label: "ACEPREV" },
  { id: "cibrius", label: "Cibrius" },
  { id: "serpros", label: "SERPROS" },
  { id: "einvest", label: "E-Invest" },
] as const;

export const DESIGN_SYSTEM_THEMES = [
  ...LEGACY_THEMES, ...CLIENT_THEMES.map(theme => theme.id),
] as const;
export type ClientTheme = typeof CLIENT_THEMES[number]["id"];
export type DesignSystemTheme = typeof DESIGN_SYSTEM_THEMES[number];
