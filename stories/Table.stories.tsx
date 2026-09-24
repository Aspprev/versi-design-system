import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  MobileCardTable,
  Table,
  type ITableColumnConfig,
  type MobileCardTableProps,
} from "../src";

type Participant = {
  id: number;
  name: string;
  plan: string;
  balance: string;
};

const rows: Participant[] = [
  { id: 1, name: "Ana Martins", plan: "Básico", balance: "R$ 12.450,00" },
  { id: 2, name: "Bruno Costa", plan: "Especial", balance: "R$ 18.900,00" },
  { id: 3, name: "Carla Souza", plan: "Normal", balance: "R$ 9.780,00" },
];

const columns: ITableColumnConfig<Participant>[] = [
  { key: "name", title: "Participante", accessor: (item) => item.name, widthUnits: 2 },
  { key: "plan", title: "Plano", accessor: (item) => item.plan, widthUnits: 1 },
  { key: "balance", title: "Saldo", accessor: (item) => item.balance, widthUnits: 1 },
];

const meta = {
  title: "Components/Data Display/Table",
  component: Table<Participant>,
  tags: ["autodocs"],
  args: {
    header: columns,
    data: rows,
    accessibleName: "Participantes e saldos",
  },
} satisfies Meta<typeof Table<Participant>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StripedCompact: Story = {
  args: { rowVariant: "striped", density: "compact", enableRowHover: true },
};

export const StickyHeader: Story = {
  args: { stickyHeader: true, scrollAreaMaxHeight: "12rem", overflowMode: "scroll" },
};

const filterableColumns: ITableColumnConfig<Participant>[] = [
  ...columns,
  {
    key: "status",
    title: "Status",
    accessor: (item) => item.plan,
    widthUnits: 1,
    filters: {
      controls: [
        {
          id: "status",
          type: "options",
          label: "Filtrar por status",
          optionList: [
            { label: "Todos", value: "__all__" },
            { label: "Básico", value: "Básico" },
            { label: "Especial", value: "Especial" },
          ],
        },
        {
          id: "search",
          type: "search",
          label: "Pesquisar participante",
          placeholder: "Nome",
        },
      ],
    },
  },
];

export const ResponsiveAdaptive: Story = {
  render: (args) => (
    <div className="max-w-[520px]">
      <Table {...args} overflowMode="adaptive" header={columns} />
    </div>
  ),
};

export const Filterable: Story = {
  render: (args) => (
    <Table
      {...args}
      header={filterableColumns}
      data={rows}
      accessibleName="Participantes filtráveis"
    />
  ),
};

export const Expandable: Story = {
  render: (args) => {
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    return (
      <Table
        {...args}
        expandable={{
          expandedRowId,
          getRowId: (item: Participant) => item.id,
          onToggleRow: (rowId) => setExpandedRowId(expandedRowId === rowId ? null : Number(rowId)),
          renderExpandedRow: (item: Participant) => <p className="text-sm">Detalhes de {item.name}</p>,
        }}
      />
    );
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    loadingMessage: "Carregando participantes…",
  },
};

export const Error: Story = {
  args: {
    errorMessage: "Não foi possível carregar os participantes.",
  },
};

function MobileCards(props: MobileCardTableProps<Participant>) {
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  return (
    <MobileCardTable
      {...props}
      expandable={{
        expandedRowId,
        getRowId: (item) => item.id,
        onToggleRow: (rowId, item, index) => setExpandedRowId(expandedRowId === rowId ? null : Number(rowId)),
        renderExpandedRow: (item) => <p className="text-sm">Detalhes de {item.name}</p>,
      }}
    />
  );
}

export const MobileCard: Story = {
  render: () => (
    <MobileCards
      headers={[{ label: "Participante" }, { label: "Plano" }, { label: "Saldo" }]}
      data={rows}
      accessibleName="Participantes"
      keyExtractor={(item) => String(item.id)}
      renderCard={(item) => (
        <div className="grid grid-cols-3 gap-3 px-3 py-3 text-sm">
          <span>{item.name}</span>
          <span>{item.plan}</span>
          <span>{item.balance}</span>
        </div>
      )}
    />
  ),
};
