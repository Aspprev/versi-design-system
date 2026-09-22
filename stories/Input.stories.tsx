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
    label: "Valor da contribuiÃ§Ã£o",
    mask: "currency",
    prefix: "R$",
    value: "125000",
    helperText: "Informe o valor sem os separadores.",
  },
};

export const Password: Story = {
  args: {
    label: "Senha",
    type: "password",
    mask: undefined,
    autoComplete: "current-password",
  },
};

export const Error: Story = {
  args: {
    label: "E-mail",
    mask: undefined,
    type: "email",
    error: true,
    errorText: "Informe um e-mail vÃ¡lido.",
  },
};

export const Disabled: Story = {
  args: {
    label: "NÃºmero da inscriÃ§Ã£o",
    mask: undefined,
    value: "123456",
    disabled: true,
  },
};

