import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { generateTokenFiles } from "./generate-tokens.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(packageRoot, "dist");
const dependencyRoots = [path.join(packageRoot, "node_modules")];

function packageBinary(packageName, fileName) {
  const root = dependencyRoots.find((candidate) =>
    fs.existsSync(path.join(candidate, packageName, ...fileName.split("/"))),
  );
  if (!root) throw new Error(`Dependência não encontrada: ${packageName}`);
  return path.join(root, packageName, ...fileName.split("/"));
}

function runNode(packageName, fileName, args) {
  return spawnSync(
    process.execPath,
    [packageBinary(packageName, fileName), ...args],
    { cwd: packageRoot, stdio: "inherit" },
  );
}

if (process.argv.includes("--clean")) {
  fs.rmSync(distRoot, { recursive: true, force: true });
  process.exit(0);
}

generateTokenFiles();
await import("./generate-country-flags.mjs");
await import("./generate-country-flag-chunks.mjs");

fs.rmSync(distRoot, { recursive: true, force: true });

const tsup = runNode("tsup", "dist/cli-default.js", [
  "src/index.ts",
  "src/core.ts",
  "src/forms.ts",
  "src/charts.ts",
  "src/overlays.ts",
  "src/documents.ts",
  "src/countries.ts",
  "src/countries-browser.ts",
  // Internal build boundaries keep optional formatting peers out of chunks
  // shared with unrelated form controls. These are not public package exports.
  "src/components/input/Input.tsx",
  "src/components/inputPhone/InputPhone.tsx",
  // InputPhone shares these helpers with selects. Give them their own
  // boundaries too, otherwise esbuild merges them back into its peer chunk.
  "src/components/countryFlag/CountryFlag.tsx",
  "src/utils/floating-panel-position.ts",
  "--format",
  "esm",
  "--target",
  "es2020",
  "--dts",
  "--sourcemap",
  "--external",
  "react",
  "--external",
  "react-dom",
  "--external",
  "react-icons",
  "--external",
  "classnames",
  "--external",
  "class-variance-authority",
  "--external",
  "@headlessui/react",
  "--external",
  "formik",
  "--external",
  "date-fns",
  "--external",
  "jsbarcode",
  "--external",
  "react-number-format",
  "--external",
  "react-apexcharts",
  "--external",
  "apexcharts",
  "--out-dir",
  "dist",
]);

if (tsup.status !== 0) process.exit(tsup.status ?? 1);

// Optional narrative assets have their own output directory and one module per
// drawing. Do not merge their payload into the core or a shared initial chunk.
const illustrationFiles = fs.readdirSync(path.join(packageRoot, "src/components/illustrations"))
  .filter(file => file.endsWith(".tsx"));
const illustrations = runNode("tsup", "dist/cli-default.js", [
  ...illustrationFiles.map(file => `src/components/illustrations/${file}`),
  "--format", "esm", "--target", "es2020", "--dts", "--sourcemap",
  "--external", "react", "--no-splitting", "--out-dir", "dist/illustrations",
]);
if (illustrations.status !== 0) process.exit(illustrations.status ?? 1);
const illustrationIndex = fs.readFileSync(path.join(packageRoot, "src/components/illustrations/index.ts"), "utf8")
  .replace(/from '([^']+)'/g, "from '$1.js'");
fs.writeFileSync(path.join(distRoot, "illustrations/index.js"), `"use client";\n${illustrationIndex}`);
fs.writeFileSync(path.join(distRoot, "illustrations/index.d.ts"), illustrationIndex);
for (const file of illustrationFiles) {
  const output = path.join(distRoot, "illustrations", file.replace(/\.tsx$/, ".js"));
  fs.writeFileSync(output, `"use client";\n${fs.readFileSync(output, "utf8")}`);
  const mapFile = `${output}.map`;
  const sourceMap = JSON.parse(fs.readFileSync(mapFile, "utf8"));
  sourceMap.mappings = `;${sourceMap.mappings}`;
  fs.writeFileSync(mapFile, JSON.stringify(sourceMap));
}

const tailwind = runNode("tailwindcss", "lib/cli.js", [
  "-c",
  "tailwind.config.cjs",
  "-i",
  "src/styles.css",
  "-o",
  "dist/styles.css",
  "--minify",
]);

if (tailwind.status !== 0) process.exit(tailwind.status ?? 1);

// Apply the same CSS optimizer to the complete theme catalog as to styles.css.
// The readable generated source stays available for review in src/themes.css.
const themes = runNode("tailwindcss", "lib/cli.js", [
  "-c", "tailwind.config.cjs", "-i", "src/themes.css", "-o", "dist/themes.css", "--minify",
]);
if (themes.status !== 0) process.exit(themes.status ?? 1);

const flagsSource = path.join(packageRoot, "public", "flags");
fs.cpSync(flagsSource, path.join(distRoot, "flags"), { recursive: true });

// Bundling strips source directives. All component entrypoints contain hooks
// or context and must retain a client boundary for React Server Components.
for (const entry of ["index", "core", "forms", "charts", "overlays", "documents"]) {
  const file = path.join(distRoot, `${entry}.js`);
  fs.writeFileSync(file, `"use client";\n${fs.readFileSync(file, "utf8")}`);
  const mapFile = `${file}.map`;
  const sourceMap = JSON.parse(fs.readFileSync(mapFile, "utf8"));
  sourceMap.mappings = `;${sourceMap.mappings}`;
  fs.writeFileSync(mapFile, JSON.stringify(sourceMap));
}

const packageJson = JSON.parse(
  fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"),
);
const manifest = {
  name: packageJson.name,
  version: packageJson.version,
  files: fs
    .readdirSync(distRoot)
    .filter((fileName) => !fileName.endsWith(".map"))
    .sort(),
};
fs.writeFileSync(
  path.join(distRoot, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

process.stdout.write(`Design system package built: ${manifest.files.join(", ")}\n`);
