import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const required = [".", "./core", "./forms", "./charts", "./overlays", "./documents", "./countries", "./styles.css", "./themes.css"];
assert.deepEqual(Object.keys(pkg.exports).sort(), required.sort());
assert.deepEqual(pkg.files, ["dist", "README.md"]);
for (const [name, entry] of Object.entries(pkg.exports)) {
  for (const target of typeof entry === "string" ? [entry] : Object.values(entry)) {
    assert(target.startsWith("./dist/"), `Export fora de dist: ${name}`);
    assert(fs.existsSync(path.join(root, target)), `Export ausente: ${target}`);
  }
  if (typeof entry !== "string") {
    const exports = await import(pathToFileURL(path.join(root, entry.import)).href);
    assert(Object.keys(exports).length > 0, `Entrada vazia: ${name}`);
    if (name !== "./countries") {
      assert(fs.readFileSync(path.join(root, entry.import), "utf8").startsWith('"use client";'));
    }
  }
}
assert(fs.existsSync(path.join(root, pkg.exports["./countries"].browser)), "Entrada browser ausente");
const { COUNTRY_OPTIONS, getCountryFlagUrl } = await import(pathToFileURL(path.join(root, "dist/countries.js")).href);
assert.equal(COUNTRY_OPTIONS.length, 250);
for (const file of fs.readdirSync(path.join(root, "dist")).filter(file => file.endsWith(".js"))) {
  if (file !== "countries-browser.js") {
    assert(!fs.readFileSync(path.join(root, "dist", file), "utf8").includes("/flags/"), `Root flags dependency in ${file}`);
  }
}
for (const country of COUNTRY_OPTIONS) {
  assert.equal(Buffer.from(getCountryFlagUrl(country.cca2).split(",")[1], "base64").toString(), fs.readFileSync(path.join(root, "dist/flags", `${country.cca2.toLowerCase()}.svg`), "utf8"));
}
const expectedFlags = COUNTRY_OPTIONS.map((country) => `${country.cca2.toLowerCase()}.svg`).sort();
assert.deepEqual(fs.readdirSync(path.join(root, "dist/flags")).sort(), expectedFlags);
for (const file of expectedFlags) {
  assert.equal(fs.readFileSync(path.join(root, "dist/flags", file), "utf8"),
    fs.readFileSync(path.join(root, "public/flags", file), "utf8"));
}
// --ignore-scripts prevents recursion through prepack; prepack already built dist.
const packed = spawnSync(process.execPath, [process.env.npm_execpath, "pack", "--dry-run", "--json", "--ignore-scripts"],
  { cwd: root, encoding: "utf8" });
assert.equal(packed.status, 0, `${packed.error || ""}\n${packed.stderr}`);
const [report] = JSON.parse(packed.stdout);
for (const { path: file } of report.files) {
  assert(file.startsWith("dist/") || ["README.md", "package.json"].includes(file), `Arquivo inesperado: ${file}`);
}
assert.equal(report.files.filter(({ path: file }) => file.startsWith("dist/flags/")).length, expectedFlags.length);
console.log(`Pacote: ${required.length} entrypoints; ${expectedFlags.length} bandeiras; ${report.entryCount} arquivos; ${report.size} bytes compactados. Apenas dist, README.md e package.json obrigatório.`);
