import { Formik } from "formik";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DatePicker from "../../src/components/datePicker/UnifiedDatePicker";

describe("DatePicker standalone", () => {
  it("associa o rótulo ao campo e formata o valor selecionado", () => {
    const html = renderToStaticMarkup(
      <Formik
        initialValues={{ dataNascimento: new Date(1991, 7, 26) }}
        onSubmit={() => undefined}
      >
        <form>
          <DatePicker
            name="dataNascimento"
            label="Data de nascimento"
            minDate={new Date(1950, 0, 1)}
            maxDate={new Date(2035, 11, 31)}
          />
        </form>
      </Formik>,
    );

    expect(html).toContain('<label for="dataNascimento"');
    expect(html).toContain('id="dataNascimento"');
    expect(html).toContain('type="text"');
    expect(html).toContain('value="26/08/1991"');
    expect(html).toContain('aria-label="Abrir calendario"');
  });

  it("prioriza a mensagem de erro do Formik sobre a ajuda", () => {
    const html = renderToStaticMarkup(
      <Formik
        initialValues={{ dataNascimento: "" }}
        initialErrors={{ dataNascimento: "Informe uma data válida." }}
        initialTouched={{ dataNascimento: true }}
        onSubmit={() => undefined}
      >
        <form>
          <DatePicker
            name="dataNascimento"
            label="Data de nascimento"
            helperText="Informe dia, mês e ano."
          />
        </form>
      </Formik>,
    );

    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="dataNascimento-error"');
    expect(html).toContain('role="alert"');
    expect(html).toContain("Informe uma data válida.");
    expect(html).not.toContain("Informe dia, mês e ano.");
  });

  it("aceita valor controlado fora do Formik", () => {
    const html = renderToStaticMarkup(
      <DatePicker
        name="dataInicio"
        label="Data de início"
        value={new Date(2024, 0, 15)}
      />,
    );

    expect(html).toContain('value="15/01/2024"');
    expect(html).toContain('for="dataInicio"');
  });

  it("expÃµe o modo de seleÃ§Ã£o por ano e associa a ajuda ao campo", () => {
    const html = renderToStaticMarkup(
      <DatePicker
        name="anoReferencia"
        ariaLabel="Ano de referência"
        label="Ano de referência"
        selectionMode="year"
        minDate={new Date(2020, 0, 1)}
        maxDate={new Date(2030, 11, 31)}
        helperText="Informe o ano do documento."
      />,
    );

    expect(html).toContain('aria-label="Ano de referência"');
    expect(html).toContain('maxLength="4"');
    expect(html).toContain('aria-describedby="anoReferencia-description"');
    expect(html).toContain("Informe o ano do documento.");
  });

  it("mantem isDisabled como alias compatÃ­vel de disabled", () => {
    const html = renderToStaticMarkup(
      <DatePicker name="data" isDisabled label="Data" />,
    );

    expect(html).toContain('disabled=""');
  });
});
