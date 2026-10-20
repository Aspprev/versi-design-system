import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const themesCss = readFileSync(
  resolve(process.cwd(), "src/themes.css"),
  "utf8",
);
const stylesCss = readFileSync(
  resolve(process.cwd(), "src/styles.css"),
  "utf8",
);
const tokensCss = readFileSync(
  resolve(process.cwd(), "src/tokens.css"),
  "utf8",
);
const themeLabStory = readFileSync(
  resolve(process.cwd(), "stories/ThemeLab.stories.tsx"),
  "utf8",
);

describe("Design System theme contract", () => {
  it("mantem placeholders do alto contraste escuro proximos ao minimo AA de 4.5:1", () => {
    const registry = JSON.parse(readFileSync(resolve(process.cwd(), "tokens/design-system.tokens.json"), "utf8"));
    const rule = registry.tokens.find((entry: { selector: string; declarations: { property: string; value: string }[] }) =>
      entry.selector.startsWith('html[data-contrast="high"][data-contrast-theme="dark"]') &&
      entry.declarations.some((declaration) => declaration.property === "--field-placeholder"),
    );
    const declarations = new Map<string, string>(rule.declarations.map((entry: { property: string; value: string }) => [entry.property, entry.value]));
    const rgb = (value: string): number[] => value.split(",").map(Number);
    const luminance = (channels: number[]): number => channels.reduce((sum, channel, index) => {
      const normalized = channel / 255;
      const linear = normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      return sum + linear * [0.2126, 0.7152, 0.0722][index];
    }, 0);
    const resolveColor = (property: string): number[] => {
      const value = declarations.get(property)!;
      const reference = /^var\((--[^)]+)\)$/.exec(value);
      return reference ? resolveColor(reference[1]) : rgb(value);
    };
    for (const [foreground, background] of [
      ["--field-placeholder", "--field-surface"],
      ["--field-placeholder-disabled", "--field-surface-disabled"],
    ]) {
      const ratio = (luminance(resolveColor(foreground)) + 0.05) / (luminance(resolveColor(background)) + 0.05);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeLessThan(4.7);
    }
  });

  it("publica todos os presets do portal como data-ds-theme", () => {
    for (const theme of [
      "azul1",
      "azul2",
      "azul3",
      "laranja1",
      "laranja2",
      "verde1",
      "verde2",
      "verde3",
      "verde4",
      "rosa1",
    ]) {
      expect(themesCss).toContain(`[data-ds-theme="${theme}"]`);
    }
  });

  it("mantem tipografia sobrescrevivel pelo consumidor", () => {
    expect(tokensCss).toContain(
      '--font-family-base: var(--font-nunito-sans, "Nunito Sans"), sans-serif',
    );
    expect(stylesCss).toContain("var(--font-family-base");
    expect(themesCss).not.toContain("@font-face");
  });

  it("faz os presets vencerem os tokens base do pacote", () => {
    expect(themesCss).not.toContain("@layer ds-themes");
    expect(themesCss).toContain(':is([data-ds-theme="verde1"], .verde1)');
  });

  it("mantem a documentacao de integracao no ThemeLab", () => {
    expect(themeLabStory).toContain("Themes/ThemeLab");
    expect(themeLabStory).toContain("@aspprev/versi-ds/styles.css");
    expect(themeLabStory).toContain("@aspprev/versi-ds/themes.css");
    expect(themeLabStory).toContain("data-ds-theme");
    expect(themeLabStory).toContain("data-color-scheme");
  });

  it("publica os contratos de enfase de foco e links", () => {
    expect(tokensCss).toContain('html[data-focus-emphasis="strong"]');
    expect(tokensCss).toContain(
      'html[data-link-emphasis="underline"] a:not([role="button"])',
    );
    expect(tokensCss).toContain("--focus-emphasis-outline-width: 3px");
    expect(tokensCss).toContain("--link-emphasis-thickness: 0.12em");
  });
});
