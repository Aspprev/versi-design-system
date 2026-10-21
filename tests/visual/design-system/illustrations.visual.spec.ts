import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { DESIGN_SYSTEM_THEMES } from "../../../src/theme-presets";
import { contrastRatio } from "../../helpers/contrast";

const css = readFileSync("dist/styles.css", "utf8") + "\n" + readFileSync("dist/themes.css", "utf8");

for (const theme of DESIGN_SYSTEM_THEMES) test(`ilustrações: ${theme}, pares calculados nos quatro modos`, async ({ page }, info) => {
  await page.goto("/iframe.html?id=foundations-illustrations--light&viewMode=story");
  await expect(page.locator("main.illustration-docs")).toBeVisible();
  await page.addStyleTag({ content: css });
  const reports: unknown[] = [];
  for (const mode of ["light", "dark", "high-light", "high-dark"]) {
    await page.evaluate(({ theme, mode }) => {
      document.body.className = "";
      document.body.removeAttribute("data-ds-theme");
      Object.assign(document.documentElement.dataset, { dsTheme: theme, colorScheme: mode.endsWith("dark") ? "dark" : "light", contrast: mode.startsWith("high") ? "high" : "normal", contrastTheme: mode.endsWith("dark") ? "dark" : "light" });
      document.querySelectorAll<SVGElement>("svg").forEach(svg => [1, 2, 3].forEach(n => svg.style.removeProperty(`--brand-accent-${n}`)));
    }, { theme, mode });
    const result = await page.locator("main.illustration-docs").evaluate(main => {
      const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      const rgb = (color: string) => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3).join(","); };
      const pairs = () => [...main.querySelectorAll("[data-pair]")].map(group => ({
        name: group.getAttribute("data-pair")!,
        bg: rgb(getComputedStyle(group.querySelector("[data-pair-background]")!).fill),
        text: group.querySelector("[data-pair-text]") ? rgb(getComputedStyle(group.querySelector("[data-pair-text]")!).fill) : null,
        symbol: rgb(getComputedStyle(group.querySelector("[data-pair-symbol]")!).fill),
      }));
      const before = pairs();
      const informational = [...main.querySelectorAll("[data-informative]")].map(el => ({
        kind: el.getAttribute("data-informative"),
        fg: rgb(el.getAttribute("data-informative") === "stroke" ? getComputedStyle(el).stroke : getComputedStyle(el).fill),
        bg: rgb(getComputedStyle(el.closest("[data-surface]")!).backgroundColor),
      }));
      const narrative = [...main.querySelectorAll("[data-narrative]")].map(el => rgb(getComputedStyle(el).fill));
      const root = main.querySelector(".versi-illustration")!;
      const style = getComputedStyle(root);
      const resolvedColor = (color: string) => { const probe = document.createElementNS("http://www.w3.org/2000/svg", "rect"); probe.style.fill = color; root.append(probe); const value = rgb(getComputedStyle(probe).fill); probe.remove(); return value; };
      const tokenColor = (token: string) => resolvedColor(`rgb(var(${token}))`);
      const accents = [1, 2, 3].map(n => ({
        solid: tokenColor(`--brand-accent-${n}`),
        soft: resolvedColor(`color-mix(in srgb, rgb(var(--brand-accent-${n})) 22%, rgb(var(--surface-card-semantic)))`),
      }));
      const normal = {
        background: rgb(style.getPropertyValue("--illustration-background")), expectedBackground: tokenColor("--surface-muted"),
        surface: rgb(style.getPropertyValue("--illustration-surface")), expectedSurface: tokenColor("--surface-card-semantic"),
        ink: rgb(style.getPropertyValue("--illustration-ink")), expectedInk: tokenColor("--content-primary"),
        outline: rgb(style.getPropertyValue("--illustration-outline")), expectedOutline: tokenColor("--border-default"),
        accent: rgb(style.getPropertyValue("--illustration-accent")),
        expectedAccent: tokenColor(document.documentElement.dataset.colorScheme === "dark" ? "--content-link" : "--primary-1"),
      };
      const status = Object.fromEntries(["success", "error", "warning"].map((state, i) => [state, tokenColor(`--status-${["green", "red", "yellow"][i]}-solid-background`)]));
      const legacyInk = rgb(getComputedStyle(main.querySelector('.portal-illustration [fill="#191C1F"]')!).fill);
      const expectedLegacyInk = tokenColor("--surface-action-neutral");
      main.querySelectorAll<SVGElement>("svg").forEach(svg => [1, 2, 3].forEach(n => svg.style.setProperty(`--brand-accent-${n}`, n === 1 ? "255, 0, 255" : "0, 255, 255")));
      const after = pairs();
      return { before, after, informational, narrative, normal, status, legacyInk, expectedLegacyInk, accents };
    });
    reports.push({ theme, mode, ...result });
    if (mode.startsWith("high")) {
      for (const pair of result.before) {
        expect(contrastRatio(pair.symbol, pair.bg), `${theme}/${mode}/${pair.name}/symbol`).toBeGreaterThanOrEqual(3);
        if (pair.text) expect(contrastRatio(pair.text, pair.bg), `${theme}/${mode}/${pair.name}/text`).toBeGreaterThanOrEqual(4.5);
      }
      for (const pair of result.informational) expect(contrastRatio(pair.fg, pair.bg), `${mode}/${pair.kind}`).toBeGreaterThanOrEqual(pair.kind === "text" ? 4.5 : 3);
      expect(result.after, "Alterar acentos decorativos não altera as ilustrações em HC").toEqual(result.before);
      for (const pair of result.before.filter(pair => pair.name.startsWith("accent-"))) {
        expect(pair.bg).toBe(pair.name.endsWith("soft") ? result.normal.expectedBackground : result.before.find(pair => pair.name === "primary")!.bg);
      }
      if (mode === "high-dark") expect(result.before.find(pair => pair.name === "primary")!.symbol).toBe("0,0,0");
    } else {
      const n = result.normal;
      expect(n.background).toBe(n.expectedBackground); expect(n.surface).toBe(n.expectedSurface);
      expect(n.ink).toBe(n.expectedInk); expect(n.outline).toBe(n.expectedOutline); expect(n.accent).toBe(n.expectedAccent);
      expect(result.legacyInk).toBe(result.expectedLegacyInk);
      expect(result.before.find(pair => pair.name === "legacy-success")!.bg).toBe("0,110,47");
      expect(result.before.find(pair => pair.name === "legacy-primary")!.symbol).toBe("255,255,255");
      for (const pair of result.before.filter(pair => pair.name.startsWith("accent-"))) {
        const index = Number(pair.name.split("-")[1]) - 1;
        expect(pair.bg, `${mode}/${pair.name}: índice e tom do acento`).toBe(result.accents[index][pair.name.endsWith("soft") ? "soft" : "solid"]);
        expect(contrastRatio(pair.text!, pair.bg), `${mode}/${pair.name}/text`).toBeGreaterThanOrEqual(4.5);
      }
    }
    for (const [state, bg] of Object.entries(result.status)) expect(result.before.find(pair => pair.name === state)!.bg, `${mode}/${state}: estado semântico prevalece sobre marca`).toBe(bg);
    expect(result.narrative).toEqual(["255,190,157", "120,61,25"]);
  }
  const report = info.outputPath("computed-colors.json");
  mkdirSync(path.dirname(report), { recursive: true });
  writeFileSync(report, JSON.stringify(reports, null, 2));
  await info.attach("illustration-computed-colors", { path: report, contentType: "application/json" });
});

test("ilustrações: estilos do pacote são opt-in e aceitam a classe legada", async ({ page }) => {
  await page.goto("/iframe.html?id=foundations-illustrations--high-dark&viewMode=story");
  await expect(page.locator("main.illustration-docs")).toBeVisible();
  await page.addStyleTag({ content: css });
  const unscoped = await page.evaluate(() => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.innerHTML = '<rect fill="#fff" data-brand-accent="2" width="10" height="10"/>';
    document.body.append(svg); const fill = getComputedStyle(svg.firstElementChild!).fill; svg.remove(); return fill;
  });
  expect(unscoped).toBe("rgb(255, 255, 255)");
  await expect(page.locator("svg.portal-illustration")).toBeVisible();
});

test("ilustrações: pares HC aceitam identidade por classe/atributo no html/body", async ({ page }) => {
  await page.setContent('<html><body><svg class="versi-illustration"><g data-brand-accent="2"><rect data-illustration-role="support" width="80" height="40"/><text data-illustration-role="on-support">IR</text></g></svg></body></html>');
  await page.addStyleTag({ content: css });
  for (const theme of DESIGN_SYSTEM_THEMES) for (const mode of ["light", "dark"]) {
    let reference: { bg: string; fg: string } | undefined;
    for (const host of ["html", "body"]) for (const identity of ["attribute", "class"]) {
      const actual = await page.evaluate(({ theme, mode, host, identity }) => {
        for (const el of [document.documentElement, document.body]) { el.className = ""; el.removeAttribute("data-ds-theme"); }
        Object.assign(document.documentElement.dataset, { contrast: "high", contrastTheme: mode, colorScheme: mode });
        const target = host === "html" ? document.documentElement : document.body;
        if (identity === "class") target.className = theme; else target.dataset.dsTheme = theme;
        return { bg: getComputedStyle(document.querySelector("rect")!).fill, fg: getComputedStyle(document.querySelector("text")!).fill };
      }, { theme, mode, host, identity });
      expect(contrastRatio(actual.fg, actual.bg), `${theme}/${mode}/${host}/${identity}`).toBeGreaterThanOrEqual(4.5);
      reference ??= actual;
      expect(actual).toEqual(reference);
    }
  }
});
