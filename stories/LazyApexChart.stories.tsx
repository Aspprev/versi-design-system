import type { Meta, StoryObj } from "@storybook/react-vite";
import { LazyApexChart, type ApexChartProps } from "../src";

const meta = {
  title: "Components/Data Display/Chart/LazyApexChart",
  component: LazyApexChart,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    type: "bar",
    height: 280,
    width: "100%",
    ariaLabel: "ContribuiÃ§Ãµes por mÃªs",
    options: {
      chart: {
        id: "design-system-lazy-chart",
        toolbar: { show: false },
      },
      xaxis: {
        categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      },
      dataLabels: { enabled: false },
      plotOptions: {
        bar: { borderRadius: 4, columnWidth: "48%" },
      },
    },
    series: [{ name: "ContribuiÃ§Ãµes", data: [12, 18, 16, 24, 27, 31] }],
  },
} satisfies Meta<typeof LazyApexChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Donut: Story = {
  args: {
    type: "donut",
    height: 300,
    ariaLabel: "DistribuiÃ§Ã£o das contribuiÃ§Ãµes",
    options: {
      labels: ["BÃ¡sica", "Especial", "Normal"],
      legend: { position: "bottom" },
    },
    series: [48, 32, 20],
  } satisfies Partial<ApexChartProps>,
};


