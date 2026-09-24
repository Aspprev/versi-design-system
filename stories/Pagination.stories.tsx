import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "../src";

const meta = { title: "Components/Navigation/Pagination", component: Pagination, tags: ["autodocs"] } satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MiddlePage: Story = { args: { currentPage: 3, totalResults: 47, perPage: 10, onClick: () => undefined } };
export const FirstPage: Story = { args: { currentPage: 1, totalResults: 8, perPage: 10, onClick: () => undefined } };
export const SmallPageSize: Story = { args: { currentPage: 2, totalResults: 17, perPage: 5, onClick: () => undefined } };
export const ArrowControls: Story = {
  args: {
    currentPage: 3,
    totalResults: 47,
    perPage: 10,
    variant: "arrows",
    onClick: () => undefined,
  },
};
export const SmallArrowControls: Story = {
  args: {
    currentPage: 3,
    totalResults: 47,
    perPage: 10,
    size: "small",
    variant: "arrows",
    onClick: () => undefined,
  },
};
