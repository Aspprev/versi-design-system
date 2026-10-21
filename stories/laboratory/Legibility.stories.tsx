import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import { useGlobals } from "storybook/preview-api";
import portalReference from "../../docs/correcao-legibilidade/PORTAL-STATUS-MAP-REFERENCIA.json";
import baseline from "../../docs/correcao-legibilidade/BASELINE-ANTES.json";
import { MdInfoOutline } from "react-icons/md";
import { Button, Checkbox, DomainStatusBadge, InputSelect, InputStandalone, InputSwitch, Modal, Notice, PageTabsHeader, Pagination, RadioCardGroup, SelectMulti, StatusBadge, Table, TimeRangeSelector, Tooltip, type StatusDomain, type StatusBadgeColor, type StatusAppearanceMap, type StatusAppearanceConfig } from "../../src";
import "./legibility.css";

const STATUS_COLORS: StatusBadgeColor[] = ["primary", "blue", "green", "orange", "yellow", "red", "slate", "black"];
const DOMAINS: StatusDomain[] = ["generic", "beneficiary", "document", "loan", "benefit", "signature", "participation", "claim", "payment", "protocol", "request"];
const OPTIONS = [{label:"Plano básico",value:"basic"},{label:"Plano adicional",value:"extra"}];
const PORTAL = portalReference as unknown as { map: StatusAppearanceMap; byDomain: Partial<Record<StatusDomain, StatusAppearanceMap>>; fallback: StatusAppearanceConfig };

function LegibilityMatrix() {
  const [tab, setTab] = useState("summary");
  const [page, setPage] = useState(1);
  const [range, setRange] = useState("Mensal");
  const [modal, setModal] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [terms, setTerms] = useState("yes");
  const [plans, setPlans] = useState(["basic"]);
  const target = useRef<HTMLButtonElement>(null);
  return <main className="legibility-matrix">
    <header><h1>Legibilidade por família</h1><p>Quatro histórias de modo; selecione qualquer um dos 18 temas na toolbar. Os controles desta página são componentes reais do DS. Placeholders permanecem fora desta correção.</p></header>
    <section id="legibility-status"><h2>Status nos fundos efetivos</h2><p>Outline é transparente. Compare texto e borda com página, card, tabela e muted, inclusive o neutro usado no fallback.</p>
      {(["page", "card", "table", "muted"] as const).map(context => <div key={context} className={`legibility-status-context context-${context}`} data-status-context={context}><h3>{context}</h3><div className="legibility-status-grid">{STATUS_COLORS.flatMap(color => (["solid", "outline", "soft"] as const).map(appearance => <StatusBadge key={`${color}-${appearance}`} color={color} appearance={appearance} data-audit="status" data-color={color} data-appearance={appearance}>{color} · {appearance}</StatusBadge>))}</div></div>)}
      <h3>Mapa real do portal por domínio</h3><p>Snapshot de leitura do portal: 46 status nos 11 domínios, com suas exceções. REPROVADO não está mapeado e usa slate outline. ATIVO é blue solid em loan e green solid nos demais domínios. Este mapa pertence ao consumidor e não é exportado pelo DS.</p>
      {DOMAINS.map(domain => { const map={...PORTAL.map,...PORTAL.byDomain[domain]}; return <details open key={domain}><summary>{domain} · mapa completo e dois fallbacks</summary><div className="legibility-status-grid">{[...Object.keys(map),"REPROVADO","STATUS DESCONHECIDO"].map(status=><DomainStatusBadge key={status} data-audit="domain" data-domain={domain} data-status={status} domain={domain} status={status} statusMap={map} fallback={PORTAL.fallback}/>)}</div></details>;})}
      <DomainStatusBadge status="REPROVADO" data-audit="unmapped" /> <span>REPROVADO sem mapa: fallback slate outline.</span>
    </section>
    <section id="legibility-actions"><h2>Button, Notice e links</h2><div className="legibility-actions">{(["primary", "secondary", "danger", "warning"] as const).flatMap(color => (["flat", "outline", "plain"] as const).map(variant => <Button key={`${color}-${variant}`} type="button" color={color} variant={variant} data-audit="button" data-color={color} data-variant={variant}>{color} · {variant}</Button>))}<Button disabled>Desabilitado</Button></div>
      <a href="#legibility-status" className="text-content-link underline" data-audit="link">Consultar situação</a>
      <div className="legibility-grid">{(["primary", "secondary", "gray", "info", "success", "warning", "danger"] as const).flatMap(type => (["default", "color"] as const).map(textColor => <Notice key={`${type}-${textColor}`} type={type} textColor={textColor} rounded data-audit="notice">{type} · {textColor}</Notice>))}</div>
    </section>
    <section id="legibility-forms"><h2>Campos, seleções e switches</h2><div className="legibility-grid"><InputStandalone label="Nome" placeholder="Digite seu nome" leadIcon={MdInfoOutline} /><InputStandalone label="Campo inválido" error errorText="Confira o valor informado." /><InputStandalone label="Vazio desabilitado" placeholder="Não informado" disabled/><InputStandalone label="Preenchido desabilitado" value="Maria Silva" disabled/></div>
      <Formik initialValues={{plan:"basic"}} onSubmit={() => undefined}><InputSelect name="plan" label="Plano" options={OPTIONS}/></Formik>
      <SelectMulti name="plans" label="Planos selecionados" options={OPTIONS} value={plans} onChange={event => setPlans(previous => event.target.checked ? [...previous,event.target.value] : previous.filter(value => value !== event.target.value))}/>
      <Checkbox value={terms} onChange={event => setTerms(event.target.checked ? "yes" : "")} options={[{label:"Aceitar comunicações",value:"yes"}]}/>
      <RadioCardGroup label="Escolha do plano" defaultValue="basic" options={[{value:"basic",title:"Plano básico",description:"Contribuição mensal"},{value:"extra",title:"Plano adicional",description:"Contribuição complementar"},{value:"disabled",title:"Indisponível",disabled:true}]}/>
      <div className="legibility-actions">{(["primary", "secondary", "contract", "theme"] as const).flatMap(variant => [false,true].map(enabled => <div key={`${variant}-${enabled}`}><span>{variant} · {enabled ? "on" : "off"}</span><InputSwitch variant={variant} defaultEnable={enabled} icon={variant === "primary" ? MdInfoOutline : undefined} aria-label={`${variant} ${enabled ? "on" : "off"}`}/></div>))}<InputSwitch aria-label="Switch indisponível" disabled/></div>
    </section>
    <section id="legibility-navigation"><h2>Navegação e tabela</h2><PageTabsHeader title="Participante" tabs={[{id:"summary",label:"Resumo"},{id:"history",label:"Histórico"},{id:"disabled",label:"Indisponível",disabled:true}]} activeTab={tab} onTabChange={setTab}/><TimeRangeSelector options={["Mensal","Anual"]} selected={range} onSelect={setRange}/><Pagination currentPage={page} totalResults={30} perPage={10} onClick={setPage}/>
      <div className="legibility-table-example"><Table accessibleName="Situações dos participantes" header={[{key:"name",title:"Participante",accessor:item=>item.name},{key:"status",title:"Situação",renderCell:item=><DomainStatusBadge status={item.status}/>}]} data={[{name:"Ana",status:"ATIVO"},{name:"Bruno",status:"REPROVADO"}]}/></div>
    </section>
    <section id="legibility-overlays"><h2>Portais, tooltip e modal</h2><div className="legibility-actions"><Button type="button" onClick={() => setModal(true)}>Abrir modal de revisão</Button><button ref={target} type="button" onFocus={() => setTooltip(true)} onBlur={() => setTooltip(false)} onMouseEnter={() => setTooltip(true)} onMouseLeave={() => setTooltip(false)} className="rounded border border-border-default px-3 py-2 text-content-primary">Ajuda contextual</button></div><Tooltip targetRef={target} visible={tooltip} content="Informação adicional do componente"/><Modal isOpen={modal} onClose={()=>setModal(false)} title="Revisão de legibilidade"><Notice type="info" textColor="color">Informação independente da marca.</Notice><Button type="button" onClick={()=>setModal(false)}>Concluir revisão</Button></Modal></section>
  </main>;
}
const meta = { title:"Laboratory/Legibility", component:LegibilityMatrix } satisfies Meta<typeof LegibilityMatrix>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {name:"Claro",globals:{colorScheme:"light",contrast:"normal"}};
export const Dark: Story = {name:"Escuro",globals:{colorScheme:"dark",contrast:"normal"}};
export const HighLight: Story = {name:"Alto contraste claro",globals:{colorScheme:"light",contrast:"high"}};
export const HighDark: Story = {name:"Alto contraste escuro",globals:{colorScheme:"dark",contrast:"high"}};
export const BeforeAfter: Story = {
  name:"Antes e depois dos status",
  render: () => {
    const [globals]=useGlobals();
    const id=String(globals.dsTheme??"default");
    const scheme=globals.colorScheme==="system"?document.documentElement.dataset.colorScheme:String(globals.colorScheme??"light");
    const mode=`${globals.contrast==="high"?"high-":""}${scheme}`;
    const data=baseline.themes as unknown as Record<string,Record<string,Record<string,string>>>;
    const old=data[id]?.[mode]??data.default.light;
    const examples=[{label:"ATIVO",color:"green",appearance:"solid"},{label:"REPROVADO",color:"slate",appearance:"outline"},{label:"Primário",color:"primary",appearance:"outline"},{label:"Informação",color:"blue",appearance:"soft"}] as const;
    return <main className="legibility-matrix"><h1>Antes e depois · {id} · {mode}</h1><p>Use a toolbar para comparar os 18 temas nos quatro modos. A referência anterior usa valores capturados do CSS distribuído local antes da correção; o depois é o componente atual, sem overrides.</p><div className="legibility-grid">{[true,false].map(before=><section key={String(before)} style={{backgroundColor:`rgb(${old["--surface-card-semantic"]})`}}><h2>{before?"Antes · referência":"Depois · componente atual"}</h2><div className="legibility-actions">{examples.map(({label,color,appearance})=>{
      const foreground=color==="primary"?old["--primary-1"]:old[`--status-${color}-${appearance}-foreground`];
      const background=appearance==="outline"?"transparent":`rgb(${old[`--status-${color}-${appearance}-background`]})`;
      const border=color==="primary"?old["--primary-1"]:old[`--status-${color}-${appearance==="outline"||appearance==="soft"?"outline-border":"solid-background"}`];
      return <StatusBadge key={label} color={color} appearance={appearance} style={before?{color:`rgb(${foreground})`,backgroundColor:background,borderColor:`rgb(${border})`}:undefined}>{label}</StatusBadge>;
    })}</div></section>)}</div></main>;
  },
};
