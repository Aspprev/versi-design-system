import { useId, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputStandalone } from "../src";
import "./validation-layout.css";

type Layout = "automatic" | "reserved" | "rows";

function LayoutExample({ layout, showError, longMessage }: {
  layout: Layout;
  showError: boolean;
  longMessage: boolean;
}) {
  const id = useId();
  const fields = [
    { label: "E-mail", placeholder: "nome@exemplo.com", invalid: true },
    { label: "CPF", placeholder: "000.000.000-00" },
    { label: "Nome", placeholder: "Nome completo" },
    { label: "Telefone", placeholder: "(11) 99999-9999" },
    { label: "Cidade", placeholder: "Sua cidade" },
    { label: "Estado", placeholder: "UF" },
  ];
  const renderField = (index: number) => {
    const field = fields[index];
    const invalid = Boolean(showError && field.invalid);
    return (
      <InputStandalone
        key={index}
        name={`${id}-${index}`}
        label={field.label}
        placeholder={field.placeholder}
        error={invalid}
        errorText={invalid ? (longMessage
          ? "Informe um e-mail válido para receber as informações sobre seu cadastro."
          : "Informe um e-mail válido.") : undefined}
      />
    );
  };

  return (
    <div className={`validation-layout-demo validation-layout-demo--${layout}`}>
      {layout === "rows" ? fields.map((_, index) => renderField(index)) : (
        <>
          <div className="validation-layout-demo__column">{[0, 2, 4].map(renderField)}</div>
          <div className="validation-layout-demo__column">{[1, 3, 5].map(renderField)}</div>
        </>
      )}
    </div>
  );
}

function ValidationLayoutComparison() {
  const [showError, setShowError] = useState(true);
  const [longMessage, setLongMessage] = useState(false);
  const examples: { layout: Layout; title: string; description: string }[] = [
    { layout: "automatic", title: "1. Altura automática", description: "Colunas independentes: o erro desloca apenas os campos da coluna da esquerda." },
    { layout: "reserved", title: "2. Uma linha reservada", description: "Cada campo reserva uma linha para a mensagem. Um erro curto não move os campos abaixo; mensagens maiores podem crescer." },
    { layout: "rows", title: "3. Crescimento por linha", description: "Sem espaço reservado: a linha assume a altura do maior campo. O conteúdo abaixo se move junto e os vizinhos ficam alinhados." },
  ];

  return (
    <main className="mx-auto w-full max-w-[1600px] p-4 text-content-primary">
      <h1 className="mb-2 text-xl font-bold">Espaço das mensagens de validação</h1>
      <p className="mb-4 text-content-secondary">Ligue e desligue o erro para comparar o movimento dos mesmos campos nas três opções.</p>
      <div className="mb-6 flex flex-wrap gap-6">
        <label className="flex min-h-7 cursor-pointer items-center gap-2">
          <input type="checkbox" className="checkbox-control" checked={showError} onChange={(event) => setShowError(event.target.checked)} />
          Mostrar erro
        </label>
        <label className="flex min-h-7 cursor-pointer items-center gap-2">
          <input type="checkbox" className="checkbox-control" checked={longMessage} onChange={(event) => setLongMessage(event.target.checked)} />
          Usar mensagem longa
        </label>
      </div>
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 desktop:grid-cols-3">
        {examples.map(({ layout, title, description }) => (
          <section key={layout} aria-label={title} className="min-w-0 rounded-sm border border-border-default bg-surface-card p-3">
            <h2 className="mb-2 text-lg font-semibold">{title}</h2>
            <p className="mb-4 min-h-[96px] text-sm text-content-secondary">{description}</p>
            <LayoutExample layout={layout} showError={showError} longMessage={longMessage} />
          </section>
        ))}
      </div>
    </main>
  );
}

const meta = {
  id: "components-forms-validationlayout",
  title: "Laboratory/Forms/ValidationLayout",
  component: ValidationLayoutComparison,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ValidationLayoutComparison>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Comparison: Story = {
  name: "Comparação",};
