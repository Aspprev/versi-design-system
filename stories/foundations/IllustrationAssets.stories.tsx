import type { Meta, StoryObj } from "@storybook/react-vite";
import * as assets from "../../src/components/illustrations";

function IllustrationAssets() {
  return <main style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
    {Object.entries(assets).map(([name, Asset]) => <figure key={name} style={{ margin: 0, color: "rgb(var(--content-primary))", background: "rgb(var(--surface-card-semantic))" }}>
      <Asset aria-label={name} role="img" style={{ width: "100%", height: 260, objectFit: "contain" }} />
      <figcaption>{name}</figcaption>
    </figure>)}
  </main>;
}

const meta = { title: "Foundations/Illustration assets", component: IllustrationAssets } satisfies Meta<typeof IllustrationAssets>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = { globals: { colorScheme: "light", contrast: "normal" } };
export const Dark: Story = { globals: { colorScheme: "dark", contrast: "normal" } };
export const HighLight: Story = { globals: { colorScheme: "light", contrast: "high" } };
export const HighDark: Story = { globals: { colorScheme: "dark", contrast: "high" } };
