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


const renderStatus: NonNullable<Story["render"]> = (args) => <div className="flex flex-wrap gap-4">
  <Button {...args} variant="flat" />
  <Button {...args} variant="outline" />
  <Button {...args} variant="plain" />
  <Button {...args} variant="flat" loading />
  <Button {...args} variant="flat" disabled />
</div>;

export const Success: Story = {
  name: "Sucesso", args: { color: "success", children: "Confirmar" }, render: renderStatus,
};
export const Danger: Story = {
  name: "Perigo", args: { color: "danger", children: "Excluir" }, render: renderStatus,
};
export const Warning: Story = {
  name: "Aviso", args: { color: "warning", children: "Prosseguir com atenção" }, render: renderStatus,
};
