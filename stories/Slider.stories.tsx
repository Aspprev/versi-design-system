import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "../src";

const meta = { title: "Design System/Slider", component: Slider, tags: ["autodocs"], args: { min: 0, max: 100, step: 5, ariaLabel: "Percentual de contribuição", getAriaValueText: (value: number) => `${value}%` } } satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithMarks: Story = {
  render: () => {
    const [value, setValue] = useState(35);
    return <div className="max-w-xl"><Slider min={0} max={100} step={5} value={value} onChange={setValue} marks={[0, 25, 50, 75, 100]} ariaLabel="Percentual de contribuição" getAriaValueText={(current) => `${current}%`} /></div>;
  },
};
