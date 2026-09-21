import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../public/flags/", import.meta.url));
const target = fileURLToPath(new URL("../src/data/country-flags.json", import.meta.url));
const countries = JSON.parse(fs.readFileSync(new URL("../src/data/countries-source.json", import.meta.url), "utf8"));
const files = fs.readdirSync(source).filter(file => file.endsWith(".svg")).sort();
assert.equal(files.length, 250, "The package must include all 250 flags");
assert.deepEqual(files, countries.map(country => `${country.alpha2Code.toLowerCase()}.svg`).sort());
const flags = Object.fromEntries(files.map(file => [
  file.slice(0, -4),
  `data:image/svg+xml;base64,${fs.readFileSync(path.join(source, file)).toString("base64")}`,
]));
const output = `${JSON.stringify(flags, null, 2)}\n`;
if (process.argv.includes("--check")) {
  assert.equal(fs.readFileSync(target, "utf8"), output, "Run node scripts/generate-country-flags.mjs");
} else {
  fs.writeFileSync(target, output);
}
