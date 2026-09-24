import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FileDropzone,
  FileList,
  FileUploadProgress,
  type FileUploadItem,
} from "../src";

const meta = {
  title: "Components/Documents/FileUpload",
  component: FileDropzone,
  tags: ["autodocs"],
  parameters: { a11y: { disable: false } },
} satisfies Meta<typeof FileDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

function makeFile(name: string, type: string, content = "conteudo de exemplo") {
  return new File([content], name, { type, lastModified: 0 });
}

function UploadPlayground(props: ComponentProps<typeof FileDropzone>) {
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
        {...props}
        onFilesAccepted={(accepted) => {
          setFiles((current) => [
            ...current,
            ...accepted.map((file) => ({ file, status: "pending" as const })),
          ]);
          props.onFilesAccepted?.(accepted);
        }}
        onFilesRejected={props.onFilesRejected}
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
  args: {
    accept: "application/pdf,image/*",
    multiple: true,
    maxFiles: 3,
    label: "Adicionar arquivos",
    hint: "Arraste PDF ou imagem, ate 3 arquivos.",
  },
  render: (args) => <UploadPlayground {...args} />,
};

function ValidationPlayground(props: ComponentProps<typeof FileDropzone>) {
  const [rejectionMessage, setRejectionMessage] = useState<string>();

  return (
    <div className="w-full max-w-xl p-4">
      <FileDropzone
        {...props}
        error={rejectionMessage || props.error}
        onFilesRejected={(rejections) => {
          setRejectionMessage(rejections.map(({ message }) => message).join(" "));
          props.onFilesRejected?.(rejections);
        }}
      />
    </div>
  );
}

export const DropzoneWithValidation: Story = {
  args: {
    accept: "application/pdf",
    maxSize: 5 * 1024 * 1024,
    label: "Selecionar comprovante",
    hint: "Somente PDF de ate 5 MB.",
    messages: {
      type: "Escolha um PDF valido.",
      size: ({ fileName }) => `${fileName} ultrapassa o limite informado.`,
      empty: ({ fileName }) => `${fileName} esta vazio.`,
      invalid: ({ fileName }) => `${fileName} e invalido.`,
    },
  },
  render: (args) => <ValidationPlayground {...args} />,
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
