import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SelectMulti,
  Modal,
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
  const [selected, setSelected] = useState<string[]>(Array.isArray(selectMultiProps.value) ? [...selectMultiProps.value] : initialValue);
  useEffect(() => { if (Array.isArray(selectMultiProps.value)) setSelected([...selectMultiProps.value]); }, [selectMultiProps.value]);

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
  name: "Padrão",
  render: (args) => <SelectMultiForm {...args} />,
};

export const Selected: Story = {
  name: "Selecionado",
  render: (args) => (
    <SelectMultiForm {...args} initialValue={["basico", "especial"]} />
  ),
};

export const Error: Story = {
  name: "Erro",
  args: { error: "Selecione ao menos uma opção." },
  render: (args) => <SelectMultiForm {...args} />,
};

export const Disabled: Story = {
  name: "Desabilitado",
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
  name: "Resumo da seleção",
  render: () => <ResponsiveSelectionExample />,
  parameters: {
    docs: {
      description: {
        story: "Mostra os nomes selecionados que cabem no campo e +N para os restantes. A última etiqueta visível pode usar reticências para aproveitar o espaço restante. A seleção completa fica no texto acessível e no título ao passar o mouse. Ajuste a largura, altere as opções e use o X para limpar.",
      },
    },
  },
};


export const Grouped: Story = {
  name: "Com seções",
  args: {
    options: [
      { title: "Planos previdenciários", options },
      { title: "Benefícios adicionais", options: [
        { label: "Auxílio saúde", value: "saude" },
        { label: "Auxílio educação", value: "educacao" },
      ] },
    ],
  },
  render: (args) => <SelectMultiForm {...args} />,
  parameters: { docs: { description: { story: "options aceita a lista simples ou [{ title, options: [{ label, value }] }]. Os values devem ser únicos em toda a lista; os títulos não são selecionáveis. O resumo continua exibindo os nomes escolhidos." } } },
};

export const SelectionLimits: Story = {
  ...Grouped,
  name: "Mínimo e máximo de seleção",
  args: { ...Grouped.args, minSelected: 1, maxSelected: 3 },
  render: (args) => <SelectMultiForm {...args} initialValue={["basico"]} />,
  parameters: { docs: { description: { story: "minSelected impede remover a última seleção ao atingir o mínimo e desabilita limpar tudo quando maior que zero. maxSelected bloqueia novas marcações ao atingir o máximo. Ambos são opcionais e valem para a lista inteira. Valores externos não são alterados: um formulário inicialmente vazio ainda precisa validar o mínimo no envio. Limites são inteiros não negativos; máximo menor que mínimo assume o mínimo." } } },
};

export const NearViewportEdge: Story = {
  name: "Próximo ao rodapé",
  ...{ args: Grouped.args },
  render: (args) => <div style={{ minHeight: "140vh", paddingTop: "75vh" }}><SelectMultiForm {...args} /><button type="button">Próximo campo</button></div>,
};
function ModalSelectExample(args: SelectMultiProps) {
  const [open, setOpen] = useState(false);
  return <><button type="button" onClick={() => setOpen(true)}>Abrir seleção em modal</button>
    <Modal isOpen={open} onClose={() => setOpen(false)} title="Selecionar benefícios">
      <div className="max-h-32 overflow-auto"><SelectMultiForm {...args} /></div>
    </Modal></>;
}
export const InsideModal: Story = {
  name: "Dentro de modal", args: Grouped.args,
  render: (args) => <ModalSelectExample {...args} />,
};
