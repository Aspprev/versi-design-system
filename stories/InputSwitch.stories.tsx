import { MdNotifications } from "react-icons/md";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputSwitch } from "../src";

const meta = {
  title: "Components/Forms/InputSwitch",
  component: InputSwitch,
  tags: ["autodocs"],
  args: { "aria-label": "Alternador", checked: false },
} satisfies Meta<typeof InputSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-5">
      <InputSwitch aria-label="Primário" defaultEnable variant="primary" />
      <InputSwitch aria-label="Secundário" defaultEnable variant="secondary" />
      <InputSwitch aria-label="Terciário" defaultEnable variant="tertiary" />
      <InputSwitch aria-label="Com contrato" defaultEnable variant="contract" />
      <InputSwitch aria-label="Tema" defaultEnable variant="theme" />
      <InputSwitch aria-label="Notificações" icon={MdNotifications} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { "aria-label": "Desabilitado", disabled: true, checked: true },
};


