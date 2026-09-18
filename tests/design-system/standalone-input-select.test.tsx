import { Formik } from "formik";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import InputSelect from "../../src/components/inputSelect/InputSelect";

describe("InputSelect standalone", () => {
  const options = [
    { label: "Plano Básico", value: "basico" },
    { label: "Plano Especial", value: "especial" },
  ];

  it("associa label, combobox e descrição do valor selecionado", () => {
    const html = renderToStaticMarkup(
      <Formik
        initialValues={{ plano: "especial" }}
        onSubmit={() => undefined}
      >
        <form>
          <InputSelect
            name="plano"
            label="Plano previdenciário"
            placeholder="Selecione"
            options={options}
          />
        </form>
      </Formik>,
    );

    expect(html).toContain("<label");
    expect(html).toContain('for="');
    expect(html).toContain('role="combobox"');
    expect(html).toContain("aria-labelledby=");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("Plano Especial");
    expect(html).toContain("Selecionado: Plano Especial");
  });

  it("anuncia erro do Formik e marca o campo como inválido", () => {
    const html = renderToStaticMarkup(
      <Formik
        initialValues={{ plano: "" }}
        initialErrors={{ plano: "Selecione uma opção válida." }}
        initialTouched={{ plano: true }}
        onSubmit={() => undefined}
      >
        <form>
          <InputSelect
            name="plano"
            label="Plano previdenciário"
            placeholder="Selecione"
            options={options}
          />
        </form>
      </Formik>,
    );

    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("Selecione uma opção válida.");
    expect(html).toContain('role="alert"');
  });

  it("identifica o controle por nome quando não há rótulo visível", () => {
    const html = renderToStaticMarkup(
      <Formik initialValues={{ plano: "" }} onSubmit={() => undefined}>
        <InputSelect
          name="plano"
          placeholder="Escolha o plano"
          options={options}
          searchable
        />
      </Formik>,
    );

    expect(html).toContain('aria-label="Escolha o plano"');
    expect(html).toContain('role="combobox"');
  });
});
