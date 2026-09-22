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
});
