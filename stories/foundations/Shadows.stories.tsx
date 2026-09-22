import type { Meta, StoryObj } from "@storybook/react-vite";

const TOKENS = ["shadow-sm", "shadow-md", "shadow-lg", "shadow-focus", "shadow-outline", "shadow-button-focus"];

function ShadowsFoundation() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-content-primary">Shadows</h1>
        <p className="mt-2 text-content-secondary">Elevação e foco são contratos visuais do sistema, inclusive nos modos de tema.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 desktop:grid-cols-3">
        {TOKENS.map((token) => (
          <div className="rounded-md bg-surface-card p-6" key={token} style={{ boxShadow: `var(--${token})` }}>
            <div className="flex h-28 items-center justify-center rounded-sm border border-border-subtle bg-surface-card text-center text-sm text-content-primary">
              <code>--{token}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = { title: "Foundations/Shadows", component: ShadowsFoundation } satisfies Meta<typeof ShadowsFoundation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
