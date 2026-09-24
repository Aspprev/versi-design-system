import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeading } from "../src";

const meta = {
  title: "Components/Layout/PageHeading",
  component: PageHeading,
  tags: ["autodocs"],
  args: { title: "Meu cadastro" },
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSubtitleAndBack: Story = {
  args: {
    title: "Dados pessoais",
    subtitle: "Confira e atualize seus dados.",
    back: { label: "Voltar", href: "#" },
  },
};

export const WithActions: Story = {
  args: {
    title: "Minhas solicitacoes",
    actions: (
      <button type="button" className="rounded-sm bg-action-primary px-4 py-2 font-bold text-action-primary-content">
        Nova solicitacao
      </button>
    ),
  },
};
