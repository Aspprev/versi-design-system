import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const governance = fs.readFileSync(
  path.join(root, "docs", "GOVERNANCA-DESIGN-SYSTEM.md"),
  "utf8",
);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(packageJson.version)) {
  throw new Error(`Versão inválida: ${packageJson.version}`);
}
for (const section of ["## Versionamento", "## Contribuição", "## Depreciação"]) {
  if (!governance.includes(section)) throw new Error(`Seção ausente: ${section}`);
}
process.stdout.write("Design system standalone governance: OK\n");
