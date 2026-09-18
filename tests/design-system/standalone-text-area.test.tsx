import { Formik } from "formik";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TextArea from "../../src/components/textArea/TextArea";

describe("TextArea standalone", () => {
  it("associa o rótulo ao textarea e renderiza ajuda", () => {
    const html = renderToStaticMarkup(
      <Formik initialValues={{ observacao: "" }} onSubmit={() => undefined}>
        <form>
          <TextArea
            name="observacao"
            label="Observação"
            helperText="Inclua informações complementares."
            placeholder="Digite uma observação"
          />
        </form>
      </Formik>,
    );

    expect(html).toContain("<label");
    expect(html).toContain('for="observacao"');
    expect(html).toContain('id="observacao"');
    expect(html).toContain("Inclua informações complementares.");
    expect(html).toContain('placeholder="Digite uma observação"');
  });

  it("anuncia erro do Formik e marca o campo como inválido", () => {
    const html = renderToStaticMarkup(
      <Formik
        initialValues={{ observacao: "" }}
        initialErrors={{ observacao: "Informe uma observação válida." }}
        initialTouched={{ observacao: true }}
        onSubmit={() => undefined}
      >
        <form>
          <TextArea name="observacao" label="Observação" />
        </form>
      </Formik>,
    );

    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="observacao-error"');
    expect(html).toContain('role="alert"');
    expect(html).toContain("Informe uma observação válida.");
  });

  it("mantém os slots de prefixo, sufixo e ícone", () => {
    const html = renderToStaticMarkup(
      <Formik initialValues={{ observacao: "" }} onSubmit={() => undefined}>
        <TextArea
          name="observacao"
          prefix="Nota"
          suffix="máx. 500"
          icon={() => <span data-testid="icon">i</span>}
        />
      </Formik>,
    );

    expect(html).toContain("Nota");
    expect(html).toContain("máx. 500");
    expect(html).toContain('data-testid="icon"');
  });
});
