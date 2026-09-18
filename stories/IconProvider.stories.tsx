import { MdCheck, MdFavorite } from "react-icons/md";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconProvider } from "../src";

const meta = {
  title: "Design System/IconProvider",
  component: IconProvider,
  tags: ["autodocs"],
  args: { children: null },
} satisfies Meta<typeof IconProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <IconProvider>
      <div className="flex items-center gap-4 text-content-link">
        <MdFavorite aria-label="Favorito" size={24} />
        <MdCheck aria-label="Concluído" size={24} />
      </div>
    </IconProvider>
  ),
};
