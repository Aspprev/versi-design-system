import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  InteractiveDonutChart,
  TimeRangeSelector,
  TimeSeriesChart,
} from "../src";

const seriesOptions = {
  chart: { id: "design-system-series" },
  xaxis: { categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] },
  legend: { position: "bottom" as const },
};

const meta = {
  title: "Components/Data Display/Chart",
  component: TimeSeriesChart,
  tags: ["autodocs"],
  args: {
    type: "line",
    height: 280,
    width: "100%",
    ariaLabel: "Evolução do saldo",
    options: seriesOptions,
    series: [{ name: "Saldo", data: [12, 18, 16, 24, 27, 31] }],
  },
} satisfies Meta<typeof TimeSeriesChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TimeSeries: Story = {
  args: {
    type: "line",
    height: 280,
    width: "100%",
    ariaLabel: "Evolução do saldo",
    options: seriesOptions,
    series: [
      { name: "Saldo", data: [12, 18, 16, 24, 27, 31] },
      { name: "Meta", data: [10, 14, 18, 21, 25, 28] },
    ],
  },
};

export const Donut: Story = {
  render: () => (
    <InteractiveDonutChart
      height={280}
      width="100%"
      ariaLabel="Distribuição dos investimentos"
      options={{ labels: ["Básico", "Especial", "Normal"] }}
      series={[48, 32, 20]}
      valueFormatter={(value) => `${value}%`}
    />
  ),
};

export const TimeRanges: Story = {
  render: () => {
    const options = ["6 meses", "1 ano", "5 anos"] as const;
    const [selected, setSelected] = useState<(typeof options)[number]>(options[1]);

    return (
      <TimeRangeSelector
        options={options}
        selected={selected}
        onSelect={(range) => setSelected(range as (typeof options)[number])}
        ariaLabel="Período do gráfico"
      />
    );
  },
};
