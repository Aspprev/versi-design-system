import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { resolveNpmCli } from "./resolve-npm-cli.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);
const react18 = process.argv.includes("--react18");
const npmCli = resolveNpmCli();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "versi-package-"));
function run(args, cwd = temp) {
  const result = spawnSync(process.execPath, args, {
    cwd,
    encoding: "utf8",
    // Registry downloads and antivirus scans can exceed the compiler timeout.
    timeout: args[0] === npmCli ? 600_000 : 240_000,
  });
  assert.equal(
    result.status,
    0,
    `${args.join(" ")}\n${result.error || ""}\n${result.stdout}\n${result.stderr}`,
  );
  return result.stdout;
}
const npm = (...args) => run([npmCli, ...args]);
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
    const { COUNTRY_OPTIONS, getCountryFlagUrl } = await import('${pkg.name}/countries');
    assert.equal(COUNTRY_OPTIONS.length, 250);
    assert(getCountryFlagUrl('BR').startsWith('data:image/svg+xml;base64,'));
    if (${entries.includes('/forms')}) {
      const { Formik } = await import('formik');
      const { Input, InputStandalone, InputPhone, PhoneInput, SelectCountry } = await import('${pkg.name}/forms');
      assert.equal(PhoneInput, InputPhone);
      const standalone = renderToStaticMarkup(createElement(InputStandalone, {
        name: 'cpf', mask: 'cpf', value: '12345678901', onChange() {}
      }));
      assert(standalone.includes('123.456.789-01'));
      const formatted = renderToStaticMarkup(createElement(Formik, {
        initialValues: { cpf: '12345678901' }, onSubmit() {}
      }, createElement(Input, { name: 'cpf', mask: 'cpf' })));
      assert(formatted.includes('123.456.789-01'));
      for (const Component of [InputPhone, SelectCountry]) {
        const html = renderToStaticMarkup(createElement(Formik, {
          initialValues: { phone: { ddi: 55, ddd: '11', numero: '987654321' }, country: 'Brasil' }, onSubmit() {}
        }, createElement(Component, { name: Component === InputPhone ? 'phone' : 'country' })));
        assert(!html.includes('/flags/'));
        assert(!html.includes('src="data:image/svg+xml;base64,'));
        if (Component === InputPhone) assert(html.includes('(11) 98765-4321'));
      }
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
        npmCli,
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
    "webpack@^5.0.0",
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
    ...Object.keys(pkg.peerDependenciesMeta).filter(peer => peer !== "react-number-format").map(
      (peer) => `${peer}@${pkg.peerDependencies[peer]}`,
    ),
  );
  assert(!fs.existsSync(path.join(temp, "node_modules/react-number-format")));
  fs.writeFileSync(path.join(temp, "unrelated.mjs"), `
    import { Button } from '${pkg.name}';
    import { TextArea, InputSelect, SelectCountry, SelectMulti, DatePicker, RadioGroup, RadioCardGroup, OtpCodeInput } from '${pkg.name}/forms';
    import assert from 'node:assert/strict';
    import { createElement } from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    for (const Component of [TextArea, InputSelect, SelectCountry, SelectMulti, DatePicker, RadioGroup, RadioCardGroup, OtpCodeInput]) assert(Component);
    assert(renderToStaticMarkup(createElement(Button, null, 'Sem peer')).includes('Sem peer'));
  `);
  fs.writeFileSync(path.join(temp, "bundle.cjs"), `
    const webpack = require('webpack');
    webpack({ mode: 'production', entry: './unrelated.mjs',
      output: { path: require('path').resolve('bundle'), filename: 'consumer.cjs' },
      target: 'node', optimization: { minimize: false }
    }, (error, stats) => {
      if (error || stats.hasErrors()) {
        console.error(error || stats.toString({ all: false, errors: true }));
        process.exitCode = 1;
      }
    });
  `);
  run(["bundle.cjs"]);
  assert(!fs.readFileSync(path.join(temp, "bundle/consumer.cjs"), "utf8").includes("react-number-format"));
  run(["bundle/consumer.cjs"]);
  console.log("Consumidor webpack: raiz/forms sem react-number-format OK.");
  npm("install", "--ignore-scripts", "--no-audit", "--no-fund",
    `react-number-format@${pkg.peerDependencies["react-number-format"]}`);
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
