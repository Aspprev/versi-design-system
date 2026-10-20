import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircularLoading } from "../src";

const meta = {
  title: "Components/Feedback/CircularLoading",
  component: CircularLoading,
  tags: ["autodocs"],
} satisfies Meta<typeof CircularLoading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithMessage: Story = {
  name: "Com mensagem",
  args: { size: 56, color: "primary", message: "Carregando dados..." },
};
export const WithoutTrack: Story = {
  name: "Sem trilha",
  args: {
    size: 40,
    color: "success",
    withTrack: false,
    ariaLabel: "Processando",
  },
};
