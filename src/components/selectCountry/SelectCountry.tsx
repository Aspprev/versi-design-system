"use client";

import InputSelect, {
  type InputSelectOption,
} from "../inputSelect/InputSelect";
import {
  COUNTRY_OPTIONS,
  filterCountryOptions,
  getCountryFlagUrl,
  type CountryListFilter,
} from "../../countries";
import type React from "react";

export type SelectCountryOption = InputSelectOption & {
  cca2?: string;
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
};

export type SelectCountryProps = Omit<
  React.ComponentProps<typeof InputSelect>,
  "options" | "renderOption" | "renderValue"
> & {
  /** Lista base customizada. Quando omitida, usa todos os paises do pacote. */
  options?: SelectCountryOption[];
  /** Use `all` (padrao), `include` ou `exclude` com codigos ISO-2. */
  countryList?: CountryListFilter;
};

function renderFlag(option: SelectCountryOption) {
  const svgSrc = String(
    getCountryFlagUrl(option.cca2) || option.flags?.svg || "",
  ).trim();

  if (!svgSrc) {
    return (
      <span
        aria-hidden="true"
        className="h-5 w-7 shrink-0 rounded-sm bg-surface-muted"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-7 shrink-0 items-center justify-center"
    >
      <img
        src={svgSrc}
        alt=""
        className="h-full w-full object-contain"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </span>
  );
}

function renderCountryContent(
  option: SelectCountryOption | null,
  placeholder?: string,
) {
  if (!option) {
    return (
      <span className="block w-full truncate overflow-hidden text-content-muted">
        {placeholder}
      </span>
    );
  }

  return (
    <span className="flex w-full min-w-0 items-center gap-2">
      {renderFlag(option)}
      <span className="block truncate overflow-hidden">{option.label}</span>
    </span>
  );
}

export function SelectCountry({
  options,
  countryList,
  searchable = true,
  searchPlaceholder = "Busque um país",
  noOptionsText = "Nenhum país encontrado",
  defaultValue,
  onChange,
  className,
  ...props
}: SelectCountryProps) {
  const availableOptions = filterCountryOptions(
    options || COUNTRY_OPTIONS,
    countryList,
  );

  return (
    <InputSelect
      {...props}
      className={className}
      defaultValue={defaultValue}
      onChange={onChange}
      options={availableOptions}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      noOptionsText={noOptionsText}
      renderOption={(option) =>
        renderCountryContent(option as SelectCountryOption)
      }
      renderValue={(option, placeholder) =>
        renderCountryContent(option as SelectCountryOption | null, placeholder)
      }
    />
  );
}

/** @deprecated Use SelectCountry. */
export const CountrySelect = SelectCountry;
/** @deprecated Use SelectCountryOption. */
export type CountrySelectOption = SelectCountryOption;
/** @deprecated Use SelectCountryProps. */
export type CountrySelectProps = SelectCountryProps;

export default SelectCountry;
