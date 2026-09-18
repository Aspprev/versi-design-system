import rawCountries from "./data/countries-source.json";

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

/**
 * Configura quais paises ficam disponiveis nos seletores.
 * `codes` usa os codigos ISO-2 (`BR`, `US`, `PT`, ...).
 */
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
  if (/^\/flags\/[a-z0-9-]+\.svg$/i.test(localPath)) return localPath;
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

export function getCountryFlagUrl(cca2?: string | null) {
  const code = text(cca2).toLowerCase();
  return /^[a-z]{2}$/.test(code) ? `/flags/${code}.svg` : "";
}

function optionCode(option: { cca2?: string; value?: string; label?: string }) {
  return text(option.cca2 || option.value || option.label).toUpperCase();
}

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
    const included = codes.has(optionCode(option));
    return mode === "include" ? included : !included;
  });
}

function mapCountry(country: RawCountry): DesignSystemCountryOption | null {
  const label = text(country.name);
  const cca2 = text(country.alpha2Code).toUpperCase();
  const codes = callingCodes(country.callingCodes);
  const svg = getCountryFlagUrl(cca2) || flagUrl(country.flags?.svg);
  const png = flagUrl(country.flags?.png);

  if (!label || cca2.length !== 2 || !codes[0] || !svg) return null;

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
      svg,
      alt: text(country.flags?.alt) || `Bandeira de ${label || "pais"}`,
    },
  };
}

const seen = new Set<string>();

/** Países com nome, bandeira SVG local e código de discagem válidos. */
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

/** Alias semântico para uso direto com o InputPhone. */
export const PHONE_COUNTRY_OPTIONS = COUNTRY_OPTIONS;

/** Retorna uma cópia para consumidores que precisam ordenar ou filtrar localmente. */
export function getCountryOptions() {
  return COUNTRY_OPTIONS.map((country) => ({
    ...country,
    idd: { ...country.idd, suffixes: [...country.idd.suffixes] },
    flags: { ...country.flags },
  }));
}

export default COUNTRY_OPTIONS;
