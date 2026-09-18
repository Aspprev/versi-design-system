import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  COUNTRY_OPTIONS,
  filterCountryOptions,
  getCountryFlagUrl,
  getCountryOptions,
  PHONE_COUNTRY_OPTIONS,
} from "../../src/countries";

describe("Design System country data", () => {
  it("exporta a lista normalizada com Brasil e codigos de discagem", () => {
    const brazil = COUNTRY_OPTIONS.find((country) => country.cca2 === "BR");

    expect(COUNTRY_OPTIONS.length).toBe(250);
    expect(PHONE_COUNTRY_OPTIONS).toBe(COUNTRY_OPTIONS);
    expect(brazil).toMatchObject({
      label: "Brasil",
      value: "Brasil",
      idd: { display: "+55" },
      flags: { svg: "/flags/br.svg" },
    });
  });

  it("mantem uma bandeira SVG local para cada pais publicado", () => {
    const flagsRoot = path.resolve("public/flags");
    const flags = fs
      .readdirSync(flagsRoot)
      .filter((fileName) => fileName.endsWith(".svg"));

    expect(flags).toHaveLength(COUNTRY_OPTIONS.length);
    for (const country of COUNTRY_OPTIONS) {
      expect(flags).toContain(`${country.cca2.toLowerCase()}.svg`);
    }
    expect(
      COUNTRY_OPTIONS.every((country) =>
        /^\/flags\/[a-z0-9-]+\.svg$/i.test(country.flags.svg),
      ),
    ).toBe(true);
  });

  it("retorna uma copia segura para filtros locais", () => {
    const copy = getCountryOptions();

    expect(copy).not.toBe(COUNTRY_OPTIONS);
    expect(copy[0]).not.toBe(COUNTRY_OPTIONS[0]);
    expect(copy[0].idd).not.toBe(COUNTRY_OPTIONS[0].idd);
    expect(copy[0].flags).not.toBe(COUNTRY_OPTIONS[0].flags);
  });

  it("filtra a lista por inclusao, exclusao ou todos", () => {
    const sample = COUNTRY_OPTIONS.filter((country) =>
      ["BR", "PT", "US"].includes(country.cca2),
    );

    expect(
      filterCountryOptions(sample, { mode: "all", codes: ["BR"] }).map(
        (country) => country.cca2,
      ),
    ).toEqual(["BR", "US", "PT"]);
    expect(
      filterCountryOptions(sample, {
        mode: "include",
        codes: ["BR", "PT"],
      }).map((country) => country.cca2),
    ).toEqual(["BR", "PT"]);
    expect(
      filterCountryOptions(sample, {
        mode: "exclude",
        codes: ["PT"],
      }).map((country) => country.cca2),
    ).toEqual(["BR", "US"]);
  });

  it("resolve o caminho local da bandeira pelo codigo ISO-2", () => {
    expect(getCountryFlagUrl("BR")).toBe("/flags/br.svg");
    expect(getCountryFlagUrl("br")).toBe("/flags/br.svg");
    expect(getCountryFlagUrl("Brasil")).toBe("");
  });
});

