import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, CircularLoading, InputSwitch, LoadingDots, Notice } from "../../src";
import "./legibility.css";

function SecondaryExamples() {
  return <main className="legibility-matrix secondary-examples">
    <header><h1>Secondary · ações alternativas</h1><p>A partir da 0.7.0, secondary assume a aparência do antigo tertiary. Os acentos de marca e a hierarquia dos textos continuam independentes.</p></header>
    <section><h2>Botões</h2><div className="legibility-actions">
      {(["flat", "outline", "plain"] as const).map(variant => <div key={variant}>
        <Button color="secondary" variant={variant} data-testid={`secondary-${variant}`}>{variant}</Button>
        <Button color="secondary" variant={variant} disabled>Desabilitado</Button>
        <Button color="secondary" variant={variant} loading data-testid={`secondary-loading-${variant}`} loadingLabel={`Carregando ${variant}`}>Carregar</Button>
      </div>)}
    </div></section>
    <section><h2>Switch e aviso</h2><div className="legibility-actions">
      <InputSwitch variant="secondary" defaultEnable aria-label="Secondary ligado" />
      <InputSwitch variant="secondary" aria-label="Secondary desligado" />
      <InputSwitch variant="secondary" defaultEnable disabled aria-label="Secondary indisponível" />
    </div><Notice type="secondary" rounded data-testid="secondary-notice">O aviso acompanha a ação secondary.</Notice></section>
    <section><h2>Carregadores</h2><p>As variantes preservam suas apresentações anteriores; não representam estados de sucesso ou erro.</p>
      <div className="legibility-grid">{(["page", "card", "muted"] as const).map(surface => <div key={surface} style={{ padding: 24, backgroundColor: `rgb(var(--surface-${surface === "card" ? "card-semantic" : surface}))` }} data-testid={`loaders-${surface}`}>
        <p>{surface}</p><CircularLoading color="secondary" size={40} message="Carregando dados" /><LoadingDots color="secondary" announce={false} />
      </div>)}</div>
    </section>
  </main>;
}

const meta = { title: "Laboratory/Secondary", component: SecondaryExamples } satisfies Meta<typeof SecondaryExamples>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = { name: "Claro", globals: { colorScheme: "light", contrast: "normal" } };
export const Dark: Story = { name: "Escuro", globals: { colorScheme: "dark", contrast: "normal" } };
export const HighLight: Story = { name: "Alto contraste claro", globals: { colorScheme: "light", contrast: "high" } };
export const HighDark: Story = { name: "Alto contraste escuro", globals: { colorScheme: "dark", contrast: "high" } };
