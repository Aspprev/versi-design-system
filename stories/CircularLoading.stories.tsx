import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircularLoading } from "../src";

const meta = {
  title: "Design System/CircularLoading",
  component: CircularLoading,
  tags: ["autodocs"],
} satisfies Meta<typeof CircularLoading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithMessage: Story = {
  args: { size: 56, color: "primary", message: "Carregando dados..." },
};
export const WithoutTrack: Story = {
  args: {
    size: 40,
    color: "success",
    withTrack: false,
    ariaLabel: "Processando",
  },
};
