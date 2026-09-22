import type { Meta, StoryObj } from "@storybook/react-vite";
import { DocumentItem, StatusBadge } from "../src";

const meta = {
  title: "Components/Documents/DocumentItem",
  component: DocumentItem,
  tags: ["autodocs"],
} satisfies Meta<typeof DocumentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {
  args: {
    title: "Comprovante de residência",
    description: "Arquivo PDF ou imagem com data de emissão recente.",
    details: [{ label: "Obrigatoriedade", value: "Obrigatório" }],
    status: (
      <StatusBadge tone="warning" appearance="soft">
        Pendente
      </StatusBadge>
    ),
    actions: (
      <button
        type="button"
        className="rounded-sm bg-action-primary px-4 py-2 font-bold text-action-primary-content"
      >
        Anexar
      </button>
    ),
  },
};

export const Subtle: Story = {
  args: {
    title: "Documento assinado",
    label: "Declaração",
    variant: "subtle",
    details: [
      { label: "Enviado em", value: "09/09/2026" },
      { label: "Arquivo", value: "declaracao.pdf" },
    ],
    status: (
      <StatusBadge tone="success" appearance="solid">
        Assinado
      </StatusBadge>
    ),
    actions: (
      <button
        type="button"
        className="rounded-sm border-2 border-action-primary px-4 py-2 font-bold"
      >
        Baixar
      </button>
    ),
  },
};
