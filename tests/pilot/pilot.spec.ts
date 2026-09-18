import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const scheme of ["light", "dark"]) {
  for (const contrast of ["normal", "high"]) {
    test(`cadastro, teclado e acessibilidade: ${scheme}/${contrast}`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      const missing: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", (response) => { if (response.status() >= 400) missing.push(response.url()); });
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Cadastro de contatos" })).toBeVisible();
      const skip = page.getByRole("link", { name: "Ir para o conteúdo" });
      expect(await skip.evaluate((element) => element.getBoundingClientRect().bottom)).toBeLessThanOrEqual(0);
      await page.keyboard.press("Tab");
      await expect(skip).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("main")).toBeFocused();
      await page.getByRole("combobox", { name: "Esquema de cores", exact: true }).selectOption(scheme);
      await page.getByRole("combobox", { name: "Contraste", exact: true }).selectOption(contrast);
      await page.getByRole("combobox", { name: "Paleta", exact: true }).selectOption(scheme === "light" ? "azul1" : "verde1");
      const previousSize = await page.getByRole("heading", { level: 1 }).evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
      await page.getByRole("combobox", { name: "Tamanho da fonte", exact: true }).selectOption("extra-large");
      await expect(page.locator("html")).toHaveAttribute("data-color-scheme", scheme);
      await expect(page.locator("html")).toHaveAttribute("data-contrast", contrast);
      await expect.poll(() => page.getByRole("heading", { level: 1 }).evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThan(previousSize);
      const flag = page.locator('img[src="/flags/br.svg"]').first();
      await expect.poll(() => flag.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await page.getByRole("button", { name: "Salvar contato" }).click();
      await expect(page.getByText("Informe o nome completo.", { exact: true })).toBeVisible();
      await page.getByRole("textbox", { name: "Nome completo" }).fill("Beatriz Lima");
      const country = page.getByRole("combobox", { name: "País de residência" });
      await country.focus();
      await page.keyboard.press("Enter");
      const search = page.getByRole("textbox", { name: /Pesquisar opções/ });
      await expect(search).toBeFocused();
      await search.fill("Portugal");
      await search.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(country).toBeFocused();
      await expect(country).toContainText("Portugal");
      await page.getByRole("textbox", { name: "Telefone", exact: true }).fill("11987654321");
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.getByRole("button", { name: "Salvar contato" }).click();
      const modal = page.getByRole("dialog", { name: "Contato salvo" });
      await expect(modal).toBeVisible();
      await expect(modal).toContainText("Beatriz Lima");
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.keyboard.press("Escape");
      await expect(modal).not.toBeVisible();
      await expect(page.getByRole("button", { name: "Salvar contato" })).toBeFocused();
      await expect(page.getByRole("table", { name: "Contatos cadastrados" })).toContainText("Beatriz Lima");
      await expect(page.getByRole("table", { name: "Contatos cadastrados" })).toContainText("Portugal");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]);
      expect(missing).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath(`${scheme}-${contrast}.png`), fullPage: true });
    });
  }
}
