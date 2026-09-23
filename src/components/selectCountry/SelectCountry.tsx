"use client";

import InputSelect, {
  type InputSelectOption,
} from "../inputSelect/InputSelect";
import {
  COUNTRY_OPTIONS,
  filterCountryOptions,
} from "../../data/country-metadata";
import type { CountryListFilter } from "../../data/country-metadata";
import { CountryFlag } from "../countryFlag/CountryFlag";
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
  /** Exibe as bandeiras dos países. O padrão é true. */
  showFlags?: boolean;
};

function renderFlag(option: SelectCountryOption, showFlags: boolean) {
  if (!showFlags) return null;

  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-7 shrink-0 items-center justify-center"
    >
      <CountryFlag
        cca2={option.cca2}
        src={option.flags?.svg}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

function renderCountryContent(
  option: SelectCountryOption | null,
  placeholder?: string,
  showFlags = true,
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
      {renderFlag(option, showFlags)}
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
  showFlags = true,
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
        renderCountryContent(option as SelectCountryOption, undefined, showFlags)
      }
      renderValue={(option, placeholder) =>
        renderCountryContent(
          option as SelectCountryOption | null,
          placeholder,
          showFlags,
        )
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
