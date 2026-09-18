import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);
const react18 = process.argv.includes("--react18");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "versi-package-"));
function run(args, cwd = temp) {
  const result = spawnSync(process.execPath, args, {
    cwd,
    encoding: "utf8",
    timeout: 240_000,
  });
  assert.equal(
    result.status,
    0,
    `${args.join(" ")}\n${result.error || ""}\n${result.stdout}\n${result.stderr}`,
  );
  return result.stdout;
}
const npm = (...args) => run([process.env.npm_execpath, ...args]);
function verify(entries) {
  fs.writeFileSync(
    path.join(temp, "consumer.mjs"),
    `
    import assert from 'node:assert/strict';
    import { createElement } from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    import { Button } from '${pkg.name}/core';
    for (const entry of ${JSON.stringify(entries)}) {
      assert(Object.keys(await import('${pkg.name}' + entry)).length > 0);
    }
    assert(renderToStaticMarkup(createElement(Button, null, 'Isolado')).includes('Isolado'));
    for (const css of ['styles.css', 'themes.css']) assert(import.meta.resolve('${pkg.name}/' + css));
  `,
  );
  run(["consumer.mjs"]);
  fs.writeFileSync(
    path.join(temp, "consumer.ts"),
    entries
      .map(
        (entry, index) =>
          `import * as entry${index} from '${pkg.name}${entry}';\nvoid entry${index};`,
      )
      .join("\n"),
  );
  run([
    path.join(temp, "node_modules/typescript/bin/tsc"),
    "--noEmit",
    "--strict",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--target",
    "ES2020",
    "consumer.ts",
  ]);
}
try {
  const [packed] = JSON.parse(
    run(
      [
        process.env.npm_execpath,
        "pack",
        "--ignore-scripts",
        "--json",
        "--pack-destination",
        temp,
      ],
      root,
    ),
  );
  fs.writeFileSync(
    path.join(temp, "package.json"),
    JSON.stringify({ private: true, type: "module" }),
  );
  npm(
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    "--omit=optional",
    path.join(temp, packed.filename),
    `react@${react18 ? "18.2.0" : pkg.devDependencies.react}`,
    `react-dom@${react18 ? "18.2.0" : pkg.devDependencies["react-dom"]}`,
    `typescript@${pkg.devDependencies.typescript}`,
    `@types/react@${react18 ? "18" : pkg.devDependencies["@types/react"]}`,
    `@types/react-dom@${react18 ? "18" : pkg.devDependencies["@types/react-dom"]}`,
  );
  for (const peer of Object.keys(pkg.peerDependenciesMeta)) {
    assert(
      !fs.existsSync(path.join(temp, "node_modules", peer)),
      `Peer opcional instalado no teste mínimo: ${peer}`,
    );
  }
  verify(["/core", "/countries"]);
  console.log(
    "Consumidor isolado mínimo: core/countries, CSS, SSR e TypeScript strict OK, sem peers opcionais.",
  );
  npm(
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    ...Object.keys(pkg.peerDependenciesMeta).map(
      (peer) => `${peer}@${pkg.peerDependencies[peer]}`,
    ),
  );
  verify([
    "",
    "/core",
    "/forms",
    "/charts",
    "/overlays",
    "/documents",
    "/countries",
  ]);
  console.log(
    "Consumidor isolado completo: todos os entrypoints ESM e declarações NodeNext/strict OK.",
  );
} finally {
  // Only remove the exact temporary directory created by this invocation.
  assert.equal(path.dirname(temp), path.resolve(os.tmpdir()));
  assert(path.basename(temp).startsWith("versi-package-"));
  fs.rmSync(temp, { recursive: true, force: true });
}
