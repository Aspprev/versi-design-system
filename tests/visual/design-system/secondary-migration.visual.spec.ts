import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { DESIGN_SYSTEM_THEMES } from "../../../src/theme-presets";
import { applyHighDarkSecondary } from "../../helpers/theme-role-migration";
import { settle } from "./legibility.helpers";

const css = readFileSync("dist/styles.css", "utf8") + "\n" + readFileSync("dist/themes.css", "utf8");
const reference = JSON.parse(readFileSync("docs/migrations/0.7.0-secondary-reference.json", "utf8")).themes as Record<string, Record<string, Record<string, string>>>;
const modes = ["light", "dark", "high-light", "high-dark"];
const normalize = (s: string) => s.replace(/\s/g, "");

test("secondary: contrato da promoção e papéis protegidos em 72 contextos", async ({ page }) => {
  await page.setContent("<html><head></head><body></body></html>");
  await page.addStyleTag({ content: css });
  for (const theme of DESIGN_SYSTEM_THEMES) for (const mode of modes) {
    const expected = applyHighDarkSecondary(reference[theme][mode], mode);
    const actual = await page.evaluate(({ theme, mode, names }) => {
      Object.assign(document.documentElement.dataset, { dsTheme: theme, colorScheme: mode.endsWith("dark") ? "dark" : "light", contrast: mode.startsWith("high") ? "high" : "normal", contrastTheme: mode.endsWith("dark") ? "dark" : "light" });
      const s = getComputedStyle(document.body);
      return Object.fromEntries(names.map(key => [key, s.getPropertyValue(key).trim()]));
    }, { theme, mode, names: Object.keys(expected) });
    for (const [key, value] of Object.entries(expected)) expect(normalize(actual[key]), `${theme}/${mode}/${key}`).toBe(normalize(value));
  }
  expect(css).not.toMatch(/--(?:tertiary-|action-tertiary-|switch-track-tertiary|content-brand-secondary|notice-secondary-content)/);
});

for (const theme of DESIGN_SYSTEM_THEMES) test(`secondary: ${theme}, componentes e estados nos quatro modos`, async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/iframe.html?id=laboratory-secondary--light&viewMode=story");
  const main = page.locator("main.secondary-examples");
  await expect(main).toBeVisible();
  for (const mode of modes) {
    await page.evaluate(({ theme, mode }) => Object.assign(document.documentElement.dataset, { dsTheme: theme, colorScheme: mode.endsWith("dark") ? "dark" : "light", contrast: mode.startsWith("high") ? "high" : "normal", contrastTheme: mode.endsWith("dark") ? "dark" : "light" }), { theme, mode });
    const high = mode.startsWith("high");
    const button = main.getByTestId("secondary-flat");
    if (mode === "high-dark") {
      const colors = await main.evaluate(el => {
        const style = getComputedStyle(el);
        const off = el.querySelector('[role="switch"][aria-checked="false"]')!;
        return { track: getComputedStyle(off).backgroundColor,
          surfaces: ["--surface-page", "--surface-card-semantic", "--surface-muted"].map(token => `rgb(${style.getPropertyValue(token)})`),
          scale: [1, 2, 3, 4, 5].map(i => style.getPropertyValue(`--secondary-${i}`).trim()) };
      });
      for (const bg of colors.surfaces) expect(contrast(colors.track, bg), `${theme}/off-track`).toBeGreaterThanOrEqual(3);
      for (const color of colors.scale) expect(new Set(color.split(",").map(c => Math.round(Number(c) / 32))).size).toBeLessThanOrEqual(2);
    }
    for (const state of ["default", "hover", "active"] as const) {
      if (state === "default") await page.mouse.move(0, 0);
      else await button.hover();
      if (state === "active") await page.mouse.down();
      await settle(button);
      const colors = await button.evaluate(el => ({ fg: getComputedStyle(el).color, bg: getComputedStyle(el).backgroundColor }));
      if (high) expect(contrast(colors.fg, colors.bg), `${mode}/${state}`).toBeGreaterThanOrEqual(4.5);
      if (state === "active") await page.mouse.up();
    }
    // Enter keyboard modality; a mouse-focused button need not match :focus-visible.
    await page.keyboard.press("Tab");
    await button.focus();
    expect(await button.evaluate(el => getComputedStyle(el).outlineStyle)).toBe("solid");
    await expect(main.getByRole("switch", { name: "Secondary ligado", exact: true })).toHaveAttribute("aria-checked", "true");
    await expect(main.getByRole("switch", { name: "Secondary desligado", exact: true })).toHaveAttribute("aria-checked", "false");
    await expect(main.getByRole("switch", { name: "Secondary indisponível", exact: true })).toBeDisabled();
    const loading = await main.getByTestId("secondary-loading-flat").evaluate(el => ({
      text: getComputedStyle(el).color,
      dots: getComputedStyle(el.querySelector('span[class*="bg-action-secondary-content"]')!).backgroundColor,
    }));
    expect(loading.dots).toBe(loading.text);
    for (const surface of ["page", "card", "muted"]) {
      const values = await main.getByTestId(`loaders-${surface}`).evaluate(el => ({
        bg: getComputedStyle(el).backgroundColor,
        circle: getComputedStyle(el.querySelector(".circular-loading-indicator")!).stroke,
        dots: getComputedStyle(el.querySelector('span[class*="bg-content-primary"]')!).backgroundColor,
      }));
      if (high) for (const ink of [values.circle, values.dots]) expect(contrast(ink, values.bg), `${mode}/${surface}`).toBeGreaterThanOrEqual(3);
    }
  }
  expect(errors).toEqual([]);
});

function contrast(a: string, b: string) {
  const luminance = (s: string) => s.match(/[\d.]+/g)!.slice(0, 3).map(Number).reduce((sum, n, i) => {
    n /= 255;
    return sum + (n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][i];
  }, 0);
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
