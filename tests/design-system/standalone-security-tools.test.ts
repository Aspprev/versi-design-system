import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { assessAudit, describeFinding, runSecurityChecks } from "../../scripts/check-security.mjs";
import { validateRelease } from "../../scripts/check-release.mjs";

const clean = { metadata: { vulnerabilities: { total: 0 } }, vulnerabilities: {} };
const result = (report: unknown, status = 0) => ({ stdout: JSON.stringify(report), stderr: "", status });

describe("security and release gates", () => {
  it("distinguishes a clean report from registry and process failures", () => {
    expect(assessAudit(result(clean)).status).toBe("clean");
    for (const response of [result(null), result({ error: { code: "ENETUNREACH" } }, 1), result({}), result(clean, 1), { stdout: "unavailable", status: null }]) {
      expect(assessAudit(response).status).toBe("infrastructure-error");
    }
  });

  it("blocks vulnerabilities and preserves the affected chain and fix", () => {
    const finding = { name: "example", severity: "high", via: ["dependency"], fixAvailable: true };
    const report = { metadata: { vulnerabilities: { total: 1 } }, vulnerabilities: { example: finding } };
    expect(assessAudit(result(report, 1)).status).toBe("vulnerable");
    expect(describeFinding(finding)).toContain("example: high; via dependency; atualização disponível");
    expect(assessAudit(result({ ...report, vulnerabilities: { example: { ...finding, via: [null] } } }, 1)).status).toBe("infrastructure-error");
  });

  it("collects every scope even if the first audit fails", () => {
    let calls = 0;
    const output = path.resolve("test-results/security-fixture");
    const exitCode = runSecurityChecks(() => {
      calls++;
      return calls === 1 ? result({ error: { summary: "registry unavailable" } }, 1) : result(clean);
    }, output);
    expect(calls).toBe(4);
    expect(exitCode).toBe(1);
    expect(JSON.parse(fs.readFileSync(path.join(output, "summary.json"), "utf8"))).toHaveLength(4);
  });

  it("rejects inconsistent release manifests and tags", () => {
    const pkg = { name: "@aspprev/versi-ds", version: "0.5.1" };
    const lock = { ...pkg, packages: { "": { version: "0.5.1" } } };
    expect(() => validateRelease(pkg, lock, "v0.5.1")).not.toThrow();
    expect(() => validateRelease(pkg, lock, "v0.5.0")).toThrow(/Tag/);
    expect(() => validateRelease(pkg, { ...lock, version: "0.5.0" })).toThrow(/lockfile/);
  });
});
