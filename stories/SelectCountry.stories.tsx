import type { Meta, StoryObj } from "@storybook/react-vite";
import { Formik } from "formik";
import {
  SelectCountry,
  type SelectCountryProps,
} from "../src";

const meta = {
  title: "Components/Forms/SelectCountry",
  component: SelectCountry,
  tags: ["autodocs"],
  args: {
    name: "pais",
    label: "País de residência",
    placeholder: "Selecione um país",
  },
} satisfies Meta<typeof SelectCountry>;

export default meta;
type Story = StoryObj<typeof meta>;

function CountryForm({
  initialValue = "",
  initialError,
  initialTouched = false,
  ...countryProps
}: SelectCountryProps & {
  initialValue?: string;
  initialError?: string;
  initialTouched?: boolean;
}) {
  return (
    <Formik
      initialValues={{ [countryProps.name]: initialValue }}
      initialErrors={initialError ? { [countryProps.name]: initialError } : {}}
      initialTouched={initialTouched ? { [countryProps.name]: true } : {}}
      onSubmit={() => undefined}
    >
      <form className="max-w-xl">
        <SelectCountry {...countryProps} />
      </form>
    </Formik>
  );
}

export const Default: Story = {
  render: (args) => <CountryForm {...args} />,
};

export const Selected: Story = {
  render: (args) => <CountryForm {...args} initialValue="Brasil" />,
};

export const Searchable: Story = {
  args: {
    searchable: true,
    searchPlaceholder: "Busque um país",
  },
  render: (args) => <CountryForm {...args} />,
};

export const Error: Story = {
  render: (args) => (
    <CountryForm
      {...args}
      initialError="Selecione um país para continuar."
      initialTouched
    />
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <CountryForm {...args} initialValue="Brasil" />,
};

export const FullCountryList: Story = {
  render: (args) => <CountryForm {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Usa automaticamente a lista completa de países do Design System.",
      },
    },
  },
};

export const IncludedCountries: Story = {
  args: {
    countryList: { mode: "include", codes: ["BR", "PT", "US"] },
  },
  render: (args) => <CountryForm {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Exibe somente os países informados pelos códigos ISO-2.",
      },
    },
  },
};

export const ExcludedCountries: Story = {
  args: {
    countryList: { mode: "exclude", codes: ["BR", "PT"] },
  },
  render: (args) => <CountryForm {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Exibe todos os países, exceto os códigos informados.",
      },
    },
  },
};


