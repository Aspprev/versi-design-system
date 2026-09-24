import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeRangeSelector } from "../src";

const ranges = ["6 meses", "1 ano", "5 anos"] as const;
type Range = (typeof ranges)[number];

const meta = {
  title: "Components/Data Display/TimeRangeSelector",
  component: TimeRangeSelector,
  tags: ["autodocs"],
  args: {
    options: ranges,
    selected: "1 ano" as Range,
    ariaLabel: "Periodo do grafico",
    onSelect: () => undefined,
  },
} satisfies Meta<typeof TimeRangeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<Range>(args.selected as Range);

    return (
      <TimeRangeSelector
        {...args}
        selected={selected}
        onSelect={(range) => setSelected(range as Range)}
      />
    );
  },
};
