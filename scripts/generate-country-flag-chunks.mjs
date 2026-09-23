import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "src", "data", "country-flags.json");
const output = path.join(root, "src", "data", "country-flag-chunks");
const maxChunkBytes = 300_000;

const flags = JSON.parse(fs.readFileSync(source, "utf8"));
const entries = Object.entries(flags).sort(([a], [b]) => a.localeCompare(b));
const chunks = [];
let current = {};

for (const [code, svg] of entries) {
  const candidate = { ...current, [code]: svg };
  if (Object.keys(current).length && Buffer.byteLength(JSON.stringify(candidate)) > maxChunkBytes) {
    chunks.push(current);
    current = { [code]: svg };
  } else {
    current = candidate;
  }
}
if (Object.keys(current).length) chunks.push(current);

fs.mkdirSync(output, { recursive: true });
for (const name of fs.readdirSync(output)) {
  if (/^flags-\d+\.json$/.test(name)) fs.unlinkSync(path.join(output, name));
}

for (const [index, chunk] of chunks.entries()) {
  const name = `flags-${String(index).padStart(2, "0")}.json`;
  fs.writeFileSync(path.join(output, name), `${JSON.stringify(chunk, null, 2)}\n`);
}

process.stdout.write(`Country flag chunks generated: ${chunks.length}\n`);
