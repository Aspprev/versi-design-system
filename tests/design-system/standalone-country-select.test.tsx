import { Formik } from "formik";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SelectCountry from "../../src/components/selectCountry/SelectCountry";

const countries = [
  { label: "Brasil", value: "BR", cca2: "BR" },
  { label: "Estados Unidos", value: "US", cca2: "US" },
];

describe("SelectCountry standalone", () => {
  it("renderiza o país selecionado com conteúdo de bandeira", () => {
    const html = renderToStaticMarkup(
      <Formik initialValues={{ pais: "BR" }} onSubmit={() => undefined}>
        <form>
          <SelectCountry
            name="pais"
            label="País de residência"
            placeholder="Selecione um país"
            options={countries}
          />
        </form>
      </Formik>,
    );

    expect(html).toContain("<label");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("Brasil");
    expect(html).toContain('data:image/svg+xml;base64,');
    expect(html).toContain('data-has-value="true"');
    expect(html).toContain('aria-labelledby="');
  });

  it("preserva busca, nome acessível e anúncio de erro", () => {
    const html = renderToStaticMarkup(
      <Formik
        initialValues={{ pais: "" }}
        initialErrors={{ pais: "Selecione um país para continuar." }}
        initialTouched={{ pais: true }}
        onSubmit={() => undefined}
      >
        <form>
          <SelectCountry
            name="pais"
            options={countries}
            searchable
            searchPlaceholder="Busque um país"
          />
        </form>
      </Formik>,
    );

    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('role="alert"');
    expect(html).toContain("Selecione um país para continuar.");
  });

  it("usa o placeholder quando não há seleção", () => {
    const html = renderToStaticMarkup(
      <Formik initialValues={{ pais: "" }} onSubmit={() => undefined}>
        <SelectCountry
          name="pais"
          placeholder="Escolha o país"
          options={countries}
        />
      </Formik>,
    );

    expect(html).toContain("Escolha o país");
    expect(html).toContain("Nenhuma opção selecionada");
  });
});
