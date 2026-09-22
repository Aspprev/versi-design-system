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

  it("usa o modo responsivo do contêiner e não cria foco artificial nas linhas", () => {
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
    expect(tableHtml).not.toContain('<tr tabindex="0"');
    expect(cardsHtml).not.toContain('tabindex="0"');
  });
});
