import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function runAudit(cwd, label) {
  const result = spawnSync(process.execPath, [process.env.npm_execpath, "audit", "--json", "--offline=false"], {
    cwd,
    encoding: "utf8",
    timeout: 300_000,
  });
  if (result.error) throw result.error;
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    throw new Error(`${label}: npm audit não retornou JSON válido.\n${result.stdout}\n${result.stderr}`);
  }
  const vulnerabilities = report.metadata?.vulnerabilities || {};
  const total = Number(vulnerabilities.total || 0);
  if (result.status !== 0 || total > 0) {
    throw new Error(`${label}: ${total} vulnerabilidade(s) reportada(s). Execute npm audit para detalhes.`);
  }
  process.stdout.write(`${label}: npm audit OK (0 vulnerabilidades; ${report.metadata?.dependencies?.total ?? "?"} dependências).\n`);
}

runAudit(root, "Design System");
runAudit(path.join(root, "examples", "pilot"), "Piloto");
