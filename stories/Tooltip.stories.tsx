import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs, useRef } from "storybook/preview-api";
import { Tooltip } from "../src";

const meta = {
  title: "Components/Overlay/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  name: "Visível e interativo",
  render: (args) => {
    const targetRef = useRef<HTMLButtonElement | null>(null);
    const [{ visible }, updateArgs] = useArgs();
    return (
      <div className="flex min-h-40 items-center justify-center">
        <button ref={targetRef} type="button" className="rounded-sm bg-action-primary px-4 py-2 font-bold text-action-primary-content" onClick={() => updateArgs({ visible: !visible })}>
          Alternar tooltip
        </button>
        <Tooltip {...args} targetRef={targetRef} visible={visible} />
      </div>
    );
  },
  args: { content: "Informação complementar", visible: true, targetRef: { current: null } },
};
