"use client";

import { getFloatingLayerClass } from "../../utils/floating-layer";
import { calculateFloatingPanelRect } from "../../utils/floating-panel-position";
import classNames from "classnames";
import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  isValid,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { FormikContext, FormikContextType, getIn } from "formik";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdCalendarMonth, MdChevronLeft, MdChevronRight } from "react-icons/md";
import FieldFrame from "../field/FieldFrame";
import {
  FIELD_CONTROL_CLASS,
  FIELD_DISABLED_CLASS,
  FIELD_ERROR_CLASS,
  FIELD_INPUT_CLASS,
} from "../field/field-styles";

type ViewMode = "days" | "months" | "years";
export type DatePickerNavigationVariant = "drilldown" | "dropdown";
export type DatePickerSelectionMode = "day" | "month" | "year";

export interface UnifiedDatePickerProps {
  value?: Date | string | null;
  label?: string;
  onChange?: (date: Date | null) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  isDisabled?: boolean;
  disabled?: boolean;
  name?: string;
  error?: boolean;
  errorText?: string;
  helperText?: string | React.ReactNode;
  defaultView?: ViewMode;
  navigationVariant?: DatePickerNavigationVariant;
  selectionMode?: DatePickerSelectionMode;
  showAdjacentDays?: boolean;
  className?: string;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const CALENDAR_WIDTH = 256;
const VIEWPORT_MARGIN = 8;
const CALENDAR_GAP = 4;
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const formatDateForInput = (
  date: Date | null,
  selectionMode: DatePickerSelectionMode = "day",
) => {
  if (!date || !isValid(date)) return "";
  return format(date, selectionMode === "year" ? "yyyy" : "dd/MM/yyyy");
};

const formatInputValue = (
  value: string,
  selectionMode: DatePickerSelectionMode = "day",
) => {
  const digits = value.replace(/\D/g, "").slice(0, selectionMode === "year" ? 4 : 8);
  if (selectionMode === "year") return digits;
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const parseDateValue = (value: unknown): Date | null => {
  if (!value) return null;

  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    if (!trimmedValue) return null;

    const parsedPtBr = parse(trimmedValue, "dd/MM/yyyy", new Date());
    if (
      isValid(parsedPtBr) &&
      format(parsedPtBr, "dd/MM/yyyy") === trimmedValue
    ) {
      return parsedPtBr;
    }

    const nativeDate = new Date(trimmedValue);
    return isValid(nativeDate) ? nativeDate : null;
  }

  return null;
};

const getSafeViewDate = (date: Date | null) =>
  date && isValid(date) ? date : new Date();

const UnifiedDatePicker: React.FC<UnifiedDatePickerProps> = ({
  value,
  onChange,
  onBlur,
  label,
  placeholder = "dd/mm/aaaa",
  minDate = addYears(new Date(), -120),
  maxDate = addYears(new Date(), 120),
  isDisabled = false,
  disabled = false,
  name = "data",
  error,
  errorText,
  defaultView = "days",
  navigationVariant = "drilldown",
  selectionMode = "day",
  showAdjacentDays = true,
  className,
}) => {
  const formik = useContext(
    FormikContext as React.Context<
      FormikContextType<Record<string, unknown>> | undefined
    >,
  );
  const hasFormikField = Boolean(formik && name);

  const formikRawValue = hasFormikField && formik
    ? getIn(formik.values, name)
    : undefined;
  const selectedDate = useMemo(
    () => parseDateValue(hasFormikField ? formikRawValue : value),
    [formikRawValue, hasFormikField, value],
  );

  const formikTouched = hasFormikField && formik
    ? Boolean(getIn(formik.touched, name))
    : false;
  const formikError = hasFormikField && formik ? getIn(formik.errors, name) : undefined;

  const isFieldDisabled = disabled || isDisabled;
  const resolvedPlaceholder = selectionMode === "year" ? "aaaa" : placeholder;
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(
    formatDateForInput(selectedDate, selectionMode),
  );
  const [viewDate, setViewDate] = useState<Date>(getSafeViewDate(selectedDate));
  const [mode, setMode] = useState<ViewMode>(defaultView);
  const [inputError, setInputError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [panelNeedsScroll, setPanelNeedsScroll] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(formatDateForInput(selectedDate, selectionMode));
    }
    setViewDate(getSafeViewDate(selectedDate));
  }, [isEditing, selectedDate, selectionMode]);

  useEffect(() => {
    if (!isOpen) return;

    setMode(
      selectionMode === "year"
        ? "years"
        : selectionMode === "month"
          ? "months"
          : navigationVariant === "dropdown"
            ? "days"
            : defaultView,
    );

    const onMouseDown = (event: MouseEvent) => {
      if (
        !containerRef.current?.contains(event.target as Node) &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [defaultView, isOpen, navigationVariant, selectionMode]);

  useEffect(() => {
    if (!isOpen) return;

    const updateDropdownPosition = () => {
      if (!containerRef.current) return;

      const rect = (
        inputRef.current ?? containerRef.current
      ).getBoundingClientRect();

      const isOutOfViewport =
        rect.bottom <= 0 ||
        rect.top >= window.innerHeight ||
        rect.right <= 0 ||
        rect.left >= window.innerWidth;

      if (isOutOfViewport) {
        setIsOpen(false);
        return;
      }

      const dropdown = dropdownRef.current;
      const panelHeight = dropdown?.scrollHeight || 320;
      const panelRect = calculateFloatingPanelRect({
        trigger: rect,
        panel: {
          width: CALENDAR_WIDTH,
          height: panelHeight,
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        gap: CALENDAR_GAP,
        margin: VIEWPORT_MARGIN,
      });
      const needsScroll = panelHeight > panelRect.maxHeight + 1;

      setPanelNeedsScroll(needsScroll);

      setDropdownStyle({
        position: "fixed",
        top: panelRect.top,
        left: panelRect.left,
        width: panelRect.width,
        maxHeight: needsScroll ? panelRect.maxHeight : undefined,
      });
    };

    const scheduleDropdownPosition = () => {
      if (rafRef.current != null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updateDropdownPosition();
      });
    };

    updateDropdownPosition();
    window.addEventListener("resize", scheduleDropdownPosition);
    window.addEventListener("scroll", scheduleDropdownPosition, true);

    return () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.removeEventListener("resize", scheduleDropdownPosition);
      window.removeEventListener("scroll", scheduleDropdownPosition, true);
    };
  }, [isOpen, defaultView, navigationVariant, viewDate, draftValue]);

  const syncValue = (nextDate: Date | null) => {
    if (hasFormikField && formik) {
      formik.setFieldValue(name, nextDate);
    }

    onChange?.(nextDate);
  };

  const touchField = () => {
    if (hasFormikField && formik) {
      formik.setFieldTouched(name, true);
    }
  };

  const openCalendar = () => {
    if (isFieldDisabled) return;
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const getDaysInView = () => {
    const start = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const handleDayClick = (day: Date) => {
    if (selectionMode !== "day") return;
    if (isBefore(day, startOfDay(minDate)) || isAfter(day, startOfDay(maxDate)))
      return;

    syncValue(day);
    setDraftValue(formatDateForInput(day));
    setInputError(null);
    setViewDate(day);
    touchField();
    setIsOpen(false);
  };

  const handleMonthClick = (monthIndex: number) => {
    const candidate = new Date(viewDate.getFullYear(), monthIndex, 1);
    const monthDisabled =
      isBefore(endOfMonth(candidate), startOfDay(minDate)) ||
      isAfter(startOfMonth(candidate), startOfDay(maxDate));
    if (monthDisabled) return;

    if (selectionMode === "month") {
      const nextDate = isBefore(candidate, minDate)
        ? minDate
        : isAfter(candidate, maxDate)
          ? maxDate
          : candidate;
      syncValue(nextDate);
      setDraftValue(formatDateForInput(nextDate, selectionMode));
      setInputError(null);
      touchField();
      setIsOpen(false);
      return;
    }

    setViewDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setMonth(monthIndex);
      return nextDate;
    });
    setMode("days");
  };

  const handleMonthChange = (monthIndex: number) => {
    setViewDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setDate(1);
      nextDate.setMonth(monthIndex);
      return nextDate;
    });
  };

  const handleYearClick = (year: number) => {
    if (year < minDate.getFullYear() || year > maxDate.getFullYear()) return;
    if (selectionMode === "year") {
      const firstDay = new Date(year, 0, 1);
      const nextDate = year === minDate.getFullYear() && firstDay < minDate
        ? minDate
        : year === maxDate.getFullYear() && firstDay > maxDate
          ? maxDate
          : firstDay;
      syncValue(nextDate);
      setDraftValue(formatDateForInput(nextDate, selectionMode));
      setInputError(null);
      touchField();
      setIsOpen(false);
      return;
    }

    setViewDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setFullYear(year);
      return nextDate;
    });
    setMode(selectionMode === "month" ? "months" : "days");
  };

  const handleYearChange = (year: number) => {
    setViewDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setDate(1);
      nextDate.setFullYear(year);

      if (year === minDate.getFullYear() && nextDate < startOfMonth(minDate)) {
        nextDate.setMonth(minDate.getMonth());
      }

      if (year === maxDate.getFullYear() && nextDate > startOfMonth(maxDate)) {
        nextDate.setMonth(maxDate.getMonth());
      }

      return nextDate;
    });
  };

  const commitDraftValue = (rawValue: string) => {
    const normalizedValue = formatInputValue(rawValue, selectionMode);
    setDraftValue(normalizedValue);
    touchField();

    if (!normalizedValue) {
      syncValue(null);
      setInputError(null);
      return;
    }

    if (selectionMode === "year") {
      if (normalizedValue.length < 4) {
        syncValue(null);
        setInputError("Ano incompleto");
        return;
      }
      const year = Number(normalizedValue);
      if (year < minDate.getFullYear() || year > maxDate.getFullYear()) {
        syncValue(null);
        setInputError("Ano fora do intervalo permitido");
        return;
      }
      handleYearClick(year);
      setInputError(null);
      return;
    }

    if (normalizedValue.length < 10) {
      syncValue(null);
      setInputError("Data incompleta");
      return;
    }

    const parsedDate = parseDateValue(normalizedValue);
    if (!parsedDate) {
      syncValue(null);
      setInputError("Data invalida");
      return;
    }

    if (
      isBefore(parsedDate, startOfDay(minDate)) ||
      isAfter(parsedDate, startOfDay(maxDate))
    ) {
      syncValue(null);
      setInputError("Data fora do intervalo permitido");
      return;
    }

    syncValue(parsedDate);
    setViewDate(parsedDate);
    setInputError(null);
  };

  const yearRangeStart = viewDate.getFullYear() - 5;
  const years = Array.from(
    { length: 12 },
    (_, index) => yearRangeStart + index,
  );
  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();
  const selectableYears = Array.from(
    { length: Math.max(0, maxYear - minYear + 1) },
    (_, index) => minYear + index,
  );
  const previousMonth = subMonths(viewDate, 1);
  const nextMonth = addMonths(viewDate, 1);
  const previousMonthDisabled = isBefore(
    endOfMonth(previousMonth),
    startOfDay(minDate),
  );
  const nextMonthDisabled = isAfter(
    startOfMonth(nextMonth),
    startOfDay(maxDate),
  );
  const headerLabel =
    mode === "days"
      ? format(viewDate, "MMMM yyyy", { locale: ptBR })
      : mode === "months"
        ? String(viewDate.getFullYear())
        : `${yearRangeStart} - ${yearRangeStart + 11}`;

  const resolvedErrorText =
    inputError ||
    (formikTouched && typeof formikError === "string"
      ? formikError
      : errorText);
  const hasError = Boolean(
    inputError || (formikTouched && formikError) || error,
  );
  const errorId = `${name}-error`;

  return (
    <FieldFrame
      className="relative"
      ref={containerRef}
      label={label}
      labelFor={name}
      invalid={hasError}
      message={resolvedErrorText}
      messageId={errorId}
    >
      <div
        data-has-value={draftValue.length > 0}
        className={classNames(
          FIELD_CONTROL_CLASS,
          {
            [FIELD_DISABLED_CLASS]: isFieldDisabled,
            [FIELD_ERROR_CLASS]: hasError,
          },
          className,
        )}
      >
        <input
          ref={inputRef}
          id={name}
          name={name}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError && resolvedErrorText ? errorId : undefined}
          type="text"
          inputMode="numeric"
          autoComplete="off"
           maxLength={selectionMode === "year" ? 4 : 10}
          disabled={isFieldDisabled}
           placeholder={resolvedPlaceholder}
          value={draftValue}
          onClick={openCalendar}
          onFocus={() => {
            setIsEditing(true);
            openCalendar();
          }}
          onChange={(event) => {
             const nextValue = formatInputValue(event.target.value, selectionMode);
            setDraftValue(nextValue);
            setInputError(null);

             if (selectionMode === "day" && nextValue.length === 10) {
              const parsedDate = parseDateValue(nextValue);
              if (parsedDate) {
                setViewDate(parsedDate);
              }
            }
          }}
          onBlur={(event) => {
            setIsEditing(false);
            commitDraftValue(event.target.value);
            onBlur?.(event);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              commitDraftValue(draftValue);
              setIsOpen(false);
            }
          }}
          className={FIELD_INPUT_CLASS}
        />

        <button
          type="button"
          disabled={isFieldDisabled}
          onClick={openCalendar}
          className="flex items-center justify-center disabled:cursor-not-allowed"
          aria-label="Abrir calendario"
        >
          <MdCalendarMonth
            className={classNames("h-5 w-5", {
              "text-field-assistive-error": hasError,
            })}
          />
        </button>
      </div>

      {isMounted && isOpen
        ? createPortal(
            <div
              ref={dropdownRef}
              style={dropdownStyle}
              className={classNames(
                getFloatingLayerClass(containerRef.current, "popover"),
                "rounded-sm border border-border-default bg-white shadow-md transition-all duration-150",
                panelNeedsScroll
                  ? "overflow-y-auto overscroll-contain"
                  : "overflow-visible",
                "py-3",
              )}
            >
              <div className="mb-1 flex items-center justify-between px-1">
                <button
                  type="button"
                  aria-label="Exibir mês anterior"
                  disabled={
                    navigationVariant === "dropdown" && previousMonthDisabled
                  }
                  onClick={() =>
                    mode === "days"
                      ? setViewDate((currentDate) => subMonths(currentDate, 1))
                      : mode === "months"
                        ? setViewDate((currentDate) => {
                            const nextDate = new Date(currentDate);
                            nextDate.setFullYear(nextDate.getFullYear() - 1);
                            return nextDate;
                          })
                        : setViewDate((currentDate) => {
                            const nextDate = new Date(currentDate);
                            nextDate.setFullYear(nextDate.getFullYear() - 12);
                            return nextDate;
                          })
                  }
                  className="rounded-sm p-1 text-primary-1 transition-colors hover:bg-primary-1/10 disabled:cursor-not-allowed disabled:text-content-disabled"
                >
                  <MdChevronLeft aria-hidden="true" className="h-5 w-5" />
                </button>

                {navigationVariant === "dropdown" ? (
                  <div className="flex items-center gap-[6px]">
                    <select
                      aria-label="Selecionar mês do calendário"
                      value={viewDate.getMonth()}
                      onChange={(event) =>
                        handleMonthChange(Number(event.target.value))
                      }
                      className="h-6 w-24 rounded-sm border-2 border-border-default bg-field-surface px-0.5 text-xs leading-3 text-field-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    >
                      {MONTHS.map((month, monthIndex) => (
                        <option
                          key={month}
                          value={monthIndex}
                          disabled={
                            (viewDate.getFullYear() === minYear &&
                              monthIndex < minDate.getMonth()) ||
                            (viewDate.getFullYear() === maxYear &&
                              monthIndex > maxDate.getMonth())
                          }
                        >
                          {month}
                        </option>
                      ))}
                    </select>

                    <select
                      aria-label="Selecionar ano do calendário"
                      value={viewDate.getFullYear()}
                      onChange={(event) =>
                        handleYearChange(Number(event.target.value))
                      }
                      className="h-6 w-[58px] rounded-sm border-2 border-border-default bg-field-surface px-0.5 text-xs leading-3 text-field-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    >
                      {selectableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setMode((currentMode) =>
                        currentMode === "days"
                          ? "months"
                          : currentMode === "months"
                            ? "years"
                            : "days",
                      )
                    }
                    className="px-2 text-sm font-semibold capitalize text-content-primary transition-colors hover:text-primary-1"
                  >
                    {headerLabel}
                  </button>
                )}

                <button
                  type="button"
                  aria-label="Exibir próximo mês"
                  disabled={
                    navigationVariant === "dropdown" && nextMonthDisabled
                  }
                  onClick={() =>
                    mode === "days"
                      ? setViewDate((currentDate) => addMonths(currentDate, 1))
                      : mode === "months"
                        ? setViewDate((currentDate) => {
                            const nextDate = new Date(currentDate);
                            nextDate.setFullYear(nextDate.getFullYear() + 1);
                            return nextDate;
                          })
                        : setViewDate((currentDate) => {
                            const nextDate = new Date(currentDate);
                            nextDate.setFullYear(nextDate.getFullYear() + 12);
                            return nextDate;
                          })
                  }
                  className="rounded-sm p-1 text-primary-1 transition-colors hover:bg-primary-1/10 disabled:cursor-not-allowed disabled:text-content-disabled"
                >
                  <MdChevronRight aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              {mode === "days" && (
                <div className="px-3">
                  <div className="grid grid-cols-7 gap-x-1">
                    {WEEKDAYS.map((weekday) => (
                      <div
                        key={weekday}
                        className="select-none py-0.5 text-center text-2xs font-semibold text-content-muted"
                      >
                        {weekday}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-x-1">
                    {getDaysInView().map((day, index) => {
                      const selected = selectedDate
                        ? isSameDay(day, selectedDate)
                        : false;
                      const currentDay = isToday(day);
                      const inMonth = isSameMonth(day, viewDate);
                      const dayDisabled =
                        isBefore(day, startOfDay(minDate)) ||
                        isAfter(day, startOfDay(maxDate));

                      if (!showAdjacentDays && !inMonth) {
                        return (
                          <span
                            key={`${day.toISOString()}-${index}`}
                            aria-hidden="true"
                            className="h-7"
                          />
                        );
                      }

                      return (
                        <button
                          key={`${day.toISOString()}-${index}`}
                          type="button"
                          onClick={() => handleDayClick(day)}
                          disabled={dayDisabled}
                          className={classNames(
                            "group flex h-7 w-full items-center justify-center text-xs transition-colors",
                            {
                              "opacity-30 cursor-not-allowed": dayDisabled,
                              "cursor-pointer": !dayDisabled,
                            },
                          )}
                        >
                          <span
                            className={classNames(
                              "flex h-6 w-6 items-center justify-center rounded-sm transition-colors",
                              {
                                "border border-selection-border bg-selection-background font-semibold text-selection-content":
                                  selected,
                                "border border-primary-1 text-primary-1 font-semibold group-hover:bg-primary-1/10":
                                  currentDay && inMonth && !selected,
                                "text-content-primary group-hover:bg-primary-1/10":
                                  inMonth && !selected && !currentDay,
                                "text-content-muted": !inMonth,
                              },
                            )}
                          >
                            {format(day, "d")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mode === "months" && (
                <div className="grid grid-cols-3 gap-1 px-3">
                  {MONTHS.map((month, index) => {
                    const selected = index === viewDate.getMonth();

                    return (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleMonthClick(index)}
                        className={classNames(
                          "rounded-sm py-1 text-xs capitalize transition-colors",
                          {
                            "border border-selection-border bg-selection-background font-semibold text-selection-content":
                              selected,
                            "text-content-primary hover:bg-primary-1/10":
                              !selected,
                          },
                        )}
                      >
                        {month.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              )}

              {mode === "years" && (
                <div className="grid grid-cols-3 gap-1 px-3">
                  {years.map((year) => {
                    const selected = year === viewDate.getFullYear();

                    return (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearClick(year)}
                        className={classNames(
                          "rounded-sm py-1 text-xs transition-colors",
                          {
                            "border border-selection-border bg-selection-background font-semibold text-selection-content":
                              selected,
                            "text-content-primary hover:bg-primary-1/10":
                              !selected,
                          },
                        )}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>,
            document.body,
          )
        : null}
    </FieldFrame>
  );
};

export default UnifiedDatePicker;

/** @deprecated Use DatePicker. Kept for deep-import compatibility. */
export const DatePickerLegacy = UnifiedDatePicker;
/** @deprecated Use DatePickerProps. */
export type DatepickerProps = UnifiedDatePickerProps;
/** @deprecated Use DatePickerNavigationVariant. */
export type DatepickerNavigationVariant = DatePickerNavigationVariant;
