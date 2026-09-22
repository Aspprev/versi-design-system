import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("componentes priorizados: teclado e acessibilidade", () => {
  test("OTP aceita foco por Tab, teclado e erro associado", async ({ page }) => {
    await page.goto("/iframe.html?id=components-forms-otpcodeinput--error&viewMode=story", { waitUntil: "networkidle" });
    const inputs = page.locator("input");
    await expect(inputs).toHaveCount(6);
    await page.keyboard.press("Tab");
    await expect(inputs.first()).toBeFocused();
    await inputs.first().fill("1");
    await expect(inputs.nth(1)).toBeFocused();
    await expect(page.getByRole("alert")).toContainText("Informe o código completo");
    expect((await new AxeBuilder({ page }).include("#storybook-root").analyze()).violations).toEqual([]);
  });

  test("dropzone e QR têm nome acessível e alvo de teclado", async ({ page }) => {
    await page.goto("/iframe.html?id=components-documents-upload-and-viewer--dropzone&viewMode=story", { waitUntil: "networkidle" });
    const dropzone = page.locator('input[type="file"]');
    await expect(dropzone).toBeVisible();
    await dropzone.focus();
    await expect(dropzone).toBeFocused();
    expect((await new AxeBuilder({ page }).include("#storybook-root").analyze()).violations).toEqual([]);

    await page.goto("/iframe.html?id=components-documents-upload-and-viewer--qr-code-example&viewMode=story", { waitUntil: "networkidle" });
    await expect(page.getByRole("img", { name: "Código QR" })).toBeVisible();
    expect((await new AxeBuilder({ page }).include("#storybook-root").analyze()).violations).toEqual([]);
  });

  test("preferências aplicam globals do preview e preservam teclado", async ({ page }) => {
    await page.goto("/iframe.html?id=components-accessibility-accessibilitypreferencespanel--default&viewMode=story", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Preferências de acessibilidade" }).click();
    await expect(
      page.getByRole("heading", { name: "Preferências de acessibilidade" }),
    ).toBeVisible();

    const themeSwitch = page.getByRole("switch", { name: "Alternar tema claro ou escuro" });
    await themeSwitch.click();
    await expect(page.locator("html")).toHaveAttribute("data-color-scheme", "dark");

    await page.getByRole("radio", { name: "Aa Grande", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-font-scale", "large");

    await page.getByRole("checkbox", { name: "Reduzir animações" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");

    expect((await new AxeBuilder({ page }).include("#storybook-root").analyze()).violations).toEqual([]);
  });
});
