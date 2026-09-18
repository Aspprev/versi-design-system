import * as designSystem from "../../src";
import { describe, expect, it } from "vitest";

describe("API pública dos controles standalone", () => {
  it("expõe os componentes de formulário pelo entrypoint único", () => {
    const expectedExports = [
      "Input",
      "InputStandalone",
      "InputSelect",
      "TextArea",
      "InputPhone",
      "DatePicker",
      "SelectMulti",
      "SelectCountry",
    ];

    for (const exportName of expectedExports) {
      expect(designSystem).toHaveProperty(exportName);
      expect(
        typeof designSystem[exportName as keyof typeof designSystem],
      ).toBe("function");
    }
  });

  it("expõe os utilitários públicos do InputPhone", () => {
    expect(designSystem).toHaveProperty("buildPhonePayload");
    expect(designSystem).toHaveProperty("parsePhonePayload");
    expect(typeof designSystem.buildPhonePayload).toBe("function");
    expect(typeof designSystem.parsePhonePayload).toBe("function");
  });
});
