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

export const Default: Story = {
  name: "Padrão",};

export const WithSubtitleAndBack: Story = {
  name: "Subtítulo e voltar",
  args: {
    title: "Dados pessoais",
    subtitle: "Confira e atualize seus dados.",
    back: { label: "Voltar", href: "#" },
  },
};

export const WithActions: Story = {
  name: "Com ações",
  args: {
    title: "Minhas solicitacoes",
    actions: (
      <button type="button" className="rounded-sm bg-action-primary px-4 py-2 font-bold text-action-primary-content">
        Nova solicitacao
      </button>
    ),
  },
};

export const LongTitle: Story = {
  name: "Título longo",
  args: {
    title: "Histórico de atendimentos e solicitações disponíveis no portal",
  },
};

export const FlexibleLimitedWidth: Story = {
  name: "Largura limitada",
  args: {
    title: "Meu benefício",
    subtitle: "Confira os dados do seu benefício.",
  },
  render: (args) => (
    <div className="flex w-full min-w-0 max-w-md">
      <PageHeading {...args} />
    </div>
  ),
};
