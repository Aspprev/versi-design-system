import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type * as IllustrationAssets from "../../../src/components/illustrations";
import { expect, test } from "@playwright/test";
import { DESIGN_SYSTEM_THEMES } from "../../../src/theme-presets";
import { contrastRatio } from "../../helpers/contrast";

const css = readFileSync("dist/styles.css", "utf8") + readFileSync("dist/themes.css", "utf8");
const original = JSON.parse(readFileSync("docs/reconciliation/original-chart-palettes.json", "utf8")) as Record<string, Record<string, string>>;
const approved = JSON.parse(readFileSync("docs/reconciliation/approved-overrides.json", "utf8")).overrides as Record<string, Record<string, Record<string, string>>>;
const modes = ["light", "dark", "high-light", "high-dark"];
const normalize = (value: string) => value.replace(/\s/g, "");
const highDark = JSON.parse(readFileSync("docs/high-contrast-dark/policy.json", "utf8")).tokens as Record<string, string>;
test.skip(({ isMobile }) => isMobile, "Matriz de cascata independente do viewport, coberta no desktop.");

test("padrão sem identidade e isolamento do foreground em tema aninhado", async ({page}) => {
  await page.setContent('<html><head></head><body><section data-ds-theme="azul1"><button class="versi-button-primary-flat">Ação</button></section></body></html>');
  await page.addStyleTag({content:css});
  for(const mode of modes) {
    const colors=await page.evaluate(mode=>{
      Object.assign(document.documentElement.dataset,{colorScheme:mode.endsWith('dark')?'dark':'light',contrast:mode.startsWith('high')?'high':'normal',contrastTheme:mode.endsWith('dark')?'dark':'light'});
      const style=getComputedStyle(document.body);
      return Array.from({length:12},(_,i)=>style.getPropertyValue(`--chart-donut-${i+1}`).trim());
    },mode);
    colors.forEach((color,i)=>expect(normalize(color)).toBe(normalize((mode === "high-dark" ? highDark[`--chart-donut-${i+1}`] : undefined) ?? approved.default[mode]?.[`--chart-donut-${i+1}`]??original[`default/${mode}`][`--chart-donut-${i+1}`])));
  }
  const foreground=await page.evaluate(()=>{
    Object.assign(document.documentElement.dataset,{colorScheme:'light',contrast:'normal'});
    document.body.className='custom2178';
    return getComputedStyle(document.querySelector('button')!).getPropertyValue('--action-primary-content');
  });
  expect(normalize(foreground)).toBe('255,255,255');
});

for (const theme of DESIGN_SYSTEM_THEMES) test(`${theme}: quatro modos, classe/atributo, html/body, paletas e contraste`, async ({ page }) => {
  await page.setContent("<html><head></head><body></body></html>");
  await page.addStyleTag({ content: css });
  for (const mode of modes) for (const target of ["html", "body"]) for (const identity of ["class", "attribute"]) {
    const values = await page.evaluate(({ theme, mode, target, identity }) => {
      for (const el of [document.body, document.documentElement]) { el.className = ""; el.removeAttribute("data-ds-theme"); }
      Object.assign(document.documentElement.dataset, {colorScheme: mode.endsWith("dark") ? "dark" : "light", contrast: mode.startsWith("high") ? "high" : "normal", contrastTheme: mode.endsWith("dark") ? "dark" : "light"});
      const el = target === "html" ? document.documentElement : document.body;
      if (identity === "class") el.className = theme; else el.dataset.dsTheme = theme;
      const style = getComputedStyle(document.body);
      return Object.fromEntries(Array.from(style).filter(n => n.startsWith("--")).map(n => [n, style.getPropertyValue(n).trim()]));
    }, { theme, mode, target, identity });
    const context = `${theme}/${mode}/${target}/${identity}`;
    const old = original[`${theme}/${mode}`];
    for (let i=1;i<=12;i++) {
      const series = `--chart-${i}`, donut = `--chart-donut-${i}`;
      const expectedSeries = mode === "high-dark" ? highDark[series] : theme === "custom2178" ? approved[theme][mode][series] : old[series];
      expect(normalize(values[series]), `${context}/${series}`).toBe(normalize(expectedSeries));
      const expectedDonut = (mode === "high-dark" ? highDark[donut] : undefined) ?? approved[theme]?.[mode]?.[donut] ?? old[donut];
      expect(normalize(values[donut]), `${context}/${donut}`).toBe(normalize(expectedDonut));
      if (theme !== "custom2178" && !mode.startsWith("high")) expect(normalize(values[donut])).toBe(old[donut].split(",").map(Number).map(c => Math.round(c*.78+255*.22)).join(","));
      if (mode.startsWith("high")) expect(contrastRatio(values[donut], values["--surface-card-semantic"]), `${context}/${donut}`).toBeGreaterThanOrEqual(3);
    }
    if (theme === "custom2178") {
      for (const state of ["", "-hover", "-active"]) expect(contrastRatio(values[`--action-primary-background${state}`], values[`--action-primary-content${state}`]), `${context}/action${state}`).toBeGreaterThanOrEqual(4.5);
      for (let i=1;i<=3;i++) expect(contrastRatio(values[`--brand-accent-${i}-content`],values[`--brand-accent-${i}-soft`]), `${context}/accent${i}`).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(values["--content-link"], values["--surface-card-semantic"]), `${context}/link`).toBeGreaterThanOrEqual(4.5);
    }
  }
});

test("assets: cores fixas, pares dos checkbox e troca dinâmica nos 72 contextos", async ({ page }) => {
  // Compiled JSX uses React's runtime rather than Playwright's JSX transform.
  const compiledPath = "../../../dist/illustrations/index.js";
  const assets = await import(compiledPath) as typeof IllustrationAssets;
  const selected = [assets.IllustrationPortalBanner, assets.IllustrationError, assets.IllustrationLoginHmgImg, assets.IllustrationUnderDevelopmentImage, assets.IllustrationVantagens, assets.IllustrationInvestment, assets.IllustrationImpostoRendaImg, assets.IllustrationUnableImage, assets.IllustrationContribuicaoAdicionalImg];
  await page.setContent('<html><head></head><body>'+selected.map((Asset,i) => renderToStaticMarkup(createElement(Asset,{className:`asset-${i}`,style:{width:380,height:280}}))).join("")+'</body></html>');
  await page.addStyleTag({content:css+'body{background:rgb(var(--surface-page));color:rgb(var(--content-primary));display:grid;grid-template-columns:repeat(3,380px);gap:16px;}'});
  for (const theme of DESIGN_SYSTEM_THEMES) for (const mode of modes) {
    const result = await page.evaluate(({theme,mode}) => {
      document.body.className=theme;
      Object.assign(document.documentElement.dataset,{colorScheme:mode.endsWith('dark')?'dark':'light',contrast:mode.startsWith('high')?'high':'normal',contrastTheme:mode.endsWith('dark')?'dark':'light'});
      const fill=(el:Element)=>getComputedStyle(el).fill;
      return {
        fixed:[...document.querySelectorAll('.asset-0 circle, .asset-1 [fill="#80868E"], .asset-2 [fill="#A8ADB4"], .asset-3 [fill="#80868E"], .asset-5 [fill="#EAB308"], .asset-6 [fill="#A16207"], .asset-7 [fill="#42be65"], .asset-7 [fill="#D80813"]')].map(el=>({actual:fill(el),original:el.getAttribute('fill')})),
        checks:[...document.querySelectorAll('.asset-4 g[data-brand-accent="1"]')].map(g=>({bg:fill(g.querySelector('[data-illustration-role="support"]')!),fg:fill(g.querySelector('[data-illustration-role="on-support"]')!)})),
        shirts:[...document.querySelectorAll('.asset-8 path[data-brand-accent]')].map(el=>{const probe=document.createElement('span');probe.style.color=getComputedStyle(el).getPropertyValue('--illustration-support').trim();document.body.append(probe);const expected=getComputedStyle(probe).color;probe.remove();return {actual:fill(el),expected};}),
      };
    },{theme,mode});
    expect(result.fixed.length).toBeGreaterThan(20);
    for(const color of result.fixed) {
      const hex = color.original!.toLowerCase();
      const normalized = hex.length===4 ? '#'+hex.slice(1).split('').map(c=>c+c).join('') : hex;
      const channels = normalized.slice(1).match(/../g)!.map(c=>parseInt(c,16));
      expect(color.actual,`${theme}/${mode}/${hex}`).toBe(`rgb(${channels.join(', ')})`);
    }
    expect(result.checks).toHaveLength(4);
    for(const pair of result.checks) expect(contrastRatio(pair.bg,pair.fg),`${theme}/${mode}/check`).toBeGreaterThanOrEqual(4.5);
    expect(result.shirts).toHaveLength(5);
    for(const shirt of result.shirts) expect(shirt.actual.replace(/\s/g,''),`${theme}/${mode}/shirt`).toBe(shirt.expected.replace(/\s/g,''));
    if(theme==='custom2170'||theme==='custom2178') await page.screenshot({path:`test-results/reconciliation/${theme}-assets-${mode}.png`,fullPage:true});
  }
});
