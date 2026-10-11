import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function validateRelease(pkg, lock, tag) {
  assert.equal(lock.version, pkg.version, "Versão do lockfile diverge do pacote");
  assert.equal(lock.packages?.[""]?.version, pkg.version, "Versão raiz do lockfile diverge do pacote");
  assert.equal(lock.name, pkg.name, "Nome do lockfile diverge do pacote");
  assert(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.version), "Versão inválida");
  if (tag) assert.equal(tag, `v${pkg.version}`, "Tag diverge da versão do pacote");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const read = name => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
  const tag = process.env.GITHUB_REF_TYPE === "tag" ? process.env.GITHUB_REF_NAME : process.argv[2];
  validateRelease(read("package.json"), read("package-lock.json"), tag);
  console.log(`Release: manifestos consistentes${tag ? `; tag ${tag} conferida` : ""}.`);
}
