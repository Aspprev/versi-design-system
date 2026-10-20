import { useArgs } from "storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../src";
import FieldFrame from "../src/components/field/FieldFrame";

const options = [
  { label: "Básica", value: "basica" },
  { label: "Especial", value: "especial" },
  { label: "Normal", value: "normal" },
];

const meta = {
  title: "Components/Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    options,
    value: "basica",
    onChange: () => undefined,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Options: Story = {
  name: "Opções",
  render: (args) => {
    const [, updateArgs] = useArgs();
    return <Checkbox {...args} onChange={event => { updateArgs({ value: event.target.value }); }} layout="col" name="contribuicao" />;
  },
};

export const Error: Story = {
  name: "Erro",
  render: (args) => (
    <FieldFrame
      label="Contribuição"
      invalid
      message="Selecione uma opção de contribuição."
      messageId="checkbox-validation-error"
    >
      <Checkbox
        {...args}
        value=""
        layout="col"
        aria-invalid="true"
        aria-describedby="checkbox-validation-error"
      />
    </FieldFrame>
  ),
};

export const Disabled: Story = { name: "Desabilitado", args: { disabled: true } };
