import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MdInfoOutline, MdVisibility } from "react-icons/md";
import { Button, InputStandalone, Notice, Slider, StatusBadge, Tooltip, InteractiveDonutChart, TimeSeriesChart } from "../../src";
import { IllustrationPortalBanner, IllustrationPixRecorrenteImg, IllustrationSearch, IllustrationContribuicaoAdicionalImg } from "../../src/components/illustrations";

function HighContrastDark() {
  const target = useRef<HTMLButtonElement>(null);
  const [tooltip, setTooltip] = useState(false);
  return <main data-high-dark-lab style={{padding:24,background:"rgb(var(--surface-page))",color:"rgb(var(--content-primary))"}}>
    <h1>Escuro + Alto contraste universal</h1>
    <p>Dezoito identidades compartilham esta política. Texto e ícones acompanham os papéis semânticos.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:24}}>
      <section style={{background:"rgb(var(--surface-card-semantic))",padding:20}}>
        <h2>Ações e campos</h2>
        {(["primary","secondary","danger","warning"] as const).map(color=><Button key={color} color={color} data-testid={`universal-${color}`}>{color}</Button>)}
        <Button color="primary" variant="outline" leadIcon={MdVisibility} data-testid="universal-primary-outline">Primária outline</Button>
        <button className="bg-action-secondary-background text-action-secondary-content" data-testid="secondary-icon"><MdVisibility aria-hidden="true"/>Visualizar ação secundária</button>
        <InputStandalone name="invalid" label="Campo inválido" error errorText="Erro: informe um valor válido" />
        <InputStandalone name="disabled" label="Campo desabilitado" disabled placeholder="Indisponível" />
        <a className="text-content-link" href="#status">Consultar situação</a>
        <p style={{background:"rgb(var(--selection-background))",color:"rgb(var(--selection-content))"}}>Texto selecionado</p>
        <button ref={target} className="bg-action-primary text-action-primary-content px-3 py-2" onClick={()=>setTooltip(v=>!v)}>Mostrar tooltip</button>
        <Tooltip targetRef={target} visible={tooltip} content={<><strong>Título do tooltip</strong><span>Valor: 42</span></>} />
        <div style={{marginTop:40}}><Slider min={0} max={100} step={5} initialValue={35} ariaLabel="Percentual" getAriaValueText={v=>`${v}%`} /></div>
      </section>
      <section id="status" style={{background:"rgb(var(--surface-muted))",padding:20}}>
        <h2>Feedback semântico</h2>
        {(["info","success","warning","danger"] as const).map(type=><Notice key={type} type={type} icon={MdInfoOutline}>{type}: mensagem identificada</Notice>)}
        {(["blue","green","yellow","red","orange","slate"] as const).flatMap(color=>(["solid","soft","outline"] as const).map(appearance=><StatusBadge key={`${color}-${appearance}`} color={color} appearance={appearance}>{color} · {appearance}</StatusBadge>))}
      </section>
      <section><h2>Distribuição com legendas e texturas</h2><InteractiveDonutChart ariaLabel="Distribuição universal" height={360} series={[12,11,10,9,8,7,6,5,4,3,2,1]} options={{labels:Array.from({length:12},(_,i)=>`Série ${i+1}`),chart:{animations:{enabled:false}},legend:{show:true}}}/></section>
      <section><h2>Saldo e investimento</h2><TimeSeriesChart ariaLabel="Saldo e investimento" type="line" height={360} options={{xaxis:{categories:["Jan","Fev","Mar"]},chart:{animations:{enabled:false}},legend:{show:true},dataLabels:{enabled:true}}} series={[{name:"Saldo",data:[10,15,20]},{name:"Investimento",data:[7,12,16]}]}/></section>
    </div>
    <section style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:16}}>
      <IllustrationPortalBanner style={{width:"100%",height:200}} />
      <IllustrationPixRecorrenteImg style={{width:"100%",height:280}} />
      <IllustrationSearch style={{width:"100%",height:280}} />
      <IllustrationContribuicaoAdicionalImg style={{width:"100%",height:280}} />
    </section>
  </main>;
}
const meta={title:"Laboratory/High contrast dark",component:HighContrastDark} satisfies Meta<typeof HighContrastDark>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Universal:Story={globals:{colorScheme:"dark",contrast:"high"}};
