import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Button, InputStandalone, InputSwitch, LoadingDots, Notice, StatusBadge, Surface, Typography } from "../src";
import { guidanceFor } from "../.storybook/component-guidance";
import { catalog } from "./shared/catalog";

const categories: Record<string, string> = { Actions: "Ações", Forms: "Formulários", "Data Display": "Exibição de dados", Feedback: "Feedback", Navigation: "Navegação", Layout: "Layout", Documents: "Documentos", Overlay: "Sobreposições", Accessibility: "Acessibilidade", Utilities: "Utilitários" };
function Miniature({ name }: { name: string }) {
  if (name === "Button") return <Button>Continuar</Button>;
  if (name === "InputStandalone" || name === "Input/Formik") return <InputStandalone label="Nome completo" placeholder="Digite seu nome" />;
  if (name === "InputSwitch") return <InputSwitch aria-label="Receber avisos" defaultEnable />;
  if (name === "StatusBadge") return <StatusBadge tone="success" appearance="soft">Ativo</StatusBadge>;
  if (name === "Notice") return <Notice type="info">Informação complementar</Notice>;
  if (name === "Avatar") return <Avatar name="Maria Silva" />;
  if (name === "LoadingDots") return <LoadingDots />;
  if (name === "Surface") return <Surface tone="subtle" padding="compact">Área de conteúdo</Surface>;
  if (name === "Typography") return <Typography element="span" semanticRole="section-title">Título da seção</Typography>;
  return <span className="text-center text-lg font-semibold text-content-secondary">{name}</span>;
}
function ComponentCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const visible = catalog.filter(item => (!category || item.category === category) && `${item.name} ${guidanceFor(item.title)} ${categories[item.category]}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")));
  return <div className="mx-auto max-w-7xl space-y-6">
    <h1 className="text-3xl font-bold">Catálogo de componentes</h1>
    <p>Encontre o componente e abra sua documentação para experimentar as propriedades, os estados e o código.</p>
    <InputStandalone label="Buscar componente" placeholder="Nome ou finalidade do componente" value={query} onChange={event => setQuery(event.target.value)} />
    <div className="flex flex-wrap gap-2" aria-label="Categorias">
      {["", ...new Set(catalog.map(item => item.category))].map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)} className={`rounded-full border border-border-default px-3 py-2 ${category === value ? "bg-action-primary font-semibold text-action-primary-content" : "bg-surface-card text-content-primary"}`}>{categories[value] ?? "Todos"}</button>)}
    </div>
    <p role="status">{visible.length} componentes encontrados.</p>
    <div className="versi-catalog-grid">{visible.map(item => <article key={item.id} className="rounded-md border border-border-subtle bg-surface-card p-4">
      <div className="versi-catalog-preview" inert aria-hidden="true"><Miniature name={item.name} /></div>
      <h2 className="text-lg font-bold"><a href={`?path=/docs/${item.id}`} className="underline underline-offset-4">{item.name}</a></h2>
      <p className="mt-2 text-sm text-content-secondary">{guidanceFor(item.title)}</p>
    </article>)}</div>
    {!visible.length && <p>Experimente outro termo ou selecione Todas as categorias.</p>}
    <p><a href="?path=/docs/guidelines-componentchoice--docs">Ajuda para escolher o componente</a></p>
  </div>;
}
export default { title: "Components/Overview", component: ComponentCatalog, parameters: { controls: { disable: true } } } satisfies Meta<typeof ComponentCatalog>;
export const Catalog: StoryObj<typeof ComponentCatalog> = { name: "Catálogo" };
