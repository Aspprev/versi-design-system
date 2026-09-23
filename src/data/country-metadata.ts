import rawCountries from "./countries-source.json";

export type DesignSystemCountryOption = {
  label: string;
  value: string;
  cca2: string;
  idd: {
    root: string;
    suffixes: string[];
    display: string;
  };
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
};

export type CountryListMode = "all" | "include" | "exclude";

export type CountryListFilter = {
  mode?: CountryListMode;
  codes?: string[];
};

type RawCountry = {
  name?: unknown;
  alpha2Code?: unknown;
  callingCodes?: unknown;
  flags?: { png?: unknown; svg?: unknown; alt?: unknown } | null;
};

function text(value: unknown) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 120)
    : "";
}

function flagUrl(value: unknown) {
  if (typeof value !== "string") return "";
  const localPath = value.trim();
  try {
    const url = new URL(localPath);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function callingCodes(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => text(item).replace(/\D/g, ""))
    .filter(Boolean)
    .slice(0, 10);
}

function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function mapCountry(country: RawCountry): DesignSystemCountryOption | null {
  const label = text(country.name);
  const cca2 = text(country.alpha2Code).toUpperCase();
  const codes = callingCodes(country.callingCodes);
  const png = flagUrl(country.flags?.png);

  if (!label || cca2.length !== 2 || !codes[0]) return null;

  return {
    label,
    value: label,
    cca2,
    idd: {
      root: `+${codes[0]}`,
      suffixes: codes.slice(1),
      display: `+${codes[0]}`,
    },
    flags: {
      png,
      // SVG data is resolved by the countries entrypoint or component loader.
      svg: "",
      alt: text(country.flags?.alt) || `Bandeira de ${label || "pais"}`,
    },
  };
}

const seen = new Set<string>();

/** Country metadata without the embedded SVG flag payloads. */
export const COUNTRY_OPTIONS: DesignSystemCountryOption[] = (rawCountries as RawCountry[])
  .map(mapCountry)
  .filter((item): item is DesignSystemCountryOption => Boolean(item))
  .filter((item) => {
    const key = normalizeKey(item.label);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

export const PHONE_COUNTRY_OPTIONS = COUNTRY_OPTIONS;

export function filterCountryOptions<T extends {
  cca2?: string;
  value?: string;
  label?: string;
}>(options: T[], filter?: CountryListFilter) {
  const mode = filter?.mode || "all";
  if (mode === "all") return options;

  const codes = new Set(
    (filter?.codes || [])
      .map((code) => text(code).toUpperCase())
      .filter(Boolean),
  );

  return options.filter((option) => {
    const included = codes.has(text(option.cca2 || option.value || option.label).toUpperCase());
    return mode === "include" ? included : !included;
  });
}

export function getCountryOptions() {
  return COUNTRY_OPTIONS.map((country) => ({
    ...country,
    idd: { ...country.idd, suffixes: [...country.idd.suffixes] },
    flags: { ...country.flags },
  }));
}
