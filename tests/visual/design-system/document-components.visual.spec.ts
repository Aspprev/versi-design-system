import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page }).include("#storybook-root").analyze();
  expect(results.violations).toEqual([]);
}

test.describe("componentes de documentos", () => {
  test("QRCode apresenta nome e descricao acessiveis", async ({ page }) => {
    await page.goto(
      "/iframe.html?id=components-documents-qrcode--with-accessible-description&viewMode=story",
      { waitUntil: "networkidle" },
    );

    await expect(
      page.getByRole("img", { name: "QR Code para abrir a documentacao do Design System VERSI" }),
    ).toBeVisible();
    await expect(page.getByText("Aponte a camera para abrir a documentacao em uma nova pagina.")).toBeAttached();
    await expectAccessible(page);
  });

  test("upload aceita arquivo por teclado e expõe a fila", async ({ page }) => {
    await page.goto(
      "/iframe.html?id=components-documents-fileupload--playground&viewMode=story",
      { waitUntil: "networkidle" },
    );

    const input = page.getByLabel("Adicionar arquivos");
    await expect(input).toBeAttached();
    await input.focus();
    await expect(input).toBeFocused();
    await input.setInputFiles({
      name: "novo-documento.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("PDF de exemplo"),
    });
    await expect(page.getByText("novo-documento.pdf")).toBeVisible();
    await expectAccessible(page);
  });

  test("FileViewer expõe o conteudo e o estado de carregamento", async ({ page }) => {
    await page.goto(
      "/iframe.html?id=components-documents-fileviewer--text&viewMode=story",
      { waitUntil: "networkidle" },
    );

    await expect(page.getByText("Documento de exemplo para leitura no FileViewer.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Baixar arquivo" })).toBeVisible();
    await expectAccessible(page);

    await page.goto(
      "/iframe.html?id=components-documents-fileviewer--loading&viewMode=story",
      { waitUntil: "networkidle" },
    );
    await expect(page.getByRole("status")).toContainText("Carregando arquivo");
    await expectAccessible(page);
  });
});
