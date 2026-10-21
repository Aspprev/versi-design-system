import { useState } from "react";
import { Button, Surface, TimeSeriesChart, InteractiveDonutChart, type ChartBrandPalette } from "../../src";
import "./brand-accents.css";

const CATEGORIES = ["Contribuições", "Empréstimos", "Atendimento", "Documentos", "Investimentos", "Outros"];
const PALETTE: ChartBrandPalette = {
  categories: CATEGORIES,
  roles: { Contribuições: "primary", Empréstimos: "accent-2", Atendimento: "accent-3" },
};

function DetailIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 19V9h4v10M10 19V5h4v14M16 19V2h4v17M2 21h20" /></svg>;
}

export function BrandAccentExamples() {
  const [custom, setCustom] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [reversed, setReversed] = useState(false);
  const keys = CATEGORIES.filter(key => !filtered || !["Empréstimos", "Documentos"].includes(key));
  if (reversed) keys.reverse();
  const customColors = custom ? keys.map(key => ["#7252A2", "#23708D", "#A04C66", "#477A35", "#966B20", "#3A6976"][CATEGORIES.indexOf(key)]) : undefined;
  return <section className="brand-accent-examples" aria-label="Aplicação dos acentos de marca">
    <h2>Detalhes de marca · uso opcional</h2>
    <p>A primária continua nas ações principais. Os três acentos identificam detalhes deliberados; o título do card mantém a cor de conteúdo. Em alto contraste, os detalhes priorizam neutros legíveis.</p>
    <div className="brand-detail-examples">
      {([1, 2, 3] as const).map(accent => <Surface key={accent} elevation="none" className="brand-detail-card">
        <Surface brandAccent={accent} padding="compact" radius="sm" elevation="none" className="brand-icon-example" style={{ width: 48, height: 48 }}><DetailIcon /></Surface>
        <h3>{["Contribuições", "Empréstimos e investimentos", "Atendimento e documentos"][accent - 1]}</h3>
        <p>Acento {accent} · ícone em fundo suave</p>
        <div aria-hidden="true" className="brand-card-stripe" data-accent={accent} />
      </Surface>)}
    </div>
    <div className="brand-before-after">
      <Surface elevation="none" tone="muted"><h3>Padrão · sem acento</h3><DetailIcon /><p>O componente existente mantém sua aparência padrão.</p></Surface>
      <Surface elevation="none"><h3>Com acento explícito</h3><Surface brandAccent={2} padding="compact" radius="sm" elevation="none"><DetailIcon /><span>Detalhe de investimento</span></Surface></Surface>
    </div>
    <figure className="brand-illustration-example"><svg viewBox="0 0 260 110" width="260" height="110" role="img" aria-label="Exemplo geométrico de investimento com dois detalhes de marca">
      <rect x="2" y="12" width="256" height="96" rx="8" fill="rgb(var(--surface-muted))" />
      <rect x="30" y="46" width="45" height="50" rx="4" fill="rgb(var(--brand-accent-2-soft))" stroke="rgb(var(--brand-accent-2-content))" />
      <circle cx="211" cy="35" r="20" fill="rgb(var(--brand-accent-3-soft))" stroke="rgb(var(--brand-accent-3-content))" />
      <path d="M30 85L100 60L155 70L228 20" stroke="rgb(var(--content-primary))" strokeWidth="3" fill="none" />
    </svg><figcaption>Exemplo ilustrativo: somente os dois detalhes geométricos recebem os papéis 2 e 3.</figcaption></figure>
    <div aria-hidden="true" className="brand-gradient-example" />
    <p>A faixa usa degradê apenas quando o tema o disponibiliza: custom2157 nos modos comuns. No alto contraste, usa uma superfície simples.</p>
    <h3>Gráficos · categorias estáveis</h3>
    <p>As duas visualizações compartilham o catálogo e os papéis. Filtrar ou reordenar mantém a cor de cada categoria; saldo/investido continuam com seus próprios tokens. Troque o tema na toolbar com os gráficos já montados.</p>
    <div className="brand-chart-controls"><Button type="button" variant="outline" onClick={() => setFiltered(!filtered)} aria-pressed={filtered}>Filtrar categorias</Button><Button type="button" variant="outline" onClick={() => setReversed(!reversed)} aria-pressed={reversed}>Reordenar categorias</Button><Button type="button" variant="outline" onClick={() => setCustom(!custom)} aria-pressed={custom}>Cores personalizadas</Button></div>
    <div className="brand-example-charts">
      <TimeSeriesChart ariaLabel="Detalhes de marca por categoria" height={290} type="line" brandPalette={PALETTE} seriesKeys={keys} options={{ chart: { animations: { enabled: false } }, colors: customColors, xaxis: { categories: ["Jan", "Fev", "Mar"] }, legend: { show: true } }} series={keys.map(key => ({ name: key, data: [8, 12, 18].map(value => value + CATEGORIES.indexOf(key) * 3) }))} />
      <InteractiveDonutChart ariaLabel="Distribuição por categoria de marca" height={290} brandPalette={PALETTE} colors={customColors} seriesKeys={keys} options={{ chart: { animations: { enabled: false } }, labels: keys, legend: { show: true } }} series={keys.map(key => 10 + CATEGORIES.indexOf(key) * 3)} />
    </div>
  </section>;
}
