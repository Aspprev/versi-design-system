import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FileDropzone,
  FileList,
  FileUploadProgress,
  FileViewer,
  QRCode,
  Button,
  type FileUploadItem,
} from "../src";

const meta = {
  id: "components-documents-upload-and-viewer",
  title: "Patterns/Documents/UploadFlow",
  parameters: { a11y: { disable: false } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function UploadFlow() {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  useEffect(() => {
    if (!files.some(item => item.status === "uploading")) return;
    const timer = window.setTimeout(() => setFiles(current => current.map(item => {
      if (item.status !== "uploading") return item;
      const progress = Math.min((item.progress ?? 0) + 25, 100);
      return { ...item, progress, status: progress === 100 ? "success" : "uploading" };
    })), 400);
    return () => window.clearTimeout(timer);
  }, [files]);
  return <div className="mx-auto max-w-2xl space-y-5">
    <h1 className="text-3xl font-bold">Envio de documentos</h1>
    <p>Selecione até três PDFs ou imagens. O envio é simulado no navegador; nenhum arquivo é transmitido.</p>
    <FileDropzone accept="application/pdf,image/*" multiple maxFiles={3} maxSize={5 * 1024 * 1024} disabled={files.length >= 3} hint="Até 3 arquivos de 5 MB. PDF ou imagem." onFilesAccepted={accepted => setFiles(current => [...current, ...accepted.slice(0, 3 - current.length).map(file => ({ id: crypto.randomUUID(), file, progress: 0, status: "pending" as const }))])} />
    <FileList files={files} onRemove={(_, index) => setFiles(current => current.filter((_, i) => i !== index))} onRetry={(_, index) => setFiles(current => current.map((item, i) => i === index ? { ...item, status: "uploading", progress: 0, error: undefined } : item))} />
    <div className="flex flex-wrap gap-3">
      <Button disabled={!files.some(item => item.status === "pending")} onClick={() => setFiles(current => current.map(item => item.status === "pending" ? { ...item, status: "uploading" } : item))}>Enviar arquivos</Button>
      <Button variant="outline" disabled={!files.length} onClick={() => setFiles(current => current.map(item => ({ ...item, status: "error", error: "Falha simulada. Tente novamente." })))}>Simular falha</Button>
    </div>
    <p role="status">{files.filter(item => item.status === "success").length} de {files.length} arquivos enviados.</p>
  </div>;
}

export const Flow: Story = { name: "Envio, progresso e nova tentativa", render: () => <UploadFlow /> };

export const QRCodeExample: Story = {
  tags: ["!dev"],
  name: "QR Code",
  render: () => (
    <QRCode
      value="https://versitec.com.br/"
      description="Link para o Design System VERSI"
    />
  ),
};
export const Dropzone: Story = {
  tags: ["!dev"],
  name: "Área de envio",
  render: () => (
    <FileDropzone accept="application/pdf,image/*" multiple maxFiles={3} />
  ),
};
export const UploadProgress: Story = {
  tags: ["!dev"],
  name: "Progresso do envio",
  render: () => (
    <FileUploadProgress value={68} label="Enviando comprovante.pdf" />
  ),
};
export const FileQueue: Story = {
  tags: ["!dev"],
  name: "Fila de arquivos",
  render: () => (
    <FileList
      files={[
        {
          id: "1",
          file: new File(["conteúdo"], "comprovante.pdf", {
            type: "application/pdf",
          }),
          progress: 45,
          status: "uploading",
        },
      ]}
      onRemove={() => {}}
    />
  ),
};
export const ViewerFallback: Story = {
  tags: ["!dev"],
  name: "Alternativa de visualização",
  render: () => (
    <FileViewer
      source="https://example.com/documento.zip"
      fileName="documento.zip"
    />
  ),
};
