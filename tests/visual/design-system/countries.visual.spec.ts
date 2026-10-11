import { getCountryFlagUrl } from "../../flag-url";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("SelectCountry: showFlags=false oculta somente a bandeira do campo", async ({ page }) => {
  await page.goto("/iframe.html?id=components-forms-selectcountry--without-flags&viewMode=story");
  const trigger = page.getByRole("combobox");
  await expect(trigger).toBeVisible();
  await expect(trigger).toContainText("Brasil");
  await expect(trigger.locator("img")).toHaveCount(0);
  await trigger.click();
  const search = page.getByRole("textbox", { name: /Pesquisar opções/ });
  await search.fill("Portugal");
  const option = page.getByRole("option").filter({ hasText: "Portugal" });
  const flag = option.locator("img");
  await expect(flag).toBeVisible();
  await expect.poll(() => flag.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await option.click();
  await expect(trigger).toContainText("Portugal");
  await expect(trigger.locator("img")).toHaveCount(0);
  await trigger.click();
  await search.fill("Portugal");
  await expect(option.locator("img")).toBeVisible();
});

test("InputPhone: showFlags=false oculta somente a bandeira do input", async ({ page }) => {
  await page.goto("/iframe.html?id=components-forms-inputphone--without-flags&viewMode=story");
  const trigger = page.getByRole("button", { name: /Selecionar país de/ });
  await expect(trigger).toBeVisible();
  await expect(trigger.locator("img")).toHaveCount(0);
  await expect(trigger).toContainText("+55");
  await trigger.click();
  const search = page.getByRole("textbox", { name: "Pesquisar país ou DDI" });
  await search.fill("Portugal");
  const option = page.getByRole("dialog").getByRole("button").filter({ hasText: "Portugal" });
  const flag = option.locator("img");
  await expect(flag).toBeVisible();
  await expect.poll(() => flag.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await option.click();
  await expect(trigger).toContainText("+351");
  await expect(trigger.locator("img")).toHaveCount(0);
  await trigger.click();
  await search.fill("Portugal");
  await expect(option.locator("img")).toBeVisible();
});

for (const scheme of ["light", "dark"]) {
  for (const contrast of ["normal", "high"]) {
    for (const component of ["select-country", "input-phone"]) {
      test(`${component}: teclado, bandeiras e Axe (${scheme}/${contrast})`, async ({ page }) => {
        const errors: string[] = [];
        const flagRequests: string[] = [];
        await page.route("**/flags/**", route => { flagRequests.push(route.request().url()); return route.abort(); });
        page.on("pageerror", (error) => errors.push(error.message));
        const story = component === "select-country" ? "selected" : "filled";
        const globals = `colorScheme:${scheme};contrast:${contrast};fontScale:extra-large;motion:reduce`;
        const storyId = component === "select-country"
          ? "components-forms-selectcountry"
          : "components-forms-inputphone";
        await page.goto(`/iframe.html?id=${storyId}--${story}&viewMode=story&globals=${encodeURIComponent(globals)}`, { waitUntil: "networkidle" });
        const root = page.locator("#storybook-root");
        const trigger = component === "select-country" ? page.getByRole("combobox")
          : page.getByRole("button", { name: /Selecionar país de/ });
        await expect(trigger).toBeVisible();
        await expect(root.locator(`img[src="${getCountryFlagUrl("BR")}"]`)).toBeVisible();
        await expect.poll(() => root.locator(`img[src="${getCountryFlagUrl("BR")}"]`).evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
        // Real Tab navigation catches controls accidentally removed from tab order.
        await page.keyboard.press("Tab");
        await expect(trigger).toBeFocused();
        await page.keyboard.press("Enter");
        const search = component === "select-country" ? page.getByRole("textbox", { name: /Pesquisar opções/ })
          : page.getByRole("textbox", { name: "Pesquisar país ou DDI" });
        await expect(search).toBeFocused();
        await search.fill("Portugal");
        await expect(page.locator(`img[src="${getCountryFlagUrl("PT")}"]`)).toBeVisible();
        await expect.poll(() => page.locator(`img[src="${getCountryFlagUrl("PT")}"]`).evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
        const axe = new AxeBuilder({ page }).include("#storybook-root");
        if (component === "input-phone") axe.include('[role="dialog"]');
        else axe.include('[role="listbox"]');
        expect((await axe.analyze()).violations).toEqual([]);
        await search.press("ArrowDown");
        await page.keyboard.press("Enter");
        await expect(trigger).toBeFocused();
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await expect(trigger.locator(`img[src="${getCountryFlagUrl("PT")}"]`)).toBeVisible();
        await trigger.press("Enter");
        await expect(search).toBeFocused();
        await search.press("Escape");
        await expect(trigger).toBeFocused();
        expect(errors).toEqual([]);
        expect(flagRequests).toEqual([]);
      });
    }
  }
}
