import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingDots } from "../src";

const meta = {
  title: "Design System/LoadingDots",
  component: LoadingDots,
  tags: ["autodocs"],
  args: { color: "primary", ariaLabel: "Carregando conteúdo" },
} satisfies Meta<typeof LoadingDots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Announced: Story = { args: { announce: true } };
export const Decorative: Story = { args: { announce: false } };
export const FullContainer: Story = { args: { fullContainer: true } };

