import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputSlider } from "../src";

const meta = { title: "Components/Forms/InputSlider", component: InputSlider, tags: ["autodocs"], args: { name: "idade", start: 20, end: 70, initialValue: 60, functionChange: () => undefined } } satisfies Meta<typeof InputSlider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  render: () => {
    const [, setValue] = useState(60);
    return <InputSlider name="idade" start={20} end={70} initialValue={60} functionChange={setValue} showInput showLabel prefix="" sufix=" anos" />;
  },
};

