export type CountryFlagMap = Record<string, string>;

let countryFlags: CountryFlagMap | null = null;
let countryFlagsPromise: Promise<CountryFlagMap> | null = null;

export function getLoadedCountryFlagUrl(cca2?: string | null) {
  const code = String(cca2 || "").trim().toLowerCase();
  return code && countryFlags ? countryFlags[code] || "" : "";
}

/**
 * Loads embedded flag data only when a country component needs to render it.
 * The JSON becomes an internal package chunk; no network request is involved.
 */
export function loadCountryFlags() {
  if (countryFlags) return Promise.resolve(countryFlags);
  if (!countryFlagsPromise) {
    countryFlagsPromise = Promise.all([
      import("./country-flag-chunks/flags-00.json"),
      import("./country-flag-chunks/flags-01.json"),
      import("./country-flag-chunks/flags-02.json"),
      import("./country-flag-chunks/flags-03.json"),
      import("./country-flag-chunks/flags-04.json"),
      import("./country-flag-chunks/flags-05.json"),
      import("./country-flag-chunks/flags-06.json"),
      import("./country-flag-chunks/flags-07.json"),
      import("./country-flag-chunks/flags-08.json"),
      import("./country-flag-chunks/flags-09.json"),
      import("./country-flag-chunks/flags-10.json"),
      import("./country-flag-chunks/flags-11.json"),
      import("./country-flag-chunks/flags-12.json"),
      import("./country-flag-chunks/flags-13.json"),
      import("./country-flag-chunks/flags-14.json"),
      import("./country-flag-chunks/flags-15.json"),
      import("./country-flag-chunks/flags-16.json"),
      import("./country-flag-chunks/flags-17.json"),
      import("./country-flag-chunks/flags-18.json"),
      import("./country-flag-chunks/flags-19.json"),
    ]).then((modules) => {
      const mergedFlags = Object.assign(
        {},
        ...modules.map((module) => module.default as CountryFlagMap),
      ) as CountryFlagMap;
      countryFlags = mergedFlags;
      return mergedFlags;
    });
  }
  return countryFlagsPromise;
}
