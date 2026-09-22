import type { Meta, StoryObj } from "@storybook/react-vite";

const SAMPLES = [
  ["text-2xs", "0.625rem"], ["text-xs", "0.75rem"], ["text-sm", "0.875rem"], ["text-md", "1rem"],
  ["text-lg", "1.125rem"], ["text-xl", "1.25rem"], ["text-2xl", "1.5rem"],
  ["title-sm", "2rem"], ["title-md", "2.5rem"], ["title-lg", "3rem"], ["title-xl", "3.5rem"],
] as const;

function TypographyFoundation() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-content-primary">Typography</h1>
        <p className="mt-2 text-content-secondary">A família base, a escala e os line-heights vêm dos tokens do Versi.</p>
      </div>
      <div className="rounded-md border border-border-subtle bg-surface-card p-6">
        <p className="text-sm text-content-secondary">Família: <code>var(--font-family-base)</code></p>
        <div className="mt-6 flex flex-col divide-y divide-border-subtle">
          {SAMPLES.map(([name, fallback]) => (
            <div className="flex flex-wrap items-baseline justify-between gap-4 py-4" key={name}>
              <span className="text-content-secondary"><code>--{name}</code> · {fallback}</span>
              <span style={{ fontSize: `var(--${name})`, lineHeight: `var(--leading-${name.replace("text-", "")}, 1.4)` }}>Versi Design System</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {["font-normal", "font-semibold", "font-bold"].map((weight) => (
          <div className="rounded-md border border-border-subtle bg-surface-card p-4" key={weight}>
            <p className={`${weight} text-lg text-content-primary`}>Peso {weight.replace("font-", "")}</p>
            <code className="text-xs text-content-secondary">{weight}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = { title: "Foundations/Typography", component: TypographyFoundation } satisfies Meta<typeof TypographyFoundation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
