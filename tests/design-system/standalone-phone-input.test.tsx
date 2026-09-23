import { Formik } from "formik";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import InputPhone, {
  buildPhonePayload,
  parsePhonePayload,
  type PhoneCountryOption,
} from "../../src/components/inputPhone/InputPhone";

const countries: PhoneCountryOption[] = [
  {
    label: "Brasil",
    value: "BR",
    cca2: "BR",
    idd: { root: "+5", suffixes: ["5"], display: "+55" },
  },
  {
    label: "Estados Unidos",
    value: "US",
    cca2: "US",
    idd: { root: "+1", suffixes: [], display: "+1" },
  },
];

describe("InputPhone standalone", () => {
  it("renderiza um telefone acessível com país e máscara", () => {
    const html = renderToStaticMarkup(
      <Formik
        initialValues={{ telefone: { ddi: 55, ddd: "11", numero: "987654321" } }}
        onSubmit={() => undefined}
      >
        <form>
          <InputPhone
            name="telefone"
            label="Telefone"
            countries={countries}
          />
        </form>
      </Formik>,
    );

    expect(html).toContain('<label for="telefone"');
    expect(html).toContain('id="telefone"');
    expect(html).toContain('type="tel"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).not.toContain('tabindex="-1"');
    expect(html).toContain("+55");
    expect(html).toContain('data-has-value="true"');
  });

  it("anuncia erro do Formik no campo de telefone", () => {
    const html = renderToStaticMarkup(
      <Formik
        initialValues={{ telefone: "" }}
        initialErrors={{ telefone: "Informe um telefone válido." }}
        initialTouched={{ telefone: true }}
        onSubmit={() => undefined}
      >
        <form>
          <InputPhone name="telefone" label="Telefone" countries={countries} />
        </form>
      </Formik>,
    );

    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="telefone-error"');
    expect(html).toContain('role="alert"');
    expect(html).toContain("Informe um telefone válido.");
  });

  it("normaliza e monta o payload no contrato do portal", () => {
    expect(
      buildPhonePayload({ ddi: 55, ddd: "11", numero: "98765-4321" }),
    ).toBe("55-11-987654321");
    expect(parsePhonePayload("+55 (11) 98765-4321", countries)).toEqual({
      ddi: 55,
      ddd: "11",
      numero: "987654321",
    });
  });

  it("mantém largura total no wrapper e permite ocultar bandeiras", () => {
    const html = renderToStaticMarkup(
      <Formik
        initialValues={{ telefone: { ddi: 55, ddd: "11", numero: "987654321" } }}
        onSubmit={() => undefined}
      >
        <form>
          <InputPhone
            name="telefone"
            label="Telefone"
            countries={countries}
            className="w-full"
            showFlags={false}
          />
        </form>
      </Formik>,
    );

    expect(html).toContain("field-control-slot");
    expect(html).toContain("w-full min-w-0");
    expect(html).toContain("+55");
    expect(html).not.toContain("h-5 w-7");
  });

  it("mantém as bandeiras por padrão", () => {
    const html = renderToStaticMarkup(
      <Formik
        initialValues={{ telefone: { ddi: 55, ddd: "11", numero: "987654321" } }}
        onSubmit={() => undefined}
      >
        <form>
          <InputPhone name="telefone" countries={countries} />
        </form>
      </Formik>,
    );

    expect(html).toContain("h-5 w-7");
  });
});
