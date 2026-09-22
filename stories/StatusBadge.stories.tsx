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

export const Outline: Story = { args: { tone: "info", appearance: "outline" } };
export const SoftWarning: Story = { args: { tone: "warning", appearance: "soft" } };
export const SolidSuccess: Story = { args: { tone: "success", appearance: "solid" } };
export const SolidDanger: Story = { args: { children: "Cancelado", tone: "danger", appearance: "solid" } };
export const Truncated: Story = {
  args: {
    children: "Aguardando validaÃ§Ã£o do participante",
    tone: "warning",
    appearance: "soft",
    overflow: "truncate",
  },
};

export const DomainStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <DomainStatusBadge status="Ativo" domain="beneficiary" />
      <DomainStatusBadge status="Pendente" />
      <DomainStatusBadge status="" empty="placeholder" />
    </div>
  ),
};

