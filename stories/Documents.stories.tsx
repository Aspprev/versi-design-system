import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FileDropzone,
  FileList,
  FileUploadProgress,
  FileViewer,
  QRCode,
} from "../src";

const meta = {
  title: "Components/Documents/Upload and Viewer",
  parameters: { a11y: { disable: false } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const QRCodeExample: Story = {
  render: () => (
    <QRCode
      value="https://versitec.com.br/"
      description="Link para o Design System VERSI"
    />
  ),
};
export const Dropzone: Story = {
  render: () => (
    <FileDropzone accept="application/pdf,image/*" multiple maxFiles={3} />
  ),
};
export const UploadProgress: Story = {
  render: () => (
    <FileUploadProgress value={68} label="Enviando comprovante.pdf" />
  ),
};
export const FileQueue: Story = {
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
  render: () => (
    <FileViewer
      source="https://example.com/documento.zip"
      fileName="documento.zip"
    />
  ),
};
