"use client";
import classNames from "classnames";
import { useField } from "formik";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { IconBaseProps } from "react-icons";
import { createPortal } from "react-dom";
import { calculateFloatingPanelRect } from "../../utils/floating-panel-position";
import { getFloatingLayerClass } from "../../utils/floating-layer";
import {
  MdInfoOutline,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdSearch,
} from "react-icons/md";
import Tooltip from "../tooltip/Tooltip";
import FieldFrame from "../field/FieldFrame";
import {
  FIELD_CONTROL_CLASS,
  FIELD_DISABLED_CLASS,
  FIELD_ERROR_CLASS,
} from "../field/field-styles";

export type InputSelectOption = {
  label: string;
  value: string;
};

export type InputSelectProps = {
  name: string;
  label?: string;
  helperText?: string | React.ReactNode;
  placeholder?: string;
  defaultValue?: InputSelectOption;
  options: InputSelectOption[];
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  error?: boolean;
  leadIcon?: React.ComponentType<IconBaseProps>;
  endIcon?: React.ComponentType<IconBaseProps>;
  searchable?: boolean;
  searchPlaceholder?: string;
  noOptionsText?: string;
  renderOption?: (option: InputSelectOption) => React.ReactNode;
  renderValue?: (
    option: InputSelectOption | null,
    placeholder?: string,
  ) => React.ReactNode;
  searchAccessor?: (option: InputSelectOption) => string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">;

const InputSelect: React.FC<InputSelectProps> = ({
  name,
  label,
  helperText,
  placeholder,
  defaultValue,
  options,
  prefix,
  suffix,
  disabled,
  error,
  leadIcon: LeadIcon,
  endIcon: EndIcon,
  searchable,
  searchPlaceholder = "Pesquisar...",
  noOptionsText = "Nenhuma opção encontrada",
  renderOption,
  renderValue,
  searchAccessor,
  className,
  onChange,
  ...rest
}) => {
  const isSearchable = searchable ?? options.length > 10;

  const normalizeSearchText = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const [field, meta, helpers] = useField(name!);
  const inputRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectionAnnouncement, setSelectionAnnouncement] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const rafRef = useRef<number | null>(null);
  const selectId = useId();
  const labelId = `${selectId}-label`;
  const listboxId = `${selectId}-listbox`;
  const resultsId = `${selectId}-results`;
  const valueDescriptionId = `${selectId}-value-description`;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateDropdownPosition = useCallback(() => {
    if (open && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;

      if (!dropdown) return;

      const panelRect = calculateFloatingPanelRect({
        trigger: rect,
        panel: {
          width: rect.width,
          height: Math.min(dropdown.scrollHeight || 240, 240),
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });

      dropdown.style.top = `${panelRect.top}px`;
      dropdown.style.left = `${panelRect.left}px`;
      dropdown.style.width = `${panelRect.width}px`;
      dropdown.style.maxHeight = `${panelRect.maxHeight}px`;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (isSearchable) {
      searchInputRef.current?.focus({ preventScroll: true });
      return;
    }

    const selectedOptionElement =
      dropdownRef.current?.querySelector<HTMLElement>(
        '[role="option"][aria-selected="true"]',
      );
    const firstOptionElement =
      dropdownRef.current?.querySelector<HTMLElement>('[role="option"]');

    (selectedOptionElement ?? firstOptionElement)?.focus({
      preventScroll: true,
    });
  }, [isSearchable, open]);

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  useEffect(() => {
    if (open && dropdownRef.current) {
      updateDropdownPosition();
    }
  }, [open, updateDropdownPosition]);

  useEffect(() => {
    if (!open) return;

    const scheduleDropdownPosition = () => {
      if (rafRef.current != null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updateDropdownPosition();
      });
    };

    window.addEventListener("scroll", scheduleDropdownPosition, true);
    window.addEventListener("resize", scheduleDropdownPosition);

    return () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.removeEventListener("scroll", scheduleDropdownPosition, true);
      window.removeEventListener("resize", scheduleDropdownPosition);
    };
  }, [open, updateDropdownPosition]);

  const selectedOption =
    options.find((o) => o.value === (field.value || defaultValue?.value)) ||
    null;

  const closeDropdown = useCallback((restoreFocus = false) => {
    setOpen(false);

    if (restoreFocus) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const moveFocusFromTrigger = useCallback((backward: boolean) => {
    const trigger = inputRef.current;
    if (!trigger) return;

    const focusableElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(
      (element) =>
        !dropdownRef.current?.contains(element) &&
        element.getAttribute("aria-hidden") !== "true" &&
        element.getClientRects().length > 0,
    );
    const triggerIndex = focusableElements.indexOf(trigger);
    const targetIndex = triggerIndex + (backward ? -1 : 1);

    focusableElements[targetIndex]?.focus({ preventScroll: true });
  }, []);

  const handleSelect = (value: string) => {
    const option = options.find((candidate) => candidate.value === value);

    helpers.setValue(value);
    helpers.setTouched(true);
    setSelectionAnnouncement(
      option ? `Selecionado: ${option.label}` : "Seleção atualizada",
    );

    if (onChange) {
      const syntheticEvent = {
        target: { value, name },
        currentTarget: { value, name },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }

    closeDropdown(true);
  };

  const handleBlur = useCallback(() => {
    helpers.setTouched(true);
  }, [helpers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        (!dropdownRef.current ||
          !dropdownRef.current.contains(event.target as Node))
      ) {
        handleBlur();
        closeDropdown();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDropdown, handleBlur, open]);

  const hasError = meta.touched && meta.error;
  const errorId = `${selectId}-error`;
  const normalizedSearch = normalizeSearchText(searchTerm.trim());
  const filteredOptions = isSearchable
    ? options.filter((option) => {
        const label = normalizeSearchText(String(option.label || ""));
        const value = normalizeSearchText(String(option.value || ""));
        const extraSearch = normalizeSearchText(
          String(searchAccessor?.(option) || ""),
        );
        return (
          label.includes(normalizedSearch) ||
          value.includes(normalizedSearch) ||
          extraSearch.includes(normalizedSearch)
        );
      })
    : options;
  const resultAnnouncement =
    filteredOptions.length === 0
      ? noOptionsText
      : normalizedSearch
        ? filteredOptions.length === 1
          ? "1 resultado encontrado"
          : `${filteredOptions.length} resultados encontrados`
        : filteredOptions.length === 1
          ? "1 opção disponível"
          : `${filteredOptions.length} opções disponíveis`;
  const selectedValueDescription = selectedOption
    ? `Selecionado: ${selectedOption.label}`
    : placeholder
      ? `Nenhuma opção selecionada. ${placeholder}`
      : "Nenhuma opção selecionada";
  const triggerDescribedBy = [
    valueDescriptionId,
    hasError ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const focusOption = (position: "first" | "last") => {
    const optionElements = Array.from(
      dropdownRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="option"]',
      ) ?? [],
    );
    const option =
      position === "first"
        ? optionElements[0]
        : optionElements[optionElements.length - 1];

    option?.focus({ preventScroll: true });
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    const optionElements = Array.from(
      dropdownRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="option"]',
      ) ?? [],
    );
    const currentIndex = optionElements.indexOf(event.currentTarget);

    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown(true);
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      closeDropdown();
      handleBlur();
      moveFocusFromTrigger(event.shiftKey);
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
      optionElements[0]?.focus({ preventScroll: true });
      return;
    }

    if (event.key === "End") {
      optionElements[optionElements.length - 1]?.focus({
        preventScroll: true,
      });
      return;
    }

    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex =
      (currentIndex + direction + optionElements.length) %
      optionElements.length;
    optionElements[nextIndex]?.focus({ preventScroll: true });
  };

  const selectedValueContent = renderValue ? (
    renderValue(selectedOption, placeholder)
  ) : (
    <span
      className={classNames("block w-full truncate overflow-hidden", {
        "text-field-placeholder": !selectedOption && placeholder,
      })}
    >
      {selectedOption ? selectedOption.label : placeholder}
    </span>
  );

  const dropdownContent =
    open && !disabled ? (
      <div
        ref={dropdownRef}
        className={`fixed ${getFloatingLayerClass(inputRef.current, "popover")} overflow-y-auto overflow-x-hidden overscroll-contain rounded-sm border border-field-border-default bg-field-surface text-field-content shadow-lg`}
      >
        {isSearchable && (
          <div className="sticky top-0 flex items-center gap-2 border-b border-field-border-default bg-field-surface p-2">
            <MdSearch aria-hidden="true" className="h-4 w-4 text-field-icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === "Tab") {
                  event.preventDefault();
                  closeDropdown();
                  handleBlur();
                  moveFocusFromTrigger(event.shiftKey);
                  return;
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  closeDropdown(true);
                }

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  focusOption("first");
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  focusOption("last");
                }
              }}
              aria-label={`Pesquisar opções de ${label ?? name}`}
              aria-controls={listboxId}
              aria-describedby={resultsId}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-field-content outline-none placeholder:text-field-placeholder"
            />
          </div>
        )}
        {isSearchable && (
          <span
            id={resultsId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {resultAnnouncement}
          </span>
        )}
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
        >
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-content-muted">
              {noOptionsText}
            </div>
          ) : (
            filteredOptions.map((opc) => (
              <button
                key={opc.value}
                type="button"
                role="option"
                aria-selected={selectedOption?.value === opc.value}
                tabIndex={-1}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleSelect(opc.value)}
                onKeyDown={handleOptionKeyDown}
                className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring"
              >
                {renderOption ? renderOption(opc) : opc.label}
              </button>
            ))
          )}
        </div>
      </div>
    ) : null;

  return (
    <FieldFrame
      className={className}
      label={label}
      labelFor={selectId}
      labelId={label ? labelId : undefined}
      invalid={Boolean(hasError)}
      message={meta.error}
      messageId={errorId}
      labelAdornment={
        helperText ? (
          <>
            <button
              ref={iconRef}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              type="button"
              aria-label={`Mais informações sobre ${label ?? name}`}
              className="rounded-sm pb-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
            >
              <MdInfoOutline
                aria-hidden="true"
                className="mr-0 text-content-muted"
              />
            </button>

            <Tooltip
              targetRef={iconRef}
              content={helperText}
              visible={hovered}
              preferredPosition="bottom"
            />
          </>
        ) : undefined
      }
      {...rest}
    >
      <button
        type="button"
        id={selectId}
        name={name}
        ref={inputRef}
        data-has-value={Boolean(selectedOption)}
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : (placeholder ?? name)}
        aria-invalid={Boolean(hasError) || undefined}
        aria-describedby={triggerDescribedBy}
        disabled={disabled}
        onBlur={() => !open && handleBlur()}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((prev) => !prev);
          }

          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }

          if (event.key === "Escape") {
            closeDropdown();
          }
        }}
        className={classNames(`${FIELD_CONTROL_CLASS} px-2`, {
          [FIELD_DISABLED_CLASS]: disabled,
          [FIELD_ERROR_CLASS]: hasError,
          "cursor-pointer": !disabled,
        })}
      >
        {LeadIcon && (
          <LeadIcon
            aria-hidden="true"
            className={classNames(`h-5 w-5`, {
              "text-field-assistive-error": hasError,
              "text-field-content": !hasError && (open || selectedOption),
              "text-field-content-disabled": disabled,
              "cursor-not-allowed": disabled,
              "cursor-pointer": !disabled,
            })}
          />
        )}
        {prefix && <span>{prefix}</span>}

        <span
          className={classNames(
            "flex-1 min-w-0 flex items-center justify-between leading-5",
            "bg-transparent text-field-content text-left",
            {
              "text-field-content-disabled": disabled,
              "cursor-not-allowed": disabled,
              "cursor-pointer": !disabled,
            },
          )}
        >
          {selectedValueContent}
        </span>

        {EndIcon ? (
          <EndIcon
            aria-hidden="true"
            className={classNames(`h-5 w-5`, {
              "text-field-assistive-error": hasError,
              "text-field-content": !hasError && (open || selectedOption),
              "text-field-content-disabled": disabled,
              "cursor-not-allowed": disabled,
              "cursor-pointer": !disabled,
            })}
          />
        ) : (
          <span
            className={classNames(
              "flex items-center justify-center text-field-icon",
              {
                "text-field-assistive-error": hasError,
                "text-field-content": !hasError && (open || selectedOption),
                "text-field-content-disabled": disabled,
                "cursor-not-allowed": disabled,
                "cursor-pointer": !disabled,
              },
            )}
          >
            {open ? (
              <MdOutlineKeyboardArrowUp
                aria-hidden="true"
                className="h-5 w-5"
              />
            ) : (
              <MdOutlineKeyboardArrowDown
                aria-hidden="true"
                className="h-5 w-5"
              />
            )}
          </span>
        )}
      </button>
      <span id={valueDescriptionId} className="sr-only">
        {selectedValueDescription}
      </span>
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {selectionAnnouncement}
      </span>
      {isMounted && dropdownContent
        ? createPortal(dropdownContent, document.body)
        : null}
    </FieldFrame>
  );
};

export default InputSelect;
