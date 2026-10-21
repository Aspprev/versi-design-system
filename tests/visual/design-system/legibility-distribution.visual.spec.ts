import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { DESIGN_SYSTEM_THEMES } from "../../../src/theme-presets";
import { readLegibility, settle } from "./legibility.helpers";

type Tokens = Record<string, string>;
const baseline = JSON.parse(readFileSync("docs/correcao-legibilidade/BASELINE-ANTES.json", "utf8")).themes as Record<string, Record<string, Tokens>>;
const corrections = JSON.parse(readFileSync("docs/correcao-legibilidade/AJUSTES-FUNCIONAIS.json", "utf8")).overrides as typeof baseline;
const restorations = JSON.parse(readFileSync("docs/temas-clientes/ROSA1-RESTAURACAO.json", "utf8")).overrides as typeof baseline;
const css = readFileSync("dist/styles.css", "utf8") + "\n" + readFileSync("dist/themes.css", "utf8");
const normalize = (tokens: Tokens) => Object.fromEntries(Object.entries(tokens).map(([key, value]) => [key, value.replace(/\s/g, "")]));
const consumer = "body { margin: 0; color: rgb(var(--content-primary)); background: rgb(var(--surface-page)); }";

test("tema padrão mantém as correções com styles.css isolado", async ({ page }, info) => {
  test.skip(info.project.name === "chromium-mobile", "Contrato de tokens independente do viewport.");
  await page.setContent("<html><head></head><body></body></html>");
  await page.addStyleTag({ content:readFileSync("dist/styles.css","utf8")+consumer });
  for(const mode of ["light","dark","high-light","high-dark"]) {
    const expected={...baseline.default[mode],...corrections.default[mode]};
    const actual=await page.evaluate(({mode,names})=>{
      Object.assign(document.documentElement.dataset,{colorScheme:mode.endsWith("dark")?"dark":"light",contrast:mode.startsWith("high")?"high":"normal",contrastTheme:mode.endsWith("dark")?"dark":"light"});
      const s=getComputedStyle(document.body);return Object.fromEntries(names.map(key=>[key,s.getPropertyValue(key).trim()]));
    },{mode,names:Object.keys(expected)});
    expect(normalize(actual),mode).toEqual(normalize(expected));
  }
});

test("CSS distribuído: 288 contextos, diferenças documentadas e valores protegidos", async ({ page }, info) => {
  test.skip(info.project.name === "chromium-mobile", "Cascata independente do viewport, exercitada no desktop.");
  test.setTimeout(120_000);
  expect(readFileSync("dist/themes.css", "utf8").replace(/\r/g, ""), "Execute npm run build antes deste teste").toBe(readFileSync("src/themes.css", "utf8").replace(/\r/g, ""));
  await page.setContent("<html><head></head><body></body></html>");
  await page.addStyleTag({ content: css + consumer });
  const differences: object[] = [];
  for (const theme of DESIGN_SYSTEM_THEMES) for (const mode of ["light", "dark", "high-light", "high-dark"]) {
    const expected = { ...baseline[theme][mode], ...corrections[theme][mode], ...restorations[theme]?.[mode] };
    for (const host of ["html", "body"]) for (const identity of ["attribute", "class"]) {
      const actual = await page.evaluate(({ theme, mode, host, identity, names }) => {
        for (const el of [document.documentElement, document.body]) { el.className = ""; el.removeAttribute("data-ds-theme"); }
        Object.assign(document.documentElement.dataset, { colorScheme:mode.endsWith("dark")?"dark":"light", contrast:mode.startsWith("high")?"high":"normal", contrastTheme:mode.endsWith("dark")?"dark":"light" });
        const el = host === "html" ? document.documentElement : document.body;
        if (identity === "class") el.className = theme; else el.dataset.dsTheme = theme;
        const s = getComputedStyle(document.body);
        return Object.fromEntries(names.map(key => [key, s.getPropertyValue(key).trim()]));
      }, { theme, mode, host, identity, names:Object.keys(expected) });
      const a = normalize(actual), e = normalize(expected);
      for (const key of Object.keys(e)) if (a[key] !== e[key]) differences.push({ theme, mode, host, identity, key, expected:e[key], actual:a[key] });
      for (const key of Object.keys(baseline[theme][mode]).filter(key => /^--(primary|secondary|tertiary)-\d|^--brand-accent-|placeholder|^--content-secondary$/.test(key))) {
        expect.soft(actual[key]?.replace(/\s/g, ""), `${theme}/${mode}: protegido ${key}`).toBe((restorations[theme]?.[mode]?.[key] ?? baseline[theme][mode][key]).replace(/\s/g, ""));
      }
    }
  }
  expect(differences).toEqual([]);
});

for (const theme of DESIGN_SYSTEM_THEMES) test(`${theme}: componentes com CSS do pacote, sem estilos do Storybook`, async ({ page }, info) => {
  test.skip(info.project.name === "chromium-mobile", "Matriz completa no desktop; cobertura responsiva em legibility-mobile.");
  await page.goto("/iframe.html?id=laboratory-legibility--light&viewMode=story");
  await expect(page.locator("main.legibility-matrix")).toBeVisible();
  await page.evaluate(() => document.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => node.remove()));
  await page.addStyleTag({ content: css + consumer + readFileSync("stories/laboratory/legibility.css", "utf8") });
  const reports = [];
  for (const mode of ["light", "dark", "high-light", "high-dark"]) {
    await page.evaluate(({ theme, mode }) => Object.assign(document.documentElement.dataset, { dsTheme:theme, colorScheme:mode.endsWith("dark")?"dark":"light", contrast:mode.startsWith("high")?"high":"normal", contrastTheme:mode.endsWith("dark")?"dark":"light" }), { theme, mode });
    await settle(page.locator("main.legibility-matrix"));
    const rows = await readLegibility(page);
    reports.push({ theme, mode, rows });
    if (mode.startsWith("high")) expect.soft(rows.filter(row=>!row.disabled&&!row.uncertainBackground&&row.ratio<row.minimum), `${theme}/${mode}`).toEqual([]);
  }
  await info.attach("distributed-css", { body:JSON.stringify(reports),contentType:"application/json" });
});
