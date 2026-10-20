import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldState } from "./shared/FieldState";
import "./placeholder-comparison.css";


function PlaceholderExamples({ title, color }: { title: string; color?: string }) {
  const style = color ? {
    "--comparison-placeholder": color,
  } as CSSProperties : undefined;
  return (
    <section style={style} className={`${color ? "placeholder-reference " : ""}min-w-0 rounded-sm border border-border-default bg-field-surface p-4`}>
      <h2 className="mb-6 text-lg font-semibold text-content-primary">{title}</h2>
      <div className="flex flex-col gap-6">
        <FieldState filled={false} disabled={false} />
        <FieldState filled disabled={false} />
        <FieldState filled={false} disabled />
        <FieldState filled disabled />
      </div>
    </section>
  );
}

function PlaceholderComparison() {
  return (
    <main className="mx-auto w-full max-w-[1600px] p-4">
      <h1 className="mb-2 text-xl font-bold text-content-primary">Cor dos placeholders</h1>
      <p className="mb-2 text-content-secondary">Compare a cor atual, uma opção intermediária e a cor do protótipo nos quatro estados de cada campo.</p>
      <p className="mb-6 text-sm text-content-secondary">Tema claro aplicado: placeholder #A1A8B0, vazio desabilitado #B2B8C0 e preenchido desabilitado #626B76. Tema escuro aplicado: placeholder #707C8A, vazio desabilitado #5B6775 e preenchido desabilitado #AEB9C4; as colunas de referência mantêm o placeholder anterior #BEC7D0. O protótipo #C9CED4 é uma referência apenas para o tema claro. No alto contraste escuro: placeholder #757575 sobre #000000 (4,56:1) e vazio desabilitado #9B9B9B sobre #333333 (4,55:1).</p>
      <div className="grid min-w-0 grid-cols-1 gap-6 desktop:grid-cols-3">
        <PlaceholderExamples title="Anterior" color="105, 105, 105" />
        <PlaceholderExamples title="Aplicado" />
        <PlaceholderExamples title="Referência do protótipo" color="201, 206, 212" />
      </div>
    </main>
  );
}

const meta = {
  id: "components-forms-placeholdercomparison",
  title: "Laboratory/Forms/PlaceholderComparison",
  component: PlaceholderComparison,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PlaceholderComparison>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Comparison: Story = {
  name: "Comparação",};
