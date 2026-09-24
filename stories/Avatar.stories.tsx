import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../src";

const meta = {
  title: "Components/Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Ana Silva",
    size: "md",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Ana Silva" size="xs" />
      <Avatar name="Ana Silva" size="sm" />
      <Avatar name="Ana Silva" size="md" />
      <Avatar name="Ana Silva" size="lg" />
      <Avatar name="Ana Silva" size="xl" />
    </div>
  ),
};

export const WithoutName: Story = {
  render: () => <Avatar size="lg" aria-label="Participante sem nome" />,
};
