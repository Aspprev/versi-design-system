import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import { InputPhone, type InputPhoneProps, type PhoneValue } from "../src";

const meta = {
  title: "Components/Forms/InputPhone",
  component: InputPhone,
  tags: ["autodocs"],
  args: {
    name: "telefone",
    label: "Telefone",
    placeholder: "Digite o telefone",
  },
} satisfies Meta<typeof InputPhone>;

export default meta;
type Story = StoryObj<typeof meta>;

function PhoneForm({
  initialValue = "",
  initialError,
  initialTouched = false,
  ...phoneProps
}: InputPhoneProps & {
  initialValue?: string | PhoneValue;
  initialError?: string;
  initialTouched?: boolean;
}) {
  return (
    <Formik
      initialValues={{ [phoneProps.name]: initialValue }}
      initialErrors={initialError ? { [phoneProps.name]: initialError } : {}}
      initialTouched={initialTouched ? { [phoneProps.name]: true } : {}}
      onSubmit={() => undefined}
    >
      <form className="max-w-xl">
        <InputPhone {...phoneProps} />
      </form>
    </Formik>
  );
}

export const Default: Story = {
  render: (args) => <PhoneForm {...args} />,
};

export const Filled: Story = {
  render: (args) => (
    <PhoneForm
      {...args}
      initialValue={{ ddi: 55, ddd: "11", numero: "987654321" }}
    />
  ),
};

export const SearchCountry: Story = {
  render: (args) => <PhoneForm {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Abra o seletor de país para pesquisar por nome, sigla ou DDI.",
      },
    },
  },
};

export const Error: Story = {
  render: (args) => (
    <PhoneForm
      {...args}
      initialError="Informe um telefone válido."
      initialTouched
    />
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <PhoneForm
      {...args}
      initialValue={{ ddi: 55, ddd: "11", numero: "987654321" }}
    />
  ),
};

export const FullCountryList: Story = {
  render: (args) => <PhoneForm {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Usa automaticamente a lista completa de países do Design System.",
      },
    },
  },
};

export const IncludedCountries: Story = {
  args: {
    countryList: { mode: "include", codes: ["BR", "PT", "US"] },
  },
  render: (args) => <PhoneForm {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Permite somente os países informados pelos códigos ISO-2.",
      },
    },
  },
};

export const ExcludedCountries: Story = {
  args: {
    countryList: { mode: "exclude", codes: ["BR", "PT"] },
  },
  render: (args) => <PhoneForm {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Permite todos os países, exceto os códigos informados.",
      },
    },
  },
};
