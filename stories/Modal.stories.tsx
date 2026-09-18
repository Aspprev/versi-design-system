import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "../src";

const meta = { title: "Design System/Modal", component: Modal, tags: ["autodocs"], args: { isOpen: false, onClose: () => undefined } } satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button type="button" className="rounded-sm bg-action-primary px-4 py-2 font-bold text-action-primary-content" onClick={() => setIsOpen(true)}>Abrir modal</button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} title="Simulação concluída">
          <p className="text-center text-content-secondary">O resultado foi calculado com sucesso.</p>
        </Modal>
      </>
    );
  },
  args: { variant: "success", size: "small", showIcon: true },
};

export const Error: Story = { args: { isOpen: true, title: "Não foi possível concluir", variant: "error", onClose: () => undefined } };
