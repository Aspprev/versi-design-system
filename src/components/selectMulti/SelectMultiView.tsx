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
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const labelId = `${baseId}-label`;
  const groupId = `${baseId}-options`;
  const summaryId = `${baseId}-summary`;
  const errorId = `${baseId}-error`;
  const selectedCount = checkedList.length;
  const selectedSummary =
    selectedCount === 0
      ? "Nenhuma opção selecionada"
      : selectedCount === 1
        ? "1 opção selecionada"
        : `${selectedCount} opções selecionadas`;
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
            "flex h-control-md w-full cursor-pointer items-center justify-between rounded-sm border border-field-border-default bg-field-surface px-3 text-field-icon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
            error && "border-field-border-error text-field-assistive-error",
            !error &&
              isOpened &&
              "border-field-border-active text-field-content",
            !error && selectedCount > 0 && "text-field-content",
            disabled &&
              "cursor-not-allowed border-field-border-default bg-field-surface-disabled text-field-content-disabled",
          )}
        >
          <span
            className={cs(
              "min-w-0 flex-1 truncate text-left text-base font-normal text-field-placeholder",
              {
                "pr-12 text-field-content": !disabled && selectedCount > 0,
                "text-field-content-disabled": disabled,
              },
            )}
          >
            Selecione
          </span>
          <MdKeyboardArrowDown
            aria-hidden="true"
            className={cs(
              "shrink-0 text-base text-field-icon transition-transform",
              {
                "rotate-180": isOpened,
                "text-field-assistive-error": error,
                "text-field-content": !error && (isOpened || selectedCount > 0),
                "text-field-content-disabled": disabled,
              },
            )}
          />
        </button>

        <span id={summaryId} className="sr-only">
          {selectedSummary}
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
                    isChecked && "bg-primary-5 text-primary-1",
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
            onClick={onClear}
            className="absolute right-9 top-1/2 flex min-h-6 min-w-6 -translate-y-1/2 touch-manipulation items-center justify-center gap-1 rounded-full bg-action-primary px-2 text-xs text-action-primary-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed"
          >
            <span aria-hidden="true">{selectedCount}</span>
            <MdClose aria-hidden="true" size={10} />
          </button>
        )}
      </div>
    </FieldFrame>
  );
}

export default SelectMultiView;

/** @deprecated Use SelectMultiViewProps. */
export type MultiSelectViewProps = SelectMultiViewProps;
