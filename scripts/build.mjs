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

fs.rmSync(distRoot, { recursive: true, force: true });

const tsup = runNode("tsup", "dist/cli-default.js", [
  "src/index.ts",
  "src/core.ts",
  "src/forms.ts",
  "src/charts.ts",
  "src/overlays.ts",
  "src/documents.ts",
  "src/countries.ts",
  "--format",
  "esm",
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

const themesSource = path.join(packageRoot, "src", "themes.css");
fs.copyFileSync(themesSource, path.join(distRoot, "themes.css"));

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
