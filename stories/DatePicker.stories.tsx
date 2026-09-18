import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import { DatePicker, type DatePickerProps } from "../src";

const meta = {
  title: "Design System/DatePicker",
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
  render: (args) => <DatePickerForm {...args} />,
};

export const Filled: Story = {
  render: (args) => (
    <DatePickerForm {...args} initialValue={new Date(1991, 7, 26)} />
  ),
};

export const WithHelperText: Story = {
  args: { helperText: "Informe a data no formato dia/mês/ano." },
  render: (args) => <DatePickerForm {...args} />,
};

export const DropdownNavigation: Story = {
  args: { navigationVariant: "dropdown" },
  render: (args) => <DatePickerForm {...args} />,
};

export const Error: Story = {
  render: (args) => (
    <DatePickerForm
      {...args}
      initialError="Informe uma data válida."
      initialTouched
    />
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <DatePickerForm {...args} initialValue={new Date(1991, 7, 26)} />
  ),
};
