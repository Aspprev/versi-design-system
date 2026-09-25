import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import { TextArea, type TextAreaProps } from "../src";

const meta = {
  title: "Components/Forms/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  args: {
    name: "observacao",
    label: "Observação",
    placeholder: "Digite uma observação",
    rows: 4,
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

function TextAreaForm({
  initialValue = "",
  initialError,
  initialTouched = false,
  ...textAreaProps
}: TextAreaProps & {
  initialValue?: string;
  initialError?: string;
  initialTouched?: boolean;
}) {
  return (
    <Formik
      initialValues={{ [textAreaProps.name]: initialValue }}
      initialErrors={initialError ? { [textAreaProps.name]: initialError } : {}}
      initialTouched={initialTouched ? { [textAreaProps.name]: true } : {}}
      onSubmit={() => undefined}
    >
      <form className="max-w-xl">
        <TextArea {...textAreaProps} />
      </form>
    </Formik>
  );
}

export const Default: Story = {
  render: (args) => <TextAreaForm {...args} />,
};

export const Filled: Story = {
  render: (args) => (
    <TextAreaForm
      {...args}
    initialValue="A contribuição foi atualizada conforme solicitado."
    />
  ),
};

export const WithHelperText: Story = {
  args: { helperText: "Use este campo para incluir informações complementares." },
  render: (args) => <TextAreaForm {...args} />,
};

export const Error: Story = {
  render: (args) => (
    <TextAreaForm
      {...args}
    initialError="Informe uma observação válida."
      initialTouched
    />
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <TextAreaForm {...args} initialValue="Campo bloqueado para edição." />
  ),
};

