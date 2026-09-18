import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  InteractiveDonutChart,
  TimeRangeSelector,
} from "../../src";

describe("Chart components standalone", () => {
  it("mantem seletor de periodo como grupo de botoes acessivel", () => {
    const html = renderToStaticMarkup(
      <TimeRangeSelector
        options={["6 meses", "1 ano"]}
        selected="1 ano"
        onSelect={() => undefined}
        ariaLabel="Periodo do grafico"
      />,
    );

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Periodo do grafico"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-pressed="false"');
  });

  it("renderiza fallback client side do donut sem quebrar SSR", () => {
    const html = renderToStaticMarkup(
      <InteractiveDonutChart
        series={[60, 40]}
        options={{ labels: ["Plano A", "Plano B"] }}
        ariaLabel="Distribuicao dos planos"
      />,
    );

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Distribuicao dos planos"');
    expect(html).toContain('role="status"');
    expect(html).toContain("Carregando grafico");
  });
});
