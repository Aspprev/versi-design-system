import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { expect, it } from "vitest";

it("generates LF from embedded CRLF and checks both checkout styles without hiding drift", () => {
  fs.mkdirSync("test-results", { recursive: true });
  const root = fs.mkdtempSync(path.resolve("test-results/tokens-regression-"));
  try {
    for (const folder of ["src", "scripts", "tokens"]) fs.mkdirSync(path.join(root, folder));
    fs.copyFileSync("scripts/generate-tokens.mjs", path.join(root, "scripts/generate-tokens.mjs"));
    const registry = {
      version: 1,
      tokens: [{ selector: "html\r\n  :where(body, .default)", declarations: [{ property: "--example", value: "1" }] }],
      themes: [{ selector: ".default", declarations: [{ property: "--example", value: "2" }] }],
    };
    fs.writeFileSync(path.join(root, "tokens/design-system.tokens.json"), JSON.stringify(registry));
    const run = (mode: string) => spawnSync(process.execPath, [path.join(root, "scripts/generate-tokens.mjs"), mode], { encoding: "utf8" });
    expect(run("--write").status).toBe(0);
    const files = ["src/tokens.css", "src/themes.css", "tokens/tailwind-colors.cjs"];
    const contents = files.map(file => fs.readFileSync(path.join(root, file), "utf8"));
    expect(contents.every(content => !content.includes("\r"))).toBe(true);
    expect(run("--check").status).toBe(0);
    files.forEach((file, index) => fs.writeFileSync(path.join(root, file), contents[index].replace(/\n/g, "\r\n")));
    expect(run("--check").status).toBe(0);
    fs.writeFileSync(path.join(root, files[0]), contents[0].replace("--example: 1", "--example: 99"));
    const drift = run("--check");
    expect(drift.status).toBe(1);
    expect(drift.stderr).toContain("Arquivos de tokens fora de sincronia");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
