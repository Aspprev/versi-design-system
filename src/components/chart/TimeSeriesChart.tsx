"use client";

import { useHighContrastPreference } from "../../hooks/useHighContrastPreference";
import { getChartTheme } from "../../utils/chart-theme";
import { useEffect, useRef, useState } from "react";
import Chart, { type Props as ApexChartProps } from "./LazyApexChart";

export type TimeSeriesChartOptions = NonNullable<ApexChartProps["options"]>;

export type TimeSeriesChartProps = Omit<ApexChartProps, "options"> & {
  options: TimeSeriesChartOptions;
  ariaLabel: string;
  className?: string;
  chartClassName?: string;
  responsiveHeight?: boolean;
  highContrastOverride?: boolean;
};

export default function TimeSeriesChart({
  options,
  ariaLabel,
  className,
  chartClassName,
  responsiveHeight = false,
  highContrastOverride,
  ...chartProps
}: TimeSeriesChartProps) {
  const storedHighContrast = useHighContrastPreference();
  const highContrast = highContrastOverride ?? storedHighContrast;
  const theme = getChartTheme();
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
    colors: highContrast ? [...theme.series] : options.colors,
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
      colors: highContrast ? [...theme.series] : options.stroke?.colors,
      dashArray: highContrast
        ? [0, 6, 2, 8, 4, 10, 1, 7, 3, 9, 5, 11]
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
          xaxis: options.annotations?.xaxis?.map((annotation, index) => ({
            ...annotation,
            fillColor: theme.series[index % theme.series.length],
            opacity: 0.28,
          })),
        }
      : options.annotations,
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
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      <Chart
        key={renderKey}
        {...chartProps}
        className={chartClassName}
        width={renderedWidth}
        height={renderedHeight}
        options={sharedOptions}
      />
    </div>
  );
}
