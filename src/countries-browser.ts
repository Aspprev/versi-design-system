import {
  COUNTRY_OPTIONS as COUNTRY_METADATA_OPTIONS,
  filterCountryOptions,
  getCountryOptions as getMetadataCountryOptions,
  type DesignSystemCountryOption,
} from "./data/country-metadata";

export type {
  CountryListFilter,
  CountryListMode,
  DesignSystemCountryOption,
} from "./data/country-metadata";

export { filterCountryOptions };

const countryFlagFiles = new Set(
  COUNTRY_METADATA_OPTIONS.map((country) => country.cca2.toLowerCase()),
);

function normalizedCode(cca2?: string | null) {
  const code = String(cca2 || "").trim().toLowerCase();
  return /^[a-z]{2}$/.test(code) && countryFlagFiles.has(code) ? code : "";
}

/** Browser-safe synchronous URL for a flag shipped by this package. */
export function getCountryFlagUrl(cca2?: string | null) {
  const code = normalizedCode(cca2);
  return code ? new URL(`./flags/${code}.svg`, import.meta.url).toString() : "";
}

function withCountryFlag(option: DesignSystemCountryOption): DesignSystemCountryOption {
  return {
    ...option,
    flags: {
      ...option.flags,
      svg: getCountryFlagUrl(option.cca2),
    },
  };
}

/** Browser entrypoint: light metadata and package-local flag URLs. */
export const COUNTRY_OPTIONS: DesignSystemCountryOption[] = COUNTRY_METADATA_OPTIONS.map(
  withCountryFlag,
);

export const PHONE_COUNTRY_OPTIONS = COUNTRY_OPTIONS;

export function getCountryOptions() {
  return getMetadataCountryOptions().map(withCountryFlag);
}

export default COUNTRY_OPTIONS;
