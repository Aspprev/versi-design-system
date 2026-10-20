import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, FormActions, FormGrid, InputStandalone, Surface, Typography, Notice } from "../../src";

function BasicForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attempted, setAttempted] = useState(false);
  const nameError = attempted && !name.trim();
  const emailError = attempted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <Surface tone="card" padding="default" elevation="sm" className="mx-auto w-full max-w-2xl">
      <Typography element="h1" semanticRole="section-title">Atualizar cadastro</Typography>
      <Typography variant="secondary" className="mt-2">Uma composição simples de formulário usando componentes do DS.</Typography>
      <form noValidate onReset={() => { setName(""); setEmail(""); setAttempted(false); setSubmitted(false); }} onSubmit={event => { event.preventDefault(); setAttempted(true); setSubmitted(Boolean(name.trim()) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)); }} className="mt-6">
        <FormGrid columns={2}>
          <InputStandalone label="Nome completo" name="name" placeholder="Maria da Silva" value={name} onChange={event => { setName(event.target.value); setSubmitted(false); }} error={nameError} errorText="Informe seu nome completo." />
          <InputStandalone label="E-mail" name="email" type="email" placeholder="maria@example.com" value={email} onChange={event => { setEmail(event.target.value); setSubmitted(false); }} error={emailError} errorText="Informe um e-mail válido." />
        </FormGrid>
      <FormGrid columns={2} className="mt-4"><InputStandalone label="Cidade" placeholder="Sua cidade" /><InputStandalone label="Profissão" placeholder="Sua profissão" /></FormGrid>
      <FormActions align="end" className="mt-6">
        <Button type="reset" variant="outline">Cancelar</Button>
        <Button type="submit">{submitted ? "Salvo" : "Salvar"}</Button>
      </FormActions>
      {submitted && <Notice type="success" className="mt-4">Cadastro validado nesta demonstração.</Notice>}
      </form>
    </Surface>
  );
}

const meta = {
  title: "Patterns/Forms",
  tags: ["autodocs"],
  component: BasicForm,
  parameters: { docs: { description: { component: "Composição demonstrativa; não é um novo componente do pacote." } } },
} satisfies Meta<typeof BasicForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {
  name: "Formulário básico",};
