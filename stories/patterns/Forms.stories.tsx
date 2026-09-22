import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, FormActions, FormGrid, InputStandalone, Surface, Typography } from "../../src";

function BasicForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <Surface tone="card" padding="default" elevation="sm" className="mx-auto w-full max-w-2xl">
      <Typography element="h1" semanticRole="section-title">Atualizar cadastro</Typography>
      <Typography variant="secondary" className="mt-2">Uma composição simples de formulário usando componentes do DS.</Typography>
      <div className="mt-6">
        <FormGrid columns={2}>
          <InputStandalone label="Nome completo" name="name" placeholder="Maria da Silva" />
          <InputStandalone label="E-mail" name="email" type="email" placeholder="maria@example.com" />
        </FormGrid>
      </div>
      <FormActions align="end" className="mt-6">
        <Button type="button" variant="outline">Cancelar</Button>
        <Button type="button" onClick={() => setSubmitted(true)}>{submitted ? "Salvo" : "Salvar"}</Button>
      </FormActions>
    </Surface>
  );
}

const meta = {
  title: "Patterns/Forms",
  component: BasicForm,
  parameters: { docs: { description: { component: "Composição demonstrativa; não é um novo componente do pacote." } } },
} satisfies Meta<typeof BasicForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {};
