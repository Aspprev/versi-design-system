import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Notice, StatusBadge, Surface, Typography } from "../../src";

const THEMES = ["default", "azul2", "laranja1", "verde3", "rosa1"] as const;

function ThemeComparison() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <Typography element="h1" semanticRole="page-title">Theme comparison</Typography>
        <Typography variant="secondary">Os presets abaixo são os temas reais distribuídos pelo Versi.</Typography>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {THEMES.map((theme) => (
          <section className="rounded-md border border-border-subtle bg-surface-page p-4" data-ds-theme={theme} key={theme}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <Typography element="h2" semanticRole="section-title" size="lg">{theme === "default" ? "Default" : theme}</Typography>
              <span className="h-8 w-8 rounded-full border border-border-default" style={{ backgroundColor: "rgb(var(--primary-1))" }} aria-label={`Cor primária ${theme}`} />
            </div>
            <Surface tone="card" padding="compact">
              <div className="flex flex-wrap items-center gap-3">
                <Button color="primary">Ação principal</Button>
                <Button color="secondary" variant="outline">Secundária</Button>
                <StatusBadge tone="success" appearance="soft">Ativo</StatusBadge>
              </div>
              <Notice type="info" rounded className="mt-4">Tokens semânticos acompanham o preset selecionado.</Notice>
            </Surface>
          </section>
        ))}
      </div>
    </div>
  );
}

const meta = { title: "Themes/Comparison", component: ThemeComparison } satisfies Meta<typeof ThemeComparison>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
