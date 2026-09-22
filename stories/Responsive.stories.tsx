import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  breakpoints,
  getBreakpoint,
  resolveContainerBreakpoint,
  useBreakpoint,
  useContainerBreakpoint,
} from "../src";

const meta = {
  title: "Foundations/Responsive",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Use useBreakpoint para decisões baseadas na viewport e useContainerBreakpoint para decisões baseadas no espaço real do componente.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ResponsivePlayground() {
  const viewportBreakpoint = useBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(720);
  const containerBreakpoint = useContainerBreakpoint(containerRef);

  return (
    <div className="mx-auto flex w-full max-w-[var(--content-max-width)] flex-col gap-6 px-[var(--content-gutter-inline)]">
      <div>
        <h1 className="text-xl font-bold text-content-primary">
          Viewport versus container
        </h1>
        <p className="mt-2 max-w-3xl text-content-secondary">
          A viewport representa a janela do navegador. O container representa
          a largura disponível para o componente, inclusive quando há menu,
          coluna lateral ou painel adjacente.
        </p>
      </div>

      <dl className="grid gap-3 tablet:grid-cols-2">
        <div className="rounded-sm border border-border-default bg-surface-card p-4">
          <dt className="text-sm font-semibold text-content-secondary">
            Breakpoint da viewport
          </dt>
          <dd className="mt-1 text-lg font-bold text-content-primary">
            {viewportBreakpoint}
          </dd>
          <dd className="mt-1 text-xs text-content-secondary">
            {Object.entries(breakpoints)
              .map(([name, value]) => `${name}: ${value}px`)
              .join(" · ")}
          </dd>
        </div>
        <div className="rounded-sm border border-border-default bg-surface-card p-4">
          <dt className="text-sm font-semibold text-content-secondary">
            Breakpoint do container
          </dt>
          <dd className="mt-1 text-lg font-bold text-content-primary">
            {containerBreakpoint ?? "medindo…"}
          </dd>
          <dd className="mt-1 text-xs text-content-secondary">
            Threshold padrão: mobile 0px, tablet 640px, desktop 1024px, wide
            1440px.
          </dd>
        </div>
      </dl>

      <label className="grid max-w-xl gap-2 text-sm font-semibold text-content-primary">
        Largura simulada do container: {containerWidth}px
        <input
          type="range"
          min="280"
          max="1500"
          step="10"
          value={containerWidth}
          onChange={(event) => setContainerWidth(Number(event.target.value))}
          aria-label="Largura simulada do container"
        />
      </label>

      <div className="min-w-0 overflow-x-auto rounded-sm border border-dashed border-border-strong p-3">
        <div
          ref={containerRef}
          style={{ width: `${containerWidth}px`, maxWidth: "100%" }}
          className="min-h-28 rounded-sm bg-surface-muted p-4 text-content-primary"
        >
          <p className="font-semibold">Área observada pelo ResizeObserver</p>
          <p className="mt-1 text-sm text-content-secondary">
            O breakpoint deste bloco pode mudar sem alterar a viewport.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-border-default bg-surface-card p-4 text-sm text-content-secondary">
        <p className="font-semibold text-content-primary">Contrato puro</p>
        <p className="mt-1">
          800px de viewport → <code>{getBreakpoint(800)}</code>; 800px de
          container → <code>{resolveContainerBreakpoint(800)}</code>.
        </p>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <ResponsivePlayground />,
};
