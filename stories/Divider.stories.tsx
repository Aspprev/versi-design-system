import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "../src";

const meta = {
  title: "Design System/Divider",
  component: Divider,
  tags: ["autodocs"],
  args: { bgColor: "dark" },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutLabel: Story = {};
export const WithLabel: Story = { args: { children: "Seção" } };
export const Subtle: Story = { args: { bgColor: "light" } };

