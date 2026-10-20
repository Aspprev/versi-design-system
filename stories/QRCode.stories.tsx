import type { Meta, StoryObj } from "@storybook/react-vite";
import { QRCode } from "../src";

const meta = {
  title: "Components/Documents/QRCode",
  component: QRCode,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { disable: false },
  },
  args: {
    value: "https://versitec.com.br/",
    description: "Link para o site da VERSI",
  },
} satisfies Meta<typeof QRCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Padrão",};

export const WithAccessibleDescription: Story = {
  name: "Descrição acessível",
  args: {
    ariaLabel: "QR Code para abrir a documentacao do Design System VERSI",
    description: "Aponte a camera para abrir a documentacao em uma nova pagina.",
  },
};

export const CustomSizeAndCorrection: Story = {
  name: "Tamanho e correção",
  args: {
    size: 256,
    level: "H",
    includeMargin: false,
  },
};

export const LongValue: Story = {
  name: "Conteúdo longo",
  args: {
    value: "https://versitec.com.br/versi-design-system/documentacao/componentes/qr-code?origem=storybook",
    size: 224,
  },
};

export const Loading: Story = {
  name: "Carregando",
  args: {
    loading: true,
    description: "O código QR está sendo preparado.",
  },
};

export const Error: Story = {
  name: "Erro",
  args: {
    error: "Não foi possível gerar o código QR. Tente novamente.",
    description: "O código QR não está disponível.",
  },
};
