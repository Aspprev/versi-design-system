import type { Meta, StoryObj } from "@storybook/react-vite";
import { BoletoBarCode } from "../src";

const meta = {
  title: "Components/Documents/BoletoBarCode",
  component: BoletoBarCode,
  tags: ["autodocs"],
} satisfies Meta<typeof BoletoBarCode>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: { linhaDigitavel: "00190500954014481606906809350314337370000000100" },
};

export const ConfigurableSize: Story = {
  args: {
    linhaDigitavel: "00190500954014481606906809350314337370000000100",
    width: 3,
    height: 96,
    quietZone: 4,
  },
};

export const Error: Story = {
  args: {
    linhaDigitavel: "00190500954014481606906809350314337370000000100",
    error: "Código indisponível.",
  },
};
