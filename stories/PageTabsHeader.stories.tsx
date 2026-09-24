import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTabsHeader } from "../src";

const meta = {
  title: "Components/Layout/PageTabsHeader",
  component: PageTabsHeader,
  tags: ["autodocs"],
  args: {
    title: "Meu beneficio",
    tabs: [
      { id: "overview", label: "Visao geral" },
      { id: "history", label: "Historico", notification: 2 },
    ],
    activeTab: "overview",
    onTabChange: () => undefined,
  },
} satisfies Meta<typeof PageTabsHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);

    return (
      <PageTabsHeader
        {...args}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    );
  },
};

export const LongTitle: Story = {
  args: {
    title: "Contracheques e historico de pagamentos disponiveis",
    tabs: [
      { id: "benefit", label: "Meu beneficio" },
      { id: "statements", label: "Contracheques" },
      { id: "history", label: "Ficha financeira" },
    ],
    activeTab: "statements",
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);

    return (
      <PageTabsHeader
        {...args}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    );
  },
};

export const Small: Story = {
  args: { size: "small" },
};

export const FlexibleLimitedWidth: Story = {
  args: {
    title: "Histórico de atendimentos e informações do meu benefício",
    tabs: [
      { id: "benefit", label: "Meu benefício" },
      { id: "statements", label: "Contracheques" },
      { id: "history", label: "Ficha financeira" },
    ],
    activeTab: "benefit",
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);

    return (
      <div className="flex w-full min-w-0 max-w-2xl">
        <PageTabsHeader
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    );
  },
};
