import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Surface, getChartTheme, resolveChartBrandPalette, type ChartBrandPalette } from "../../src";
import { contrastRatio } from "../helpers/contrast";

describe("Optional brand detail contract", () => {
  it("preserves Surface defaults and consumes explicit accents without leaking props to the DOM", () => {
    expect(renderToStaticMarkup(<Surface>Default</Surface>)).toContain("bg-surface-card");
    const html = renderToStaticMarkup(<Surface brandAccent={2}>Detail</Surface>);
    expect(html).toContain("bg-brand-accent-2-soft");
    expect(html).toContain("text-brand-accent-2-content");
    expect(html).not.toContain("brandAccent=");
    expect(html).not.toContain("feedback-");
  });
  it("keeps category identity across filtering/reordering and shares brand ordering between chart kinds", () => {
    const theme = getChartTheme();
    const catalog: ChartBrandPalette = { categories: ["savings", "loan", "help", "other"], roles: { loan: "accent-2", help: "accent-3", savings: "balance" } };
    const colors = resolveChartBrandPalette(theme, catalog, catalog.categories);
    expect(colors[0]).toBe(theme.balance);
    expect(colors[1]).toBe(theme.brandSeries[1]);
    expect(resolveChartBrandPalette(theme, catalog, ["other", "loan"])).toEqual([colors[3], colors[1]]);
    expect(resolveChartBrandPalette(theme, catalog, ["loan", "help"])).toEqual([colors[1], colors[2]]);
  });
  it("extends beyond three accents and twelve series without undefined or cycling colors", () => {
    const categories = Array.from({ length: 24 }, (_, index) => `category-${index}`);
    const colors = resolveChartBrandPalette(getChartTheme(), { categories }, categories);
    expect(colors).toHaveLength(24);
    expect(new Set(colors).size).toBe(24);
    expect(colors.every(Boolean)).toBe(true);
    expect(() => resolveChartBrandPalette(getChartTheme(), { categories }, ["unknown"])).toThrow(/stable catalog/);
    expect(() => resolveChartBrandPalette(getChartTheme(), { categories: ["a", "a"] }, ["a"])).toThrow(/unique/);
  });
  it("keeps formal high contrast checks for all seven clients and both high modes", () => {
    const { pairs } = JSON.parse(readFileSync("docs/brand-accents/PAIRS.json", "utf8"));
    expect(pairs).toHaveLength(216);
    for (const pair of pairs.filter((row: { mode: string }) => row.mode.startsWith("high"))) {
      expect(contrastRatio(pair.content, pair.soft)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(pair.border, pair.soft)).toBeGreaterThanOrEqual(3);
      expect(pair.chartRatio).toBeGreaterThanOrEqual(3);
    }
    const colors = readFileSync("tokens/tailwind-colors.cjs", "utf8");
    expect(colors).toContain('"brand-accent-1-soft"');
    expect(colors).not.toContain('"brand-detail-gradient"');
    expect(colors).not.toContain('"brand-accent-1-radius"');
  });
});
