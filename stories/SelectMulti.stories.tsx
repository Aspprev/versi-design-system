import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SelectMulti,
  type SelectMultiOption,
  type SelectMultiProps,
} from "../src";

const options: SelectMultiOption[] = [
  { label: "Plano Básico", value: "basico" },
  { label: "Plano Especial", value: "especial" },
  { label: "Plano de Aposentadoria", value: "aposentadoria" },
];

const meta = {
  title: "Components/Forms/SelectMulti",
  component: SelectMulti,
  tags: ["autodocs"],
  args: {
    name: "planos",
    label: "Planos de interesse",
    options,
  },
} satisfies Meta<typeof SelectMulti>;

export default meta;
type Story = StoryObj<typeof meta>;

function SelectMultiForm({
  initialValue = [],
  ...selectMultiProps
}: SelectMultiProps & { initialValue?: string[] }) {
  const [selected, setSelected] = useState(initialValue);

  return (
    <form className="max-w-xl">
      <SelectMulti
        {...selectMultiProps}
        value={selected}
        onChange={(event) => {
          const nextValue = event.target.value;
          setSelected((current) =>
            event.target.checked
              ? [...current, nextValue]
              : current.filter((value) => value !== nextValue),
          );
        }}
        onReset={() => setSelected([])}
      />
    </form>
  );
}

export const Default: Story = {
  render: (args) => <SelectMultiForm {...args} />,
};

export const Selected: Story = {
  render: (args) => (
    <SelectMultiForm {...args} initialValue={["basico", "especial"]} />
  ),
};

export const Error: Story = {
  args: { error: "Selecione ao menos uma opção." },
  render: (args) => <SelectMultiForm {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <SelectMultiForm {...args} initialValue={["especial"]} />
  ),
};

