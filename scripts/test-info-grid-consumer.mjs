import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import postcss from "postcss";
import tailwind from "tailwindcss";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(root, "test-results/info-grid-consumer");
fs.mkdirSync(directory, { recursive: true });
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, `${result.error || ""}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
// Extract the actual npm artifact into a consumer node_modules, without a source alias.
const npmCli = process.env.npm_execpath || path.join(path.dirname(process.execPath), "node_modules/npm/bin/npm-cli.js");
const [packed] = JSON.parse(run(process.execPath, [npmCli, "pack", "--ignore-scripts", "--json", "--pack-destination", directory]));
const installed = path.join(directory, "node_modules/@aspprev/versi-ds");
fs.mkdirSync(installed, { recursive: true });
run("tar", ["-xf", path.join(directory, packed.filename), "-C", installed, "--strip-components=1"]);
const requireConsumer = createRequire(path.join(directory, "app.cjs"));
const { InfoGrid } = await import(pathToFileURL(requireConsumer.resolve("@aspprev/versi-ds/core")));
const ds = fs.readFileSync(requireConsumer.resolve("@aspprev/versi-ds/styles.css"), "utf8");
const consumer = (await postcss([tailwind({
  content: [path.join(root, "examples/info-grid-consumer/src/**/*.html")],
  theme: { screens: { mobile: "640px", tablet: "1024px", desktop: "1440px" } },
  corePlugins: { preflight: false },
})]).process("@tailwind utilities;", { from: undefined })).css;
assert(consumer.includes(".tablet\\:grid-cols-3"));
assert(!consumer.includes(".desktop\\:grid-cols-6"));
fs.writeFileSync(path.join(directory, "consumer.css"), consumer);
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const render = (columns, className, id = `grid-${columns}`) => renderToStaticMarkup(
    React.createElement(InfoGrid, { columns, className, id }, Array.from({ length: 12 }, (_, i) => React.createElement("div", { key: i }, String(i)))),
  );
  const count = id => page.locator(`#${id}`).evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  const expectations = [
    [375, [1, 1, 1, 1, 1]], [639, [1, 1, 1, 1, 1]],
    [640, [1, 2, 2, 2, 2]], [1023, [1, 2, 2, 2, 2]],
    [1024, [1, 2, 3, 2, 3]], [1439, [1, 2, 3, 2, 3]],
    [1440, [1, 2, 3, 4, 6]], [1920, [1, 2, 3, 4, 6]],
  ];
  for (const [order, styles] of [["DS → consumer", ds + consumer], ["consumer → DS", consumer + ds], ["DS only", ds]]) {
    await page.setContent(`<style>${styles}</style>${[1, 2, 3, 4, 6].map(n => render(n)).join("")}`);
    for (const [width, expected] of expectations) {
      await page.setViewportSize({ width, height: 900 });
      for (const [index, columns] of [1, 2, 3, 4, 6].entries()) {
        assert.equal(await count(`grid-${columns}`), expected[index], `${order}, columns=${columns}, width=${width}`);
      }
    }
    console.log(`${order}: all column options and breakpoint boundaries passed`);
  }
  for (const styles of [ds + consumer, consumer + ds]) {
    await page.setContent(`<style>${styles}</style>${render(6, "grid-cols-5 desktop:grid-cols-2", "custom")}`);
    for (const [width, expected] of [[375, 5], [640, 5], [1024, 5], [1440, 2]]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await count("custom"), expected, `className override at ${width}`);
    }
  }
  console.log("className: base and responsive overrides passed");
} finally {
  await browser.close();
}
