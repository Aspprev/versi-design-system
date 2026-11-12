import { createHash } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import { createElement, type SVGProps } from "react";
import type * as IllustrationAssets from "../../../src/components/illustrations";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "@playwright/test";
import { DESIGN_SYSTEM_THEMES } from "../../../src/theme-presets";
import { contrastRatio } from "../../helpers/contrast";

const css=readFileSync("dist/styles.css","utf8")+readFileSync("dist/themes.css","utf8");
const policy=JSON.parse(readFileSync("docs/high-contrast-dark/policy.json","utf8")).tokens as Record<string,string>;
const baseline=JSON.parse(readFileSync("docs/high-contrast-dark/other-modes-baseline.json","utf8")) as {names:string[];contexts:Record<string,{tokens:string;illustrations:string}>};
const hash=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const normalize=(s:string)=>s.replace(/\s/g,"");
test.skip(({isMobile})=>isMobile,"Política e cascata independentes do viewport.");

async function assetMarkup(){const compiledPath="../../../dist/illustrations/index.js";const assets=await import(compiledPath) as typeof IllustrationAssets;return Object.entries(assets).map(([name,Asset])=>renderToStaticMarkup(createElement(Asset,{"data-asset":name} as SVGProps<SVGSVGElement>))).join("");}

test("três modos preservados: todos os tokens e cores dos 29 SVGs nos 18 temas",async({page})=>{
  test.setTimeout(180_000);
  await page.setContent('<html><head></head><body>'+await assetMarkup()+'</body></html>');
  await page.addStyleTag({content:css});
  for(const [key,expected] of Object.entries(baseline.contexts)){
    const [theme,mode]=key.split('/');
    const actual=await page.evaluate(({theme,mode,names})=>{
      document.body.className=theme;
      Object.assign(document.documentElement.dataset,{colorScheme:mode==='dark'?'dark':'light',contrast:mode.startsWith('high')?'high':'normal',contrastTheme:'light'});
      const s=getComputedStyle(document.body);
      const tokens=Object.fromEntries(names.map(n=>[n,s.getPropertyValue(n).trim().replace(/\s/g,'')]));
      const illustrations=[...document.querySelectorAll('svg[data-asset]')].map(svg=>[svg.getAttribute('data-asset'),[...svg.querySelectorAll('path,circle,rect,ellipse,polygon,polyline,line,text,g')].map(el=>{const st=getComputedStyle(el);return [st.fill,st.stroke,st.strokeWidth,st.opacity,st.fillOpacity,st.strokeOpacity];})]);
      return {tokens,illustrations};
    },{theme,mode,names:baseline.names});
    expect(hash(actual.tokens),`${key}/tokens`).toBe(expected.tokens);
    expect(hash(actual.illustrations),`${key}/SVG`).toBe(expected.illustrations);
  }
});

test("política vence identidades, escopos e previews inline e alcança portais",async({page})=>{
  await page.setContent('<html><head></head><body><section></section><input type="checkbox" class="checkbox-control" checked><div id="portal" style="color:rgb(var(--content-inverse));background:rgb(var(--surface-tooltip))">Tooltip em portal</div></body></html>');
  await page.addStyleTag({content:css});
  for(const theme of [...DESIGN_SYSTEM_THEMES,'preview-violeta']) for(const host of ['html','body','section']) for(const identity of ['class','attribute']){
    const actual=await page.evaluate(({theme,host,identity,names})=>{
      for(const el of [document.documentElement,document.body,document.querySelector('section')!] as HTMLElement[]){el.className='';el.removeAttribute('data-ds-theme');el.style.cssText='';}
      // Deliberately stale contrast-theme must not defeat the exact combination.
      Object.assign(document.documentElement.dataset,{colorScheme:'dark',contrast:'high',contrastTheme:'light'});
      const el=document.querySelector(host)! as HTMLElement;
      if(identity==='class')el.className=theme;else el.dataset.dsTheme=theme;
      for(const name of names)el.style.setProperty(name,'1, 2, 3');
      const styles=getComputedStyle(el);
      const tokens=Object.fromEntries(names.map(n=>[n,styles.getPropertyValue(n).trim().replace(/\s/g,'')]));
      const portal=getComputedStyle(document.querySelector('#portal')!);
      return {tokens,portal:{fg:portal.color,bg:portal.backgroundColor},check:getComputedStyle(document.querySelector('input')!).backgroundImage};
    },{theme,host,identity,names:Object.keys(policy)});
    // An unknown preview class alone is not an identity API. Its inline tokens
    // are covered on html/body, or by the public data-ds-theme scope.
    if(theme==='preview-violeta'&&host==='section'&&identity==='class')continue;
    expect(actual.tokens,`${theme}/${host}/${identity}`).toEqual(Object.fromEntries(Object.entries(policy).map(([n,v])=>[n,normalize(v)])));
    expect(contrastRatio(actual.portal.fg,actual.portal.bg)).toBe(21);
    await expect(page.locator('.checkbox-control')).toHaveCSS('background-image', /%23000/);
  }
});

test("SVGs: cabelo preto, cores narrativas, banner, notas verdes e lupa preta",async({page})=>{
  await page.setContent('<html data-color-scheme="dark" data-contrast="high"><head></head><body>'+await assetMarkup()+'</body></html>');
  await page.addStyleTag({content:css+'body{background:#000;color:#ffff00;display:grid;grid-template-columns:repeat(4,300px);gap:16px}svg[data-asset]{width:300px;height:240px}'});
  const result=await page.evaluate(()=>{
    const fill=(el:Element)=>getComputedStyle(el).fill;
    const asset=(name:string)=>document.querySelector(`[data-asset="${name}"]`)!;
    const banner=asset('IllustrationPortalBanner');
    return {
      ink:[...document.querySelectorAll('svg [fill="#191C1F"]:not([data-brand-accent])')].map(fill),
      valid:[...document.querySelectorAll('svg[data-asset]')].map(svg=>['--illustration-accent','--illustration-ink','--illustration-support'].every(n=>CSS.supports('color',getComputedStyle(svg).getPropertyValue(n)))),
      banner:{field:fill(banner),text:fill(banner.querySelector('[fill*="portal-banner-text"]')!),circles:[...banner.querySelectorAll('circle')].map(fill),clothes:[1,2,3].map(n=>fill(banner.querySelector(`[data-brand-accent="${n}"]`)!))},
      notes:[...asset('IllustrationPixRecorrenteImg').querySelectorAll('[data-brand-accent]')].map(fill),
      search:[...asset('IllustrationSearch').querySelectorAll('[data-illustration-high-dark="ink"]')].map(fill),
      successChecks:['IllustrationMobileInbox','IllustrationAtivarPixImg'].map(name=>({bg:fill(asset(name).querySelector('[data-illustration-success]')!),fg:fill(asset(name).querySelector('[data-illustration-on-success]')!)})),
      fixed:[...document.querySelectorAll('svg [fill]:not([data-illustration-success]):not([data-illustration-error])')].filter(el=>/^#(?:EAB308|A16207|80868E|A8ADB4|42BE65|D80813|FFBE9D|AE7461)$/i.test(el.getAttribute('fill')!)).map(el=>({original:el.getAttribute('fill')!,computed:fill(el)})),
    };
  });
  expect(result.ink.length).toBeGreaterThan(100);expect(new Set(result.ink)).toEqual(new Set(['rgb(0, 0, 0)']));
  expect(result.valid.every(Boolean)).toBe(true);
  expect(result.banner).toEqual({field:'rgb(255, 223, 0)',text:'rgb(0, 0, 0)',circles:['rgb(255, 255, 255)','rgb(255, 255, 255)'],clothes:['rgb(102, 179, 255)','rgb(255, 133, 157)','rgb(204, 153, 255)']});
  expect(result.notes).toHaveLength(4);expect(new Set(result.notes)).toEqual(new Set(['rgb(22, 83, 43)']));
  expect(result.search).toEqual(['rgb(0, 0, 0)','rgb(0, 0, 0)']);
  for(const pair of result.successChecks)expect(contrastRatio(pair.fg,pair.bg)).toBeGreaterThanOrEqual(7);
  for(const v of result.fixed){const rgb=v.original.slice(1).match(/../g)!.map(c=>parseInt(c,16));expect(v.computed,v.original).toBe(`rgb(${rgb.join(', ')})`);}
  mkdirSync('test-results/high-contrast-dark',{recursive:true});
  await page.screenshot({path:'test-results/high-contrast-dark/illustrations.png',fullPage:true});
});

test("componentes reais: estados, avisos, tooltips, slider, padrões e interação",async({page},info)=>{
  test.skip(!info.config.webServer,"Requer Storybook; os outros contratos rodam sem servidor.");
  test.setTimeout(180_000);
  await page.goto('/iframe.html?id=laboratory-high-contrast-dark--universal&viewMode=story');
  await expect(page.locator('[data-high-dark-lab]')).toBeVisible();
  await expect(page.locator('.apexcharts-canvas')).toHaveCount(2);
  for(const theme of DESIGN_SYSTEM_THEMES){
    await page.evaluate(theme=>{document.body.className=theme;document.body.style.setProperty('--primary-1','1, 2, 3');Object.assign(document.documentElement.dataset,{colorScheme:'dark',contrast:'high',contrastTheme:'dark'});},theme);
    for(const color of ['primary','secondary','danger','warning','primary-outline']){
      const button=page.getByTestId(`universal-${color}`);
      for(const state of ['default','hover','active']){
        if(state==='default')await page.mouse.move(0,0);else await button.hover();
        if(state==='active')await page.mouse.down();
        const pair=await button.evaluate(el=>({fg:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor}));
        if(state==='active')await page.mouse.up();
        expect(contrastRatio(pair.fg,pair.bg),`${theme}/${color}/${state}`).toBeGreaterThanOrEqual(7);
        if(color==='primary-outline'&&state==='active')expect(pair).toEqual({fg:'rgb(255, 255, 255)',bg:'rgb(0, 90, 0)'});
      }
    }
    const pairs=await page.locator('[data-high-dark-lab]').evaluate(root=>({
      notices:[...root.querySelectorAll('[data-versi-notice]')].map(el=>({type:el.getAttribute('data-versi-notice'),fg:getComputedStyle(el.querySelector('.text-content-primary')!).color,bg:getComputedStyle(el).backgroundColor})),
      icon:getComputedStyle(root.querySelector('[data-testid="secondary-icon"] svg')!).color,
      slider:(()=>{const s=getComputedStyle(root.querySelector('[role="slider"] .bg-surface-tooltip')!);return {fg:s.color,bg:s.backgroundColor,border:s.borderTopColor,width:s.borderTopWidth};})(),
    }));
    expect(pairs.icon).toBe('rgb(0, 0, 0)');expect(contrastRatio(pairs.slider.fg,pairs.slider.bg)).toBe(21);expect(parseFloat(pairs.slider.width)).toBeGreaterThanOrEqual(1);
    for(const pair of pairs.notices){expect(contrastRatio(pair.fg,pair.bg)).toBeGreaterThanOrEqual(7);expect(normalize(pair.fg)).toBe(`rgb(${normalize(policy[`--feedback-${pair.type}-content`])})`);}
  }
  await page.getByRole('button',{name:'Mostrar tooltip',exact:true}).click();
  const tooltip=page.getByRole('tooltip');await expect(tooltip).toBeVisible();
  for(const el of [tooltip,tooltip.locator('strong'),tooltip.locator('span')])expect(await el.evaluate(el=>getComputedStyle(el).color)).toBe('rgb(255, 255, 255)');
  await page.getByRole('slider',{name:'Percentual'}).focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('slider',{name:'Percentual'})).toHaveAttribute('aria-valuenow','40');
  await expect.poll(()=>page.locator('pattern').count()).toBeGreaterThanOrEqual(5);
  const pie=page.locator('.apexcharts-pie-area').first();await pie.hover({force:true});
  await expect(page.locator('.apexcharts-tooltip').filter({has:page.locator('.donut-chart-tooltip')}).first()).toBeVisible();
  const boundaries=await page.locator('.apexcharts-pie-area').evaluateAll(els=>els.map(el=>getComputedStyle(el).stroke));expect(new Set(boundaries)).toEqual(new Set(['rgb(0, 0, 0)']));
  const label=page.locator('.apexcharts-datalabels text').first();
  const halo=await label.evaluate(el=>({stroke:getComputedStyle(el).stroke,width:getComputedStyle(el).strokeWidth,paint:getComputedStyle(el).paintOrder}));
  expect(halo.stroke).toBe('rgb(0, 0, 0)');expect(halo.width).toBe('4px');expect(halo.paint.startsWith('stroke')).toBe(true);
  const region=page.getByRole('group',{name:'Distribuição universal'});await region.focus();await page.keyboard.press('ArrowRight');
  await expect(region.locator('[aria-live]').first()).toContainText('Série 1');
  await page.keyboard.press('Escape');await expect(region.locator('[aria-live]').first()).toContainText('Nenhuma categoria');
  const line=page.locator('.apexcharts-line').first();const universalStroke=await line.evaluate(el=>getComputedStyle(el).stroke);
  await page.evaluate(()=>{document.body.style.removeProperty('--primary-1');document.documentElement.dataset.contrast='normal';});
  await expect.poll(()=>line.evaluate(el=>getComputedStyle(el).stroke)).not.toBe(universalStroke);
  await page.evaluate(()=>document.documentElement.dataset.contrast='high');
  await expect.poll(()=>line.evaluate(el=>getComputedStyle(el).stroke)).toBe(universalStroke);
  await page.screenshot({path:'test-results/high-contrast-dark/components.png',fullPage:true});
});
