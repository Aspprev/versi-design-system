import { Formik } from "formik";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { COUNTRY_OPTIONS, getCountryFlagUrl } from "../../src/countries";
import { InputPhone } from "../../src/components/inputPhone/InputPhone";
import SelectCountry from "../../src/components/selectCountry/SelectCountry";

const brazil = COUNTRY_OPTIONS.find(c => c.cca2 === "BR")!;
describe("self-contained flags during SSR", () => {
  for (const component of ["phone", "country"]) {
    for (const svg of [undefined, "  ", "data:image/svg+xml;base64,PHN2Zy8+", "https://example.test/custom.svg"]) {
      it(`${component} respects custom flags and package fallback: ${svg}`, () => {
        expect(typeof window).toBe("undefined");
        expect(typeof document).toBe("undefined");
        const option = { ...brazil, flags: { svg } };
        const html = renderToStaticMarkup(
          <Formik initialValues={{ phone: { ddi: 55, ddd: "11", numero: "999999999" }, country: "Brasil" }} onSubmit={() => {}}>
            {component === "phone" ? <InputPhone name="phone" countries={[option]} /> : <SelectCountry name="country" options={[option]} />}
          </Formik>,
        );
        expect(html).toContain(`src="${svg?.trim() || getCountryFlagUrl("BR")}"`);
        expect(html).not.toContain('/flags/');
        expect(html).toContain('alt=""');
      });
    }
    it(`${component} uses a placeholder for an unknown country`, () => {
      const option = { ...brazil, cca2: "ZZ", flags: undefined };
      const html = renderToStaticMarkup(<Formik initialValues={{ phone: { ddi: 55 }, country: "Brasil" }} onSubmit={() => {}}>
        {component === "phone" ? <InputPhone name="phone" countries={[option]} /> : <SelectCountry name="country" options={[option]} />}
      </Formik>);
      expect(html).not.toContain('<img');
    });
  }
});
