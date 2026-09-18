import fs from "node:fs";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(
  new URL("./flags/", import.meta.resolve("@versi/design-system/countries")),
);
const target = fileURLToPath(new URL("../public/flags/", import.meta.url));
fs.cpSync(source, target, { recursive: true });
console.log(
  `Bandeiras copiadas do pacote instalado: ${fs.readdirSync(target).length}`,
);
