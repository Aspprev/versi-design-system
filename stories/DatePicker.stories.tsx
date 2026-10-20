import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import { DatePicker, type DatePickerProps } from "../src";

const meta = {
  title: "Components/Forms/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  args: {
    name: "dataNascimento",
    label: "Data de nascimento",
    placeholder: "dd/mm/aaaa",
    minDate: new Date(1950, 0, 1),
    maxDate: new Date(2035, 11, 31),
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function DatePickerForm({
  initialValue = "",
  initialError,
  initialTouched = false,
  ...datePickerProps
}: DatePickerProps & {
  initialValue?: string | Date | null;
  initialError?: string;
  initialTouched?: boolean;
}) {
  return (
    <Formik
      initialValues={{ [datePickerProps.name ?? "data"]: initialValue }}
      initialErrors={
        initialError
          ? { [datePickerProps.name ?? "data"]: initialError }
          : {}
      }
      initialTouched={
        initialTouched ? { [datePickerProps.name ?? "data"]: true } : {}
      }
      onSubmit={() => undefined}
    >
      <form className="max-w-xl">
        <DatePicker {...datePickerProps} />
      </form>
    </Formik>
  );
}

export const Default: Story = {
  name: "Padrão",
  render: (args) => <DatePickerForm {...args} />,
};

export const MonthSelection: Story = {
  name: "Seleção de mês",
  args: {
    label: "Mês de referência",
    name: "mesReferencia",
    placeholder: "mm/aaaa",
    selectionMode: "month",
    minDate: new Date(2024, 5, 15),
    maxDate: new Date(2024, 7, 31),
    helperText: "Selecione o mês de referência.",
  },
  render: (args) => (
    <DatePickerForm {...args} initialValue={new Date(2024, 6, 1)} />
  ),
};

export const Filled: Story = {
  name: "Preenchido",
  render: (args) => (
    <DatePickerForm {...args} initialValue={new Date(1991, 7, 26)} />
  ),
};

export const WithHelperText: Story = {
  name: "Com texto de ajuda",
  args: { helperText: "Informe a data no formato dia/mês/ano." },
  render: (args) => <DatePickerForm {...args} />,
};

export const DropdownNavigation: Story = {
  name: "Navegação do calendário",
  args: { navigationVariant: "dropdown" },
  render: (args) => <DatePickerForm {...args} />,
};

export const Error: Story = {
  name: "Erro",
  render: (args) => (
    <DatePickerForm
      {...args}
      initialError="Informe uma data válida."
      initialTouched
    />
  ),
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true },
  render: (args) => (
    <DatePickerForm {...args} initialValue={new Date(1991, 7, 26)} />
  ),
};

export const YearSelection: Story = {
  name: "Seleção de ano",
  args: {
    label: "Ano de referência",
    name: "anoReferencia",
    placeholder: "aaaa",
    selectionMode: "year",
    minDate: new Date(2020, 0, 1),
    maxDate: new Date(2030, 11, 31),
    helperText: "Selecione o ano de referência.",
  },
  render: (args) => <DatePickerForm {...args} />,
};
