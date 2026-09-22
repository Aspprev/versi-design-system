import type { Meta, StoryObj } from "@storybook/react-vite";
import { OtpCodeInput } from "../src";

const meta = {
  title: "Components/Forms/OtpCodeInput",
  component: OtpCodeInput,
  args: { label: "Código enviado por e-mail", length: 6 },
  parameters: { a11y: { disable: false } },
} satisfies Meta<typeof OtpCodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = { args: { error: true, errorText: "Informe o código completo." } };
export const Disabled: Story = { args: { disabled: true, value: "123456" } };
export const EightCharacters: Story = { args: { length: 8, mask: "alphanumeric" } };
