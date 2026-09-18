import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../src";

const options = [
  { label: "Básica", value: "basica" },
  { label: "Especial", value: "especial" },
  { label: "Normal", value: "normal" },
];

const meta = {
  title: "Design System/Checkbox",
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

