"use client";

import { useHighContrastPreference } from "../../hooks/useHighContrastPreference";
import { resolveChartBrandPalette, type ChartBrandPalette } from "../../utils/chart-brand-palette";
import { useChartTheme } from "../../hooks/useChartTheme";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Chart, { type Props as ApexChartProps } from "./LazyApexChart";

export type TimeSeriesChartOptions = NonNullable<ApexChartProps["options"]>;

export type TimeSeriesChartProps = Omit<ApexChartProps, "options"> & {
  options: TimeSeriesChartOptions;
  brandPalette?: ChartBrandPalette;
  seriesKeys?: readonly string[];
  ariaLabel: string;
  loading?: boolean;
  loadingMessage?: ReactNode;
  error?: ReactNode;
  emptyMessage?: ReactNode;
  className?: string;
  chartClassName?: string;
  responsiveHeight?: boolean;
  highContrastOverride?: boolean;
};

export default function TimeSeriesChart({
  options,
  brandPalette,
  seriesKeys,
  ariaLabel,
  loading = false,
  loadingMessage = "Carregando gráfico…",
  error,
  emptyMessage = "Nenhum dado disponível.",
  className,
  chartClassName,
  responsiveHeight = false,
  highContrastOverride,
  ...chartProps
}: TimeSeriesChartProps) {
  const storedHighContrast = useHighContrastPreference();
  const highContrast = highContrastOverride ?? storedHighContrast;
  const theme = useChartTheme();
  const keys: readonly string[] = seriesKeys ?? (chartProps.series ?? []).map((entry: unknown, index: number) => entry && typeof entry === "object" && "name" in entry ? String(entry.name) : String(index));
  if (brandPalette && keys.length !== chartProps.series?.length) throw new Error("TimeSeriesChart: seriesKeys must match the series count.");
  const brandColors = brandPalette ? resolveChartBrandPalette(theme, brandPalette, keys) : undefined;
  const resolvedColors = highContrast ? (brandColors ?? [...theme.series]) : (options.colors ?? brandColors ?? [...theme.series]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  const themeKey = [
    highContrast ? "high-contrast" : "standard",
    theme.axis,
    theme.axisBorder,
    theme.grid,
    theme.surface,
    ...theme.series,
    ...(brandColors ?? []),
  ].join("|");

  useEffect(() => {
    if (!responsiveHeight) {
      setMeasuredHeight(null);
      setMeasuredWidth(null);
      return;
    }

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const fallbackHeight =
      typeof chartProps.height === "number" ? chartProps.height : 0;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = container.getBoundingClientRect();
        const nextWidth = Math.floor(bounds.width);
        const nextHeight = Math.max(
          fallbackHeight,
          Math.floor(bounds.height),
        );

        if (nextWidth > 0) {
          setMeasuredWidth((current) =>
            current === nextWidth ? current : nextWidth,
          );
        }

        if (nextHeight > 0) {
          setMeasuredHeight((current) =>
            current === nextHeight ? current : nextHeight,
          );
        }
      });
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [chartProps.height, responsiveHeight]);

  const renderedHeight =
    responsiveHeight && measuredHeight ? measuredHeight : chartProps.height;
  const renderedWidth =
    responsiveHeight && measuredWidth ? measuredWidth : chartProps.width;
  const hasSeriesData =
    Array.isArray(chartProps.series) &&
    chartProps.series.some((entry) => {
      if (!entry || typeof entry !== "object") return false;
      const data = (entry as { data?: unknown }).data;
      return Array.isArray(data) ? data.length > 0 : data !== undefined;
    });
  const xAxis = options.xaxis;
  const xAxisCategories = Array.isArray(xAxis?.categories)
    ? xAxis.categories
    : [];
  const availableWidth =
    typeof renderedWidth === "number" ? renderedWidth : 720;
  const maxVisibleXAxisLabels = Math.max(
    4,
    Math.min(12, Math.floor(availableWidth / 88)),
  );
  const xAxisLabelStep = Math.max(
    1,
    Math.ceil(xAxisCategories.length / maxVisibleXAxisLabels),
  );
  const hasDenseXAxis = xAxisCategories.length > maxVisibleXAxisLabels;
  const xAxisCategoriesKey = JSON.stringify(xAxisCategories);
  const responsiveXAxisFormatter = xAxisCategories.length
    ? (
        value: string | number,
        _timestamp?: number,
        opts?: { dataPointIndex?: number },
      ) => {
        const fallbackIndex = xAxisCategories.findIndex(
          (category) => String(category) === String(value),
        );
        const index =
          opts?.dataPointIndex ?? (fallbackIndex >= 0 ? fallbackIndex : 0);
        const isLast = index === xAxisCategories.length - 1;

        return index % xAxisLabelStep === 0 || isLast
          ? String(xAxisCategories[index] ?? value)
          : "";
      }
    : xAxis?.labels?.formatter;
  const renderKey = [
    themeKey,
    renderedWidth ?? "auto-width",
    renderedHeight ?? "auto-height",
    xAxisCategoriesKey,
  ].join("|");

  const yAxis = Array.isArray(options.yaxis)
    ? options.yaxis.map((axis) => ({
        ...axis,
        labels: {
          ...axis.labels,
          show: true,
          style: {
            fontSize: "11px",
            fontWeight: 500,
            ...axis.labels?.style,
            colors: theme.axis,
          },
        },
      }))
    : {
        ...options.yaxis,
        labels: {
          ...options.yaxis?.labels,
          show: true,
          style: {
            fontSize: "11px",
            fontWeight: 500,
            ...options.yaxis?.labels?.style,
            colors: theme.axis,
          },
        },
      };

  const sharedOptions: TimeSeriesChartOptions = {
    ...options,
    colors: resolvedColors,
    fill: highContrast && brandPalette ? { ...options.fill, type: "solid", opacity: 1 } : (options.fill ?? {}),
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      ...options.chart,
      foreColor: theme.axis,
    },
    dataLabels: {
      enabled: false,
      ...options.dataLabels,
    },
    grid: {
      show: true,
      borderColor: theme.grid,
      strokeDashArray: 0,
      ...options.grid,
      xaxis: {
        lines: {
          ...options.grid?.xaxis?.lines,
          show: hasDenseXAxis
            ? false
            : (options.grid?.xaxis?.lines?.show ?? true),
        },
      },
      yaxis: {
        lines: { show: true, ...options.grid?.yaxis?.lines },
      },
      padding: {
        top: 0,
        right: 8,
        bottom: 8,
        left: 8,
        ...options.grid?.padding,
      },
    },
    stroke: {
      width: 2,
      curve: "straight",
      ...options.stroke,
      colors: highContrast ? resolvedColors : options.stroke?.colors,
      dashArray: highContrast
        ? (brandPalette ? keys.map(key => brandPalette.categories.indexOf(key) * 2) : [0, 6, 2, 8, 4, 10, 1, 7, 3, 9, 5, 11])
        : (options.stroke?.dashArray ?? 0),
    },
    markers: {
      strokeWidth: 1,
      strokeColors: [theme.surface],
      ...options.markers,
      size: highContrast ? 4 : (options.markers?.size ?? 3),
      hover: { size: 4, ...options.markers?.hover },
    },
    annotations: highContrast
      ? {
          ...options.annotations,
          xaxis: (options.annotations?.xaxis ?? []).map((annotation, index) => ({
            ...annotation,
            fillColor: theme.series[index % theme.series.length],
            opacity: 0.28,
          })),
        }
      : (options.annotations ?? {}),
    xaxis: {
      tooltip: { enabled: false },
      axisBorder: { color: theme.axisBorder },
      ...xAxis,
      tickAmount: xAxisCategories.length ? undefined : xAxis?.tickAmount,
      axisTicks: {
        color: theme.axisBorder,
        ...xAxis?.axisTicks,
        show: hasDenseXAxis ? false : (xAxis?.axisTicks?.show ?? true),
      },
      labels: {
        ...xAxis?.labels,
        show: true,
        formatter: responsiveXAxisFormatter,
        style: {
          fontSize: "11px",
          fontWeight: 500,
          ...xAxis?.labels?.style,
          colors: theme.axis,
        },
      },
    },
    yaxis: yAxis,
    tooltip: {
      shared: true,
      intersect: false,
      followCursor: true,
      ...options.tooltip,
    },
    legend: {
      ...options.legend,
      labels: {
        ...options.legend?.labels,
        colors: theme.axis,
      },
    },
    noData: {
      text: "Nenhum dado disponível no período selecionado",
      ...options.noData,
      style: {
        fontSize: "15px",
        ...options.noData?.style,
        color: theme.axis,
      },
    },
  };

  return (
    <div ref={containerRef} role="img" aria-label={ariaLabel} className={`versi-chart ${className ?? ""}`.trim()}>
      {loading ? (
        <div role="status" aria-busy="true" aria-live="polite" className="flex min-h-32 items-center justify-center text-sm text-content-secondary">
          {loadingMessage}
        </div>
      ) : error ? (
        <div role="alert" className="flex min-h-32 items-center justify-center text-sm text-field-assistive-error">
          {error}
        </div>
      ) : !hasSeriesData ? (
        <div role="status" className="flex min-h-32 items-center justify-center text-sm text-content-secondary">
          {emptyMessage}
        </div>
      ) : (
        <Chart
          key={renderKey}
          {...chartProps}
          className={chartClassName}
          width={renderedWidth}
          height={renderedHeight}
          options={sharedOptions}
        />
      )}
    </div>
  );
}
