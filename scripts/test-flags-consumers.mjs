import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import { chromium } from "@playwright/test";
const root = fileURLToPath(new URL("../", import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "versi-flags-"));
function run(args, cwd = temp) {
  const result = spawnSync(process.execPath, args, { cwd, encoding: "utf8", timeout: 900_000 });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.error || ""}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
const npm = (...args) => run([process.env.npm_execpath, ...args]);
let server;
let browser;
try {
  fs.cpSync(path.join(root, "examples/flags-consumer"), temp, { recursive: true });
  const [packed] = JSON.parse(run([process.env.npm_execpath, "pack", "--ignore-scripts", "--json", "--pack-destination", temp], root));
  fs.writeFileSync(path.join(temp, "package.json"), JSON.stringify({ private: true, type: "module", dependencies: {
    [pkg.name]: `file:./${packed.filename}`, react: pkg.devDependencies.react, "react-dom": pkg.devDependencies["react-dom"],
    ...Object.fromEntries(Object.entries(pkg.peerDependencies).filter(([name]) => pkg.peerDependenciesMeta[name])),
    next: "16.3.5", vite: "8.3.0"
  }}));
  console.log("Installing Next.js/Vite and the packed DS...");
  npm("install", "--offline=false", "--no-audit", "--no-fund");
  assert(!fs.existsSync(path.join(temp, "public")));
  console.log(`Consumer installed from tarball: ${temp}`);
  browser = await chromium.launch();
  for (const framework of ["next", "vite"]) {
    const binary = path.join(temp, "node_modules", framework, framework === "next" ? "dist/bin/next" : "bin/vite.js");
    console.log(run([binary, "build"]));
    const port = framework === "next" ? 4196 : 4197;
    const args = framework === "next" ? ["start", "--hostname", "127.0.0.1", "--port", String(port)] : ["preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"];
    server = spawn(process.execPath, [binary, ...args], { cwd: temp, stdio: "ignore", windowsHide: true });
    const url = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let i = 0; i < 120; i++) {
      try { if ((await fetch(url)).ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    assert(ready, `${framework} server unavailable`);
    if (framework === "next") {
      const html = await (await fetch(url)).text();
      assert(html.includes('data:image/svg+xml;base64,'), "SSR flag absent");
      assert(!html.includes('src="/flags/'));
    }
    const page = await browser.newPage();
    const errors = [];
    const requests = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => { if (new URL(request.url()).pathname.startsWith("/flags/")) requests.push(request.url()); });
    await page.goto(url);
    await page.locator("#browser-country-flags img").first().waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll("#browser-country-flags img")].length === 3 && [...document.querySelectorAll("#browser-country-flags img")].every(img => img.complete && img.naturalWidth > 0));
    const flagSources = await page.locator("#browser-country-flags img").evaluateAll((images) => new Set(
      images.map((image) => image.getAttribute("src")).filter(Boolean),
    ).size);
    assert.equal(flagSources, 3, "Expected distinct country flag sources");
    await page.getByRole("combobox").click();
    await page.getByRole("textbox", { name: /Pesquisar/ }).fill("Portugal");
    await page.getByRole("option").first().click();
    await page.getByRole("button", { name: /Selecionar país/ }).click();
    await page.getByRole("textbox", { name: "Pesquisar país ou DDI" }).fill("Portugal");
    await page.waitForFunction(() => [...document.images].filter(img => img.getBoundingClientRect().height > 0).every(img => img.complete && img.naturalWidth > 0));
    assert.deepEqual(errors, []);
    assert.deepEqual(requests, []);
    const missingFlag = await fetch(`${url}/flags/br.svg`);
    assert(!missingFlag.headers.get("content-type")?.includes("image/svg+xml"));
    console.log(`${framework}: production build, flags loaded, interactions, no /flags requests or runtime errors OK`);
    await page.close();
    server.kill();
    await new Promise(resolve => server.once("exit", resolve));
    server = undefined;
  }
} finally {
  if (browser) await browser.close();
  if (server) { server.kill(); await new Promise(resolve => server.once("exit", resolve)); }
  assert.equal(path.dirname(temp), path.resolve(os.tmpdir()));
  assert(path.basename(temp).startsWith("versi-flags-"));
  fs.rmSync(temp, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
}
