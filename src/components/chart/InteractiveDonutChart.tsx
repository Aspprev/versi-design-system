"use client";

import { useHighContrastPreference } from "../../hooks/useHighContrastPreference";
import { getChartTheme } from "../../utils/chart-theme";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Chart, { type Props as DonutChartProps } from "./LazyApexChart";
import {
  escapeDonutTooltipText,
  resolveInteractiveDonutColors,
  resolveRelativeDonutSelection,
} from "./interactive-donut-utils";

export type InteractiveDonutOptions = NonNullable<DonutChartProps["options"]>;

export type InteractiveDonutProps = Omit<
  DonutChartProps,
  "options" | "series" | "type"
> & {
  options?: InteractiveDonutOptions;
  series: number[];
  colors?: string[];
  mutedColors?: string[];
  valueFormatter?: (value: number) => string;
  ariaLabel?: string;
  className?: string;
  chartClassName?: string;
  responsiveHeight?: boolean;
  highContrastOverride?: boolean;
};

export default function InteractiveDonutChart({
  options = {},
  series,
  colors,
  mutedColors,
  valueFormatter = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value),
  ariaLabel = "Gráfico de distribuição",
  className,
  chartClassName,
  responsiveHeight = false,
  highContrastOverride,
  ...rest
}: InteractiveDonutProps) {
  const storedHighContrast = useHighContrastPreference();
  const highContrast = highContrastOverride ?? storedHighContrast;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [legendSelectedIndex, setLegendSelectedIndex] = useState<number | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const instructionsId = useId();
  const chartTheme = getChartTheme();
  const baseColors =
    !highContrast && colors?.length ? colors : chartTheme.donutSeries;
  const neutralColors = !highContrast && mutedColors?.length
    ? mutedColors
    : chartTheme.mutedSeries;
  const labels = useMemo(() => options.labels ?? [], [options.labels]);

  useEffect(() => {
    setSelectedIndex((current) =>
      current !== null && current >= series.length ? null : current,
    );
    setLegendSelectedIndex((current) =>
      current !== null && current >= series.length ? null : current,
    );
  }, [series.length]);

  useEffect(() => {
    const resetOnOutsideClick = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;

      setSelectedIndex(null);
      setLegendSelectedIndex(null);
    };

    document.addEventListener("pointerdown", resetOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", resetOnOutsideClick);
  }, []);

  const [pieCircle, setPieCircle] = useState<{
    cx: number;
    cy: number;
    diameter: number;
  } | null>(null);
  const [measuredChartHeight, setMeasuredChartHeight] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();

      if (responsiveHeight) {
        const fallbackHeight =
          typeof rest.height === "number" ? rest.height : 0;
        const nextHeight = Math.max(
          fallbackHeight,
          Math.floor(containerRect.height),
        );

        if (nextHeight > 0) {
          setMeasuredChartHeight((current) =>
            current === nextHeight ? current : nextHeight,
          );
        }
      }

      const areas = container.querySelectorAll<SVGPathElement>(
        ".apexcharts-pie-area",
      );
      if (!areas.length) return;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      areas.forEach((area) => {
        const rect = area.getBoundingClientRect();
        minX = Math.min(minX, rect.left);
        minY = Math.min(minY, rect.top);
        maxX = Math.max(maxX, rect.right);
        maxY = Math.max(maxY, rect.bottom);
      });

      setPieCircle({
        cx: (minX + maxX) / 2 - containerRect.left,
        cy: (minY + maxY) / 2 - containerRect.top,
        diameter: Math.min(maxX - minX, maxY - minY),
      });
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    const mutationObserver = new MutationObserver(measure);
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["d"],
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [responsiveHeight, rest.height, series.length]);

  const donutSizeRatio = useMemo(() => {
    const size = options.plotOptions?.pie?.donut?.size ?? "65%";
    const parsed = parseFloat(String(size));
    return Number.isFinite(parsed) ? parsed / 100 : 0.65;
  }, [options.plotOptions?.pie?.donut?.size]);

  const displayColors = resolveInteractiveDonutColors({
    count: series.length,
    colors: baseColors,
    mutedColors: neutralColors,
    selectedIndex,
  });

  const legendValue =
    legendSelectedIndex !== null
      ? {
          label:
            labels[legendSelectedIndex] ??
            `Categoria ${legendSelectedIndex + 1}`,
          value: Number(series[legendSelectedIndex] ?? 0),
        }
      : null;

  const interactiveOptions = useMemo<InteractiveDonutOptions>(() => {
    const originalSelection = options.chart?.events?.dataPointSelection;
    const originalLegendClick = options.chart?.events?.legendClick;

    return {
      ...options,
      colors: displayColors,
      fill: highContrast
        ? {
            type: "pattern",
            pattern: {
              style: [
                "verticalLines",
                "horizontalLines",
                "slantedLines",
                "squares",
                "circles",
              ],
              width: 6,
              height: 6,
              strokeWidth: 2,
            },
          }
        : {
            ...options.fill,
            type: options.fill?.type ?? "solid",
            opacity: options.fill?.opacity ?? 1,
          },
      stroke: highContrast
        ? { ...options.stroke, colors: ["#ffffff"], width: 2 }
        : options.stroke,
      chart: {
        ...options.chart,
        events: {
          ...options.chart?.events,
          dataPointSelection(event, chart, config) {
            originalSelection?.(event, chart, config);
            const nextIndex = Number(config?.dataPointIndex);

            if (!Number.isInteger(nextIndex) || nextIndex < 0) return;

            setSelectedIndex((current) =>
              current === nextIndex ? null : nextIndex,
            );
          },
          legendClick(chartContext, seriesIndex, config) {
            originalLegendClick?.(chartContext, seriesIndex, config);

            if (typeof seriesIndex !== "number" || seriesIndex < 0) return;

            setLegendSelectedIndex((current) =>
              current === seriesIndex ? null : seriesIndex,
            );
          },
        },
      },
      legend: {
        ...options.legend,
        labels: {
          ...options.legend?.labels,
          colors: chartTheme.axis,
        },
        onItemClick: {
          ...options.legend?.onItemClick,
          toggleDataSeries: false,
        },
      },
      states: {
        ...options.states,
        hover: {
          ...options.states?.hover,
          filter: { type: "none" },
        },
        active: {
          ...options.states?.active,
          allowMultipleDataPointsSelection: false,
          filter: { type: "none" },
        },
      },
      tooltip: {
        ...options.tooltip,
        enabled: true,
        followCursor: true,
        custom({ series: tooltipSeries, seriesIndex }) {
          const value = Number(tooltipSeries?.[seriesIndex] ?? 0);
          const label = escapeDonutTooltipText(
            labels[seriesIndex] ?? `Categoria ${seriesIndex + 1}`,
          );
          const formattedValue = escapeDonutTooltipText(valueFormatter(value));

          return `<div class="donut-chart-tooltip"><span class="donut-chart-tooltip-label">${label}</span><strong class="donut-chart-tooltip-value">${formattedValue}</strong></div>`;
        },
      },
    };
  }, [
    chartTheme.axis,
    displayColors,
    highContrast,
    labels,
    options,
    valueFormatter,
  ]);

  const selectedLabel =
    selectedIndex === null
      ? "Nenhuma categoria selecionada"
      : `${labels[selectedIndex] ?? `Categoria ${selectedIndex + 1}`}: ${valueFormatter(
          Number(series[selectedIndex] ?? 0),
        )}`;

  const legendValueLabel =
    legendSelectedIndex === null
      ? ""
      : `Valor em destaque: ${
          labels[legendSelectedIndex] ?? `Categoria ${legendSelectedIndex + 1}`
        }: ${valueFormatter(Number(series[legendSelectedIndex] ?? 0))}`;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)
    ) {
      event.preventDefault();
      const direction =
        event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      setSelectedIndex((current) =>
        resolveRelativeDonutSelection({
          currentIndex: current,
          direction,
          count: series.length,
        }),
      );
    }

    if (event.key === "Escape") {
      setSelectedIndex(null);
      setLegendSelectedIndex(null);
    }
  };

  return (
    <div
      ref={containerRef}
      role="group"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-describedby={instructionsId}
      onKeyDown={handleKeyDown}
      className={`chart-keyboard-focus-ring relative min-w-0 rounded-sm ${className ?? ""}`.trim()}
    >
      <Chart
        key={highContrast ? "donut-high-contrast" : "donut-standard"}
        {...rest}
        className={chartClassName}
        height={
          responsiveHeight && measuredChartHeight
            ? measuredChartHeight
            : rest.height
        }
        options={interactiveOptions}
        series={series}
        type="donut"
      />
      {legendValue && pieCircle && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute flex flex-col items-center justify-center text-center"
          style={{
            left: pieCircle.cx,
            top: pieCircle.cy,
            width: pieCircle.diameter * donutSizeRatio * 0.94,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="w-full truncate text-xs leading-tight text-content-secondary">
            {legendValue.label}
          </span>
          <span className="w-full break-words text-md font-bold leading-tight text-content-primary">
            {valueFormatter(legendValue.value)}
          </span>
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        {selectedLabel}
      </span>
      <span className="sr-only" aria-live="polite">
        {legendValueLabel}
      </span>
      <span id={instructionsId} className="sr-only">
        Use as setas para navegar pelas categorias e Escape para limpar a
        seleção.
      </span>
    </div>
  );
}
