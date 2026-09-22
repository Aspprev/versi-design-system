import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import { RadioGroup } from "../src";

const meta = {
  title: "Components/Forms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  args: {
    name: "tipo",
    options: [
      { label: "Aposentadoria normal", value: "normal" },
      { label: "Aposentadoria especial", value: "especial" },
    ],
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Formik initialValues={{ tipo: "normal" }} onSubmit={() => undefined}>
      <RadioGroup
        name="tipo"
        label="Tipo de benefício"
        options={[
          { label: "Aposentadoria normal", value: "normal" },
          { label: "Aposentadoria especial", value: "especial" },
        ]}
      />
    </Formik>
  ),
};
