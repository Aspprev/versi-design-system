import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);

export function verifyBuildSecurity() {
  const expected = path.join(root, "vendor/braces-build");
  const resolutions = new Set();
  for (const consumer of ["micromatch", "chokidar"]) {
    const fromConsumer = createRequire(require.resolve(consumer));
    const resolved = fromConsumer.resolve("braces");
    resolutions.add(path.dirname(resolved));
    const installed = JSON.parse(fs.readFileSync(path.join(path.dirname(resolved), "package.json"), "utf8"));
    assert.equal(installed.name, "@aspprev/braces-build", `${consumer} must use the maintained snapshot`);
    const braces = fromConsumer("braces");
    for (const operation of ["parse", "compile", "expand", "stringify"]) {
      for (const [open, close] of [["{", "}"], ["(", ")"]]) {
        assert.throws(() => braces[operation](open.repeat(4000) + "x" + close.repeat(4000)),
          error => error instanceof SyntaxError && /maximum depth/.test(error.message));
      }
    }
    assert.deepEqual(braces.expand("src/{components,hooks}/**/*.{ts,tsx}"), [
      "src/components/**/*.ts", "src/components/**/*.tsx", "src/hooks/**/*.ts", "src/hooks/**/*.tsx",
    ]);
  }
  for (const installed of resolutions) {
    for (const relative of ["index.js", ...fs.readdirSync(path.join(expected, "lib")).map(file => `lib/${file}`)]) {
      assert(fs.readFileSync(path.join(installed, relative)).equals(fs.readFileSync(path.join(expected, relative))),
        `Installed build patch differs: ${relative}`);
    }
  }
  const parserPath = require.resolve("postcss-selector-parser/package.json", { paths: [path.dirname(require.resolve("tailwindcss"))] });
  assert.equal(JSON.parse(fs.readFileSync(parserPath, "utf8")).version, "7.1.6");
  console.log("Build security: installed snapshot verified; bounded parse/compile/expand/stringify; parser 7.1.6.");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) verifyBuildSecurity();
