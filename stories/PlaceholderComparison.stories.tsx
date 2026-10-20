import { useId, useState } from "react";
import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import { InputPhone, InputSelect, InputStandalone, SelectMulti, TextArea } from "../src";
import "./placeholder-comparison.css";

const options = [
  { label: "Plano Básico", value: "basico" },
  { label: "Plano Especial", value: "especial" },
];

function FieldState({ filled, disabled }: { filled: boolean; disabled: boolean }) {
  const id = useId();
  const phoneName = `${id}-phone`;
  const selectName = `${id}-select`;
  const notesName = `${id}-notes`;
  const [name, setName] = useState(filled ? "Maria da Silva" : "");
  const [selected, setSelected] = useState<string[]>(filled ? ["basico"] : []);

  return (
    <fieldset className="min-w-0 border-t border-border-default pt-4">
      <legend className="px-1 text-sm font-semibold text-content-primary">
        {filled ? "Preenchido" : "Vazio"} · {disabled ? "desabilitado" : "habilitado"}
      </legend>
      <Formik
        initialValues={{
          [phoneName]: { ddi: 55, ddd: filled ? "11" : "", numero: filled ? "987654321" : "" },
          [selectName]: filled ? "basico" : "",
          [notesName]: filled ? "Cadastro atualizado conforme solicitado." : "",
        }}
        onSubmit={() => undefined}
      >
        <div className="flex min-w-0 flex-col gap-5">
          <InputStandalone name={`${id}-name`} label="Nome completo" placeholder="Digite seu nome" value={name} onChange={(event) => setName(event.target.value)} disabled={disabled} />
          <InputPhone name={phoneName} label="Telefone" placeholder="(11) 99999-9999" disabled={disabled} />
          <InputSelect name={selectName} label="Plano" placeholder="Selecione um plano" options={options} disabled={disabled} />
          <SelectMulti name={`${id}-multi`} label="Planos de interesse" options={options} value={selected} disabled={disabled}
            onChange={(event) => {
              const { value, checked } = event.target;
              setSelected((current) => checked ? [...current, value] : current.filter((item) => item !== value));
            }}
            onReset={() => setSelected([])}
          />
          <TextArea name={notesName} label="Observações" placeholder="Digite uma observação" rows={3} disabled={disabled} />
        </div>
      </Formik>
    </fieldset>
  );
}

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
  title: "Components/Forms/PlaceholderComparison",
  component: PlaceholderComparison,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PlaceholderComparison>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Comparison: Story = {};
