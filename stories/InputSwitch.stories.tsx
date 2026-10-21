import { useArgs } from "storybook/preview-api";
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

export const Playground: Story = {
  name: "Interativo",
  render: (args) => { const [, updateArgs] = useArgs(); return <InputSwitch {...args} onChange={checked => { args.onChange?.(checked); updateArgs({ checked }); }} />; },
};

export const Variants: Story = {
  name: "Variantes",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-5">
      <InputSwitch aria-label="Primário" defaultEnable variant="primary" />
      <InputSwitch aria-label="Secundário" defaultEnable variant="secondary" />
      <InputSwitch aria-label="Com contrato" defaultEnable variant="contract" />
      <InputSwitch aria-label="Tema" defaultEnable variant="theme" />
      <InputSwitch aria-label="Notificações" icon={MdNotifications} />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { "aria-label": "Desabilitado", disabled: true, checked: true },
};

export const ExternalLabel: Story = {
  name: "Rótulo externo",
  render: () => (
    <div className="flex flex-col gap-2">
      <span id="input-switch-label">Receber notificações</span>
      <span id="input-switch-help" className="text-sm text-content-secondary">
        Ativa os avisos do sistema.
      </span>
      <InputSwitch
        aria-labelledby="input-switch-label"
        aria-describedby="input-switch-help"
      />
    </div>
  ),
};


