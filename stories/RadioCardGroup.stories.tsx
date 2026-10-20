import { useArgs } from "storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioCardGroup } from "../src";

const meta = { title: "Components/Forms/RadioCardGroup", component: RadioCardGroup, tags: ["autodocs"], args: { options: [{ value: "monthly", title: "Renda mensal", description: "Recebimento recorrente." }, { value: "single", title: "Pagamento único", description: "Resgate em uma parcela." }] } } satisfies Meta<typeof RadioCardGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plans: Story = {
  name: "Planos",
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();
    return <RadioCardGroup {...args} label="Forma de recebimento" value={value} onChange={value => updateArgs({ value })} columnsClassName="grid-cols-2" />;
  },
};


export const Disabled: Story = { name: "Desabilitado", args: { disabled: true, value: "monthly" } };
