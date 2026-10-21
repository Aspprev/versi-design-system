"use client";

import cs from "classnames";
import {
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { MdClose, MdKeyboardArrowDown } from "react-icons/md";
import FieldFrame from "../field/FieldFrame";
import { getFloatingLayerClass } from "../../utils/floating-layer";

export interface SelectMultiViewProps extends InputHTMLAttributes<HTMLInputElement> {
  options: {
    label: string;
    value: string;
  }[];
  label?: string;
  error?: string;
  checkedList?: string[];
  onClear?: () => void;
  disabled?: boolean;
}

export function SelectMultiView(props: SelectMultiViewProps) {
  const {
    options,
    error,
    label,
    checkedList = [],
    onClear,
    disabled,
    className,
  } = props;
  const [isOpened, setIsOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const measurementRef = useRef<HTMLSpanElement>(null);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const labelId = `${baseId}-label`;
  const groupId = `${baseId}-options`;
  const summaryId = `${baseId}-summary`;
  const errorId = `${baseId}-error`;
  const selectedCount = checkedList.length;
  const selectedLabels = checkedList.map((value) =>
    options.find((option) => option.value === value)?.label ?? value,
  );
  const selectionKey = JSON.stringify(selectedLabels);
  const displayedCount = Math.min(selectedCount, visibleCount ?? selectedCount);
  const hiddenCount = selectedCount - displayedCount;
  const chipClass = cs(
    "rounded-full px-1 py-0.5 text-sm",
    disabled ? "bg-surface-muted text-field-content-disabled" : "bg-action-primary text-action-primary-content",
  );
  const selectedSummary =
    selectedCount === 0
      ? "Nenhuma opção selecionada"
      : selectedCount === 1
        ? "1 opção selecionada"
        : `${selectedCount} opções selecionadas`;
  const accessibleSummary = selectedCount > 0
    ? `${selectedSummary}: ${selectedLabels.join(", ")}`
    : selectedSummary;
  const describedBy = [summaryId, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");
  const floatingLayerClass = getFloatingLayerClass(
    triggerRef.current,
    "popover",
  );
  const menuLayerClass =
    floatingLayerClass === "z-popover" ? "z-menu" : floatingLayerClass;

  const closeAndFocusTrigger = () => {
    setIsOpened(false);
    triggerRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const valueElement = valueRef.current;
    const measurements = measurementRef.current;
    if (!valueElement || !measurements || selectedCount === 0) return;

    let active = true;
    const update = () => {
      if (!active) return;
      const available = valueElement.getBoundingClientRect().width;
      const labels = Array.from(measurements.querySelectorAll<HTMLElement>("[data-label-width]"));
      const partialLabels = Array.from(measurements.querySelectorAll<HTMLElement>("[data-partial-width]"));
      const counters = Array.from(measurements.querySelectorAll<HTMLElement>("[data-counter-width]"));
      const gap = Number.parseFloat(window.getComputedStyle(valueElement).columnGap) || 0;
      const totalWidth = labels.reduce((sum, element) => sum + element.getBoundingClientRect().width, 0) + Math.max(0, selectedCount - 1) * gap;
      if (totalWidth <= available) {
        setVisibleCount(selectedCount);
        return;
      }
      let used = 0;
      let fitting = 0;
      for (let index = 0; index < labels.length; index += 1) {
        const fullWidth = labels[index].getBoundingClientRect().width;
        used += fullWidth + (index > 0 ? gap : 0);
        const remaining = selectedCount - index - 1;
        const counterWidth = remaining > 0 ? counters[remaining - 1].getBoundingClientRect().width + gap : 0;
        if (used + counterWidth <= available) fitting = index + 1;
        else {
          const partialWidth = Math.min(fullWidth, partialLabels[index].getBoundingClientRect().width);
          if (used - fullWidth + partialWidth + counterWidth <= available) fitting = index + 1;
          break;
        }
      }
      // Keep at least the first label; it can truncate when the field is narrow.
      setVisibleCount(Math.max(1, fitting));
    };
    update();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : undefined;
    observer?.observe(valueElement);
    observer?.observe(measurements);
    window.addEventListener("resize", update);
    document.fonts?.addEventListener("loadingdone", update);
    void document.fonts?.ready.then(update);
    return () => {
      active = false;
      observer?.disconnect();
      window.removeEventListener("resize", update);
      document.fonts?.removeEventListener("loadingdone", update);
    };
  }, [selectionKey, selectedCount, onClear]);

  useEffect(() => {
    if (!isOpened) return;

    groupRef.current
      ?.querySelector<HTMLInputElement>('input[type="checkbox"]')
      ?.focus({ preventScroll: true });
  }, [isOpened]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpened(false);
      }
    }

    if (isOpened) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpened]);

  useEffect(() => {
    if (disabled) setIsOpened(false);
  }, [disabled]);

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const checkboxes = Array.from(
      groupRef.current?.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:not([disabled])',
      ) ?? [],
    );
    const currentIndex = checkboxes.indexOf(event.currentTarget);

    if (event.key === "Escape") {
      event.preventDefault();
      closeAndFocusTrigger();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.click();
      return;
    }

    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    event.preventDefault();

    if (event.key === "Home") {
      checkboxes[0]?.focus({ preventScroll: true });
      return;
    }

    if (event.key === "End") {
      checkboxes[checkboxes.length - 1]?.focus({ preventScroll: true });
      return;
    }

    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex =
      (currentIndex + direction + checkboxes.length) % checkboxes.length;
    checkboxes[nextIndex]?.focus({ preventScroll: true });
  };

  return (
    <FieldFrame
      ref={containerRef}
      className={cs("multi-select-container", className)}
      label={label}
      labelFor={triggerId}
      labelId={label ? labelId : undefined}
      invalid={Boolean(error)}
      message={error}
      messageId={errorId}
    >
      <div
        aria-invalid={Boolean(error) || undefined}
        className="relative mb-[4px] mt-4xs w-full min-w-0"
      >
        <button
          type="button"
          id={triggerId}
          data-has-value={selectedCount > 0}
          ref={triggerRef}
          aria-controls={groupId}
          aria-expanded={isOpened}
          aria-invalid={Boolean(error) || undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : "Selecionar opções"}
          aria-describedby={describedBy}
          disabled={disabled}
          onClick={() => setIsOpened((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setIsOpened(true);
            }

            if (event.key === "Escape") {
              event.preventDefault();
              setIsOpened(false);
            }
          }}
          className={cs(
            "flex h-control-md w-full cursor-pointer items-center justify-between gap-1 rounded-sm border border-field-border-default bg-field-surface px-3 text-field-icon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
            error && "border-2 px-[calc(var(--spacing-xs)-1px)] border-field-border-error text-field-assistive-error",
            !error &&
              isOpened &&
              "border-field-border-active text-field-content",
            !error && selectedCount > 0 && "text-field-content",
            disabled &&
              "cursor-not-allowed border-field-border-default bg-field-surface-disabled text-field-content-disabled",
          )}
        >
          <span
            ref={valueRef}
            title={selectedCount > 0 ? selectedLabels.join(", ") : undefined}
            className={cs(
              "field-value relative flex min-w-0 flex-1 items-center gap-1 overflow-hidden text-left text-base font-normal",
              {
                "mr-[40px]": selectedCount > 0 && Boolean(onClear),
                "text-field-placeholder": !disabled && selectedCount === 0,
                "text-field-content": !disabled && selectedCount > 0,
                "text-field-content-disabled": disabled && selectedCount > 0,
                "text-field-placeholder-disabled": disabled && selectedCount === 0,
              },
            )}
          >
            {selectedCount === 0 ? (
              <span className="min-w-0 truncate" aria-hidden="true">Selecione</span>
            ) : selectedLabels.slice(0, displayedCount).map((text, index) => (
              <span key={index} className={cs("min-w-0 truncate", index < displayedCount - 1 && "shrink-0", chipClass)} aria-hidden="true">{text}</span>
            ))}
            {hiddenCount > 0 && (
              <span aria-hidden="true" className={cs("shrink-0", chipClass)}>+{hiddenCount}</span>
            )}
            {selectedCount > 0 && (
              <span ref={measurementRef} aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 flex w-max whitespace-pre" style={{ font: "inherit" }}>
                {selectedLabels.map((text, index) => <span key={index} data-label-width className={chipClass}>{text}</span>)}
                {selectedLabels.map((text, index) => <span key={index} data-partial-width className={chipClass}>{Array.from(text).slice(0, 6).join("")}…</span>)}
                {selectedLabels.map((_, index) => <span key={index} data-counter-width className={chipClass}>+{index + 1}</span>)}
              </span>
            )}
          </span>
          <MdKeyboardArrowDown
            aria-hidden="true"
            className={cs(
              "shrink-0 text-base transition-transform",
              {
                "text-field-icon": !error && !isOpened && selectedCount === 0 && !disabled,
                "rotate-180": isOpened,
                "text-field-assistive-error": error,
                "text-field-content": !error && (isOpened || selectedCount > 0),
                "text-field-content-disabled": disabled && selectedCount > 0,
                "text-field-placeholder-disabled": disabled && !(selectedCount > 0),
              },
            )}
          />
        </button>

        <span id={summaryId} className="sr-only">
          {accessibleSummary}
        </span>

        {isOpened && (
          <div
            id={groupId}
            ref={groupRef}
            role="group"
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : "Opções disponíveis"}
            aria-describedby={summaryId}
            className={cs(
              "absolute top-[100%] w-full rounded-sm bg-surface-card p-3",
              menuLayerClass,
              "flex flex-col items-stretch gap-2 shadow-md",
            )}
          >
            {options.map((option, index) => {
              const isChecked = checkedList.includes(option.value);

              return (
                <label
                  key={option.value}
                  className={cs(
                    "flex h-10 cursor-pointer items-center gap-2 rounded p-2",
                    isChecked && "bg-selection-background text-selection-content",
                    disabled && "cursor-not-allowed",
                  )}
                >
                  <input
                    id={`${baseId}-option-${index}`}
                    type="checkbox"
                    className="peer sr-only"
                    value={option.value}
                    checked={isChecked}
                    name={props.name}
                    onChange={props.onChange}
                    onKeyDown={handleOptionKeyDown}
                    aria-invalid={Boolean(error) || undefined}
                    aria-describedby={error ? errorId : undefined}
                    disabled={disabled}
                  />
                  <span aria-hidden="true" className="checkbox-control-proxy" />
                  {option.label}
                </label>
              );
            })}
          </div>
        )}

        {selectedCount > 0 && onClear && (
          <button
            type="button"
            aria-label={`Limpar seleção de ${label ?? "opções"}`}
            disabled={disabled}
            onClick={() => {
              onClear();
              triggerRef.current?.focus({ preventScroll: true });
            }}
            className="absolute right-[40px] top-1/2 flex h-6 w-6 -translate-y-1/2 touch-manipulation items-center justify-center rounded-sm text-field-icon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:text-field-content-disabled"
          >
            <MdClose aria-hidden="true" size={16} />
          </button>
        )}
      </div>
    </FieldFrame>
  );
}

export default SelectMultiView;

/** @deprecated Use SelectMultiViewProps. */
export type MultiSelectViewProps = SelectMultiViewProps;
