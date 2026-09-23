"use client";

import classNames from "classnames";
import FieldFrame from "../field/FieldFrame";
import {
  FIELD_DISABLED_CLASS,
  FIELD_ERROR_CLASS,
  FIELD_INPUT_CLASS,
} from "../field/field-styles";
import { useField } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdSearch,
} from "react-icons/md";
import { PatternFormat } from "react-number-format";
import { createPortal } from "react-dom";
import { calculateFloatingPanelRect } from "../../utils/floating-panel-position";
import { getFloatingLayerClass } from "../../utils/floating-layer";
import {
  filterCountryOptions,
  PHONE_COUNTRY_OPTIONS,
} from "../../data/country-metadata";
import type { CountryListFilter } from "../../data/country-metadata";
import { CountryFlag } from "../countryFlag/CountryFlag";

export type PhoneCountryOption = {
  label: string;
  value: string;
  cca2: string;
  idd: {
    root: string;
    suffixes: string[];
    display: string;
  };
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
};

export type PhoneValue = {
  ddi: number;
  ddd: string;
  numero: string;
};

type RawPhonePayload =
  | string
  | number
  | null
  | undefined
  | {
      ddi?: string | number | null;
      ddd?: string | number | null;
      numero?: string | number | null;
    };

export type InputPhoneProps = {
  name: string;
  label?: string;
  placeholder?: string;
  /** Lista base customizada. Quando omitida, usa todos os paises do pacote. */
  countries?: PhoneCountryOption[];
  /** Use `all` (padrao), `include` ou `exclude` com codigos ISO-2. */
  countryList?: CountryListFilter;
  disabled?: boolean;
  className?: string;
  /** Exibe as bandeiras do país. O padrão é true. */
  showFlags?: boolean;
};

const DEFAULT_BRAZIL_DDI = 55;
const DEFAULT_BRAZIL_CCA2 = "BR";
const phoneMasksByDdi: Record<string, string | null> = {
  "1": "(###) ###-####",
  "31": "## ########",
  "32": "### ## ## ##",
  "44": "#### ######",
  "49": null,
  "51": "### ### ###",
  "55": "(##) #####-####",
  "58": "### #######",
  "351": "### ### ###",
};

function normalizeDigits(value: string | number | null | undefined) {
  return String(value ?? "").replace(/\D/g, "");
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toPhoneValue(value?: Partial<PhoneValue> | null): PhoneValue {
  return {
    ddi: Number(normalizeDigits(value?.ddi) || DEFAULT_BRAZIL_DDI),
    ddd: normalizeDigits(value?.ddd),
    numero: normalizeDigits(value?.numero),
  };
}

function getMaskForDdi(ddi: number) {
  return phoneMasksByDdi[normalizeDigits(ddi)] ?? null;
}

function getAreaCodeLength(mask: string | null) {
  if (!mask) return 0;

  const match = mask.match(/\((#+)\)/);
  return match ? match[1].length : 0;
}

function splitNationalNumber(localNumber: string, mask: string | null) {
  const digits = normalizeDigits(localNumber);
  const areaCodeLength = getAreaCodeLength(mask);

  if (!areaCodeLength) {
    return {
      ddd: "",
      numero: digits,
    };
  }

  return {
    ddd: digits.slice(0, areaCodeLength),
    numero: digits.slice(areaCodeLength),
  };
}

function getDialDigits(country?: PhoneCountryOption | null) {
  return normalizeDigits(country?.idd?.display);
}

function getCountryByDdi(countries: PhoneCountryOption[], ddi: number) {
  const normalizedDdi = Number(normalizeDigits(ddi));

  return (
    countries.find(
      (country) => Number(getDialDigits(country)) === normalizedDdi,
    ) ||
    countries.find((country) => country.cca2 === DEFAULT_BRAZIL_CCA2) ||
    countries[0] ||
    null
  );
}

function getCountriesByDialLength(countries: PhoneCountryOption[]) {
  return [...countries].sort((a, b) => {
    return getDialDigits(b).length - getDialDigits(a).length;
  });
}

function getExplicitCountryFromRawValue(
  rawValue: RawPhonePayload,
  countries: PhoneCountryOption[],
) {
  if (typeof rawValue !== "string") return null;

  const trimmedValue = rawValue.trim();
  if (!trimmedValue || !/[^\d]/.test(trimmedValue)) return null;

  return (
    getCountriesByDialLength(countries).find((country) => {
      const dialDigits = getDialDigits(country);
      if (!dialDigits) return false;

      const dialPattern = new RegExp(`^\\+?\\s*${dialDigits}(?=\\D|$)`);
      return dialPattern.test(trimmedValue);
    }) || null
  );
}

function parseStoredPhoneValue(
  rawValue: RawPhonePayload,
  countries: PhoneCountryOption[],
): PhoneValue {
  if (rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)) {
    return {
      ddi: Number(normalizeDigits(rawValue.ddi) || DEFAULT_BRAZIL_DDI),
      ddd: normalizeDigits(rawValue.ddd),
      numero: normalizeDigits(rawValue.numero),
    };
  }

  const digits = normalizeDigits(
    rawValue as string | number | null | undefined,
  );

  if (!digits) {
    return {
      ddi: DEFAULT_BRAZIL_DDI,
      ddd: "",
      numero: "",
    };
  }

  const explicitCountry = getExplicitCountryFromRawValue(rawValue, countries);
  if (explicitCountry) {
    const dialDigits = getDialDigits(explicitCountry);
    const localDigits = digits.slice(dialDigits.length);
    const local = splitNationalNumber(
      localDigits,
      getMaskForDdi(Number(dialDigits)),
    );

    return {
      ddi: Number(dialDigits),
      ...local,
    };
  }

  if (digits.length <= 11) {
    const local = splitNationalNumber(
      digits,
      getMaskForDdi(DEFAULT_BRAZIL_DDI),
    );
    return {
      ddi: DEFAULT_BRAZIL_DDI,
      ...local,
    };
  }

  const optionsByDialLength = getCountriesByDialLength(countries);

  const matchedCountry = optionsByDialLength.find((country) => {
    const dialDigits = getDialDigits(country);
    return (
      dialDigits &&
      digits.startsWith(dialDigits) &&
      digits.length > dialDigits.length + 4
    );
  });

  if (!matchedCountry) {
    const local = splitNationalNumber(
      digits,
      getMaskForDdi(DEFAULT_BRAZIL_DDI),
    );
    return {
      ddi: DEFAULT_BRAZIL_DDI,
      ...local,
    };
  }

  const dialDigits = getDialDigits(matchedCountry);
  const localDigits = digits.slice(dialDigits.length);
  const local = splitNationalNumber(
    localDigits,
    getMaskForDdi(Number(dialDigits)),
  );

  return {
    ddi: Number(dialDigits),
    ...local,
  };
}

export function buildPhonePayload(
  phoneValue: PhoneValue | Partial<PhoneValue> | null | undefined,
) {
  const normalized = toPhoneValue(phoneValue);
  const ddiDigits = normalizeDigits(normalized.ddi);
  const dddDigits = normalizeDigits(normalized.ddd);
  const numberDigits = normalizeDigits(normalized.numero);
  const phoneDigits = `${dddDigits}${numberDigits}`;

  if (!phoneDigits) {
    return "";
  }

  // return `${ddiDigits}${phoneDigits}`;
  return `${ddiDigits}-${dddDigits}-${numberDigits}`;
}

export function parsePhonePayload(
  rawValue: RawPhonePayload,
  countries: PhoneCountryOption[] = PHONE_COUNTRY_OPTIONS,
) {
  return parseStoredPhoneValue(rawValue, countries);
}

function renderFlag(option: PhoneCountryOption | null, showFlags: boolean) {
  if (!showFlags) return null;

  return (
    <CountryFlag
      cca2={option?.cca2}
      src={option?.flags?.svg}
      alt=""
      className="h-5 w-7 shrink-0 object-contain"
    />
  );
}

export function InputPhone({
  name,
  label,
  placeholder,
  countries,
  countryList,
  disabled,
  className,
  showFlags = true,
}: InputPhoneProps) {
  const availableCountries = useMemo(
    () =>
      filterCountryOptions(
        countries || PHONE_COUNTRY_OPTIONS,
        countryList,
      ) as PhoneCountryOption[],
    [countries, countryList],
  );
  const [field, meta, helpers] = useField<PhoneValue>(name);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const countryButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>();
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);

  const value = useMemo(() => toPhoneValue(field.value), [field.value]);
  const selectedCountry = useMemo(
    () => availableCountries.find((country) => country.cca2 === selectedCountryCode &&
      Number(getDialDigits(country)) === value.ddi) || getCountryByDdi(availableCountries, value.ddi),
    [availableCountries, value.ddi, selectedCountryCode],
  );
  const phoneMask = getMaskForDdi(value.ddi);
  const phoneDigits = `${normalizeDigits(value.ddd)}${normalizeDigits(value.numero)}`;
  const normalizedSearch = normalizeSearchText(searchTerm.trim());
  const filteredCountries = useMemo(() => {
    return availableCountries.filter((country) => {
      const searchableText = [
        country.label,
        country.cca2,
        country.idd.display,
        getDialDigits(country),
      ]
        .join(" ")
        .trim();

      return normalizeSearchText(searchableText).includes(normalizedSearch);
    });
  }, [availableCountries, normalizedSearch]);

  const getErrorMessage = useCallback(() => {
    if (!meta.touched || !meta.error) return "";
    if (typeof meta.error === "string") return meta.error;
    if (typeof meta.error === "object") {
      const phoneError = meta.error as { numero?: string; ddd?: string };
      return String(phoneError.numero || phoneError.ddd || "");
    }
    return "";
  }, [meta.error, meta.touched]);

  const errorMessage = getErrorMessage();
  const hasError = Boolean(errorMessage);
  const errorId = `${name}-error`;
  const dropdownId = `${name}-countries`;
  const isDropdownPositioned = dropdownPosition !== null;

  const updateDropdownPosition = useCallback(() => {
    const trigger = countryButtonRef.current;
    const dropdown = dropdownRef.current;
    if (!open || !trigger) return;

    const rect = trigger.getBoundingClientRect();
    const panelRect = calculateFloatingPanelRect({
      trigger: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        width: 220,
      },
      panel: {
        width: 220,
        height: Math.min(dropdown?.scrollHeight || 320, 320),
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });

    setDropdownPosition(panelRect);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setDropdownPosition(null);
      return;
    }

    updateDropdownPosition();
  }, [open, updateDropdownPosition]);

  useEffect(() => {
    if (open && isDropdownPositioned) {
      searchInputRef.current?.focus({ preventScroll: true });
    }
  }, [isDropdownPositioned, open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (!open) return;

    const scheduleDropdownPosition = () => updateDropdownPosition();
    window.addEventListener("resize", scheduleDropdownPosition);
    window.addEventListener("scroll", scheduleDropdownPosition, true);

    return () => {
      window.removeEventListener("resize", scheduleDropdownPosition);
      window.removeEventListener("scroll", scheduleDropdownPosition, true);
    };
  }, [open, updateDropdownPosition]);

  useEffect(() => {
    if (initializedRef.current || availableCountries.length === 0) return;

    const parsed = parseStoredPhoneValue(
      field.value as RawPhonePayload,
      availableCountries,
    );
    helpers.setValue(parsed);
    initializedRef.current = true;
  }, [availableCountries, field.value, helpers]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !wrapperRef.current?.contains(event.target as Node) &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
        helpers.setTouched(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [helpers, open]);

  const setPhoneValue = (nextValue: Partial<PhoneValue>) => {
    helpers.setValue({
      ...value,
      ...nextValue,
      ddi: Number(
        normalizeDigits(nextValue.ddi ?? value.ddi) || DEFAULT_BRAZIL_DDI,
      ),
      ddd: normalizeDigits(nextValue.ddd ?? value.ddd),
      numero: normalizeDigits(nextValue.numero ?? value.numero),
    });
  };

  const dropdownLayerClass = getFloatingLayerClass(
    countryButtonRef.current,
    "popover",
  );
  const dropdownZClass =
    dropdownLayerClass === "z-popover" ? "z-menu" : dropdownLayerClass;

  return (
    <FieldFrame
      className={className}
      label={label}
      labelFor={name}
      invalid={Boolean(hasError)}
      message={errorMessage}
      messageId={errorId}
    >
      <div
        ref={wrapperRef}
        className="field-control-slot relative mt-4xs mb-[4px] flex w-full min-w-0"
      >
        <div
          data-has-value={phoneDigits.length > 0}
          className={classNames(
            "field-keyboard-focus-ring flex w-full min-w-0 min-h-control-md items-center overflow-hidden rounded-sm border border-field-border-default bg-field-surface text-field-icon transition-colors focus-within:border-field-border-active focus-within:text-field-content data-[has-value=true]:text-field-content",
            {
              [FIELD_ERROR_CLASS]: hasError,
              [FIELD_DISABLED_CLASS]: disabled,
            },
          )}
        >
          <button
            ref={countryButtonRef}
            type="button"
            aria-label={`Selecionar país de ${label || name}: ${selectedCountry?.label || ""} ${selectedCountry?.idd.display || `+${value.ddi}`}`}
            aria-haspopup="dialog"
            aria-expanded={open && !disabled}
            aria-controls={open && !disabled ? dropdownId : undefined}
            disabled={disabled}
            onClick={() => setOpen((prev) => !prev)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                setOpen(true);
              }
            }}
            onBlur={() => helpers.setTouched(true)}
            className={classNames(
              "flex h-full items-center gap-1.5 pl-2 pr-1 text-left",
              "border-r border-field-border-default bg-transparent text-field-content focus:outline-none",
              {
                "cursor-pointer": !disabled,
                "cursor-not-allowed text-content-disabled": disabled,
              },
            )}
          >
            {renderFlag(selectedCountry, showFlags)}
            <span className="text-sm">
              {selectedCountry?.idd.display || `+${value.ddi}`}
            </span>
            {open ? (
              <MdOutlineKeyboardArrowUp
                className={classNames("h-4 w-4 shrink-0", {
                  "text-field-assistive-error": hasError,
                  "text-field-content": !hasError,
                })}
              />
            ) : (
              <MdOutlineKeyboardArrowDown
                className={classNames("h-4 w-4 shrink-0", {
                  "text-field-assistive-error": hasError,
                  "text-field-content": !hasError && phoneDigits.length > 0,
                  "text-field-icon": !hasError && phoneDigits.length === 0,
                })}
              />
            )}
          </button>

          <div className="min-w-0 flex-1 pl-1 pr-3">
            {phoneMask ? (
              <PatternFormat
                id={name}
                name={name}
                type="tel"
                inputMode="tel"
                aria-label={label ? undefined : name}
                aria-invalid={hasError || undefined}
                aria-describedby={hasError ? errorId : undefined}
                value={phoneDigits}
                format={phoneMask}
                allowEmptyFormatting={false}
                mask=""
                placeholder={placeholder || phoneMask.replace(/#/g, "9")}
                disabled={disabled}
                className={FIELD_INPUT_CLASS}
                onBlur={() => helpers.setTouched(true)}
                onValueChange={(values) => {
                  const areaCodeLength = getAreaCodeLength(phoneMask);
                  const digits = normalizeDigits(values.value);
                  setPhoneValue({
                    ddd: areaCodeLength ? digits.slice(0, areaCodeLength) : "",
                    numero: areaCodeLength
                      ? digits.slice(areaCodeLength)
                      : digits,
                  });
                }}
              />
            ) : (
              <input
                id={name}
                name={name}
                aria-label={label ? undefined : name}
                aria-invalid={hasError || undefined}
                aria-describedby={hasError ? errorId : undefined}
                type="tel"
                inputMode="numeric"
                value={normalizeDigits(value.numero)}
                placeholder={placeholder || "Digite o telefone"}
                disabled={disabled}
                className={FIELD_INPUT_CLASS}
                onBlur={() => helpers.setTouched(true)}
                onChange={(event) =>
                  setPhoneValue({ ddd: "", numero: event.target.value })
                }
              />
            )}
          </div>
        </div>

        {open &&
          !disabled &&
          dropdownPosition &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={dropdownRef}
              id={dropdownId}
              role="dialog"
              aria-label={`Selecionar país de ${label || name}`}
              onKeyDown={(event) => {
                if (event.key === "Escape" || event.key === "Tab") {
                  event.preventDefault();
                  setOpen(false);
                  helpers.setTouched(true);
                  if (event.key === "Escape" || event.shiftKey) countryButtonRef.current?.focus();
                  else document.getElementById(name)?.focus();
                  return;
                }
                if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
                if (event.target === searchInputRef.current && ["Home", "End"].includes(event.key)) return;
                const options = Array.from(dropdownRef.current?.querySelectorAll<HTMLButtonElement>("button") || []);
                if (!options.length) return;
                event.preventDefault();
                const index = options.indexOf(document.activeElement as HTMLButtonElement);
                const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1
                  : event.key === "ArrowDown" ? (index + 1) % options.length
                  : (index <= 0 ? options.length : index) - 1;
                options[next]?.focus();
              }}
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: dropdownPosition.maxHeight,
              }}
              className={classNames(
                "fixed mt-1 overflow-hidden rounded-sm border border-field-border-default bg-field-surface shadow-lg",
                dropdownZClass,
              )}
            >
            <div className="flex items-center gap-2 border-b border-field-border-default bg-field-surface p-2">
              <MdSearch className="h-4 w-4 text-field-icon" />
              <input
                ref={searchInputRef}
                type="text"
                aria-label="Pesquisar país ou DDI"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Busque um país ou DDI"
                className="w-full bg-transparent text-sm text-field-content outline-none placeholder:text-field-placeholder"
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredCountries.length === 0 ? (
                <div role="status" className="px-3 py-2 text-sm text-content-muted">
                  Nenhum DDI encontrado
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={`${country.cca2}-${country.idd.display}`}
                    type="button"
                    aria-pressed={selectedCountry?.cca2 === country.cca2}
                    onClick={() => {
                      setSelectedCountryCode(country.cca2);
                      setPhoneValue({ ddi: Number(getDialDigits(country)) });
                      helpers.setTouched(true);
                      setOpen(false);
                      countryButtonRef.current?.focus();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring"
                  >
                    {renderFlag(country, showFlags)}
                    <span className="min-w-0 flex-1 truncate text-field-content">
                      {country.label}
                    </span>
                    <span className="shrink-0 text-content-muted">
                      {country.idd.display}
                    </span>
                  </button>
                ))
              )}
            </div>
            </div>,
            document.body,
          )}
      </div>

    </FieldFrame>
  );
}

/** @deprecated Use InputPhone. */
export const PhoneInput = InputPhone;
/** @deprecated Use InputPhoneCountryOption. */
export type InputPhoneCountryOption = PhoneCountryOption;
/** @deprecated Use InputPhoneValue. */
export type InputPhoneValue = PhoneValue;
/** @deprecated Use InputPhoneProps. */
export type PhoneInputProps = InputPhoneProps;

export default InputPhone;
