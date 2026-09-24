import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeSeriesChart } from "../src";

const seriesOptions = {
  chart: { id: "design-system-series" },
  xaxis: { categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] },
  legend: { position: "bottom" as const },
};

const meta = {
  title: "Components/Data Display/TimeSeriesChart",
  component: TimeSeriesChart,
  tags: ["autodocs"],
  args: {
    type: "line",
    height: 280,
    width: "100%",
    ariaLabel: "Evolucao do saldo",
    options: seriesOptions,
    series: [{ name: "Saldo", data: [12, 18, 16, 24, 27, 31] }],
  },
} satisfies Meta<typeof TimeSeriesChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    series: [
      { name: "Saldo", data: [12, 18, 16, 24, 27, 31] },
      { name: "Meta", data: [10, 14, 18, 21, 25, 28] },
    ],
  },
};

export const Loading: Story = {
  args: { series: [], loading: true, loadingMessage: "Carregando dados..." },
};

export const Error: Story = {
  args: { series: [], error: "Nao foi possivel carregar os dados." },
};

export const Empty: Story = {
  args: { series: [], emptyMessage: "Nenhum dado no periodo selecionado." },
};
