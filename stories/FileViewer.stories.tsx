import { useMemo } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileViewer } from "../src";

const meta = {
  title: "Components/Documents/FileViewer",
  component: FileViewer,
  tags: ["autodocs"],
  parameters: { a11y: { disable: false } },
} satisfies Meta<typeof FileViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

const imageSource = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23e8eef5'/%3E%3Ctext x='320' y='190' text-anchor='middle' font-family='sans-serif' font-size='32' fill='%231d2733'%3EVERSI%20FileViewer%3C/text%3E%3C/svg%3E";

function TextFileViewer() {
  const source = useMemo(
    () => new Blob(["Documento de exemplo para leitura no FileViewer."], { type: "text/plain" }),
    [],
  );
  return <FileViewer source={source} fileName="documento.txt" title="Documento de texto" />;
}

function JsonFileViewer() {
  const source = useMemo(
    () => new Blob([JSON.stringify({ origem: "VERSI", status: "exemplo" }, null, 2)], { type: "application/json" }),
    [],
  );
  return <FileViewer source={source} fileName="documento.json" title="Documento JSON" />;
}

export const Text: Story = {
  render: () => <TextFileViewer />,
};

export const Image: Story = {
  args: {
    source: imageSource,
    fileName: "preview.svg",
    title: "Preview de uma imagem de exemplo",
  },
};

export const Pdf: Story = {
  args: {
    source: "https://example.com/documento.pdf",
    contentType: "application/pdf",
    fileName: "documento.pdf",
    title: "Documento PDF",
  },
};

export const Json: Story = {
  render: () => <JsonFileViewer />,
};

export const AsyncSource: Story = {
  render: () => {
    const source = useMemo(
      () => Promise.resolve(new Blob(["Fonte assíncrona de exemplo."], { type: "text/plain" })),
      [],
    );
    return (
      <FileViewer
        source={source}
        fileName="async.txt"
        title="Documento carregado de forma assíncrona"
      />
    );
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    title: "Carregando documento",
  },
};

export const Error: Story = {
  args: {
    error: "Nao foi possivel carregar o arquivo. Tente novamente.",
  },
};

export const UnsupportedType: Story = {
  args: {
    source: "https://example.com/documento.zip",
    fileName: "documento.zip",
    fallback: "O formato ZIP deve ser baixado para ser aberto.",
  },
};

export const WithActions: Story = {
  args: {
    source: imageSource,
    fileName: "compartilhavel.svg",
    title: "Documento com ações",
    actions: <button type="button">Compartilhar</button>,
  },
};
