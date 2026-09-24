import type { Meta, StoryObj } from "@storybook/react-vite";
import { InteractiveDonutChart } from "../src";

const meta = {
  title: "Components/Data Display/InteractiveDonutChart",
  component: InteractiveDonutChart,
  tags: ["autodocs"],
  args: {
    height: 280,
    width: "100%",
    ariaLabel: "Distribuicao dos investimentos",
    options: { labels: ["Basico", "Especial", "Normal"] },
    series: [48, 32, 20],
    valueFormatter: (value: number) => `${value}%`,
  },
} satisfies Meta<typeof InteractiveDonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { series: [], loading: true, loadingMessage: "Carregando dados..." },
};

export const Error: Story = {
  args: { series: [], error: "Nao foi possivel carregar os dados." },
};

export const Empty: Story = {
  args: { series: [], emptyMessage: "Nenhum dado no periodo selecionado." },
};
