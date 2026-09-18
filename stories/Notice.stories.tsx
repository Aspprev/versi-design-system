import type { Meta, StoryObj } from "@storybook/react-vite";
import { Notice } from "../src";

const meta = {
  title: "Design System/Notice",
  component: Notice,
  tags: ["autodocs"],
  args: { children: "Conteúdo configurável do aviso." },
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { type: "info" } };
export const WarningDefault: Story = { args: { type: "warning", textColor: "default" } };
export const WarningColor: Story = { args: { type: "warning", textColor: "color" } };
export const Danger: Story = { args: { type: "danger", rounded: true } };

