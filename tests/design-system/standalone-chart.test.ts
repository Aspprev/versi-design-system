import { describe, expect, it } from "vitest";
import {
  buildTimeSeriesTooltip,
  escapeDonutTooltipText,
  getChartSeriesRecord,
  getChartTheme,
  normalizeTimeSeriesTooltipColor,
  resolveInteractiveDonutColors,
  resolveRelativeDonutSelection,
} from "../../src";

describe("Chart standalone", () => {
  it("fornece tema com fallbacks e registro de series", () => {
    const theme = getChartTheme();
    const record = getChartSeriesRecord(undefined, 3);

    expect(theme.series).toHaveLength(12);
    expect(theme.donutSeries).toHaveLength(12);
    expect(record[1]).toBe(theme.series[0]);
    expect(record[3]).toBe(theme.series[2]);
  });

  it("resolve selecao circular e cores de destaque do donut", () => {
    expect(resolveRelativeDonutSelection({ currentIndex: null, direction: 1, count: 3 })).toBe(0);
    expect(resolveRelativeDonutSelection({ currentIndex: 0, direction: -1, count: 3 })).toBe(2);
    expect(resolveInteractiveDonutColors({ count: 3, colors: ["red", "blue"], mutedColors: ["gray"], selectedIndex: 1 })).toEqual(["gray", "blue", "gray"]);
  });

  it("escapa tooltips e rejeita cores inseguras", () => {
    expect(escapeDonutTooltipText("<b>Plano</b>")).toBe("&lt;b&gt;Plano&lt;/b&gt;");
    expect(normalizeTimeSeriesTooltipColor("javascript:alert(1)")).toBe("currentColor");
    expect(buildTimeSeriesTooltip({ reference: "Jan", rows: [{ label: "Saldo", value: "R$ 10", color: "#123456" }] })).toContain("Saldo");
  });
});
