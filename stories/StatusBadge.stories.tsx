import type { Meta, StoryObj } from "@storybook/react-vite";
import { DomainStatusBadge, StatusBadge } from "../src";

const meta = {
  title: "Components/Feedback/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  args: { children: "Em andamento" },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = { args: { color: "blue", appearance: "outline" } };
export const SoftWarning: Story = { args: { color: "yellow", appearance: "soft" } };
export const SolidSuccess: Story = { args: { color: "green", appearance: "solid" } };
export const SolidDanger: Story = { args: { children: "Cancelado", color: "red", appearance: "solid" } };
export const Truncated: Story = {
  args: {
    children: "Aguardando validação do participante",
    color: "orange",
    appearance: "soft",
    overflow: "truncate",
  },
};

export const DomainStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <DomainStatusBadge
        status="Ativo"
        statusMap={{ Ativo: { color: "green", appearance: "solid" } }}
      />
      <DomainStatusBadge
        status="Pendente"
        statusMap={{ Pendente: { color: "yellow", appearance: "soft" } }}
      />
      <DomainStatusBadge status="" empty="placeholder" />
    </div>
  ),
};

export const ConsumerStatusMap: Story = {
  render: () => (
    <DomainStatusBadge
      status="Em revisao"
      statusMap={{
        "Em revisao": { color: "blue", appearance: "soft" },
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "O consumidor pode fornecer seu mapa de status sem adicionar regras de negócio ao Design System.",
      },
    },
  },
};

export const ClientStatusMap: Story = {
  render: () => {
    const statusMap = {
      "EM ANÁLISE": { color: "blue", appearance: "solid" },
      DEFERIDO: { color: "green", appearance: "solid" },
      "EM PROCESSAMENTO": { color: "orange", appearance: "solid" },
      "EXIGÊNCIA PENDENTE": { color: "yellow", appearance: "solid" },
      INDEFERIDO: { color: "red", appearance: "solid" },
      CANCELADO: { color: "slate", appearance: "solid" },
      ARQUIVADO: { color: "black", appearance: "solid" },
      "STATUS DO CLIENTE": { color: "primary", appearance: "outline" },
    } as const;

    return (
      <div className="flex flex-wrap gap-2">
        {Object.keys(statusMap).map((status) => (
          <DomainStatusBadge key={status} status={status} statusMap={statusMap} />
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Cada portal define seus nomes e associações; o Design System fornece apenas a paleta fechada.",
      },
    },
  },
};

