"use client";

import cs from "classnames";
import { Portal } from "@headlessui/react";
import { calculateFloatingPanelRect } from "../../utils/floating-panel-position";
import type { SelectMultiOption, SelectMultiItem } from "./SelectMulti";
import {
  InputHTMLAttributes,
  KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { MdClose, MdKeyboardArrowDown } from "react-icons/md";
import FieldFrame from "../field/FieldFrame";
import { getFloatingLayerClass } from "../../utils/floating-layer";

export interface SelectMultiViewProps extends InputHTMLAttributes<HTMLInputElement> {
  options: SelectMultiItem[];
  minSelected?: number;
  maxSelected?: number;
  label?: string;
  error?: string;
  checkedList?: string[];
  onClear?: () => void;
  disabled?: boolean;
}

export function SelectMultiView(props: SelectMultiViewProps) {
  const {
    options,
    minSelected,
    maxSelected,
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
  const flatOptions = options.flatMap(item => "options" in item ? item.options : [item]);
  const minimum = Number.isFinite(minSelected) ? Math.max(0, Math.floor(minSelected!)) : 0;
  const maximum = Number.isFinite(maxSelected) ? Math.max(minimum, Math.floor(maxSelected!)) : Infinity;
  const selectedCount = checkedList.length;
  const limitsId = `${baseId}-limits`;
  const limitsText = minimum > 0 && maximum < Infinity
    ? `Selecione de ${minimum} a ${maximum} opções.`
    : minimum > 0 ? `Selecione pelo menos ${minimum} opções.`
      : maximum < Infinity ? `Selecione até ${maximum} opções.` : "";
  const optionUnavailable = (checked: boolean) => Boolean(disabled) ||
    (checked ? selectedCount <= minimum : selectedCount >= maximum);
  const selectedLabels = checkedList.map((value) =>
    flatOptions.find((option) => option.value === value)?.label ?? value,
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
  const describedBy = [summaryId, limitsText ? limitsId : undefined, error ? errorId : undefined]
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
      ?.querySelector<HTMLInputElement>('input[type="checkbox"]:not([disabled])')
      ?.focus({ preventScroll: true });
  }, [isOpened]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node) && !groupRef.current?.contains(event.target as Node)) {
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

  const updatePanelPosition = useCallback(() => {
      const trigger = triggerRef.current;
      const panel = groupRef.current;
      if (!trigger || !panel) return;
      const rect = calculateFloatingPanelRect({
        trigger: trigger.getBoundingClientRect(),
        panel: { width: trigger.getBoundingClientRect().width, height: Math.min(panel.scrollHeight, 240) },
        viewport: { width: window.innerWidth, height: window.innerHeight },
      });
      Object.assign(panel.style, { top: `${rect.top}px`, left: `${rect.left}px`, width: `${rect.width}px`, maxHeight: `${rect.maxHeight}px` });
  }, []);
  const setPanelRef = useCallback((panel: HTMLDivElement | null) => {
    groupRef.current = panel;
    if (!panel) return;
    updatePanelPosition();
    panel.querySelector<HTMLInputElement>('input:not([disabled])')?.focus({ preventScroll: true });
  }, [updatePanelPosition]);

  useEffect(() => {
    if (!isOpened) return;
    let frame: number | undefined;

    const schedule = () => {
      if (frame !== undefined) return;
      frame = window.requestAnimationFrame(() => { frame = undefined; updatePanelPosition(); });
    };
    // Portal mounts after this component's effects. Observe it when its ref attaches.
    const observer = new ResizeObserver(schedule);
    if (triggerRef.current) observer.observe(triggerRef.current);
    updatePanelPosition();
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);
    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [isOpened, options, updatePanelPosition]);

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

    if (event.key === "Tab") {
      event.preventDefault();
      const scope = triggerRef.current?.closest('[role="dialog"]') ?? document;
      const focusable = Array.from(scope.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        .filter(el => !groupRef.current?.contains(el) && el.getClientRects().length > 0);
      const current = focusable.indexOf(triggerRef.current!);
      const next = (current + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
      setIsOpened(false);
      focusable[next]?.focus({ preventScroll: true });
      return;
    }
    if (event.key === "Escape") {
      event.stopPropagation();
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

  const renderOption = (option: SelectMultiOption) => {
    const isChecked = checkedList.includes(option.value);
    const unavailable = optionUnavailable(isChecked);
    return (
      <label
        key={option.value}
        className={cs(
          "flex min-h-10 items-center gap-2 rounded px-4 py-2",
          isChecked && "bg-selection-background text-selection-content",
          unavailable ? "cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <input
          type="checkbox"
          className="peer sr-only"
          value={option.value}
          checked={isChecked}
          name={props.name}
          onChange={(event) => {
            if (!optionUnavailable(isChecked)) props.onChange?.(event);
          }}
          onKeyDown={handleOptionKeyDown}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={[limitsText ? limitsId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined}
          disabled={disabled}
          aria-disabled={unavailable || undefined}
        />
        <span aria-hidden="true" className="checkbox-control-proxy" />
        {option.label}
      </label>
    );
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
          <Portal>
          <div
            id={groupId}
            ref={setPanelRef}
            role="group"
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : "Opções disponíveis"}
            aria-describedby={describedBy}
            className={cs(
              "fixed max-h-60 overflow-y-auto overscroll-contain rounded-sm border border-field-border-default bg-surface-card text-content-primary",
              menuLayerClass,
              "flex flex-col items-stretch gap-2 shadow-md",
            )}
          >
            {options.map((item, index) => "options" in item ? (
              item.options.length > 0 && <div key={`group-${index}`} role="group" aria-labelledby={`${groupId}-${index}`}>
                <div id={`${groupId}-${index}`} className="px-2 pb-1 pt-3 text-xs font-semibold text-content-secondary">{item.title}</div>
                {item.options.map(renderOption)}
              </div>
            ) : renderOption(item))}
          </div>
          </Portal>
        )}

        {selectedCount > 0 && onClear && (
          <button
            type="button"
            aria-label={`Limpar seleção de ${label ?? "opções"}`}
            disabled={disabled || minimum > 0}
            onClick={() => {
              if (minimum > 0) return;
              onClear();
              triggerRef.current?.focus({ preventScroll: true });
            }}
            className="absolute right-[40px] top-1/2 flex h-6 w-6 -translate-y-1/2 touch-manipulation items-center justify-center rounded-sm text-field-icon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:text-field-content-disabled"
          >
            <MdClose aria-hidden="true" size={16} />
          </button>
        )}
      </div>
      {limitsText && <span id={limitsId} className="block text-xs text-content-secondary">{limitsText}</span>}
    </FieldFrame>
  );
}

export default SelectMultiView;

/** @deprecated Use SelectMultiViewProps. */
export type MultiSelectViewProps = SelectMultiViewProps;
