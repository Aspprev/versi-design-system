import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const pilot = path.join(root, "examples/pilot");
const vendor = path.join(pilot, "vendor");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const artifact = `${pkg.name.replace(/^@/, "").replace("/", "-")}-${pkg.version}.tgz`;
function npm(args, cwd) {
  const result = spawnSync(process.execPath, [process.env.npm_execpath, ...args], { cwd, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
fs.mkdirSync(vendor, { recursive: true });
npm(["pack", "--pack-destination", vendor], root);
const manifestPath = path.join(pilot, "package.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.dependencies[pkg.name] = `file:./vendor/${artifact}`;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
// Explicit tarball install refreshes the artifact even when the version is unchanged.
npm(["install", "--ignore-scripts", `./vendor/${artifact}`], pilot);
const installed = path.join(pilot, "node_modules", pkg.name);
assert(!fs.lstatSync(installed).isSymbolicLink(), "O piloto deve usar o tarball, não symlink.");
assert.equal(fs.readFileSync(path.join(installed, "dist/index.js"), "utf8"), fs.readFileSync(path.join(root, "dist/index.js"), "utf8"));
npm(["run", "assets"], pilot);
console.log(`Piloto preparado com ${artifact}, instalado em node_modules próprio.`);
