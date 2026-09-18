import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(root, "dist");
const budgets = {
  // Aggregate all emitted JS, including shared chunks (entry files reexport them).
  "*.js": { bytes: 450_000, gzipBytes: 85_000 },
  "index.js": { bytes: 310_000, gzipBytes: 65_000 },
  // Per-entry limits complement the aggregate budget above.
  "core.js": { bytes: 10_000, gzipBytes: 4_000 },
  "forms.js": { bytes: 10_000, gzipBytes: 4_000 },
  "charts.js": { bytes: 10_000, gzipBytes: 4_000 },
  "overlays.js": { bytes: 10_000, gzipBytes: 4_000 },
  "documents.js": { bytes: 10_000, gzipBytes: 4_000 },
  "countries.js": { bytes: 80_000, gzipBytes: 25_000 },
  "flags/*.svg": { bytes: 4_000_000, gzipBytes: 1_500_000 },
  "styles.css": { bytes: 125_000, gzipBytes: 25_000 },
  "themes.css": { bytes: 35_000, gzipBytes: 10_000 },
};

const report = Object.entries(budgets).map(([fileName, budget]) => {
  const content = fileName === "*.js"
    ? Buffer.concat(fs.readdirSync(distRoot).filter((entry) => entry.endsWith(".js")).sort()
        .map((entry) => fs.readFileSync(path.join(distRoot, entry))))
    : fileName === "flags/*.svg"
    ? Buffer.concat(
        fs
          .readdirSync(path.join(distRoot, "flags"))
          .filter((entry) => entry.endsWith(".svg"))
          .sort()
          .map((entry) => fs.readFileSync(path.join(distRoot, "flags", entry))),
      )
    : fs.readFileSync(path.join(distRoot, fileName));
  const gzipBytes = gzipSync(content).byteLength;
  return {
    file: fileName,
    bytes: content.byteLength,
    gzipBytes,
    budget,
    withinBudget:
      content.byteLength <= budget.bytes && gzipBytes <= budget.gzipBytes,
  };
});

const bundle = fs.readdirSync(distRoot).filter((entry) => entry.endsWith(".js"))
  .map((entry) => fs.readFileSync(path.join(distRoot, entry), "utf8")).join("\n");
const styles = fs.readFileSync(path.join(distRoot, "styles.css"), "utf8");
if (bundle.includes("@/")) throw new Error("O bundle contém alias interno.");
for (const token of ["--primary-1", "--content-primary", "data-color-scheme=dark"]) {
  if (!styles.includes(token)) throw new Error(`Token ausente: ${token}`);
}
if (report.some((entry) => !entry.withinBudget)) {
  throw new Error("O pacote excedeu o orçamento de bundle.");
}

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
