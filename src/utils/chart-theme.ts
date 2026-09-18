const SERIES_FALLBACKS = [
  "#0f62c1",
  "#16d39a",
  "#feb019",
  "#ff4560",
  "#775dd0",
  "#00b8d9",
  "#ff8f00",
  "#26a69a",
  "#ec407a",
  "#7cb342",
  "#5c6bc0",
  "#8d6e63",
] as const;

const DONUT_SERIES_FALLBACKS = [
  "#66d288",
  "#3182f6",
  "#ffc25c",
  "#7c58e8",
  "#ff6b6b",
  ...SERIES_FALLBACKS.slice(5),
] as const;

const MUTED_SERIES_FALLBACKS = [
  "#c5cad0",
  "#d9dde1",
  "#eceef0",
  "#aeb5bd",
] as const;

const readColorToken = (token: string, fallback: string): string => {
  if (typeof window === "undefined") return fallback;
  const value = window
    .getComputedStyle(document.body ?? document.documentElement)
    .getPropertyValue(token)
    .trim();
  return value ? `rgb(${value})` : fallback;
};

export const getChartTheme = () => ({
  series: SERIES_FALLBACKS.map((fallback, index) =>
    readColorToken(`--chart-${index + 1}`, fallback),
  ),
  donutSeries: DONUT_SERIES_FALLBACKS.map((fallback, index) =>
    readColorToken(`--chart-donut-${index + 1}`, fallback),
  ),
  mutedSeries: MUTED_SERIES_FALLBACKS.map((fallback, index) =>
    readColorToken(`--chart-muted-${index + 1}`, fallback),
  ),
  balance: readColorToken("--chart-balance", "#00a76f"),
  invested: readColorToken("--chart-invested", "#1e90ff"),
  grid: readColorToken("--chart-grid", "#e5e7eb"),
  axis: readColorToken("--chart-axis", "#6b7280"),
  axisBorder: readColorToken("--chart-axis-border", "#d1d5db"),
  tooltipText: readColorToken("--chart-tooltip-text", "#111827"),
  neutralLine: readColorToken("--chart-line-neutral", "#181818"),
  surface: readColorToken("--surface-card", "#ffffff"),
});

export const getChartSeriesRecord = (
  backendColors?: Record<number, string>,
  count = 5,
): Record<number, string> => {
  const { series } = getChartTheme();
  const fallbackColors = Object.fromEntries(
    Array.from({ length: count }, (_, index) => [index + 1, series[index]]),
  );

  const isDarkSchemeActive =
    typeof document !== "undefined" &&
    document.documentElement.dataset.colorScheme === "dark";

  const highContrastActive =
    typeof document !== "undefined" &&
    document.documentElement.dataset.contrast === "high";

  return highContrastActive || isDarkSchemeActive
    ? fallbackColors
    : { ...fallbackColors, ...backendColors };
};
