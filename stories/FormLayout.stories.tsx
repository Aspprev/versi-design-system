import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FilterBar, FormActions, FormGrid, InputStandalone } from "../src";

const meta = {
  title: "Components/Forms/FormLayout",
  component: FormGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof FormGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

function RowGrowthExample() {
  const [showError, setShowError] = useState(true);
  return (
    <div className="w-full max-w-3xl">
      <label className="mb-4 flex min-h-7 cursor-pointer items-center gap-2">
        <input type="checkbox" className="checkbox-control" checked={showError} onChange={(event) => setShowError(event.target.checked)} />
        Mostrar erro de validação
      </label>
      <FormGrid columns={2} className="items-start">
        <InputStandalone name="row-growth-email" label="E-mail" placeholder="nome@exemplo.com" error={showError} errorText={showError ? "Informe um e-mail válido para receber as informações sobre seu cadastro." : undefined} />
        <InputStandalone name="row-growth-cpf" label="CPF" placeholder="000.000.000-00" />
        <InputStandalone name="row-growth-name" label="Nome" placeholder="Nome completo" />
        <InputStandalone name="row-growth-phone" label="Telefone" placeholder="(11) 99999-9999" />
      </FormGrid>
    </div>
  );
}

export const RowGrowth: Story = {
  render: () => <RowGrowthExample />,
  parameters: {
    docs: {
      description: {
        story: "Padrão recomendado: coloque os campos como filhos diretos do FormGrid, em ordem de linha. A mensagem aumenta a altura da linha inteira, mantendo os próximos campos alinhados, sem reservar espaço vazio. Consulte Patterns/FormValidation para as orientações completas.",
      },
    },
  },
};

const Field = ({ label }: { label: string }) => (
  <label className="flex min-w-0 flex-col gap-2 text-sm">
    <span className="font-semibold">{label}</span>
    <input
      aria-label={label}
      className="min-h-11 rounded-sm border border-field-border-default bg-field-surface px-3 text-field-content outline-none focus-visible:outline-2 focus-visible:outline-focus-ring"
      placeholder="Selecione"
    />
  </label>
);

export const TwoColumns: Story = {
  args: { columns: 2 },
  render: (args) => (
    <FormGrid {...args}>
      <Field label="Período inicial" />
      <Field label="Período final" />
    </FormGrid>
  ),
};

export const Actions: Story = {
  render: () => (
    <FormActions>
      <button
        type="button"
        className="rounded-sm border-2 border-action-primary px-4 py-2 font-bold"
      >
        Cancelar
      </button>
      <button
        type="button"
        className="rounded-sm bg-action-primary px-4 py-2 font-bold text-action-primary-content"
      >
        Aplicar filtros
      </button>
    </FormActions>
  ),
};

export const FilterBarExample: Story = {
  render: () => (
    <FilterBar
      filters={
        <>
          <Field label="Busca" />
          <Field label="Situação" />
        </>
      }
      actions={
        <button
          type="button"
          className="rounded-sm bg-action-primary px-4 py-2 font-bold text-action-primary-content"
        >
          Filtrar
        </button>
      }
      columns={2}
    />
  ),
};
