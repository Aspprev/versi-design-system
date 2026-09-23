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
    expect(html).toContain('bg-surface-muted');
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

  it("oculta a bandeira sem reservar espaço quando showFlags é false", () => {
    const html = renderToStaticMarkup(
      <Formik initialValues={{ pais: "BR" }} onSubmit={() => undefined}>
        <SelectCountry
          name="pais"
          label="País"
          options={countries}
          showFlags={false}
          className="w-full"
        />
      </Formik>,
    );

    expect(html).toContain("Brasil");
    expect(html).toContain('class="field-layout flex w-full min-w-0');
    expect(html).not.toContain("h-5 w-7");
    expect(html).not.toContain("bg-surface-muted");
  });

  it("mantém as bandeiras por padrão", () => {
    const html = renderToStaticMarkup(
      <Formik initialValues={{ pais: "BR" }} onSubmit={() => undefined}>
        <SelectCountry name="pais" options={countries} />
      </Formik>,
    );

    expect(html).toContain("h-5 w-7");
  });
});
