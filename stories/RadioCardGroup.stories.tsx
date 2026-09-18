import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioCardGroup } from "../src";

const meta = { title: "Design System/RadioCardGroup", component: RadioCardGroup, tags: ["autodocs"], args: { options: [{ value: "monthly", title: "Renda mensal", description: "Recebimento recorrente." }, { value: "single", title: "Pagamento único", description: "Resgate em uma parcela." }] } } satisfies Meta<typeof RadioCardGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plans: Story = {
  render: () => {
    const [value, setValue] = useState("monthly");
    return <RadioCardGroup label="Forma de recebimento" value={value} onChange={setValue} columnsClassName="grid-cols-2" options={[{ value: "monthly", title: "Renda mensal", description: "Recebimento recorrente." }, { value: "single", title: "Pagamento Ãºnico", description: "Resgate em uma parcela." }]} />;
  },
};

