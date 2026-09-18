"use client";

export type TimeRangeSelectorProps<T extends string | number> = {
  options: readonly T[];
  selected: T;
  onSelect: (range: T) => void;
  ariaLabel?: string;
  className?: string;
};

export default function TimeRangeSelector<T extends string | number>({
  options,
  selected,
  onSelect,
  ariaLabel = "Período do gráfico",
  className,
}: TimeRangeSelectorProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`flex min-w-0 flex-wrap justify-start gap-1.5 ${className ?? ""}`.trim()}
    >
      {options.map((range) => {
        const isSelected = selected === range;

        return (
          <button
            key={range}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(range)}
            className={`shrink-0 whitespace-nowrap rounded-sm border px-2.5 py-1 text-sm font-semibold transition-colors ${
              isSelected
                ? "border-selection-border bg-selection-background text-selection-content"
                : "border-primary-1 text-primary-1 hover:bg-primary-5"
            }`}
          >
            {range}
          </button>
        );
      })}
    </div>
  );
}
