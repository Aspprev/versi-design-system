import type { getChartTheme } from "./chart-theme";

export type ChartSeriesRole = "primary" | "accent-1" | "accent-2" | "accent-3" | "balance" | "invested";

export type ChartBrandPalette = {
  /** Full, stable category catalog, including categories temporarily filtered out. */
  categories: readonly string[];
  /** Deliberate semantic assignments; remaining categories use distinct data colors. */
  roles?: Readonly<Record<string, ChartSeriesRole>>;
};

type Theme = ReturnType<typeof getChartTheme>;
const channels = (color: string): number[] => color.startsWith("#")
  ? (color.length === 4 ? color.slice(1).split("").map(c => c + c) : color.slice(1).match(/../g) ?? []).map(c => parseInt(c, 16))
  : (color.match(/[\d.]+/g) ?? []).map(Number).slice(0, 3);
const luminance = (color: string) => channels(color).reduce((sum, c, i) => {
  const n = c / 255;
  return sum + (n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][i];
}, 0);
const ratio = (a: string, b: string) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);

/** Shared brand ordering for line and donut; existing default palettes remain separate. */
export function resolveChartBrandPalette(theme: Theme, catalog: ChartBrandPalette, keys: readonly string[]) {
  if (new Set(catalog.categories).size !== catalog.categories.length) throw new Error("Chart brand palette: category keys must be unique.");
  const roles: Record<ChartSeriesRole, string> = {
    primary: theme.series[0], "accent-1": theme.brandSeries[0], "accent-2": theme.brandSeries[1],
    "accent-3": theme.brandSeries[2], balance: theme.balance, invested: theme.invested,
  };
  const signature = (color: string) => channels(color).join(",");
  const usedColors = Object.values(catalog.roles ?? {}).map(role => roles[role]);
  const tooClose = (color: string) => usedColors.some(used => channels(color).reduce((sum, value, i) => sum + (value - channels(used)[i]) ** 2, 0) < 45 ** 2);
  const seen = new Set(Object.values(catalog.roles ?? {}).map(role => signature(roles[role])));
  const pool: string[] = [];
  for (const color of [...theme.brandSeries, ...theme.series]) {
    if (seen.has(signature(color))) continue;
    // Project optional data candidates, leaving public reference tokens intact.
    let projected = color;
    const toward = luminance(theme.surface) < .25 ? 255 : 0;
    for (let step = 1; step <= 16 && ratio(projected, theme.surface) < 3; step++) {
      projected = `rgb(${channels(color).map(value => Math.round(value * (1 - step * .05) + toward * step * .05)).join(", ")})`;
    }
    if (seen.has(signature(projected)) || tooClose(projected)) continue;
    seen.add(signature(color)); seen.add(signature(projected)); usedColors.push(projected); pool.push(projected);
  }
  // Extend data colors beyond the existing twelve slots; never cycle three accents.
  const extend = (index: number) => {
    const h = index * 137.508 % 360;
    let l = luminance(theme.surface) < .25 ? 65 : 35;
    const color = () => {
      const a = .65 * Math.min(l / 100, 1 - l / 100);
      return `rgb(${[0, 8, 4].map(n => { const k = (n + h / 30) % 12; return Math.round(255 * (l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); }).join(", ")})`;
    };
    while (ratio(color(), theme.surface) < 3 && l > 15 && l < 85) l += luminance(theme.surface) < .25 ? 1 : -1;
    return color();
  };
  const assigned = new Map<string, string>(); let next = 0;
  for (const category of catalog.categories) {
    const role = catalog.roles?.[category];
    assigned.set(category, role ? roles[role] : (pool[next] ?? extend(next)));
    if (!role) next++;
  }
  return keys.map(key => {
    const color = assigned.get(key);
    if (!color) throw new Error(`Chart brand palette: category "${key}" is missing from the stable catalog.`);
    return color;
  });
}
