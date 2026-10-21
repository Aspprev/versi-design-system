import { useRef, useState } from "react";
import { Formik } from "formik";
import { Button, Checkbox, InputSelect, InputStandalone, InputSwitch, InteractiveDonutChart, Modal, Notice, RadioGroup, StatusBadge, TimeSeriesChart } from "../../src";
import { CLIENT_THEMES, type ClientTheme } from "../../src/theme-presets";
import { useTokenValues } from "../shared/useTokenValues";
import { BRAND_ACCENTS, hex } from "../foundations/colorTokens";
import "./client-themes.css";
import { BrandAccentExamples } from "./BrandAccentExamples";

const PALETTE_GROUPS = [
  { title: "Escala principal", tokens: ["--primary-1", "--primary-2", "--primary-3", "--primary-4", "--primary-5"] },
  { title: "Cores do cliente · Brand accents", tokens: [...BRAND_ACCENTS] },
  { title: "Neutros de apoio", tokens: ["--surface-page", "--surface-card-semantic", "--surface-muted", "--content-primary"] },
];
const PALETTE = PALETTE_GROUPS.flatMap(group => group.tokens);
const PLANS = [{ label: "Plano básico", value: "basic" }, { label: "Plano adicional", value: "extra" }];

export function ClientThemeGallery({ client }: { client: ClientTheme }) {
  const root = useRef<HTMLElement>(null);
  const values = useTokenValues(PALETTE, root);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [terms, setTerms] = useState("yes");
  const label = CLIENT_THEMES.find(theme => theme.id === client)!.label;
  const preserved = ["custom2178", "custom2156", "custom2140"].includes(client);
  return <main ref={root} className="client-theme-gallery">
    <header><h1>{label}</h1><p>Proposta para revisão visual. Abra Claro, Escuro, Alto contraste claro ou Alto contraste escuro na navegação deste cliente.</p>
      <p>Identificador público: <code>data-ds-theme="{client}"</code>. As superfícies são neutras e o feedback mantém seu significado.</p>
      {preserved && <p>O modo claro preserva a identidade exportada do DS 0.5.7. Ajustes funcionais de legibilidade são documentados separadamente, sem redesenhar a paleta.</p>}
    </header>
    <section aria-label="Paleta da identidade"><h2>Paleta e cores do cliente</h2><p>Os três brand accents representam as cores da identidade do cliente e acompanham o modo selecionado; não representam erro, sucesso ou aviso. Nos modos reformulados, as ações alternativas são neutras.</p>
      {PALETTE_GROUPS.map(group => <div key={group.title} className="client-theme-palette-group"><h3>{group.title}</h3><div className="client-theme-palette">{group.tokens.map(token => <div key={token}><span style={{ backgroundColor: `rgb(var(${token}))` }} /><code>{token}</code><strong>{hex(values[token] || "")}</strong><small>RGB {values[token] || "Não definido neste tema"}</small></div>)}</div></div>)}
      {client === "custom2157" && <p>O degradê verde–azul pode ser usado em detalhes decorativos nos modos comuns; não faz parte do contrato de tokens RGB e não é necessário no alto contraste.</p>}
    </section>
    <section aria-label="Ações e estados"><h2>Ações e estados</h2><div className="client-theme-actions">
      {(["primary", "secondary", "tertiary", "danger", "warning"] as const).map(color => <Button type="button" key={color} color={color} data-testid={`action-${color}`}>{color}</Button>)}
      <Button type="button" variant="outline">Contorno</Button><Button type="button" variant="plain">Texto</Button><Button type="button" disabled>Desabilitado</Button>
      <Button type="button" onClick={() => setModalOpen(true)}>Abrir modal</Button>
    </div><p>Use Tab para conferir o foco; passe o mouse e mantenha o botão pressionado para conferir hover e active.</p></section>
    <section aria-label="Formulário"><h2>Campos e controles</h2><div className="client-theme-fields">
      <InputStandalone label="Nome" placeholder="Digite seu nome" value={name} onChange={event => setName(event.target.value)} />
      <InputStandalone label="Campo com erro" placeholder="Preenchimento obrigatório" error errorText="Confira o valor informado." />
      <InputStandalone label="Vazio desabilitado" placeholder="Ainda não informado" disabled />
      <InputStandalone label="Preenchido desabilitado" value="Maria Silva" disabled />
    </div><Formik initialValues={{plan:"",choice:"basic",terms:["yes"]}} onSubmit={() => undefined}>
      <form className="client-theme-form"><InputSelect name="plan" label="Plano" placeholder="Selecione um plano" options={PLANS} />
        <RadioGroup name="choice" label="Contribuição" options={PLANS} />
        <Checkbox name="terms" value={terms} onChange={event => setTerms(event.target.checked ? "yes" : "")} options={[{label:"Receber comunicações",value:"yes"}]} />
      </form>
    </Formik><div className="client-theme-actions"><InputSwitch aria-label="Notificações ativadas" defaultEnable /><InputSwitch aria-label="Notificações desativadas" /><InputSwitch aria-label="Notificações indisponíveis" disabled /></div></section>
    <section aria-label="Feedback e status"><h2>Feedback e status</h2><div className="client-theme-fields">
      {(["info", "success", "warning", "danger"] as const).map(type => <Notice key={type} type={type} textColor="color" rounded data-testid={`feedback-${type}`}>Mensagem de {type}</Notice>)}
    </div><div className="client-theme-actions">{(["blue", "green", "orange", "yellow", "red", "slate", "black"] as const).flatMap(color => (["solid", "outline", "soft"] as const).map(appearance => <StatusBadge key={`${color}-${appearance}`} color={color} appearance={appearance} data-testid={`status-${color}-${appearance}`}>{color} · {appearance}</StatusBadge>))}</div></section>
    <section aria-label="Gráficos"><h2>Gráficos reais</h2><p>As mesmas séries continuam montadas ao trocar o tema pela toolbar. No alto contraste, as linhas também têm padrões diferentes.</p><div className="client-theme-charts">
      <TimeSeriesChart ariaLabel="Evolução das contribuições" type="line" height={280} options={{ xaxis:{categories:["Jan","Fev","Mar"]}, legend:{show:true} }} series={[{name:"Contribuições",data:[12,18,16]},{name:"Rendimentos",data:[6,10,13]}]} />
      <InteractiveDonutChart ariaLabel="Distribuição do patrimônio" height={280} options={{labels:["Renda fixa","Renda variável","Outros"],legend:{show:true}}} series={[60,25,15]} />
    </div></section>
    <BrandAccentExamples />
    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Revisão do tema" size="small"><p>Este conteúdo é renderizado em um portal e deve manter as cores do cliente e o foco visível.</p><Button type="button" onClick={() => setModalOpen(false)}>Concluir</Button></Modal>
  </main>;
}
