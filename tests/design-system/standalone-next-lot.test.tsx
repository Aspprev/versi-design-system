import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Avatar,
  BoletoBarCode,
  InputSlider,
  InteractiveDonutChart,
  TimeSeriesChart,
} from "../../src";

describe("contratos do próximo lote", () => {
  it("expõe suffix canônico no InputSlider e mantém o alias legado", () => {
    const html = renderToStaticMarkup(
      <InputSlider
        name="idade"
        start={20}
        end={70}
        initialValue={60}
        functionChange={() => undefined}
        showLabel
        suffix=" anos"
      />,
    );

    expect(html).toContain("60 anos");
  });

  it("expõe o tamanho xl reutilizável do Avatar", () => {
    const html = renderToStaticMarkup(<Avatar name="Ana Silva" size="xl" />);

    expect(html).toContain("w-[4rem] h-[4rem] text-[2rem]");
  });

  it("expõe estados genéricos de gráfico", () => {
    const loading = renderToStaticMarkup(
      <TimeSeriesChart
        options={{}}
        series={[]}
        ariaLabel="Evolução"
        loading
      />,
    );
    const error = renderToStaticMarkup(
      <InteractiveDonutChart
        series={[1]}
        ariaLabel="Distribuição"
        error="Falha ao carregar"
      />,
    );
    const empty = renderToStaticMarkup(
      <InteractiveDonutChart
        series={[]}
        ariaLabel="Distribuição"
        emptyMessage="Sem dados no período"
      />,
    );

    expect(loading).toContain('aria-busy="true"');
    expect(error).toContain('role="alert"');
    expect(empty).toContain("Sem dados no período");
  });

  it("permite quiet zone, dimensões e estado de erro no código de barras", () => {
    const html = renderToStaticMarkup(
      <BoletoBarCode
        linhaDigitavel="00190500954014481606906809350314337370000000100"
        width={3}
        height={96}
        quietZone={4}
        error="Código indisponível"
      />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("Código indisponível");
  });
});
