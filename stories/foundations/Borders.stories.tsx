import type { Meta, StoryObj } from "@storybook/react-vite";

function Borders() {
  return <div className="mx-auto max-w-5xl space-y-6">
    <h1 className="text-3xl font-bold">Bordas e raios</h1>
    <p>Use tokens para manter a geometria consistente entre os temas.</p>
    <div className="grid gap-4 sm:grid-cols-4">
      {["none", "sm", "md", "lg"].map(size => <div key={size} className="border border-border-default bg-surface-subtle p-6" style={{ borderRadius: `var(--border-radius-${size})` }}><code>--border-radius-{size}</code></div>)}
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-md border border-border-default p-6">Borda padrão · 1px</div>
      <div className="rounded-md border-2 border-feedback-danger-border p-6">Validação · 2px</div>
      <button type="button" className="rounded-md border border-border-default p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Use Tab para conferir o foco</button>
    </div>
    <p>Erro precisa de mensagem além da cor. O indicador de foco deve continuar visível em todos os temas.</p>
  </div>;
}
export default { title: "Foundations/Borders", component: Borders } satisfies Meta<typeof Borders>;
export const Overview: StoryObj<typeof Borders> = { name: "Visão geral" };
