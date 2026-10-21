import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, CircularLoading, LoadingDots, Modal, Notice, Surface } from "../../src";

function StatusExamples() {
  const [active, setActive] = useState<"success" | "warning" | "danger" | null>(null);
  return <main className="space-y-6 p-4 text-content-primary">
    <h1 className="text-xl font-semibold">Estados semânticos</h1>
    <p>Sucesso, aviso e erro usam cores de feedback, independentes dos acentos de marca.</p>
    <div className="grid gap-6 desktop:grid-cols-3">
      {(["success", "warning", "danger"] as const).map(tone => <section key={tone} className="space-y-4">
        <h2 className="font-semibold">{tone}</h2>
        <div className="flex flex-wrap gap-2">{(["flat", "outline", "plain"] as const).map(variant => <Button key={variant} color={tone} variant={variant}>{variant}</Button>)}</div>
        <Button color={tone} loading>Carregando</Button>
        <Notice type={tone} textColor="color">Mensagem de {tone}</Notice>
        <Surface tone={tone}>Superfície de {tone}</Surface>
        <div className="flex items-center gap-4"><CircularLoading color={tone} size={32} /><LoadingDots color={tone} /></div>
        <Button color={tone} variant="outline" onClick={() => setActive(tone)}>Abrir modal {tone}</Button>
      </section>)}
    </div>
    <Modal isOpen={active !== null} onClose={() => setActive(null)} variant={active === "danger" ? "error" : active ?? "success"} title={`Estado: ${active ?? "success"}`}>
      <p>Exemplo do mesmo estado semântico em um modal.</p>
    </Modal>
  </main>;
}
const meta = { title: "Laboratory/Status", component: StatusExamples } satisfies Meta<typeof StatusExamples>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = { name: "Claro", globals: { colorScheme: "light", contrast: "normal" } };
export const Dark: Story = { name: "Escuro", globals: { colorScheme: "dark", contrast: "normal" } };
export const HighLight: Story = { name: "Alto contraste claro", globals: { colorScheme: "light", contrast: "high" } };
export const HighDark: Story = { name: "Alto contraste escuro", globals: { colorScheme: "dark", contrast: "high" } };
