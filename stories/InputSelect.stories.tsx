import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import { InputSelect, type InputSelectProps } from "../src";

const options = [
  { label: "Plano Básico", value: "basico" },
  { label: "Plano Especial", value: "especial" },
  { label: "Plano de Aposentadoria", value: "aposentadoria" },
];

const searchableOptions = [
  ...options,
  ...Array.from({ length: 9 }, (_, index) => ({
    label: `Opção adicional ${index + 1}`,
    value: `opcao-${index + 1}`,
  })),
];

const meta = {
  title: "Components/Forms/InputSelect",
  component: InputSelect,
  tags: ["autodocs"],
  args: {
    name: "plano",
    label: "Plano previdenciário",
    placeholder: "Selecione uma opção",
    options,
  },
} satisfies Meta<typeof InputSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

function SelectForm({
  initialValue = "",
  initialError,
  initialTouched = false,
  ...inputProps
}: InputSelectProps & {
  initialValue?: string;
  initialError?: string;
  initialTouched?: boolean;
}) {
  return (
    <Formik
      initialValues={{ [inputProps.name]: initialValue }}
      initialErrors={initialError ? { [inputProps.name]: initialError } : {}}
      initialTouched={initialTouched ? { [inputProps.name]: true } : {}}
      onSubmit={() => undefined}
    >
      <form className="max-w-xl">
        <InputSelect {...inputProps} />
      </form>
    </Formik>
  );
}

export const Default: Story = {
  name: "Padrão",
  render: (args) => <SelectForm {...args} />,
};

export const Selected: Story = {
  name: "Selecionado",
  render: (args) => <SelectForm {...args} initialValue="especial" />,
};

export const Searchable: Story = {
  name: "Com busca",
  args: {
    options: searchableOptions,
    searchable: true,
    searchPlaceholder: "Busque por nome",
    noOptionsText: "Nenhum plano encontrado",
  },
  render: (args) => <SelectForm {...args} />,
};

export const Error: Story = {
  name: "Erro",
  render: (args) => (
    <SelectForm
      {...args}
      initialError="Selecione um plano para continuar."
      initialTouched
    />
  ),
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true },
  render: (args) => <SelectForm {...args} initialValue="basico" />,
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
  parameters: { docs: { description: { story: "Use options: [{ title, options: [{ label, value }] }]. Os títulos não são selecionáveis; os values devem ser únicos em toda a lista. A busca filtra opções e títulos de seção. Grupos sem resultados ficam ocultos. Listas simples continuam funcionando." } } },
  render: (args) => <SelectForm {...args} />,
};
export const GroupedSearchable: Story = {
  ...Grouped, name: "Seções com busca", args: { ...Grouped.args, searchable: true },
};
