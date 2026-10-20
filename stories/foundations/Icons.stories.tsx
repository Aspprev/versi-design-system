import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MdCheck, MdClose, MdInfo, MdSearch, MdWarning, MdUpload, MdDownload, MdArrowForward } from "react-icons/md";

const ICONS = { MdCheck, MdClose, MdInfo, MdSearch, MdWarning, MdUpload, MdDownload, MdArrowForward };
function Icons() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  return <div className="mx-auto max-w-5xl space-y-6">
    <h1 className="text-3xl font-bold">Ícones</h1>
    <p>Amostra da coleção Material Design de react-icons. Use IconProvider para substituir ícones nos componentes que oferecem essa integração.</p>
    <label className="flex flex-col gap-2">Buscar pelo nome técnico<input className="rounded-md border border-border-default bg-surface-card p-3" value={search} onChange={event => setSearch(event.target.value)} /></label>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{Object.entries(ICONS).filter(([name]) => name.toLowerCase().includes(search.toLowerCase())).map(([name, Icon]) => <button key={name} type="button" className="flex flex-col items-center gap-3 rounded-md border border-border-default p-4" onClick={async () => { try { await navigator.clipboard.writeText(name); setStatus(`${name} copiado.`); } catch { setStatus(`Copie o nome: ${name}`); } }}><Icon aria-hidden size={24} /><code>{name}</code></button>)}</div>
    <p role="status">{status}</p>
    <h2 className="text-xl font-bold">Nome acessível</h2>
    <p>Ícones decorativos usam aria-hidden. Botões somente com ícone precisam de aria-label; tooltip complementa o rótulo.</p>
    <button type="button" aria-label="Pesquisar" className="rounded-md border border-border-default p-3"><MdSearch aria-hidden size={24} /></button>
  </div>;
}
export default { title: "Foundations/Icons", component: Icons } satisfies Meta<typeof Icons>;
export const Overview: StoryObj<typeof Icons> = { name: "Catálogo de ícones" };
