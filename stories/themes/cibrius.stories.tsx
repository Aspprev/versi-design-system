import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClientThemeGallery } from "./ClientThemeGallery";

const meta = {
  title: "Themes/Clients/Cibrius",
  component: ClientThemeGallery,
  args: { client: "cibrius" },
  globals: { dsTheme: "cibrius" },
} satisfies Meta<typeof ClientThemeGallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = { name: "Claro", globals: { colorScheme: "light", contrast: "normal" } };
export const Dark: Story = { name: "Escuro", globals: { colorScheme: "dark", contrast: "normal" } };
export const HighLight: Story = { name: "Alto contraste claro", globals: { colorScheme: "light", contrast: "high" } };
export const HighDark: Story = { name: "Alto contraste escuro", globals: { colorScheme: "dark", contrast: "high" } };
