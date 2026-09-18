/** Entrada opcional para visualizações baseadas em ApexCharts. */
export {
  LazyApexChart,
  InteractiveDonutChart,
  TimeSeriesChart,
  TimeRangeSelector,
  buildTimeSeriesTooltip,
  escapeDonutTooltipText,
  escapeTimeSeriesTooltipText,
  normalizeTimeSeriesTooltipColor,
  resolveInteractiveDonutColors,
  resolveRelativeDonutSelection,
} from "./components/chart";
export type {
  ApexChartProps,
  InteractiveDonutOptions,
  InteractiveDonutProps,
  TimeRangeSelectorProps,
  TimeSeriesChartOptions,
  TimeSeriesChartProps,
  TimeSeriesTooltipRow,
} from "./components/chart";
export {
  getChartSeriesRecord,
  getChartTheme,
} from "./utils/chart-theme";

