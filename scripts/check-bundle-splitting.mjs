import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(root, "dist");
const maxConsumerChunkBytes = 750_000;
const files = fs.readdirSync(distRoot).filter((file) => file.endsWith(".js"));
// Formatting peers must never share a module with unrelated controls/helpers:
// consumers can then discard these modules using package.json sideEffects.
const formattingChunks = files.filter(file =>
  /from ["']react-number-format["']/.test(fs.readFileSync(path.join(distRoot, file), "utf8")),
);
if (formattingChunks.length !== 2) {
  throw new Error(`Expected separate Input/InputPhone peer chunks, found ${formattingChunks.length}.`);
}
for (const file of formattingChunks) {
  const map = JSON.parse(fs.readFileSync(path.join(distRoot, `${file}.map`), "utf8"));
  if (map.sources.some(source => !/\/components\/(input\/Input|inputPhone\/InputPhone)\.tsx$/.test(source))) {
    throw new Error(`${file} mixes react-number-format with unrelated modules: ${map.sources.join(", ")}`);
  }
}
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
