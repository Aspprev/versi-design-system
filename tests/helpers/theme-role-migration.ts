import { readFileSync } from "node:fs";

const approvedPalettes = JSON.parse(readFileSync("docs/temas-clientes/0.7.2-approved-overrides.json", "utf8")).overrides as Record<string, Record<string, Record<string, string>>>;
const reconciliation = JSON.parse(readFileSync("docs/reconciliation/approved-overrides.json", "utf8")).overrides as Record<string, Record<string, Record<string, string>>>;
const universalHighDark = JSON.parse(readFileSync("docs/high-contrast-dark/policy.json", "utf8")).tokens as Record<string, string>;

/** Apply only approved palette differences to keys covered by a historical contract. */
export function applyApprovedPalettes(values: Record<string, string>, theme: string, mode: string): Record<string, string> {
  const overrides = { ...approvedPalettes[theme]?.[mode], ...reconciliation[theme]?.[mode], ...(mode === "high-dark" ? universalHighDark : {}) };
  const resolved = (value: string): string => {
    const reference = /^var\((--[^)]+)\)$/.exec(value);
    return reference ? overrides[reference[1]] ?? values[reference[1]] ?? value : value;
  };
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, resolved(overrides[key] ?? value)]));
}

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
  const overrides = universalHighDark;
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, overrides[key] ?? value]));
}
