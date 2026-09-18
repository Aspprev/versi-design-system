import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SelectMulti from "../../src/components/selectMulti/SelectMulti";

const options = [
  { label: "Plano Básico", value: "basico" },
  { label: "Plano Especial", value: "especial" },
];

describe("SelectMulti standalone", () => {
  it("associa o rótulo ao acionador e anuncia a seleção", () => {
    const html = renderToStaticMarkup(
      <SelectMulti
        name="planos"
        label="Planos de interesse"
        options={options}
        value={["especial"]}
        onChange={() => undefined}
      />,
    );

    expect(html).toContain("<label");
    expect(html).toContain('for="');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("1 opção selecionada");
    expect(html).toContain('aria-describedby=');
  });

  it("marca o acionador e a mensagem quando há erro", () => {
    const html = renderToStaticMarkup(
      <SelectMulti
        name="planos"
        label="Planos de interesse"
        options={options}
        error="Selecione ao menos uma opção."
        onChange={() => undefined}
      />,
    );

    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('role="alert"');
    expect(html).toContain("Selecione ao menos uma opção.");
  });

  it("usa nome acessível quando não há rótulo visível", () => {
    const html = renderToStaticMarkup(
      <SelectMulti
        name="planos"
        options={options}
        disabled
        onChange={() => undefined}
      />,
    );

    expect(html).toContain('aria-label="Selecionar opções"');
    expect(html).toContain("disabled");
  });
});
