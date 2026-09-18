import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../src";

const meta = {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Ação de exemplo" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FlatPrimary: Story = { args: { variant: "flat", color: "primary" } };
export const OutlineSecondary: Story = { args: { variant: "outline", color: "secondary" } };
export const PlainPrimary: Story = { args: { variant: "plain", color: "primary" } };
export const Loading: Story = { args: { loading: true, loadingLabel: "Carregando ação" } };
export const Disabled: Story = { args: { disabled: true } };

