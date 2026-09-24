import { useEffect, useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputStandalone } from "../src";

const meta = {
  title: "Components/Forms/InputStandalone",
  component: InputStandalone,
  tags: ["autodocs"],
  args: {
    label: "CPF",
    placeholder: "000.000.000-00",
    mask: "cpf",
  },
} satisfies Meta<typeof InputStandalone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Masked: Story = {};

export const Currency: Story = {
  args: {
    label: "Valor da contribuição",
    mask: "currency",
    prefix: "R$",
    value: "125000",
    helperText: "Informe o valor sem os separadores.",
  },
};

export const Password: Story = {
  args: {
    label: "Senha",
    mask: undefined,
    type: "password",
    autoComplete: "current-password",
  },
};

export const Error: Story = {
  args: {
    label: "E-mail",
    mask: undefined,
    type: "email",
    error: true,
    errorText: "Informe um e-mail válido.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Número da inscrição",
    mask: undefined,
    value: "123456",
    disabled: true,
  },
};

function FormatterPlayground(
  args: ComponentProps<typeof InputStandalone>,
) {
  const [value, setValue] = useState(String(args.value ?? ""));

  useEffect(() => {
    setValue(String(args.value ?? ""));
  }, [args.value]);

  return (
    <InputStandalone
      {...args}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

export const GenericFormatter: Story = {
  args: {
    label: "Código formatado",
    mask: undefined,
    value: "",
    formatter: (value) => {
      const compact = value.replace(/\D/g, "").slice(0, 10);
      if (compact.length <= 4) return compact;
      return `${compact.slice(0, 4)}-${compact.slice(4)}`;
    },
    helperText: "Digite, cole e edite para observar a preservação do cursor.",
  },
  render: (args) => <FormatterPlayground {...args} />,
};
