import { readFileSync, existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CLIENT_THEMES, DESIGN_SYSTEM_THEMES } from "../../src/theme-presets";

describe("Public custom theme identifiers", () => {
  it("uses only production IDs for labels, selectors, metadata and examples", () => {
    const ids = ["custom2178", "custom2156", "custom2140", "custom2133", "custom2170", "custom2162", "custom2157"];
    expect(CLIENT_THEMES.map(theme => theme.id)).toEqual(ids);
    for (const theme of CLIENT_THEMES) {
      expect(theme.label).toBe(theme.id);
      const metadata = JSON.parse(readFileSync(`docs/temas-clientes/tema-${theme.id}.json`, "utf8"));
      expect(metadata.name).toBe(theme.id);
      expect(metadata.label).toBe(theme.id);
      expect(existsSync(`stories/themes/${theme.id}.stories.tsx`)).toBe(true);
    }
    const registry = JSON.parse(readFileSync("tokens/design-system.tokens.json", "utf8"));
    const allowed = new Set<string>(DESIGN_SYSTEM_THEMES);
    for (const rule of [...registry.tokens, ...registry.themes]) {
      for (const match of rule.selector.matchAll(/data-ds-theme="([^"]+)"/g)) expect(allowed.has(match[1])).toBe(true);
    }
  });
});
