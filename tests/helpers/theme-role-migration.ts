/** Apply the 0.7.0 palette migration to historical, immutable theme snapshots. */
export function promoteTertiaryTokens(values: Record<string, string>, mode?: string): Record<string, string> {
  const result = Object.fromEntries(Object.entries(values)
    .filter(([key]) => !/^--secondary-\d$|^--action-secondary-|^--switch-track-secondary-on$|^--content-brand-secondary$|^--notice-secondary-content$/.test(key))
    .map(([key, value]) => [key
      .replace("--tertiary-", "--secondary-")
      .replace("--action-tertiary-", "--action-secondary-")
      .replace("--switch-track-tertiary-on", "--switch-track-secondary-on"), value]));
  return applyHighDarkSecondary(result, mode);
}

/** Approved HC dark corrections; keep original source snapshots immutable. */
export function applyHighDarkSecondary(values: Record<string, string>, mode?: string) {
  if (mode !== "high-dark") return values;
  const overrides: Record<string, string> = {
    "--secondary-1": "229, 231, 235", "--secondary-2": "209, 213, 219",
    "--secondary-3": "156, 163, 175", "--secondary-4": "117, 117, 117",
    "--secondary-5": "31, 33, 37", "--switch-track-off": "117, 117, 117",
  };
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, overrides[key] ?? value]));
}
