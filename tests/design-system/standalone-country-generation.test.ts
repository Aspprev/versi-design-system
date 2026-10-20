import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { expect, it } from "vitest";

it("verifica os gerados sem escrever e preserva arquivos idênticos ao regenerar", () => {
  const fixtures = path.resolve("test-results");
  fs.mkdirSync(fixtures, { recursive: true });
  const root = fs.mkdtempSync(path.join(fixtures, "country-generation-"));
  if (!root.startsWith(fixtures + path.sep)) throw new Error("Fixture fora de test-results");
  const run = (script: string, ...args: string[]) => spawnSync(process.execPath, [path.join(root, "scripts", script), ...args], { encoding: "utf8" });
  try {
    for (const folder of ["scripts", "public/flags", "src/data"]) fs.mkdirSync(path.join(root, folder), { recursive: true });
    for (const script of ["generate-country-flags.mjs", "generate-country-flag-chunks.mjs"]) fs.copyFileSync(`scripts/${script}`, path.join(root, "scripts", script));
    const countries = Array.from({ length: 250 }, (_, index) => ({ alpha2Code: String.fromCharCode(65 + Math.floor(index / 26), 65 + index % 26) }));
    fs.writeFileSync(path.join(root, "src/data/countries-source.json"), JSON.stringify(countries));
    for (const { alpha2Code } of countries) fs.writeFileSync(path.join(root, "public/flags", `${alpha2Code.toLowerCase()}.svg`), `<svg xmlns="http://www.w3.org/2000/svg">${" ".repeat(1000)}</svg>`);

    expect(run("generate-country-flags.mjs").status).toBe(0);
    expect(run("generate-country-flag-chunks.mjs").status).toBe(0);
    const chunks = path.join(root, "src/data/country-flag-chunks");
    const generated = [path.join(root, "src/data/country-flags.json"), ...fs.readdirSync(chunks).map(name => path.join(chunks, name))];
    expect(generated.length).toBeGreaterThan(2);
    const date = new Date("2000-01-01T00:00:00Z");
    for (const file of generated) fs.utimesSync(file, date, date);
    const times = generated.map(file => fs.statSync(file).mtimeMs);
    for (const script of ["generate-country-flags.mjs", "generate-country-flag-chunks.mjs"]) {
      expect(run(script, "--check").status).toBe(0);
      expect(run(script).status).toBe(0);
    }
    expect(generated.map(file => fs.statSync(file).mtimeMs)).toEqual(times);

    const stale = path.join(chunks, "flags-99.json");
    const unrelated = path.join(chunks, "notes.txt");
    fs.writeFileSync(stale, "{}");
    fs.writeFileSync(unrelated, "keep");
    expect(run("generate-country-flag-chunks.mjs", "--check").status).toBe(1);
    expect(fs.existsSync(stale)).toBe(true);
    expect(run("generate-country-flag-chunks.mjs").status).toBe(0);
    expect(fs.existsSync(stale)).toBe(false);
    expect(fs.readFileSync(unrelated, "utf8")).toBe("keep");

    const chunk = generated[1];
    fs.writeFileSync(chunk, "{}");
    expect(run("generate-country-flag-chunks.mjs", "--check").status).toBe(1);
    expect(fs.readFileSync(chunk, "utf8")).toBe("{}");
    expect(run("generate-country-flag-chunks.mjs").status).toBe(0);
    expect(run("generate-country-flag-chunks.mjs", "--check").status).toBe(0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}, 30_000);
