import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(".");
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);

describe("camadas públicas do pacote standalone", () => {
  it("publica entradas separadas para núcleo, formulários, gráficos e overlays", () => {
    for (const entry of [
      "./core",
      "./forms",
      "./charts",
      "./overlays",
      "./documents",
      "./countries",
    ]) {
      expect(packageJson.exports[entry]).toMatchObject({
        types: expect.stringContaining(`dist/${entry.slice(2)}.d.ts`),
        import: expect.stringContaining(`dist/${entry.slice(2)}.js`),
      });
    }
  });

  it("mantém o núcleo sem imports das integrações opcionais", () => {
    const core = fs.readFileSync(path.join(root, "src", "core.ts"), "utf8");

    for (const dependency of [
      "formik",
      "@headlessui/react",
      "react-apexcharts",
      "apexcharts",
      "jsbarcode",
      "date-fns",
      "react-number-format",
    ]) {
      expect(core).not.toContain(dependency);
    }
  });

  it("declara integracoes pesadas como peers opcionais", () => {
    const optionalPeers = [
      "@headlessui/react",
      "apexcharts",
      "date-fns",
      "formik",
      "jsbarcode",
      "react-apexcharts",
      "react-number-format",
    ];

    for (const dependency of optionalPeers) {
      expect(packageJson.peerDependenciesMeta[dependency]).toEqual({ optional: true });
      expect(packageJson.dependencies).not.toHaveProperty(dependency);
    }
  });

  it("mantém cada integração na camada correspondente", () => {
    const forms = fs.readFileSync(path.join(root, "src", "forms.ts"), "utf8");
    const charts = fs.readFileSync(path.join(root, "src", "charts.ts"), "utf8");
    const overlays = fs.readFileSync(path.join(root, "src", "overlays.ts"), "utf8");
    const documents = fs.readFileSync(path.join(root, "src", "documents.ts"), "utf8");

    expect(forms).toContain("InputSelect");
    expect(forms).toContain("DatePicker");
    expect(charts).toContain("LazyApexChart");
    expect(overlays).toContain("AccessibilityPreferencesPanel");
    expect(documents).toContain("BoletoBarCode");
  });
});

