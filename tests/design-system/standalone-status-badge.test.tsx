import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DomainStatusBadge, StatusBadge } from "../../src";

describe("StatusBadge standalone", () => {
  it("mantem o contrato visual de tom, aparencia e tamanho", () => {
    const html = renderToStaticMarkup(
      <StatusBadge tone="success" appearance="solid" size="sm">
        Ativo
      </StatusBadge>,
    );

    expect(html).toContain("bg-feedback-success-strong");
    expect(html).toContain("text-xs");
    expect(html).toContain("Ativo");
  });

  it("resolve status de dominio e trata valores vazios", () => {
    const html = renderToStaticMarkup(
      <>
        <DomainStatusBadge status="Pendente" />
        <DomainStatusBadge status="" empty="placeholder" placeholder="Sem status" />
      </>,
    );

    expect(html).toContain("bg-feedback-warning-soft");
    expect(html).toContain("Sem status");
  });

  it("oculta status vazio quando configurado com a politica padrao", () => {
    expect(renderToStaticMarkup(<DomainStatusBadge status="" />)).toBe("");
  });
});
