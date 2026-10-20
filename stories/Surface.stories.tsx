import type { Meta, StoryObj } from "@storybook/react-vite";
import { Surface } from "../src";

const meta = {
  title: "Components/Layout/Surface",
  component: Surface,
  tags: ["autodocs"],
  args: { children: "Conteúdo da superfície", tone: "card" },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  name: "Cartão",};
export const Subtle: Story = {
  name: "Suave", args: { tone: "subtle", elevation: "none" } };
export const FeedbackWarning: Story = {
  name: "Superfície de aviso", args: { tone: "warning" } };

