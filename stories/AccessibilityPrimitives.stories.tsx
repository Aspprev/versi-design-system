import type { Meta, StoryObj } from "@storybook/react-vite";
import { FocusNavigationMode, FormErrorNavigation, SkipLink } from "../src";

const meta = {
  id: "design-system-accessibilityprimitives",
  title: "Components/Accessibility/Primitives",
  component: SkipLink,
  tags: ["autodocs"],
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SkipToContent: Story = {
  args: { targetId: "storybook-main", label: "Pular para o conteúdo" },
  render: (args) => (
    <div className="relative min-h-32">
      <SkipLink {...args} />
      <FocusNavigationMode />
      <FormErrorNavigation />
      <p id="storybook-main" className="pt-8">
        O link de salto fica visível ao receber foco.
      </p>
    </div>
  ),
};
