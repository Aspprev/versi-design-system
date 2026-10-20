import { useState } from "react";
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

export const Error: Story = {
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

export const Options: Story = {
  render: () => {
    const [value, setValue] = useState("basica");

    return (
      <Checkbox
        options={options}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        layout="col"
        name="contribuicao"
      />
    );
  },
};

