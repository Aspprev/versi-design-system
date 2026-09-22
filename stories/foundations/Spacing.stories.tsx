import type { Meta, StoryObj } from "@storybook/react-vite";

const TOKENS = ["none", "4xs", "2xs", "xs", "sm", "md", "lg", "xl", "2xl", "4xl"];

function SpacingFoundation() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-content-primary">Spacing</h1>
        <p className="mt-2 text-content-secondary">A escala é usada para manter ritmo e alinhamento entre componentes.</p>
      </div>
      <div className="rounded-md border border-border-subtle bg-surface-card p-6">
        <div className="flex flex-col gap-4">
          {TOKENS.map((token) => (
            <div className="grid grid-cols-[7rem_1fr_4rem] items-center gap-3 text-sm" key={token}>
              <code className="text-content-secondary">--spacing-{token}</code>
              <div className="h-6 rounded-sm bg-primary-1" style={{ width: `var(--spacing-${token})`, minWidth: token === "none" ? 1 : undefined }} />
              <code className="text-right text-content-secondary">var</code>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {["sm", "md", "lg"].map((size) => (
          <div className="rounded-md border border-border-subtle bg-surface-card p-4" key={size}>
            <div className="mb-3 h-16 rounded-sm bg-primary-1" style={{ padding: `var(--spacing-${size})` }}>
              <div className="h-full rounded-sm bg-primary-5" />
            </div>
            <code className="text-xs text-content-secondary">--spacing-{size}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = { title: "Foundations/Spacing", component: SpacingFoundation } satisfies Meta<typeof SpacingFoundation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
