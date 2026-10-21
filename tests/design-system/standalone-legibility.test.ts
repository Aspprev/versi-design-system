import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "../helpers/contrast";

import { promoteTertiaryTokens } from "../helpers/theme-role-migration";

type Variants = Record<string, Record<string, string>>;
const baseline = JSON.parse(readFileSync("docs/correcao-legibilidade/BASELINE-ANTES.json", "utf8")).themes as Record<string, Variants>;
const corrections = JSON.parse(readFileSync("docs/correcao-legibilidade/AJUSTES-FUNCIONAIS.json", "utf8")).overrides as Record<string, Variants>;

describe("Pares funcionais de legibilidade", () => {
  for (const [id, variants] of Object.entries(baseline)) {
    it(`${id}: placeholders e hierarquia textual ficam fora da correção`, () => {
      for (const mode of Object.keys(variants)) {
        expect(Object.keys(corrections[id][mode]).filter(key => key.includes("placeholder") || key === "--content-secondary")).toEqual([]);
      }
    });
    for (const mode of ["high-light", "high-dark"]) it(`${id}/${mode}: pares de status e ações`, () => {
      const values = promoteTertiaryTokens({ ...variants[mode], ...corrections[id][mode] });
      for (const color of ["primary", "blue", "green", "orange", "yellow", "red", "slate", "black"]) {
        for (const surface of ["--surface-page", "--surface-card-semantic", "--surface-subtle", "--surface-muted"]) {
          expect(contrastRatio(values[`--status-${color}-outline-foreground`], values[surface])).toBeGreaterThanOrEqual(4.5);
          expect(contrastRatio(values[`--status-${color}-outline-border`], values[surface])).toBeGreaterThanOrEqual(3);
        }
        for (const appearance of ["solid", "soft"]) {
          const fg = color === "primary" && appearance === "solid" ? values["--action-primary-content"] : values[`--status-${color}-${appearance}-foreground`];
          const bg = color === "primary" && appearance === "solid" ? values["--action-primary-background"] : values[`--status-${color}-${appearance}-background`];
          expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
        }
      }
      for (const family of ["primary", "secondary", "danger", "warning"]) for (const suffix of ["", "-hover", "-active"]) {
        expect(contrastRatio(values[`--action-${family}-content${suffix}`], values[`--action-${family}-background${suffix}`])).toBeGreaterThanOrEqual(4.5);
      }
      for (const role of ["selected", "error"]) {
        expect(contrastRatio(values[`--checkbox-${role}`], values["--checkbox-surface"])).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(mode === "high-dark" ? "0,0,0" : "255,255,255", values[`--checkbox-${role}`])).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(values[`--radio-${role}`], values["--radio-surface"])).toBeGreaterThanOrEqual(3);
      }
      for (const variant of ["primary", "secondary", "contract", "theme"]) {
        const knob = variant === "theme" ? values["--switch-knob-theme-on"] : values["--switch-knob"];
        expect(contrastRatio(knob, values[`--switch-track-${variant}-on`])).toBeGreaterThanOrEqual(3);
      }
      expect(contrastRatio(values["--switch-knob"], values["--switch-track-off"])).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(values["--field-icon"], values["--field-surface"])).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(values["--field-assistive-error"], values["--surface-page"])).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(values["--chart-tooltip-content"], values["--chart-tooltip-background"])).toBeGreaterThanOrEqual(4.5);
      for (let i=1;i<=12;i++) expect(contrastRatio(values[`--chart-${i}`],values["--surface-card-semantic"])).toBeGreaterThanOrEqual(3);
    });
  }
  it("o fallback continua neutro e mais legível no escuro comum", () => {
    for (const [id, variants] of Object.entries(baseline)) {
      const before = variants.dark;
      const after = { ...before, ...corrections[id].dark };
      expect(contrastRatio(after["--status-slate-outline-foreground"], after["--surface-card-semantic"])).toBeGreaterThan(contrastRatio(before["--status-slate-outline-foreground"], before["--surface-card-semantic"]));
    }
  });
});
