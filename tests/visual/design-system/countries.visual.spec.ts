import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const scheme of ["light", "dark"]) {
  for (const contrast of ["normal", "high"]) {
    for (const component of ["select-country", "input-phone"]) {
      test(`${component}: teclado, bandeiras e Axe (${scheme}/${contrast})`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        const story = component === "select-country" ? "selected" : "filled";
        const globals = `colorScheme:${scheme};contrast:${contrast};fontScale:extra-large;motion:reduce`;
        await page.goto(`/iframe.html?id=design-system-${component.replace("-", "")}--${story}&viewMode=story&globals=${encodeURIComponent(globals)}`, { waitUntil: "networkidle" });
        const root = page.locator("#storybook-root");
        const trigger = component === "select-country" ? page.getByRole("combobox")
          : page.getByRole("button", { name: /Selecionar país de/ });
        await expect(trigger).toBeVisible();
        await expect(root.locator('img[src="/flags/br.svg"]')).toBeVisible();
        await expect.poll(() => root.locator('img[src="/flags/br.svg"]').evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
        // Real Tab navigation catches controls accidentally removed from tab order.
        await page.keyboard.press("Tab");
        await expect(trigger).toBeFocused();
        await page.keyboard.press("Enter");
        const search = component === "select-country" ? page.getByRole("textbox", { name: /Pesquisar opções/ })
          : page.getByRole("textbox", { name: "Pesquisar país ou DDI" });
        await expect(search).toBeFocused();
        await search.fill("Portugal");
        await expect(page.locator('img[src="/flags/pt.svg"]')).toBeVisible();
        await expect.poll(() => page.locator('img[src="/flags/pt.svg"]').evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
        const axe = new AxeBuilder({ page }).include("#storybook-root");
        if (component === "input-phone") axe.include('[role="dialog"]');
        else axe.include('[role="listbox"]');
        expect((await axe.analyze()).violations).toEqual([]);
        await search.press("ArrowDown");
        await page.keyboard.press("Enter");
        await expect(trigger).toBeFocused();
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await expect(trigger.locator('img[src="/flags/pt.svg"]')).toBeVisible();
        await trigger.press("Enter");
        await expect(search).toBeFocused();
        await search.press("Escape");
        await expect(trigger).toBeFocused();
        expect(errors).toEqual([]);
      });
    }
  }
}
