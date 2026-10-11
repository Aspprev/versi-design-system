import fs from "node:fs";
import path from "node:path";

// npm run supplies npm_execpath; direct node invocations must locate npm too.
export function resolveNpmCli({ env = process.env, execPath = process.execPath,
  platform = process.platform, exists = fs.existsSync, realpath = fs.realpathSync } = {}) {
  const paths = platform === "win32" ? path.win32 : path.posix;
  const bin = paths.dirname(execPath);
  const candidates = [
    env.npm_execpath,
    paths.join(bin, "node_modules/npm/bin/npm-cli.js"),
    paths.resolve(bin, "../lib/node_modules/npm/bin/npm-cli.js"),
  ];
  const cli = candidates.find(candidate => candidate && exists(candidate));
  if (cli) return cli;
  for (const directory of (env.PATH || env.Path || "").split(paths.delimiter).filter(Boolean)) {
    const adjacent = paths.join(directory, "node_modules/npm/bin/npm-cli.js");
    if (exists(adjacent)) return adjacent;
    const launcher = paths.join(directory, "npm");
    if (exists(launcher)) {
      const target = realpath(launcher);
      if (paths.basename(target) === "npm-cli.js" && exists(target)) return target;
    }
  }
  throw new Error("npm CLI não encontrado. Instale npm junto ao Node ou execute via npm run.");
}
