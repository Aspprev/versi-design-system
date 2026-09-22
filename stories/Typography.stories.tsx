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

export const PageTitle: Story = { args: { semanticRole: "page-title", element: "h1" } };
export const SectionTitle: Story = { args: { semanticRole: "section-title", element: "h2" } };
export const Body: Story = { args: { semanticRole: "body", element: "p" } };
export const Helper: Story = { args: { semanticRole: "helper", element: "small" } };

