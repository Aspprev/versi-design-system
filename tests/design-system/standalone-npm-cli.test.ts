import { expect, it } from "vitest";
import { resolveNpmCli } from "../../scripts/resolve-npm-cli.mjs";

it("resolves the Linux setup-node layout for direct node invocations", () => {
  const cli = "/opt/hostedtoolcache/node/24.21.0/x64/lib/node_modules/npm/bin/npm-cli.js";
  expect(resolveNpmCli({ env: {}, execPath: "/opt/hostedtoolcache/node/24.21.0/x64/bin/node", platform: "linux", exists: (file: string) => file === cli })).toBe(cli);
});

it("resolves Windows and npm run installations", () => {
  const cli = "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js";
  expect(resolveNpmCli({ env: {}, execPath: "C:\\Program Files\\nodejs\\node.exe", platform: "win32", exists: (file: string) => file === cli })).toBe(cli);
  expect(resolveNpmCli({ env: { npm_execpath: "/custom/npm-cli.js" }, execPath: "/bin/node", platform: "linux", exists: () => true, realpath: (file: string) => file })).toBe("/custom/npm-cli.js");
});

it("uses a PATH symlink and fails clearly when npm is missing", () => {
  const cli = "/custom prefix/lib/npm/bin/npm-cli.js";
  expect(resolveNpmCli({ env: { PATH: "/custom prefix/bin" }, execPath: "/other/node", platform: "linux",
    exists: (file: string) => [cli, "/custom prefix/bin/npm"].includes(file), realpath: () => cli })).toBe(cli);
  expect(() => resolveNpmCli({ env: {}, execPath: "/other/node", platform: "linux", exists: () => false })).toThrow(/npm CLI não encontrado/);
});
