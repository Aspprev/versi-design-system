// Read-only consumer audit. Run before changing the canonical registry.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const portal = path.resolve(process.argv[2] ?? '../por-portal-aspprev');
const read = file => fs.readFileSync(file, 'utf8');
const registry = JSON.parse(read('tokens/design-system.tokens.json'));
const names = [...new Set([...registry.tokens, ...registry.themes].flatMap(r => r.declarations.map(d => d.property)))];
const themes = ['default','azul1','azul2','azul3','laranja1','laranja2','verde1','verde2','verde3','verde4','rosa1','custom2178','custom2156','custom2140','custom2133','custom2170','custom2162','custom2157'];
const modes = ['light','dark','high-light','high-dark'];
const browser = await chromium.launch();
const page = await browser.newPage();
const result = {};
try {
  for (const [label, css] of Object.entries({
    ds: read('dist/styles.css') + read('dist/themes.css'),
    installed: read(path.join(portal,'node_modules/@aspprev/versi-ds/dist/styles.css')) + read(path.join(portal,'node_modules/@aspprev/versi-ds/dist/themes.css')),
    portal: read(path.join(portal,'node_modules/@aspprev/versi-ds/dist/styles.css')) + read(path.join(portal,'node_modules/@aspprev/versi-ds/dist/themes.css')) + read(path.join(portal,'src/styles/globals.css')) + read(path.join(portal,'src/styles/custom2178.css')),
  })) {
    await page.setContent('<html><head></head><body></body></html>');
    await page.addStyleTag({content: css});
    result[label] = {};
    for (const theme of themes) for (const mode of modes) {
      result[label][`${theme}/${mode}`] = await page.evaluate(({theme,mode,names}) => {
        document.body.className = theme;
        Object.assign(document.documentElement.dataset, {colorScheme:mode.endsWith('dark')?'dark':'light',contrast:mode.startsWith('high')?'high':'normal',contrastTheme:mode.endsWith('dark')?'dark':'light'});
        const s = getComputedStyle(document.body);
        return Object.fromEntries(names.map(n => [n,s.getPropertyValue(n).trim().replace(/\s/g,'')]));
      }, {theme,mode,names});
    }
  }
} finally { await browser.close(); }
const differences = {};
for (const key of Object.keys(result.ds)) {
  differences[key] = {};
  for (const name of names) {
    const values = Object.fromEntries(Object.keys(result).map(label => [label,result[label][key][name]]));
    if (new Set(Object.values(values)).size > 1) differences[key][name] = values;
  }
}
fs.mkdirSync('docs/reconciliation', {recursive:true});
fs.mkdirSync('.local/reconciliation', {recursive:true});
fs.writeFileSync('.local/reconciliation/current-audit.json', JSON.stringify({installedVersion:JSON.parse(read(path.join(portal,'node_modules/@aspprev/versi-ds/package.json'))).version, themes, modes, differences},null,2)+'\n');
console.log(Object.fromEntries(Object.entries(differences).map(([k,v]) => [k,Object.keys(v).length])));
