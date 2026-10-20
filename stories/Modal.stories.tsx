import { useArgs } from "storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "../src";

const meta = { title: "Components/Overlay/Modal", component: Modal, tags: ["autodocs"], args: { isOpen: false, onClose: () => undefined } } satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  name: "Sucesso",
  render: (args) => {
    const [{ isOpen }, updateArgs] = useArgs();
    return (
      <>
        <button type="button" className="rounded-sm bg-action-primary px-4 py-2 font-bold text-action-primary-content" onClick={() => updateArgs({ isOpen: true })}>Abrir modal</button>
        <Modal {...args} isOpen={isOpen} onClose={() => updateArgs({ isOpen: false })}>
          <p className="text-center text-content-secondary">O resultado foi calculado com sucesso.</p>
        </Modal>
      </>
    );
  },
  args: { title: "Simulação concluída", variant: "success", size: "small", showIcon: true },
};

export const Error: Story = {
  name: "Erro", render: (args) => {
    const [{ isOpen }, updateArgs] = useArgs();
    return <><button type="button" onClick={() => updateArgs({ isOpen: true })}>Abrir modal de erro</button><Modal {...args} isOpen={isOpen} onClose={() => updateArgs({ isOpen: false })} /></>;
  }, args: { isOpen: true, title: "Não foi possível concluir", variant: "error", onClose: () => undefined } };
