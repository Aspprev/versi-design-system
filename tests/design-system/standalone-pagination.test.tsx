import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Pagination, Table } from "../../src";

const headers = [
  { key: "name", title: "Nome", accessor: (item: { name: string }) => item.name },
];

const rows = Array.from({ length: 15 }, (_, index) => ({
  name: `Participante ${index + 1}`,
}));

function expectSharedPaginationHeight(html: string) {
  expect(html).toContain("box-border h-7 min-h-7");
  expect(html).not.toContain("min-h-11");
  expect(html).not.toContain("tablet:h-7");
}

describe("altura consistente da paginação", () => {
  it("mantém a mesma altura no Pagination standalone, inclusive com perPage diferente", () => {
    const html = renderToStaticMarkup(
      <Pagination
        currentPage={2}
        totalResults={17}
        perPage={5}
        onClick={() => undefined}
      />,
    );

    expectSharedPaginationHeight(html);
    expect(html).toContain("Anterior");
    expect(html).toContain("Próxima");
    expect(html).toContain('aria-current="page"');
  });

  it("mantém a mesma altura na paginação interna do Table", () => {
    const html = renderToStaticMarkup(
      <Table
        header={headers}
        data={rows}
        itemsPerPage={5}
        showPagination
        paginationVariant="arrows"
        accessibleName="Participantes"
      />,
    );

    expectSharedPaginationHeight(html);
    expect(html).toContain('aria-label="Ir para a página anterior"');
    expect(html).toContain('aria-label="Ir para a próxima página"');
    expect(html).toContain(">1</div>");
  });

  it("permite controles somente com setas e itens menores", () => {
    const html = renderToStaticMarkup(
      <Pagination
        currentPage={2}
        totalResults={17}
        perPage={5}
        size="small"
        variant="arrows"
        onClick={() => undefined}
      />,
    );

    expect(html).toContain("box-border h-6 min-h-6");
    expect(html).toContain("w-6");
    expect(html).not.toContain("Anterior");
    expect(html).not.toContain("Próxima");
    expect(html).toContain('aria-label="Ir para a página anterior"');
    expect(html).toContain('aria-label="Ir para a próxima página"');
  });
  it("repassa o tamanho pequeno para a paginação interna do Table", () => {
    const html = renderToStaticMarkup(
      <Table
        header={headers}
        data={rows}
        itemsPerPage={5}
        showPagination
        paginationSize="small"
        paginationVariant="arrows"
        accessibleName="Participantes"
      />,
    );

    expect(html).toContain("box-border h-6 min-h-6");
    expect(html).toContain("w-6");
    expect(html).not.toContain("box-border h-7 min-h-7");
  });

  it("aceita tamanho e variante na paginacao controlada do Table", () => {
    const html = renderToStaticMarkup(
      <Table
        header={headers}
        showPagination
        pagination={{
          currentPage: 2,
          totalPages: 4,
          totalItems: 20,
          startItem: 6,
          endItem: 10,
          onPrevious: () => undefined,
          onNext: () => undefined,
          size: "small",
          variant: "arrows",
        }}
        accessibleName="Participantes"
      />,
    );

    expect(html).toContain("box-border h-6 min-h-6");
    expect(html).toContain("w-6");
    expect(html).not.toContain("Anterior");
    expect(html).not.toContain("PrÃ³xima");
  });
});
