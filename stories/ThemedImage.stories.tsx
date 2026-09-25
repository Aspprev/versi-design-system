import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemedImage } from "../src";

const light = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='60'%3E%3Crect width='220' height='60' rx='8' fill='%230f62c1'/%3E%3Ctext x='110' y='38' text-anchor='middle' fill='white' font-size='24'%3ELight%3C/text%3E%3C/svg%3E";
const dark = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='60'%3E%3Crect width='220' height='60' rx='8' fill='%23c5d6fe'/%3E%3Ctext x='110' y='38' text-anchor='middle' fill='%23191c1f' font-size='24'%3EDark%3C/text%3E%3C/svg%3E";

const meta = { title: "Components/Utilities/ThemedImage", component: ThemedImage, tags: ["autodocs"] } satisfies Meta<typeof ThemedImage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LightAndDark: Story = { args: { source: { light, dark }, alt: "Logo temático", width: 220, height: 60 } };

