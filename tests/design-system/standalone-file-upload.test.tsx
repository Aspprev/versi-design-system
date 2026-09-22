import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  FileDropzone,
  FileViewer,
  validateFiles,
} from "../../src";

const makeFile = (name: string, type: string, content: string) => (
  new File([content], name, { type, lastModified: 0 })
);

describe("primitives de upload e visualizacao", () => {
  it("valida tipo, tamanho e quantidade sem depender de transporte", () => {
    const result = validateFiles([
      makeFile("documento.pdf", "application/pdf", "pdf"),
      makeFile("imagem.png", "image/png", "png"),
      makeFile("script.js", "text/javascript", "js"),
    ], {
      accept: "application/pdf,image/*",
      maxFiles: 2,
      maxSize: 4,
      multiple: true,
    });

    expect(result.accepted.map((file) => file.name)).toEqual(["documento.pdf", "imagem.png"]);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0].reason).toBe("type");

    expect(validateFiles([
      makeFile("primeiro.pdf", "application/pdf", "1"),
      makeFile("segundo.pdf", "application/pdf", "2"),
    ], { accept: "application/pdf", multiple: false }).rejected[0].reason).toBe("count");
    expect(validateFiles([
      makeFile("grande.pdf", "application/pdf", "12345"),
    ], { accept: "application/pdf", maxSize: 4 }).rejected[0].reason).toBe("size");
  });

  it("mantem contrato publico e estados acessiveis no dropzone", () => {
    const markup = renderToStaticMarkup(
      <FileDropzone id="document-upload" name="document" required error="Selecione um arquivo." />,
    );

    expect(markup).toContain('id="document-upload"');
    expect(markup).toContain('name="document"');
    expect(markup).toContain("aria-invalid=\"true\"");
    expect(markup).toContain("Selecione um arquivo.");
  });

  it("oferece fallback nomeado para fonte ausente e estado de erro", () => {
    expect(renderToStaticMarkup(<FileViewer title="Documento" />)).toContain('role="region"');
    expect(renderToStaticMarkup(<FileViewer error="Arquivo indisponivel." />)).toContain('role="alert"');
    expect(renderToStaticMarkup(<FileViewer loading />)).toContain('aria-busy="true"');
  });
});
