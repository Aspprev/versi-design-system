import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputStandalone, Table, type ITableColumnConfig } from "../../src";

const data = Array.from({ length: 24 }, (_, i) => ({ id: i + 1, name: `Participante ${i + 1}`, plan: i % 2 ? "Especial" : "Básico" }));
const header: ITableColumnConfig<(typeof data)[number]>[] = [
  { key: "name", title: "Participante", accessor: row => row.name, widthUnits: 2 },
  { key: "plan", title: "Plano", accessor: row => row.plan, widthUnits: 1 },
];
function DataTable() {
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState("");
  const rows = data.filter(row => row.name.toLowerCase().includes(query.toLowerCase()) && (!plan || row.plan === plan));
  return <div className="mx-auto max-w-5xl space-y-6">
    <h1 className="text-3xl font-bold">Consulta de participantes</h1>
    <p>Busca, filtro e paginação locais. Em produção, adapte a consulta ao serviço de dados.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <InputStandalone label="Buscar participante" value={query} onChange={event => setQuery(event.target.value)} placeholder="Nome do participante" />
      <label className="flex flex-col gap-2">Plano<select className="min-h-10 rounded-sm border border-border-default bg-surface-card px-3" value={plan} onChange={event => setPlan(event.target.value)}><option value="">Todos</option><option>Básico</option><option>Especial</option></select></label>
    </div>
    <p role="status">{rows.length} participantes encontrados.</p>
    {rows.length ? <Table key={`${query}-${plan}`} header={header} data={rows} itemsPerPage={5} showPagination accessibleName="Participantes encontrados" /> : <p>Nenhum participante encontrado. Revise a busca ou o filtro.</p>}
  </div>;
}
export default { title: "Patterns/Data/Table", component: DataTable, tags: ["autodocs"] } satisfies Meta<typeof DataTable>;
export const SearchAndPagination: StoryObj<typeof DataTable> = { name: "Busca, filtro e paginação" };
