import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../src";

const meta = {
  title: "Components/Actions/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Ação de exemplo" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FlatPrimary: Story = {
  name: "Principal", args: { variant: "flat", color: "primary" } };
export const OutlineSecondary: Story = {
  name: "Contorno secundário", args: { variant: "outline", color: "secondary" } };
export const PlainPrimary: Story = {
  name: "Sem fundo", args: { variant: "plain", color: "primary" } };
export const Loading: Story = {
  name: "Carregando", args: { loading: true, loadingLabel: "Carregando ação" } };
export const Disabled: Story = {
  name: "Desabilitado", args: { disabled: true } };

