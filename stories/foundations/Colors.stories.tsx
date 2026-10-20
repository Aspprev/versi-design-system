import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useTokenValues } from "../shared/useTokenValues";
import { GROUPS, TOKENS, hex } from "./colorTokens";
import { ThemeTokenMatrix } from "./ThemeTokenMatrix";
import "./colors.css";

const STYLES = `/* styles.css da aplicação: imports sempre no início */
@import "@aspprev/versi-ds/styles.css";
@import "@aspprev/versi-ds/themes.css";

/* Estilos da aplicação depois dos imports */
body {
  margin: 0;
  font-family: var(--font-family-base);
  background-color: rgb(var(--surface-page));
  color: rgb(var(--content-primary));
}

.app-card {
  background-color: rgb(var(--surface-card-semantic));
  border: 1px solid rgb(var(--border-default));
}`;
function ColorSwatches() {
 const root = useRef<HTMLElement>(null);
 const values = useTokenValues(TOKENS, root);
 const [copied, setCopied] = useState("");
 async function copy(value: string) {
  try { await navigator.clipboard.writeText(value); setCopied("Copiado para a área de transferência."); }
  catch { setCopied("Selecione o código e copie manualmente: área de transferência indisponível."); }
 }
 return <main ref={root} className="versi-colors">
 <header><h1>Cores</h1><p>Configuração da aplicação e tokens reais de cada tema, modo e contraste.</p><nav aria-label="Nesta página"><a href="#colors-setup">Configurar styles.css</a><a href="#colors-current">Paleta atual</a><a href="#colors-matrix">Todos os temas e modos</a></nav></header>
 <p role="status">{copied || "Copie os exemplos e tokens pelos botões abaixo."}</p>
 <section id="colors-setup" className="versi-colors-panel"><h2>1. Configure o styles.css da aplicação</h2>
 <p>Importe os estilos base primeiro e os temas em seguida. Este é o arquivo do projeto consumidor: o CSS do pacote já vem compilado e não exige Tailwind na aplicação.</p>
 <button type="button" onClick={() => void copy(STYLES)}>Copiar styles.css</button><pre><code>{STYLES}</code></pre>
 <p>Carregue esse arquivo uma única vez na entrada da aplicação, por exemplo em <code>main.tsx</code>:</p><pre><code>{'import "./styles.css";'}</code></pre>
 <p>Se já importa o CSS do pacote pelo JavaScript, centralize os imports em um único lugar. Preserve os estilos próprios e a configuração de Tailwind que seu projeto já utiliza.</p>
 <h3>2. Defina o tema no html</h3><pre><code>{'<html lang="pt-BR" data-ds-theme="azul1"\n  data-color-scheme="light" data-contrast="normal"\n  data-contrast-theme="light">'}</code></pre>
 <p><code>data-ds-theme</code> escolhe o preset. Mantenha <code>data-contrast-theme</code> igual a <code>data-color-scheme</code>, inclusive ao alternar o modo em tempo de execução.</p>
 <div className="versi-colors-scroll" tabIndex={0} role="region" aria-label="Configuração dos modos"><table><caption>Atributos no elemento html</caption><thead><tr><th>Modo</th><th>data-color-scheme</th><th>data-contrast</th><th>data-contrast-theme</th></tr></thead><tbody>{[['Claro','light','normal'],['Escuro','dark','normal'],['Claro · alto contraste','light','high'],['Escuro · alto contraste','dark','high']].map(([label,scheme,contrast]) => <tr key={label}><th scope="row">{label}</th><td>{scheme}</td><td>{contrast}</td><td>{scheme}</td></tr>)}</tbody></table></div>
 <p>Para seguir o sistema operacional, resolva a preferência para <code>light</code> ou <code>dark</code> antes de aplicar os atributos. O valor <code>system</code> não é um modo CSS do pacote.</p>
 <h3>3. Prefira tokens semânticos</h3><p>Use <code>--content-primary</code> para texto, <code>--surface-page</code> para a página e <code>--field-placeholder</code> para placeholders. As escalas <code>--primary-1…5</code> representam a identidade; os tokens semânticos representam a função da cor.</p>
 <p>As cores são canais RGB: escreva <code>color: rgb(var(--content-primary))</code>. Para transparência, use <code>rgba(var(--content-primary), 0.5)</code>.</p>
 <details><summary>Personalizações e manutenção do design system</summary><p>Coloque overrides depois dos imports, limitados ao tema e modo desejados. Como alguns tokens são definidos no body, aplique a personalização nesse elemento:</p><pre><code>{'html[data-ds-theme="azul1"][data-color-scheme="light"][data-contrast="normal"] body {\n  --content-link: var(--primary-3);\n}'}</code></pre><p>Revise o contraste das personalizações. No repositório do design system, edite <code>tokens/design-system.tokens.json</code> e execute <code>npm run tokens:generate</code>. Não edite manualmente os CSS gerados nem copie as diretivas <code>@tailwind</code> internas para o consumidor.</p></details></section>
 <section id="colors-current"><h2>Paleta atual · acompanha a toolbar</h2><p>Valores computados nesta página. O botão copia a expressão completa para usar como cor no CSS.</p>{GROUPS.map((group,index) => <details key={group.title} open={index < 2}><summary>{group.title} · {group.tokens.length} tokens</summary><div className="versi-colors-grid">{group.tokens.map(token => <article key={token} className="versi-colors-swatch"><div aria-hidden="true" className="versi-colors-sample" style={{backgroundColor:'rgb(var('+token+'))'}}/><div><code>{token}</code><strong>{hex(values[token] || "")}</strong><small>RGB {values[token] || "…"}</small><button type="button" aria-label={'Copiar '+token} onClick={() => void copy('rgb(var('+token+'))')}>Copiar cor CSS</button></div></article>)}</div></details>)}</section>
 <ThemeTokenMatrix /></main>;
}
const meta = { title: "Foundations/Colors", component: ColorSwatches } satisfies Meta<typeof ColorSwatches>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = { name: "Visão geral" };
