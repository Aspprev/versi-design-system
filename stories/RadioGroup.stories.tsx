import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import { RadioGroup } from "../src";

const meta = {
  title: "Components/Forms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  args: {
    name: "tipo",
    options: [
      { label: "Aposentadoria normal", value: "normal" },
      { label: "Aposentadoria especial", value: "especial" },
    ],
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Padrão",
  render: (args) => (
    <Formik initialValues={{ tipo: "normal" }} onSubmit={() => undefined}>
      <RadioGroup {...args} name="tipo" label="Tipo de benefício" />
    </Formik>
  ),
};

export const Error: Story = {
  name: "Erro",
  render: (args) => (
    <Formik
      initialValues={{ tipo: "" }}
      initialErrors={{ tipo: "Selecione um tipo de benefício." }}
      initialTouched={{ tipo: true }}
      onSubmit={() => undefined}
    >
      <RadioGroup {...args} name="tipo" label="Tipo de benefício" />
    </Formik>
  ),
};


export const Disabled: Story = { ...Default, name: "Desabilitado", args: { disabled: true } };
