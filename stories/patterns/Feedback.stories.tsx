import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Notice, StatusBadge, Surface, Typography } from "../../src";

function ErrorState() {
  return (
    <Surface tone="subtle" padding="default" className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Typography element="h1" semanticRole="section-title">Não foi possível carregar os dados</Typography>
      <Notice type="danger" rounded>Verifique sua conexão e tente novamente.</Notice>
      <div className="flex items-center justify-between gap-4">
        <StatusBadge tone="danger" appearance="soft">Falha temporária</StatusBadge>
        <Button type="button">Tentar novamente</Button>
      </div>
    </Surface>
  );
}

const meta = {
  title: "Patterns/Feedback",
  component: ErrorState,
  parameters: { docs: { description: { component: "Composição de feedback para páginas de produto." } } },
} satisfies Meta<typeof ErrorState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Error: Story = {};
