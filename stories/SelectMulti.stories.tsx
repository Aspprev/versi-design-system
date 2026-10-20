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

function ResponsiveSelectionExample() {
  const [width, setWidth] = useState(360);
  const summaryOptions = [
    { label: "Plano Básico", value: "basico" },
    { label: "Plano Especial", value: "especial" },
    { label: "Aposentadoria complementar", value: "aposentadoria" },
    { label: "Pensão por morte", value: "pensao" },
    { label: "Benefício proporcional diferido", value: "diferido" },
  ];
  return (
    <div className="w-full max-w-3xl">
      <label className="mb-4 flex flex-wrap items-center gap-2 text-content-primary">
        Largura do campo: {width}px
        <input type="range" min={180} max={720} value={width} onChange={(event) => setWidth(Number(event.target.value))} />
      </label>
      <div style={{ width, maxWidth: "100%" }}>
        <SelectMultiForm name="resumo" label="Benefícios selecionados" options={summaryOptions} initialValue={summaryOptions.map((option) => option.value)} />
      </div>
    </div>
  );
}

export const SelectedLabels: Story = {
  render: () => <ResponsiveSelectionExample />,
  parameters: {
    docs: {
      description: {
        story: "Mostra os nomes selecionados que cabem no campo e +N para os restantes. A última etiqueta visível pode usar reticências para aproveitar o espaço restante. A seleção completa fica no texto acessível e no título ao passar o mouse. Ajuste a largura, altere as opções e use o X para limpar.",
      },
    },
  },
};

