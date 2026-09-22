import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoGrid, InfoItem } from "../src";

const meta = {
  title: "Components/Data Display/InfoGrid",
  component: InfoGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof InfoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = {
  args: { columns: 3 },
  render: (args) => (
    <InfoGrid {...args}>
      <InfoItem label="Participante" value="Maria da Silva" />
      <InfoItem label="Situação" value="Ativo" />
      <InfoItem label="Salário aplicável" value="R$ 11.102,15" numeric />
    </InfoGrid>
  ),
};

export const MetricAndOptional: Story = {
  render: () => (
    <InfoGrid columns={2}>
      <InfoItem
        label="Saldo projetado"
        value="R$ 398.279,24"
        variant="metric"
        numeric
      />
      <InfoItem
        label="Data de referência"
        value={null}
        optional="placeholder"
      />
      <InfoItem label="Dado indisponível" value="N/A" optional="hide" />
    </InfoGrid>
  ),
};
