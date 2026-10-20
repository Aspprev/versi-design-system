import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const index = JSON.parse(await readFile(resolve(process.argv[2] ?? "storybook-static/index.json"), "utf8"));
const entries = index.entries;
const files = await readdir("stories", { recursive: true });
const missing = [];
for (const file of files.filter(file => /\.(mdx|tsx|ts)$/.test(file))) {
  const content = await readFile(resolve("stories", file), "utf8");
  for (const match of content.matchAll(/\?path=\/(?:docs|story)\/([a-z0-9-]+)/g)) {
    if (!entries[match[1]]) missing.push(`${file}: ${match[1]}`);
  }
}
const catalogSource = await readFile("stories/shared/catalog.ts", "utf8");
const catalog = JSON.parse(catalogSource.slice(catalogSource.indexOf("["), catalogSource.lastIndexOf("]") + 1));
for (const item of catalog) {
  if (!entries[item.id]) missing.push(`Catálogo: ${item.id}`);
}
if (missing.length) throw new Error(`Links ausentes no Storybook:\n${missing.join("\n")}`);
console.log(`Navegação válida: ${Object.keys(entries).length} entradas e ${catalog.length} componentes no catálogo.`);
