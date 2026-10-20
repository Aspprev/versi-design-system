import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Notice, StatusBadge, Surface, Typography } from "../../src";

function ErrorState() {
  const [state, setState] = useState<"error" | "loading" | "success">("error");
  useEffect(() => { if (state !== "loading") return; const timer = window.setTimeout(() => setState("success"), 800); return () => window.clearTimeout(timer); }, [state]);
  return (
    <Surface tone="subtle" padding="default" className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {state === "success" ? <><Notice type="success">Dados carregados nesta demonstração.</Notice><Button onClick={() => setState("error")}>Reiniciar exemplo</Button></> : <>
      <Typography element="h1" semanticRole="section-title">Não foi possível carregar os dados</Typography>
      <Notice type="danger" rounded>Verifique sua conexão e tente novamente.</Notice>
      <div className="flex items-center justify-between gap-4">
        <StatusBadge tone="danger" appearance="soft">Falha temporária</StatusBadge>
        <Button type="button" loading={state === "loading"} onClick={() => setState("loading")}>Tentar novamente</Button>
      </div>
      </>}
    </Surface>
  );
}

const meta = {
  title: "Patterns/Feedback",
  tags: ["autodocs"],
  component: ErrorState,
  parameters: { docs: { description: { component: "Composição de feedback para páginas de produto." } } },
} satisfies Meta<typeof ErrorState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Error: Story = {
  name: "Erro",};
