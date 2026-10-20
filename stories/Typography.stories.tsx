import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "../src";

const meta = {
  title: "Components/Data Display/Typography",
  component: Typography,
  tags: ["autodocs"],
  args: { children: "Texto tipográfico" },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageTitle: Story = {
  name: "Título da página", args: { semanticRole: "page-title", element: "h1" } };
export const SectionTitle: Story = {
  name: "Título da seção", args: { semanticRole: "section-title", element: "h2" } };
export const Body: Story = {
  name: "Texto de leitura", args: { semanticRole: "body", element: "p" } };
export const Helper: Story = {
  name: "Texto de apoio", args: { semanticRole: "helper", element: "small" } };

