import {writeFileSync} from 'node:fs';
import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {DESIGN_SYSTEM_THEMES} from '../../../src/theme-presets';
import {contrastRatio} from '../../helpers/contrast';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

test('outline primária: seleção coerente em HC e modos comuns preservados',async({page})=>{
 const compiled='../../../dist/core.js';
 const {Button}=await import(compiled) as typeof import('../../../src/core');
 const icon=()=>createElement('svg',{fill:'currentColor'},createElement('path',{d:'M0 0h1v1H0z'}));
 const markup=renderToStaticMarkup(createElement(Button,{variant:'outline',color:'primary',leadIcon:icon},'Outline'));
 await page.setContent('<html><head></head><body>'+markup+'</body></html>');
 await page.addStyleTag({content:readFileSync('dist/styles.css','utf8')+readFileSync('dist/themes.css','utf8')});
 const button=page.getByRole('button',{name:'Outline',exact:true});
 const results=[];
 for(const theme of DESIGN_SYSTEM_THEMES)for(const mode of ['light','dark','high-light','high-dark']){
  await page.evaluate(({theme,mode})=>{document.body.className=theme;Object.assign(document.documentElement.dataset,{colorScheme:mode.endsWith('dark')?'dark':'light',contrast:mode.startsWith('high')?'high':'normal',contrastTheme:mode.endsWith('dark')?'dark':'light'});},{theme,mode});
  await button.hover();await page.mouse.down();
  const pair=await button.evaluate(el=>{const s=getComputedStyle(el);return {fg:s.color,bg:s.backgroundColor,icon:getComputedStyle(el.querySelector('svg')!).color,expected:s.getPropertyValue(document.documentElement.dataset.contrast==='high'?'--selection-content':'--content-on-brand').trim()};}).finally(()=>page.mouse.up());
  expect(pair.fg).toBe(`rgb(${pair.expected.split(',').map(Number).join(', ')})`);
  expect(pair.icon).toBe(pair.fg);
  const ratio=contrastRatio(pair.fg,pair.bg);
  if(mode.startsWith('high'))expect(ratio,`${theme}/${mode}`).toBeGreaterThanOrEqual(mode==='high-dark'?7:4.5);
  results.push({theme,mode,...pair,ratio});
 }
 writeFileSync('docs/high-contrast-dark/primary-outline-contrast.json',JSON.stringify(results,null,2)+'\n');
});
test('ações secundárias: pares semânticos nos quatro modos e 18 temas',async({page})=>{
 await page.setContent('<html><head></head><body><button><svg></svg>Ação</button></body></html>');
 await page.addStyleTag({content:readFileSync('dist/styles.css','utf8')+readFileSync('dist/themes.css','utf8')+'button{background:rgb(var(--action-secondary-background));color:rgb(var(--action-secondary-content))}svg{color:inherit}'});
 const results=[];
 for(const theme of DESIGN_SYSTEM_THEMES)for(const mode of ['light','dark','high-light','high-dark']){
 await page.evaluate(({theme,mode})=>{document.body.className=theme;Object.assign(document.documentElement.dataset,{colorScheme:mode.endsWith('dark')?'dark':'light',contrast:mode.startsWith('high')?'high':'normal',contrastTheme:mode.endsWith('dark')?'dark':'light'});},{theme,mode});
 const pair=await page.locator('button').evaluate(el=>{const s=getComputedStyle(el);const v=(n:string)=>s.getPropertyValue(n).trim();return {bg:s.backgroundColor,fg:s.color,icon:getComputedStyle(el.querySelector('svg')!).color,legacy:v('--secondary-1'),states:['','-hover','-active'].map(state=>({bg:v('--action-secondary-background'+state),fg:v('--action-secondary-content'+state)}))};});
 for(const state of pair.states)expect(contrastRatio(state.bg,state.fg),`${theme}/${mode}`).toBeGreaterThanOrEqual(mode==='high-dark'?7:4.5);
 expect(pair.icon).toBe(pair.fg);if(mode==='high-dark'){expect(pair.fg).toBe('rgb(0, 0, 0)');expect(pair.bg).toBe('rgb(255, 223, 0)');}
 results.push({theme,mode,...pair,ratio:contrastRatio(pair.bg,pair.fg),legacyRatio:contrastRatio(pair.legacy,pair.fg)});
 }
 writeFileSync('docs/high-contrast-dark/secondary-action-contrast.json',JSON.stringify(results,null,2)+'\n');
});

