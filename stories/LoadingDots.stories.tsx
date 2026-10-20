import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingDots } from "../src";

const meta = {
  title: "Components/Feedback/LoadingDots",
  component: LoadingDots,
  tags: ["autodocs"],
  args: { color: "primary", ariaLabel: "Carregando conteúdo" },
} satisfies Meta<typeof LoadingDots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Announced: Story = {
  name: "Com anúncio acessível", args: { announce: true } };
export const Decorative: Story = {
  name: "Decorativo", args: { announce: false } };
export const FullContainer: Story = {
  name: "No container", args: { fullContainer: true } };

