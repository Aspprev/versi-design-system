import type { Meta, StoryObj } from "@storybook/react-vite";
import { Surface } from "../src";

const meta = {
  title: "Components/Layout/Surface",
  component: Surface,
  tags: ["autodocs"],
  args: { children: "Conteúdo da superfície", tone: "card" },
  argTypes: { brandAccent: { control: "select", options: [undefined, 1, 2, 3], description: "Detalhe opcional de marca com fundo suave e conteúdo legível. Não representa feedback." } },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  name: "Cartão",};
export const Subtle: Story = {
  name: "Suave", args: { tone: "subtle", elevation: "none" } };
export const FeedbackWarning: Story = {
  name: "Superfície de aviso", args: { tone: "warning" } };

export const BrandDetail: Story = {
  name: "Detalhe de marca",
  args: { brandAccent: 1, elevation: "none", children: "Detalhe opcional da identidade do cliente" },
};

