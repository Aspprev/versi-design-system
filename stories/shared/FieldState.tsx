import { useId, useState } from "react";
import { Formik } from "formik";
import { InputPhone, InputSelect, InputStandalone, SelectMulti, TextArea } from "../../src";

const options = [
  { label: "Plano Básico", value: "basico" },
  { label: "Plano Especial", value: "especial" },
];

export function FieldState({ filled, disabled }: { filled: boolean; disabled: boolean }) {
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

