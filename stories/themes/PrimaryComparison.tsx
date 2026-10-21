import { useRef, type CSSProperties } from "react";
import { Button, Notice } from "../../src";
import { useTokenValues } from "../shared/useTokenValues";
import { hex } from "../foundations/colorTokens";
import "./primary-comparison.css";

// Preview only. Production tokens and the original brand accents stay intact.
const PROPOSAL = {
  light: ["#E48176", "#C56B5F", "#995049", "#F7CFCB", "#FEF1F0"],
  dark: ["#E48176", "#EA948A", "#C56B5F", "#57312D", "#2F2B30"],
} as const;
type TokenStyle = CSSProperties & Record<`--${string}`, string>;
const channels = (value: string) => [1, 3, 5].map(index => parseInt(value.slice(index, index + 2), 16));
const rgb = (value: string) => channels(value).join(", ");
const luminance = (values: number[]) => values.reduce((sum, value, i) => {
  value /= 255;
  return sum + (value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][i];
}, 0);
const foreground = (value: string) => {
  const l = luminance(channels(value)), dark = luminance([20, 25, 31]);
  return (l + .05) / (dark + .05) >= 1.05 / (l + .05) ? "20, 25, 31" : "255, 255, 255";
};
const TOKENS = [1, 2, 3, 4, 5].map(n => `--primary-${n}`);

function proposalStyle(dark: boolean): TokenStyle {
  const colors = PROPOSAL[dark ? "dark" : "light"];
  return {
    ...Object.fromEntries(colors.map((color, i) => [`--primary-${i + 1}`, rgb(color)])),
    "--action-primary-background": rgb(colors[0]),
    "--action-primary-background-hover": rgb(colors[1]),
    "--action-primary-background-active": rgb(colors[2]),
    "--action-primary-content": foreground(colors[0]),
    "--action-primary-content-hover": foreground(colors[1]),
    "--action-primary-content-active": foreground(colors[2]),
    "--action-primary-ghost-background": rgb(colors[4]),
    "--content-link": dark ? rgb(colors[0]) : "148, 76, 67",
    "--content-on-brand": foreground(colors[0]),
    "--selection-background": rgb(colors[0]),
    "--selection-border": rgb(colors[0]),
    "--selection-content": foreground(colors[0]),
  };
}

function Column({ variant, dark }: { variant: "current" | "proposal" | "rosa1"; dark: boolean }) {
  const root = useRef<HTMLElement>(null);
  const values = useTokenValues(TOKENS, root);
  return <article ref={root} className={`primary-comparison-card ${variant === "rosa1" ? "rosa1" : "custom2133"}`} style={variant === "proposal" ? proposalStyle(dark) : undefined} data-preview={variant}>
    <h2>{variant === "current" ? "Atual · custom2133" : variant === "proposal" ? "Proposta intermediária" : "Referência · rosa1"}</h2>
    <div className="primary-comparison-hero" style={{ backgroundColor: "rgb(var(--primary-1))", color: values["--primary-1"] ? `rgb(${foreground(hex(values["--primary-1"]))})` : undefined }}>{hex(values["--primary-1"] || "")}</div>
    <div className="primary-comparison-swatches">{TOKENS.map(token => <div key={token}>
      <span style={{ backgroundColor: `rgb(var(${token}))` }} /><code>{token}</code><strong>{hex(values[token] || "")}</strong>
    </div>)}</div>
    {variant !== "rosa1" ? <><div className="primary-comparison-actions"><Button>Continuar</Button><Button variant="outline">Contorno</Button><Button variant="plain">Texto</Button></div>
    <div className="primary-comparison-states">{["default", "hover", "active"].map((state, i) => <span key={state} className="versi-button-primary-flat" data-state={state} style={{ backgroundColor: `rgb(var(--action-primary-background${i ? i === 1 ? "-hover" : "-active" : ""}))`, color: `rgb(var(--action-primary-content${i ? i === 1 ? "-hover" : "-active" : ""}))` }}>{state === "default" ? "Repouso" : state === "hover" ? "Hover" : "Pressionado"}</span>)}</div>
    <Notice type="primary" rounded>Aviso com a primária.</Notice></> : <p>Referência da escala de cores para comparar o tom e a intensidade do coral.</p>}
  </article>;
}

export function PrimaryComparison({ dark, highContrast }: { dark: boolean; highContrast: boolean }) {
  if (highContrast) return <Notice>Esta comparação é dos modos comuns. Escolha contraste normal para visualizar a proposta; as variantes de alto contraste continuam com seus pares atuais.</Notice>;
  return <main className="primary-comparison">
    <header><h1>Primária · proposta intermediária</h1><p>A proposta usa <strong>#E48176</strong>: um coral intermediário entre #EF8B84 e #D97667, um pouco mais fechado, mantendo o caráter quente do custom2133.</p><p>Prévia isolada para revisão. A paleta do pacote e os acentos de marca continuam com os valores atuais.</p></header>
    <div className="primary-comparison-grid">{(["current", "proposal", "rosa1"] as const).map(variant => <Column key={variant} variant={variant} dark={dark} />)}</div>
  </main>;
}
