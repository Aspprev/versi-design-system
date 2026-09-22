import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  FileDropzone,
  FileUploadProgress,
  FileViewer,
  OtpCodeInput,
  QRCode,
  StatusBadge,
} from "../../src";

describe("componentes priorizados do design system", () => {
  it("expõe contratos acessíveis para OTP, upload, viewer e QR", () => {
    const otp = renderToStaticMarkup(<OtpCodeInput length={4} label="Código" errorText="Código inválido" />);
    expect(otp).toContain('role="group"');
    expect(otp).toContain("Código, dígito 1 de 4");
    expect(otp).toContain("Código inválido");
    expect(renderToStaticMarkup(<FileDropzone accept="image/*" />)).toContain('type="file"');
    expect(renderToStaticMarkup(<FileUploadProgress value={50} />)).toContain('role="progressbar"');
    expect(renderToStaticMarkup(<FileViewer source="https://example.com/a.pdf" contentType="application/pdf" title="Documento" />)).toContain('title="Documento"');
    expect(renderToStaticMarkup(<QRCode value="versi" ariaLabel="QR do versi" />)).toContain('aria-label="QR do versi"');
  });

  it("preserva a semântica não dependente somente de cor nos status", () => {
    expect(renderToStaticMarkup(<StatusBadge statusLabel="Status: aprovado" tone="success">Aprovado</StatusBadge>)).toContain('aria-label="Status: aprovado"');
  });
});
