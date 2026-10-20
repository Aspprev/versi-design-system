import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextGroup } from "../src";

const meta = { title: "Components/Data Display/TextGroup", component: TextGroup, tags: ["autodocs"] } satisfies Meta<typeof TextGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Padrão", args: { title: "Participante", text: "Maria da Silva" } };
export const Empty: Story = {
  name: "Vazio", args: { title: "Valor não informado", text: "" } };

