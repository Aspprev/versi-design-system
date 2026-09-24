import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  DocumentItem,
  FormErrorNavigation,
  InfoGrid,
  InfoItem,
  InputStandalone,
  PageHeading,
  PageTabsHeader,
  SkipLink,
  StatusBadge,
} from "../../src";

describe("lote B/C do design system standalone", () => {
  it("mantém a anatomia semântica de cabeçalho, informações e status", () => {
    const html = renderToStaticMarkup(
      <>
        <PageHeading
          title="Meu benefício"
          subtitle="Confira seus dados"
          back={{ label: "Voltar", href: "/inicio" }}
        />
        <InfoGrid columns={2}>
          <InfoItem label="Situação" value="Ativo" />
          <InfoItem label="Saldo" value="R$ 10,00" numeric />
        </InfoGrid>
        <StatusBadge tone="success" appearance="solid">
          Ativo
        </StatusBadge>
      </>,
    );

    expect(html).toContain("<h1");
    expect(html).toContain('href="/inicio"');
    expect(html).toContain("<dl");
    expect(html).toContain(">Situação</dt>");
    expect(html).toContain("<dd");
    expect(html).toContain("Ativo");
    expect(html).toContain("bg-feedback-success-strong");
  });

  it("preserva slots e estados do item documental", () => {
    const html = renderToStaticMarkup(
      <DocumentItem
        title="Comprovante"
        description="Arquivo necessário"
        details={[{ label: "Tipo", value: "PDF" }]}
        status={<StatusBadge tone="warning">Pendente</StatusBadge>}
        actions={<button type="button">Anexar</button>}
      />,
    );

    expect(html).toContain("Comprovante");
    expect(html).toContain("Arquivo necessário");
    expect(html).toContain("Tipo");
    expect(html).toContain("Pendente");
    expect(html).toContain('type="button"');
  });

  it("mantém títulos longos flexíveis e o texto completo no atributo title", () => {
    const html = renderToStaticMarkup(
      <PageTabsHeader
        title="Contracheques e histórico de pagamentos disponíveis"
        tabs={[
          { id: "benefit", label: "Meu benefício" },
          { id: "statements", label: "Contracheques" },
        ]}
        activeTab="statements"
        onTabChange={() => undefined}
      />,
    );

    expect(html).toContain("w-full min-w-0 tablet:flex-1");
    expect(html).toContain("block w-full min-w-0 overflow-hidden text-ellipsis");
    expect(html).toContain("tablet:truncate tablet:whitespace-nowrap");
    expect(html).toContain("tablet:shrink-0");
    expect(html).toContain(
      'title="Contracheques e histórico de pagamentos disponíveis"',
    );
  });

  it("permite configurar o destino do skip link e mantém os recursos C server-safe", () => {
    const html = renderToStaticMarkup(
      <>
        <SkipLink targetId="conteudo" label="Ir para o conteúdo" />
        <FormErrorNavigation />
      </>,
    );

    expect(html).toContain('href="#conteudo"');
    expect(html).toContain("Ir para o conteúdo");
    expect(html).not.toContain("Pular para o conteúdo");
  });

  it("mantém os estados acessíveis do InputStandalone", () => {
    const html = renderToStaticMarkup(
      <InputStandalone
        label="E-mail"
        type="email"
        error
        errorText="Informe um e-mail válido."
        helperText="Usaremos este e-mail para contato."
      />,
    );

    expect(html).toContain("<label");
    expect(html).toContain('for="');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("Informe um e-mail válido.");
    expect(html).toContain("Mais informações sobre E-mail");
  });
});
