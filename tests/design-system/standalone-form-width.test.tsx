import { Formik } from "formik";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DatePicker } from "../../src/components/datePicker";
import Input, { InputStandalone } from "../../src/components/input/Input";
import InputSelect from "../../src/components/inputSelect/InputSelect";
import OtpCodeInput from "../../src/components/otp-code-input/OtpCodeInput";
import SelectMulti from "../../src/components/selectMulti/SelectMulti";
import TextArea from "../../src/components/textArea/TextArea";

const options = [
  { label: "Básico", value: "basico" },
  { label: "Especial", value: "especial" },
];

describe("largura dos controles de formulário", () => {
  it("mantém wrappers internos fluidos para grid, flex e containers estreitos", () => {
    const html = renderToStaticMarkup(
      <Formik initialValues={{ input: "", select: "", text: "" }} onSubmit={() => undefined}>
        <div className="grid min-w-0 grid-cols-3">
          <Input name="input" className="w-full" />
          <InputSelect name="select" options={options} className="w-full" />
          <TextArea name="text" className="w-full" />
          <SelectMulti name="multi" options={options} className="w-full" />
          <InputStandalone className="w-full" />
          <DatePicker name="date" className="w-full" />
        </div>
      </Formik>,
    );

    expect(html).toContain('class="grid min-w-0 grid-cols-3"');
    expect((html.match(/field-control-slot/g) ?? []).length).toBeGreaterThanOrEqual(5);
    expect(html).toContain("field-control-slot field-keyboard-focus-ring relative");
    expect(html).toContain("multi-select-container w-full");
    expect(html).toContain("min-w-0");
  });

  it("mantém o grupo do OTP fluido sem alterar o tamanho dos dígitos", () => {
    const html = renderToStaticMarkup(
      <OtpCodeInput length={4} className="w-full" />,
    );

    expect(html).toContain("flex w-full min-w-0 flex-wrap");
    expect(html).toContain("h-11 w-11");
  });
});
