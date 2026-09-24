import { useEffect, useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputSlider } from "../src";

const meta = {
  title: "Components/Forms/InputSlider",
  component: InputSlider,
  tags: ["autodocs"],
  args: {
    name: "idade",
    start: 20,
    end: 70,
    initialValue: 60,
    functionChange: () => undefined,
  },
} satisfies Meta<typeof InputSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

function InputSliderPlayground(args: ComponentProps<typeof InputSlider>) {
  const [value, setValue] = useState(args.initialValue);

  useEffect(() => {
    setValue(args.initialValue);
  }, [args.initialValue]);

  return (
    <div className="flex w-full max-w-xl flex-col gap-2 p-4">
      <InputSlider
        key={`${args.name}-${args.start}-${args.end}-${args.initialValue}`}
        {...args}
        functionChange={setValue}
      />
      <output className="text-sm text-content-secondary">Valor atual: {value}</output>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <InputSliderPlayground {...args} />,
};

export const WithInput: Story = {
  args: {
    showInput: true,
    showLabel: true,
    suffix: " anos",
  },
  render: (args) => <InputSliderPlayground {...args} />,
};

export const LegacySufix: Story = {
  args: {
    showLabel: true,
    sufix: " anos",
  },
  parameters: {
    docs: {
      description: {
        story: "Alias legado mantido somente durante a migracao para suffix.",
      },
    },
  },
  render: (args) => <InputSliderPlayground {...args} />,
};
