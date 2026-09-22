import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

type Token = { name: string; label: string };
type TokenGroup = { title: string; tokens: Token[] };

const GROUPS: TokenGroup[] = [
  {
    title: "Brand",
    tokens: ["primary", "secondary", "tertiary"].flatMap((family) =>
      Array.from({ length: 5 }, (_, index) => ({
        name: `--${family}-${index + 1}`,
        label: `${family}-${index + 1}`,
      })),
    ),
  },
  {
    title: "Neutrals",
    tokens: [
      "--grayscale-1", "--grayscale-2", "--grayscale-3", "--grayscale-4", "--grayscale-5",
      "--bg-lighter", "--bg-light", "--bg-dark", "--bg-disabled",
    ].map((name) => ({ name, label: name.slice(2) })),
  },
  {
    title: "Feedback",
    tokens: [
      "--feedback-info-strong", "--feedback-info-soft", "--feedback-warning-strong",
      "--feedback-warning-soft", "--feedback-success-strong", "--feedback-success-soft",
      "--feedback-danger-strong", "--feedback-danger-soft",
    ].map((name) => ({ name, label: name.slice(2) })),
  },
  {
    title: "Semantic",
    tokens: [
      "--content-primary", "--content-secondary", "--content-link", "--surface-page",
      "--surface-card-semantic", "--surface-muted", "--border-default", "--focus-ring",
    ].map((name) => ({ name, label: name.slice(2) })),
  },
];

function ColorSwatches() {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement);
    setValues(
      Object.fromEntries(
        GROUPS.flatMap((group) => group.tokens).map((token) => [
          token.name,
          computed.getPropertyValue(token.name).trim(),
        ]),
      ),
    );
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-content-primary">Colors</h1>
        <p className="mt-2 max-w-3xl text-content-secondary">
          Valores lidos diretamente dos tokens CSS ativos. Use a toolbar para observar o mesmo contrato em outros temas.
        </p>
      </div>
      {GROUPS.map((group) => (
        <section key={group.title}>
          <h2 className="mb-3 text-xl font-bold text-content-primary">{group.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 desktop:grid-cols-4">
            {group.tokens.map((token) => (
              <article className="overflow-hidden rounded-md border border-border-subtle bg-surface-card" key={token.name}>
                <div className="h-20 border-b border-border-subtle" style={{ backgroundColor: `rgb(var(${token.name}))` }} />
                <div className="p-3">
                  <strong className="block text-sm text-content-primary">{token.label}</strong>
                  <code className="mt-1 block break-all text-xs text-content-secondary">{token.name}</code>
                  <code className="mt-1 block text-xs text-content-muted">{values[token.name] || "-"}</code>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = { title: "Foundations/Colors", component: ColorSwatches } satisfies Meta<typeof ColorSwatches>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
