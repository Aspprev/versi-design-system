import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "../src";

const meta = {
  title: "Design System/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  render: (args) => {
    const targetRef = useRef<HTMLButtonElement>(null);
    const [visible, setVisible] = useState(true);
    return (
      <div className="flex min-h-40 items-center justify-center">
        <button ref={targetRef} type="button" className="rounded-sm bg-action-primary px-4 py-2 font-bold text-action-primary-content" onClick={() => setVisible((current) => !current)}>
          Alternar tooltip
        </button>
        <Tooltip {...args} targetRef={targetRef} visible={visible} content="Informação complementar" />
      </div>
    );
  },
  args: { content: "Informação complementar", visible: true, targetRef: { current: null } },
};
