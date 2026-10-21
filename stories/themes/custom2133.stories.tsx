import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClientThemeGallery } from "./ClientThemeGallery";
import { PrimaryComparison } from "./PrimaryComparison";

const meta = {
  title: "Themes/Clients/custom2133",
  component: ClientThemeGallery,
  args: { client: "custom2133" },
  globals: { dsTheme: "custom2133" },
} satisfies Meta<typeof ClientThemeGallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = { name: "Claro", globals: { colorScheme: "light", contrast: "normal" } };
export const Dark: Story = { name: "Escuro", globals: { colorScheme: "dark", contrast: "normal" } };
export const HighLight: Story = { name: "Alto contraste claro", globals: { colorScheme: "light", contrast: "high" } };
export const HighDark: Story = { name: "Alto contraste escuro", globals: { colorScheme: "dark", contrast: "high" } };
const renderComparison: NonNullable<Story["render"]> = (_args, context) => <PrimaryComparison dark={context.globals.colorScheme === "dark" || (context.globals.colorScheme === "system" && document.documentElement.dataset.colorScheme === "dark")} highContrast={context.globals.contrast === "high"} />;
export const PrimaryComparisonLight: Story = { name: "Comparar primária · claro", render: renderComparison, globals: { colorScheme: "light", contrast: "normal" } };
export const PrimaryComparisonDark: Story = { name: "Comparar primária · escuro", render: renderComparison, globals: { colorScheme: "dark", contrast: "normal" } };
