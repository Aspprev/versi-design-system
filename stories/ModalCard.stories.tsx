import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModalCard, Typography } from "../src";

const meta = {
  title: "Design System/ModalCard",
  component: ModalCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ModalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ModalCard>
      <Typography semanticRole="section-title" element="h2">
        Cartão de modal
      </Typography>
      <Typography semanticRole="body">
        Conteúdo configurável do cartão.
      </Typography>
    </ModalCard>
  ),
};

