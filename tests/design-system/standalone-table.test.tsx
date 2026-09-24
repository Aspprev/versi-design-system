import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MobileCardTable, Table } from "../../src";

const data = [
  { id: 1, name: "Ana", status: "Ativa" },
  { id: 2, name: "Bruno", status: "Mantido" },
];

const header = [
  { key: "name", title: "Nome", accessor: (item: (typeof data)[number]) => item.name },
  { key: "status", title: "Situação", accessor: (item: (typeof data)[number]) => item.status },
];

describe("Table standalone", () => {
  it("renderiza tabela semântica com nome acessível, cabeçalho e dados", () => {
    const html = renderToStaticMarkup(
      <Table header={header} data={data} accessibleName="Participantes" />,
    );

    expect(html).toContain("<table");
    expect(html).toContain('aria-label="Participantes"');
    expect(html).toContain('scope="col"');
    expect(html).toContain("Ana");
    expect(html).toContain("Mantido");
  });

  it("aplica variantes e mantém mensagem de vazio", () => {
    const html = renderToStaticMarkup(
      <Table
        header={header}
        data={[]}
        emptyMessage="Nenhum participante encontrado"
        rowVariant="striped"
        density="compact"
        stickyHeader
      />,
    );

    expect(html).toContain('data-sticky-header="true"');
    expect(html).toContain('data-row-variant="striped"');
    expect(html).toContain('data-table-density="compact"');
    expect(html).toContain("Nenhum participante encontrado");
  });

  it("expõe loading e erro mantendo o contrato desktop/mobile", () => {
    const tableHtml = renderToStaticMarkup(
      <Table
        header={header}
        data={data}
        loading
        loadingMessage="Carregando participantes"
        errorMessage="Não foi possível carregar participantes"
      />,
    );
    const cardsHtml = renderToStaticMarkup(
      <MobileCardTable
        headers={[{ label: "Nome" }]}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderCard={(item) => <span>{item.name}</span>}
        errorMessage="Não foi possível carregar participantes"
      />,
    );

    expect(tableHtml).toContain('aria-busy="true"');
    expect(tableHtml).toContain("Carregando participantes");
    expect(cardsHtml).toContain('role="alert"');
    expect(cardsHtml).toContain("Não foi possível carregar participantes");
  });

  it("renderiza cartões móveis com região acessível e paginação", () => {
    const html = renderToStaticMarkup(
      <MobileCardTable
        headers={[{ label: "Nome" }]}
        data={Array.from({ length: 11 }, (_, index) => ({ id: index }))}
        accessibleName="Lista de participantes"
        keyExtractor={(item) => String(item.id)}
        renderCard={(item) => <span>Participante {item.id}</span>}
        itemsPerPage={10}
      />,
    );

    expect(html).toContain('role="region"');
    expect(html).toContain('aria-label="Lista de participantes"');
    expect(html).toContain('role="list"');
    expect(html).toContain("Visualizando de 1");
  });

  it("torna linhas e cartões alcançáveis por teclado sem perder a descrição", () => {
    const tableHtml = renderToStaticMarkup(
      <Table
        header={header}
        data={data}
        overflowMode="adaptive"
        itemsPerPage={0}
        accessibleName="Participantes responsivos"
      />,
    );
    const cardsHtml = renderToStaticMarkup(
      <MobileCardTable
        headers={[{ label: "Nome" }]}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderCard={(item) => <span>{item.name}</span>}
      />,
    );

    expect(tableHtml).toContain('data-responsive-mode="adaptive"');
    expect(tableHtml).toContain('<tr tabindex="0"');
    expect(tableHtml).toContain('aria-label="Linha 1 de 2"');
    expect(tableHtml).toContain('aria-describedby="');
    expect(cardsHtml).toContain('role="listitem"');
    expect(cardsHtml).toContain('tabindex="0"');
    expect(cardsHtml).toContain('aria-describedby="');
  });
});
