import { useId, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import {
  Checkbox,
  FileDropzone,
  InputPhone,
  InputSelect,
  InputStandalone,
  OtpCodeInput,
  RadioCardGroup,
  RadioGroup,
  SelectMulti,
  TextArea,
} from "../src";
import FieldFrame from "../src/components/field/FieldFrame";

const options = [
  { label: "Plano Básico", value: "basico" },
  { label: "Plano Especial", value: "especial" },
];

function FieldExamples({ invalid, disabled, longMessage }: {
  invalid: boolean;
  disabled: boolean;
  longMessage: boolean;
}) {
  const id = useId();
  const names = { phone: `${id}-phone`, select: `${id}-select`, radio: `${id}-radio`, notes: `${id}-notes` };
  const [checked, setChecked] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const message = longMessage
    ? "Confira os dados informados e selecione uma opção válida para continuar. Se precisar, consulte as orientações de preenchimento deste campo."
    : "Confira este campo para continuar.";
  const errors = invalid ? Object.fromEntries(Object.values(names).map((name) => [name, message])) : {};

  return (
    <Formik
      initialValues={{ [names.phone]: { ddi: 55, ddd: "", numero: "" }, [names.select]: "", [names.radio]: "basico", [names.notes]: "" }}
      initialErrors={errors}
      initialTouched={Object.fromEntries(Object.values(names).map((name) => [name, true]))}
      validate={() => errors}
      onSubmit={() => undefined}
    >
      <div className="flex min-w-0 flex-col gap-6">
        <InputStandalone name={`${id}-input`} label="Input" placeholder="Digite seu nome" error={invalid} errorText={invalid ? message : undefined} disabled={disabled} />
        <InputPhone name={names.phone} label="InputPhone" disabled={disabled} />
        <InputSelect name={names.select} label="Select" options={options} disabled={disabled} />
        <SelectMulti name={`${id}-multi`} label="MultiSelect" options={options} value={selected} error={invalid ? message : undefined} disabled={disabled}
          onChange={(event) => {
            const { value, checked: nextChecked } = event.target;
            setSelected((current) => nextChecked ? [...current, value] : current.filter((item) => item !== value));
          }}
          onReset={() => setSelected([])}
        />
        <TextArea name={names.notes} label="Textarea" placeholder="Digite uma observação" rows={3} disabled={disabled} />
        <OtpCodeInput label="OTP" length={4} error={invalid} errorText={invalid ? message : undefined} disabled={disabled} />
        <FieldFrame label="Checkbox" invalid={invalid} message={message} messageId={`${id}-checkbox-error`}>
          <Checkbox options={options} value={checked} onChange={(event) => setChecked(event.target.checked ? event.target.value : "")} layout="col" disabled={disabled}
            aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-checkbox-error` : undefined} />
        </FieldFrame>
        <RadioGroup name={names.radio} label="RadioGroup" options={options} disabled={disabled} />
        <RadioCardGroup label="RadioCardGroup" options={options.map((option) => ({ value: option.value, title: option.label }))} error={invalid ? message : undefined} touched disabled={disabled} />
        <FileDropzone label="Upload" error={invalid ? message : undefined} disabled={disabled} />
      </div>
    </Formik>
  );
}

function ValidationComparison({ disabled = false, longMessage = false }) {
  return (
    <main className="mx-auto w-full max-w-6xl p-4">
      <h1 className="mb-2 text-xl font-bold text-content-primary">Validação dos campos</h1>
      <p className="mb-6 text-content-secondary">Compare os estados e use Tab para conferir o foco. Os temas podem ser alterados na barra do Storybook.</p>
      <div className="grid min-w-0 grid-cols-1 gap-8 tablet:grid-cols-2">
        {[false, true].map((invalid) => (
          <section key={String(invalid)} className="min-w-0">
            <h2 className="mb-4 text-lg font-semibold text-content-primary">{invalid ? "Com erro" : "Sem erro"}</h2>
            <FieldExamples invalid={invalid} disabled={disabled} longMessage={longMessage} />
          </section>
        ))}
      </div>
    </main>
  );
}

const meta = {
  title: "Components/Forms/ValidationErrors",
  component: ValidationComparison,
  parameters: { layout: "fullscreen" },
  args: { disabled: false, longMessage: false },
} satisfies Meta<typeof ValidationComparison>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Comparison: Story = {};
export const LongMessages: Story = { args: { longMessage: true } };
export const Disabled: Story = { args: { disabled: true } };
