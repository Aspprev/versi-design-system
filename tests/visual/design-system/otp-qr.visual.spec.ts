import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page }).include("#storybook-root").analyze();
  expect(results.violations).toEqual([]);
}

test.describe("OTP e QRCode", () => {
  test("OTP completa por teclado e dispara onComplete uma vez por preenchimento", async ({ page }) => {
    await page.goto(
      "/iframe.html?id=components-forms-otpcodeinput--completion&viewMode=story",
      { waitUntil: "networkidle" },
    );

    const inputs = page.locator("input");
    await expect(inputs).toHaveCount(6);
    await inputs.first().focus();
    for (let index = 0; index < 6; index += 1) {
      await inputs.nth(index).fill(String(index + 1));
    }
    await expect(page.getByRole("status")).toContainText("Código completo: 123456");
    await expect(page.getByRole("status")).toContainText("conclusões: 1");

    await inputs.first().fill("1");
    await expect(page.getByRole("status")).toContainText("conclusões: 1");
    await inputs.nth(5).press("Backspace");
    await inputs.nth(5).fill("6");
    await expect(page.getByRole("status")).toContainText("conclusões: 2");

    await inputs.nth(3).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(inputs.nth(2)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(inputs.first()).toBeFocused();
    await page.keyboard.press("End");
    await expect(inputs.nth(5)).toBeFocused();
    await expectAccessible(page);
  });

  test("QRCode expõe estados controlados de loading e erro", async ({ page }) => {
    await page.goto(
      "/iframe.html?id=components-documents-qrcode--loading&viewMode=story",
      { waitUntil: "networkidle" },
    );
    const loadingQr = page.getByRole("img");
    await expect(loadingQr).toHaveAttribute("aria-busy", "true");
    await expectAccessible(page);

    await page.goto(
      "/iframe.html?id=components-documents-qrcode--error&viewMode=story",
      { waitUntil: "networkidle" },
    );
    await expect(page.getByRole("alert")).toContainText("Não foi possível gerar o código QR");
    await expect(page.getByRole("img")).toHaveAttribute("aria-invalid", "true");
    await expectAccessible(page);
  });
});
