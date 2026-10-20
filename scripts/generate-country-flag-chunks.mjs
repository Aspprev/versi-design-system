import assert from "node:assert/strict";
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

const expected = new Map(chunks.map((chunk, index) => [
  `flags-${String(index).padStart(2, "0")}.json`,
  `${JSON.stringify(chunk, null, 2)}\n`,
]));
const existing = fs.existsSync(output)
  ? fs.readdirSync(output).filter(name => /^flags-\d+\.json$/.test(name))
  : [];

if (process.argv.includes("--check")) {
  assert.deepEqual(existing.sort(), [...expected.keys()].sort(), "Run node scripts/generate-country-flag-chunks.mjs");
  for (const [name, content] of expected) {
    assert.equal(fs.readFileSync(path.join(output, name), "utf8"), content, `Generated chunk differs: ${name}`);
  }
  process.stdout.write(`Country flag chunks verified: ${chunks.length}\n`);
} else {
  fs.mkdirSync(output, { recursive: true });
  for (const name of existing) {
    if (!expected.has(name)) fs.unlinkSync(path.join(output, name));
  }
  for (const [name, content] of expected) {
    const target = path.join(output, name);
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== content) fs.writeFileSync(target, content);
  }
  process.stdout.write(`Country flag chunks generated: ${chunks.length}\n`);
}
