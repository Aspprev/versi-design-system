import { useState } from "react";
import tokenCss from "../../src/tokens.css?raw";
import themeCss from "../../src/themes.css?raw";
import { GROUPS, THEMES, MODES, TOKENS, hex } from "./colorTokens";

type Snapshot = { theme: string; mode: string; values: Record<string, string> };
const DOCUMENT = `<!doctype html><html><head><style>${tokenCss}\n${themeCss}</style></head><body></body></html>`;

export function ThemeTokenMatrix() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [theme, setTheme] = useState("all");
  const [mode, setMode] = useState("all");
  const [group, setGroup] = useState(GROUPS[0].title);
  const tokens = GROUPS.find(item => item.title === group)!.tokens;
  return <section id="colors-matrix">
    <h2>Todos os temas e modos</h2>
    <p>11 temas × 4 modos = 44 combinações. A matriz lê o CSS original do pacote em um documento isolado, sem alterar a toolbar. Personalizações locais da aplicação não entram nesta comparação.</p>
    <p>No alto contraste, algumas cores podem coincidir entre presets para priorizar a legibilidade. Selecione Campos para comparar conteúdo, placeholder e estados desabilitados.</p>
    <div className="versi-colors-filters">
      <label>Tema<select value={theme} onChange={e => setTheme(e.target.value)}><option value="all">Todos os temas</option>{THEMES.map(item => <option key={item}>{item}</option>)}</select></label>
      <label>Modo<select value={mode} onChange={e => setMode(e.target.value)}><option value="all">Todos os modos</option>{MODES.map(item => <option key={item.label}>{item.label}</option>)}</select></label>
      <label>Grupo de tokens<select value={group} onChange={e => setGroup(e.target.value)}>{GROUPS.map(item => <option key={item.title}>{item.title}</option>)}</select></label>
    </div>
    <iframe title="Leitura isolada dos tokens de cores" aria-hidden="true" tabIndex={-1} sandbox="allow-same-origin" srcDoc={DOCUMENT} className="versi-colors-frame" onLoad={event => {
      const doc = event.currentTarget.contentDocument;
      if (!doc?.body || !doc.defaultView) return;
      const next: Snapshot[] = [];
      for (const preset of THEMES) for (const item of MODES) {
        Object.assign(doc.documentElement.dataset, {dsTheme:preset, colorScheme:item.scheme, contrast:item.contrast, contrastTheme:item.scheme});
        const styles = doc.defaultView.getComputedStyle(doc.body);
        next.push({theme:preset, mode:item.label, values:Object.fromEntries(TOKENS.map(token => [token,styles.getPropertyValue(token).trim()]))});
      }
      setSnapshots(next);
    }}/>
    {!snapshots.length && <p role="status">Carregando os tokens dos temas…</p>}
    {MODES.filter(item => mode === "all" || mode === item.label).map(item => <div className="versi-colors-panel" key={item.label}>
      <h3>{item.label}</h3><div className="versi-colors-scroll" tabIndex={0} role="region" aria-label={`Tokens · ${item.label}`}><table>
        <caption>{group} · {item.label} · valores HEX; RGB disponível ao passar o mouse</caption>
        <thead><tr><th scope="col">Tema</th>{tokens.map(token => <th scope="col" key={token}><code>{token}</code></th>)}</tr></thead>
        <tbody>{snapshots.filter(row => row.mode === item.label && (theme === "all" || row.theme === theme)).map(row => <tr key={row.theme} data-color-combination={`${row.theme}/${item.label}`}><th scope="row">{row.theme}</th>{tokens.map(token => <td key={token} title={`${token}: rgb(${row.values[token]})`}><span className="versi-colors-chip" aria-hidden="true" style={{backgroundColor:`rgb(${row.values[token]})`}}/><code>{hex(row.values[token])}</code></td>)}</tr>)}</tbody>
      </table></div>
    </div>)}
  </section>;
}
