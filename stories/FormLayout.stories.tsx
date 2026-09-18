import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterBar, FormActions, FormGrid } from "../src";

const meta = {
  title: "Design System/FormLayout",
  component: FormGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof FormGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

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
