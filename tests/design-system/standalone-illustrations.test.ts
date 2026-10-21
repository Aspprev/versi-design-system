import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DESIGN_SYSTEM_THEMES } from "../../src/theme-presets";
import { contrastRatio } from "../helpers/contrast";

const pairs = JSON.parse(readFileSync("docs/illustrations/PAIRS.json", "utf8")).pairs as {
  theme: string; mode: string; primary: string; content: string;
  accents: { background: string; content: string }[];
}[];

describe("contrato das cores de ilustrações", () => {
  it("documenta os pares dos 18 temas nos quatro modos", () => {
    expect(pairs).toHaveLength(72);
    expect(new Set(pairs.map(pair => pair.theme))).toEqual(new Set(DESIGN_SYSTEM_THEMES));
    expect(new Set(pairs.map(pair => `${pair.theme}/${pair.mode}`)).size).toBe(72);
  });
  it("oferece primeiro plano de texto para a primária e os três acentos", () => {
    for (const pair of pairs) {
      expect(contrastRatio(pair.primary, pair.content), `${pair.theme}/${pair.mode}/primary`).toBeGreaterThanOrEqual(4.5);
      expect(pair.accents).toHaveLength(3);
      for (const accent of pair.accents) expect(contrastRatio(accent.background, accent.content), `${pair.theme}/${pair.mode}/accent`).toBeGreaterThanOrEqual(4.5);
    }
  });
  it("usa o par semântico no alto contraste e primeiro plano escuro no escuro", () => {
    for (const pair of pairs.filter(pair => pair.mode.startsWith("high"))) {
      for (const accent of pair.accents) expect(accent).toEqual({ background: pair.primary, content: pair.content });
      if (pair.mode === "high-dark") expect(pair.content.replace(/\s/g, "")).toBe("0,0,0");
    }
  });
});
