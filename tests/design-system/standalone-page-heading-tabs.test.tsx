import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PageHeading, PageTabsHeader } from "../../src";

describe("layout estrutural de PageHeading e PageTabsHeader", () => {
  it("mantem titulo simples, longo, subtitle e actions visiveis", () => {
    const html = renderToStaticMarkup(
      <div className="flex w-full min-w-0 max-w-md">
        <PageHeading
          title="Historico de atendimentos e solicitacoes disponiveis no portal"
          subtitle="Confira os dados mais recentes."
          actions={<button type="button">Acao</button>}
        />
      </div>,
    );

    expect(html).toContain('class="flex w-full min-w-0');
    expect(html).toContain('class="w-full min-w-0 tablet:flex-1"');
    expect(html).toContain('class="flex w-full min-w-0 items-center gap-4"');
    expect(html).toContain(
      'class="font-nunito text-content-primary text-2xl font-extrabold block w-full min-w-0 overflow-hidden text-ellipsis tablet:truncate tablet:whitespace-nowrap"',
    );
    expect(html).toContain(
      'title="Historico de atendimentos e solicitacoes disponiveis no portal"',
    );
    expect(html).toContain("Confira os dados mais recentes.");
    expect(html).toContain(">Acao</button>");
  });

  it("mantem duas e tres abas em wrappers flexiveis com min-w-0", () => {
    const twoTabs = renderToStaticMarkup(
      <div className="flex w-full min-w-0 max-w-2xl">
        <PageTabsHeader
          title="Meu beneficio"
          tabs={[
            { id: "benefit", label: "Meu beneficio" },
            { id: "history", label: "Historico" },
          ]}
          activeTab="benefit"
          onTabChange={() => undefined}
        />
      </div>,
    );
    const threeTabs = renderToStaticMarkup(
      <PageTabsHeader
        title="Historico de atendimentos e informacoes do meu beneficio"
        tabs={[
          { id: "benefit", label: "Meu beneficio" },
          { id: "statements", label: "Contracheques" },
          { id: "history", label: "Ficha financeira" },
        ]}
        activeTab="history"
        onTabChange={() => undefined}
        size="small"
      />,
    );

    expect(twoTabs).toContain('class="flex w-full min-w-0');
    expect(twoTabs).toContain('class="w-full min-w-0 tablet:flex-1"');
    expect(twoTabs).toContain("tablet:w-fit tablet:shrink-0");
    expect(twoTabs.match(/role="tab"/g)).toHaveLength(2);
    expect(threeTabs.match(/role="tab"/g)).toHaveLength(3);
    expect(threeTabs).toContain(
      'title="Historico de atendimentos e informacoes do meu beneficio"',
    );
  });
});
