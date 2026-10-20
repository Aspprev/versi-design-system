import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "../src";

const meta = {
  title: "Components/Layout/Divider",
  component: Divider,
  tags: ["autodocs"],
  args: { bgColor: "dark" },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutLabel: Story = {
  name: "Sem rótulo",};
export const WithLabel: Story = {
  name: "Com rótulo", args: { children: "Seção" } };
export const Subtle: Story = {
  name: "Suave", args: { bgColor: "light" } };

