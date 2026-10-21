import type { Meta, StoryObj } from "@storybook/react-vite";
import "./illustrations.css";

const CHECK = "M10 24l7 7 13-17 4 4-16 20L6 28z";

function AccentSample({ accent, soft }: { accent: 1 | 2 | 3; soft: boolean }) {
  return <svg className="versi-illustration" viewBox="0 0 180 70" width="180" height="70" role="img" aria-label={`Acento ${accent}${soft ? " suave" : ""}`}>
    <g data-brand-accent={accent} data-brand-accent-tone={soft ? "soft" : undefined} data-pair={`accent-${accent}-${soft ? "soft" : "solid"}`}>
      <rect data-pair-background data-illustration-role="support" x="2" y="2" width="176" height="64" rx="8" />
      <text data-pair-text data-illustration-role="on-support" x="50" y="41" fontSize="20" fontWeight="600">IR · {accent}</text>
      <path data-pair-symbol data-illustration-role="on-support" d={CHECK} transform="translate(5 8)" />
    </g>
  </svg>;
}

function SemanticSample({ state }: { state: "success" | "error" | "warning" }) {
  return <svg className="versi-illustration" viewBox="0 0 180 70" width="180" height="70" role="img" aria-label={state}>
    <g data-pair={state}>
      <rect data-pair-background data-brand-accent="2" data-illustration-role={state} x="2" y="2" width="176" height="64" rx="8" />
      <text data-pair-text data-illustration-role={`on-${state}`} x="50" y="41" fontSize="17" fontWeight="600">{state}</text>
      <path data-pair-symbol data-illustration-role={`on-${state}`} d={CHECK} transform="translate(5 8)" />
    </g>
  </svg>;
}

function IllustrationContract() {
  return <main className="illustration-docs">
    <header><h1>Cores de ilustrações</h1><p>Escolha tema e modo na toolbar. Os acentos são opcionais e entram somente nos grupos marcados. No alto contraste, os grupos usam pares semânticos próprios.</p></header>
    <section><h2>Papéis estruturais</h2><svg className="versi-illustration illustration-structure" viewBox="0 0 450 180" width="450" height="180" role="img" aria-label="Documento com selo e detalhes de marca">
      <rect data-illustration-role="background" x="0" y="0" width="450" height="180" rx="12" />
      <rect data-illustration-role="surface" data-illustration-stroke="outline" strokeWidth="2" x="20" y="20" width="240" height="140" rx="6" />
      <text data-illustration-role="ink" x="38" y="55" fontSize="18">Documento</text>
      <path data-illustration-role="detail" d="M38 74h180v4H38zm0 16h155v4H38z" />
      <path data-illustration-role="muted" d="M38 110h140v4H38z" />
      <g data-pair="primary">
        <rect data-pair-background data-illustration-role="accent" x="280" y="45" width="150" height="90" rx="12" />
        <text data-pair-text data-illustration-role="on-primary" x="330" y="105" fontSize="22" fontWeight="700">OK</text>
        <path data-pair-symbol data-illustration-on-primary="true" fill="#fff" d={CHECK} transform="translate(285 67)" />
      </g>
      <circle data-brand-accent="3" cx="244" cy="36" r="12" />
    </svg><p>Fundo, superfície, contorno, tinta, detalhes e primeiro plano têm funções separadas. O símbolo branco legado sobre a primária amarela ganha primeiro plano escuro no alto contraste escuro.</p></section>
    {(["page", "card", "muted"] as const).map(surface => <section key={surface} className="illustration-surface" data-surface={surface} style={{ backgroundColor: `rgb(var(--surface-${surface === "card" ? "card-semantic" : surface}))` }}>
      <h2>Acentos sobre {surface}</h2><div className="illustration-samples">{([1, 2, 3] as const).flatMap(accent => [false, true].map(soft => <AccentSample key={`${accent}-${soft}`} accent={accent} soft={soft} />))}</div>
      <svg className="versi-illustration" width="330" height="44" role="img" aria-label="Detalhes informativos sobre a superfície">
        <text data-informative="text" data-illustration-role="ink" x="2" y="27" fontSize="16">Detalhes e contornos</text>
        <path data-informative="symbol" data-illustration-role="detail" d={CHECK} transform="translate(215 0)" />
        <path data-informative="symbol" data-illustration-role="muted" d={CHECK} transform="translate(260 0)" />
        <path data-informative="stroke" data-illustration-stroke="outline" fill="none" strokeWidth="2" d="M310 10v25" />
      </svg>
    </section>)}
    <section><h2>Sucesso, erro e aviso continuam semânticos</h2><div className="illustration-samples">{(["success", "error", "warning"] as const).map(state => <SemanticSample state={state} key={state} />)}</div><p>Mesmo que um acento seja marcado por engano no fundo de um estado, o papel de feedback tem prioridade.</p></section>
    <section><h2>Compatibilidade com o portal</h2><svg className="portal-illustration" viewBox="0 0 420 95" width="420" height="95" role="img" aria-label="Papéis legados, check e cores narrativas">
      <rect fill="#F4F7F8" x="0" y="0" width="420" height="95" />
      <rect fill="#FBFEFF" x="10" y="10" width="170" height="75" />
      <text fill="#191C1F" x="20" y="40" fontSize="16">Papéis existentes</text>
      <path fill="#455A64" d="M20 55h140v4H20z" />
      <g data-pair="legacy-primary"><rect data-pair-background x="200" y="15" width="70" height="65" fill="var(--illustration-accent)" /><path data-pair-symbol data-illustration-on-primary="true" data-brand-accent-check="true" fill="#fff" d={CHECK} transform="translate(211 28)" /></g>
      <g data-pair="legacy-success"><rect data-pair-background data-illustration-success="true" data-brand-accent="3" fill="#006E2F" x="280" y="15" width="60" height="65" /><path data-pair-symbol fill="#fff" d={CHECK} transform="translate(288 28)" /></g>
      <circle data-narrative="skin" fill="#FFBE9D" cx="382" cy="35" r="15" /><path data-narrative="hair" fill="#783D19" d="M367 23h30v7h-30z" />
    </svg><p>A classe portal-illustration, os atributos existentes, as cores de pele e cabelo e os fills narrativos continuam aceitos. Letras e checks novos devem compartilhar um grupo com o fundo correspondente.</p></section>
    <section><h2>Uso explícito</h2><pre><code>{`<svg className="versi-illustration" role="img" aria-label="Documento confirmado">
  <g data-brand-accent="2" data-brand-accent-tone="soft">
    <rect data-illustration-role="support" width="120" height="60" />
    <text data-illustration-role="on-support" x="12" y="36">IR ✓</text>
  </g>
</svg>`}</code></pre><p>Variáveis illustration-* de estrutura são cores CSS completas: use fill="var(--illustration-surface)". Os quatro tokens *-content gerados são canais RGB. Consulte docs/illustrations/README.md para integração e precedência.</p></section>
  </main>;
}

const meta = { title: "Foundations/Illustrations", component: IllustrationContract } satisfies Meta<typeof IllustrationContract>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = { name: "Claro", globals: { colorScheme: "light", contrast: "normal" } };
export const Dark: Story = { name: "Escuro", globals: { colorScheme: "dark", contrast: "normal" } };
export const HighLight: Story = { name: "Alto contraste claro", globals: { colorScheme: "light", contrast: "high" } };
export const HighDark: Story = { name: "Alto contraste escuro", globals: { colorScheme: "dark", contrast: "high" } };
