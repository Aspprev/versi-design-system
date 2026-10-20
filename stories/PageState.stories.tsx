import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageState } from "../src";

const meta = {
  title: "Components/Feedback/PageState",
  component: PageState,
  tags: ["autodocs"],
  args: {
    title: "Nenhum resultado encontrado",
    description: "A descrição do estado pode orientar a próxima ação.",
    variant: "empty",
  },
} satisfies Meta<typeof PageState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  name: "Vazio",};
export const Error: Story = {
  name: "Erro", args: { variant: "error", title: "Não foi possível carregar" } };
export const WithRetry: Story = {
  name: "Com nova tentativa", args: { onRetry: () => undefined } };

