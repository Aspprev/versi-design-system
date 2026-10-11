import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { verifyBuildSecurity } from "./check-build-security.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const npmCli = process.env.npm_execpath || path.join(path.dirname(process.execPath), "node_modules/npm/bin/npm-cli.js");

export function assessAudit(result) {
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    return { status: "infrastructure-error", message: result.error?.message || "npm audit não retornou JSON válido" };
  }
  if (!report || typeof report !== "object" || result.error || report.error || ![0, 1].includes(result.status) ||
      !Number.isInteger(report.metadata?.vulnerabilities?.total) ||
      !report.vulnerabilities || typeof report.vulnerabilities !== "object" || Array.isArray(report.vulnerabilities) ||
      Object.values(report.vulnerabilities).some(item => !item || typeof item.name !== "string" || !Array.isArray(item.via) ||
        item.via.some(via => typeof via !== "string" && (!via || typeof via.name !== "string")))) {
    return { status: "infrastructure-error", message: result.error?.message || report?.error?.summary || "Relatório ou código de saída inválido", report };
  }
  const total = report.metadata.vulnerabilities.total;
  if (total < 0 || (total === 0 && (result.status !== 0 || Object.keys(report.vulnerabilities).length > 0)) ||
      (total > 0 && Object.keys(report.vulnerabilities).length === 0)) {
    return { status: "infrastructure-error", message: "Relatório de auditoria inconsistente", report };
  }
  return { status: total > 0 ? "vulnerable" : "clean", total, report };
}

export function describeFinding(finding) {
  const advisories = finding.via.filter(item => typeof item === "object");
  const chain = finding.via.map(item => typeof item === "string" ? item : item.name).join(", ");
  const fix = finding.fixAvailable;
  const correction = fix === true ? "atualização disponível" : fix
    ? `${fix.name}@${fix.version}${fix.isSemVerMajor ? " (mudança principal; validar compatibilidade)" : ""}`
    : "sem correção informada";
  return `${finding.name}: ${finding.severity}; via ${chain}; ${correction}` +
    advisories.map(item => `\n    ${item.title}: ${item.url}`).join("");
}

export function runSecurityChecks(run = spawnSync, output = path.join(root, "test-results/security")) {
  fs.mkdirSync(output, { recursive: true });
  const summaries = [];
  for (const [id, cwd] of [["ds", root], ["pilot", path.join(root, "examples/pilot")]]) {
    for (const scope of ["all", "production"]) {
      const args = [npmCli, "audit", "--json", "--offline=false"];
      if (scope === "production") args.push("--omit=dev");
      const result = run(process.execPath, args, { cwd, encoding: "utf8", timeout: 300_000, windowsHide: true });
      const assessed = assessAudit(result);
      const name = `${id}-${scope}`;
      fs.writeFileSync(path.join(output, `${name}.json`), JSON.stringify({
        name, checkedAt: new Date().toISOString(), ...assessed,
        exitCode: result.status, stderr: result.stderr, rawOutput: assessed.report ? undefined : result.stdout,
      }, null, 2) + "\n");
      console.log(`${name}: ${assessed.status}${assessed.total === undefined ? ` — ${assessed.message}` : ` (${assessed.total} alertas)`}`);
      if (assessed.status === "vulnerable") {
        for (const finding of Object.values(assessed.report.vulnerabilities)) console.log(`  ${describeFinding(finding)}`);
      }
      summaries.push({ name, status: assessed.status, total: assessed.total });
    }
  }
  fs.writeFileSync(path.join(output, "summary.json"), JSON.stringify(summaries, null, 2) + "\n");
  console.log(`Relatórios: ${output}`);
  return summaries.every(item => item.status === "clean") ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let buildGate = 0;
  let mitigation;
  try {
    verifyBuildSecurity();
    mitigation = { status: "verified", snapshot: "@aspprev/braces-build@3.0.3-patch.1", maxDepth: 100 };
  } catch (error) {
    console.error(`Build mitigation failed: ${error.message}`);
    buildGate = 1;
    mitigation = { status: "failed", message: error.message };
  }
  process.exitCode = Math.max(buildGate, runSecurityChecks());
  fs.writeFileSync(path.join(root, "test-results/security/build-mitigation.json"), JSON.stringify(mitigation, null, 2) + "\n");
}
