import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import { Input, type InputProps } from "../src";

const meta = {
  title: "Components/Forms/Input/Formik",
  component: Input,
  tags: ["autodocs"],
  args: {
    name: "email",
    label: "E-mail",
    placeholder: "seuemail@exemplo.com",
    type: "email",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

type FormikInputExampleProps = InputProps & {
  initialValue?: string;
  initialError?: string;
  initialTouched?: boolean;
};

function FormikInputExample({
  initialValue = "",
  initialError,
  initialTouched = false,
  ...inputProps
}: FormikInputExampleProps) {
  return (
    <Formik
      initialValues={{ [inputProps.name]: initialValue }}
      initialErrors={initialError ? { [inputProps.name]: initialError } : {}}
      initialTouched={
        initialTouched ? { [inputProps.name]: true } : {}
      }
      onSubmit={() => undefined}
    >
      <form className="max-w-xl">
        <Input {...inputProps} />
      </form>
    </Formik>
  );
}

export const Empty: Story = {
  render: (args) => <FormikInputExample {...args} />,
};

export const Filled: Story = {
  render: (args) => (
    <FormikInputExample {...args} initialValue="participante@exemplo.com" />
  ),
};

export const ValidationError: Story = {
  render: (args) => (
    <FormikInputExample
      {...args}
      initialError="Informe um e-mail válido."
      initialTouched
    />
  ),
};

export const MaskedCurrency: Story = {
  args: {
    name: "contribuicao",
    label: "Valor da contribuição",
    mask: "currency",
    prefix: "R$",
    type: undefined,
  },
  render: (args) => (
    <FormikInputExample {...args} initialValue="125000" />
  ),
};
