import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OtpCodeInput } from "../src";

const meta = {
  title: "Components/Forms/OtpCodeInput",
  tags: ["autodocs"],
  component: OtpCodeInput,
  args: { label: "Código enviado por e-mail", length: 6 },
  parameters: { a11y: { disable: false } },
} satisfies Meta<typeof OtpCodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Padrão",};
export const Error: Story = {
  name: "Erro", args: { error: true, errorText: "Informe o código completo." } };
export const Disabled: Story = {
  name: "Desabilitado", args: { disabled: true, value: "123456" } };
export const EightCharacters: Story = {
  name: "Oito caracteres", args: { length: 8, mask: "alphanumeric" } };

export const Completion: Story = {
  name: "Preenchimento e conclusão",
  render: (args) => {
    const [completedValue, setCompletedValue] = useState<string>();
    const [completionCount, setCompletionCount] = useState(0);

    return (
      <div className="flex flex-col gap-3">
        <OtpCodeInput
          {...args}
          onComplete={(value) => {
            setCompletedValue(value);
            setCompletionCount((count) => count + 1);
          }}
        />
        <p role="status" aria-live="polite" className="text-sm text-content-secondary">
          {completedValue
            ? `Código completo: ${completedValue} (conclusões: ${completionCount})`
            : "Aguardando o código completo."}
        </p>
      </div>
    );
  },
};
