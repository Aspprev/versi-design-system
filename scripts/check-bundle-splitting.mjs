import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(root, "dist");
const maxConsumerChunkBytes = 750_000;
const files = fs.readdirSync(distRoot).filter((file) => file.endsWith(".js"));
const initialFiles = files.filter((file) => file !== "countries.js");
const flagChunks = files.filter((file) => /^flags-\d+-[A-Z0-9]+\.js$/.test(file));

if (flagChunks.length !== 20) {
  throw new Error(`Esperados 20 chunks internos de bandeiras; encontrados ${flagChunks.length}.`);
}

const sizes = Object.fromEntries(
  files.map((file) => [file, fs.statSync(path.join(distRoot, file)).size]),
);
const oversizedInitial = initialFiles.filter((file) => sizes[file] > maxConsumerChunkBytes);
if (oversizedInitial.length) {
  throw new Error(
    `Chunks carregáveis pelo consumidor excedem 750 KB: ${oversizedInitial
      .map((file) => `${file} (${sizes[file]} bytes)`)
      .join(", ")}`,
  );
}

for (const entry of ["core.js", "forms.js", "index.js"]) {
  const source = fs.readFileSync(path.join(distRoot, entry), "utf8");
  if (source.includes("data:image/svg+xml;base64")) {
    throw new Error(`${entry} ainda contém payload de bandeiras no carregamento inicial.`);
  }
}

const browserCountries = path.join(distRoot, "countries-browser.js");
if (!fs.existsSync(browserCountries)) {
  throw new Error("countries-browser.js ausente");
}
if (fs.readFileSync(browserCountries, "utf8").includes("data:image/svg+xml;base64")) {
  throw new Error("countries-browser.js nao pode embutir o catalogo de bandeiras");
}

const report = {
  maxConsumerChunkBytes,
  maxInitialChunk: Math.max(...initialFiles.map((file) => sizes[file])),
  flagChunks: flagChunks.map((file) => ({ file, bytes: sizes[file] })),
  synchronousCountriesEntrypointBytes: sizes["countries.js"],
};
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
