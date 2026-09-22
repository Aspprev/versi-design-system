import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FileDropzone,
  FileList,
  FileUploadProgress,
  type FileUploadItem,
} from "../src";

const meta = {
  title: "Components/Documents/FileUpload",
  tags: ["autodocs"],
  parameters: { a11y: { disable: false } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function makeFile(name: string, type: string, content = "conteudo de exemplo") {
  return new File([content], name, { type, lastModified: 0 });
}

function UploadPlayground() {
  const [files, setFiles] = useState<FileUploadItem[]>([
    {
      id: "initial-file",
      file: makeFile("comprovante.pdf", "application/pdf", "PDF de exemplo"),
      progress: 68,
      status: "uploading",
    },
  ]);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-4">
      <FileDropzone
        accept="application/pdf,image/*"
        multiple
        maxFiles={3}
        label="Adicionar arquivos"
        hint="PDF ou imagem, ate 3 arquivos."
        onFilesAccepted={(accepted) => {
          setFiles((current) => [
            ...current,
            ...accepted.map((file) => ({ file, status: "pending" as const })),
          ]);
        }}
        onFilesRejected={() => undefined}
      />
      <FileList
        files={files}
        onRemove={(item) => setFiles((current) => current.filter((entry) => entry !== item))}
        onRetry={(item) => setFiles((current) => current.map((entry) => (
          entry === item ? { ...entry, status: "uploading", progress: 0, error: undefined } : entry
        )))}
      />
    </div>
  );
}

export const Playground: Story = {
  render: () => <UploadPlayground />,
};

export const DropzoneWithValidation: Story = {
  render: () => (
    <div className="w-full max-w-xl p-4">
      <FileDropzone
        accept="application/pdf"
        maxSize={5 * 1024 * 1024}
        label="Selecionar comprovante"
        hint="Somente PDF de ate 5 MB."
        error="Selecione um arquivo PDF valido."
      />
    </div>
  ),
};

export const ProgressStates: Story = {
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-5 p-4">
      <FileUploadProgress value={35} label="Enviando comprovante.pdf" />
      <FileUploadProgress value={100} status="success" label="comprovante.pdf enviado" />
      <FileUploadProgress status="error" label="Falha no envio de documento.pdf" />
    </div>
  ),
};

export const QueueWithRetry: Story = {
  render: () => (
    <div className="w-full max-w-2xl p-4">
      <FileList
        files={[
          {
            id: "failed-file",
            file: makeFile("documento-invalido.pdf", "application/pdf"),
            status: "error",
            error: "Nao foi possivel enviar este arquivo.",
          },
          {
            id: "waiting-file",
            file: makeFile("declaracao.pdf", "application/pdf"),
            status: "pending",
          },
        ]}
        onRetry={() => undefined}
        onRemove={() => undefined}
      />
    </div>
  ),
};
