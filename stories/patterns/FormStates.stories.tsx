import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldState } from "../shared/FieldState";

function FormStates() {
  return <div className="mx-auto max-w-7xl space-y-6">
    <h1 className="text-3xl font-bold">Estados atuais dos campos</h1>
    <p>Os exemplos usam os tokens publicados. Compare preenchimento e disponibilidade na toolbar, incluindo alto contraste e fonte ampliada. Os campos habilitados são interativos.</p>
    <div className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-4">
      <FieldState filled={false} disabled={false} />
      <FieldState filled disabled={false} />
      <FieldState filled={false} disabled />
      <FieldState filled disabled />
    </div>
    <p><a href="?path=/story/components-forms-validationerrors--comparison">Conferir também os estados de erro</a></p>
  </div>;
}
export default { title: "Patterns/Forms/FormStates", component: FormStates, parameters: { controls: { disable: true } } } satisfies Meta<typeof FormStates>;
export const Overview: StoryObj<typeof FormStates> = { name: "Vazio, preenchido e desabilitado" };
