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
  name: "Padrão",
  render: (args) => <PhoneForm {...args} />,
};

export const Filled: Story = {
  name: "Preenchido",
  render: (args) => (
    <PhoneForm
      {...args}
      initialValue={{ ddi: 55, ddd: "11", numero: "987654321" }}
    />
  ),
};

export const SearchCountry: Story = {
  name: "Busca de países",
  tags: ["!dev"],
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
  name: "Erro",
  render: (args) => (
    <PhoneForm
      {...args}
      initialError="Informe um telefone válido."
      initialTouched
    />
  ),
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true },
  render: (args) => (
    <PhoneForm
      {...args}
      initialValue={{ ddi: 55, ddd: "11", numero: "987654321" }}
    />
  ),
};

export const WithoutFlags: Story = {
  name: "Sem bandeiras",
  args: { showFlags: false },
  render: (args) => <PhoneForm {...args} initialValue={{ ddi: 55, ddd: "11", numero: "987654321" }} />,
  parameters: {
    docs: {
      description: {
        story: "Oculta somente a bandeira do input; a lista de países mantém as bandeiras, o DDI e a busca.",
      },
    },
  },
};

export const ResponsiveGrid: Story = {
  name: "Grade responsiva",
  render: (args) => (
    <Formik initialValues={{ [args.name]: "" }} onSubmit={() => undefined}>
      <form className="grid min-w-0 grid-cols-1 gap-4 tablet:grid-cols-3">
        <InputPhone {...args} className="w-full" />
        <InputPhone {...args} name={`${args.name}-second`} className="w-full" />
        <InputPhone {...args} name={`${args.name}-third`} className="w-full" />
      </form>
    </Formik>
  ),
  parameters: {
    docs: {
      description: {
        story: "Valida largura total em grid responsivo com três colunas.",
      },
    },
  },
};

export const FullCountryList: Story = {
  name: "Lista completa de países",
  tags: ["!dev"],
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
  name: "Países incluídos",
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
  name: "Países excluídos",
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
