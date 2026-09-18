import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "../src";

const meta = { title: "Design System/Pagination", component: Pagination, tags: ["autodocs"] } satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MiddlePage: Story = { args: { currentPage: 3, totalResults: 47, perPage: 10, onClick: () => undefined } };
export const FirstPage: Story = { args: { currentPage: 1, totalResults: 8, perPage: 10, onClick: () => undefined } };
