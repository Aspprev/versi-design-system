import { readFileSync } from "node:fs";
import { expect, test, type Locator } from "@playwright/test";
import { CLIENT_THEMES } from "../../../src/theme-presets";

import { promoteTertiaryTokens } from "../../helpers/theme-role-migration";

const css = readFileSync("src/tokens.css", "utf8") + "\n" + readFileSync("src/themes.css", "utf8");
const modes = ["light", "dark", "high-light", "high-dark"] as const;
type Mode = typeof modes[number];
const reference = (id: string) => {
  const proposal = JSON.parse(readFileSync(`docs/temas-clientes/tema-${id}.json`, "utf8")) as { variants: Record<Mode, Record<string, string>> };
  // Identity snapshots remain immutable. Documented functional fixes take
  // precedence so a stale exported status cannot reintroduce a known defect.
  const corrections = JSON.parse(readFileSync("docs/correcao-legibilidade/AJUSTES-FUNCIONAIS.json", "utf8"));
  for (const mode of modes) proposal.variants[mode] = promoteTertiaryTokens({ ...proposal.variants[mode], ...corrections.overrides[id]?.[mode] }, mode);
  return proposal;
};
const normalize = (values: Record<string, string>) => Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.replace(/\s/g, "")]));
function ratio(a: string, b: string) {
  const luminance = (value: string) => {
    const channels = value.match(/[\d.]+/g)!.slice(0, 3).map(Number);
    return channels.reduce((sum, channel, i) => {
      const s = channel / 255;
      return sum + (s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][i];
    }, 0);
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
async function colors(control: Locator) {
  return control.evaluate(el => {
    const s = getComputedStyle(el);
    return { foreground: s.color, background: s.backgroundColor, border: s.borderColor, outline: s.outlineColor, outlineStyle: s.outlineStyle, outlineWidth: parseFloat(s.outlineWidth) };
  });
}

for (const { id } of CLIENT_THEMES) {
  test(`${id}: contrato integral nos quatro modos e quatro seletores`, async ({ page }) => {
    await page.setContent("<html><head></head><body></body></html>");
    await page.addStyleTag({ content: css });
    for (const mode of modes) for (const target of ["html", "body"]) for (const identity of ["class", "attribute"]) {
      const expected = reference(id).variants[mode];
      const actual = await page.evaluate(({ id, mode, target, identity, names }) => {
        for (const el of [document.documentElement, document.body]) {
          el.className = "";
          el.removeAttribute("data-ds-theme");
        }
        Object.assign(document.documentElement.dataset, { colorScheme: mode.endsWith("dark") ? "dark" : "light", contrast: mode.startsWith("high") ? "high" : "normal", contrastTheme: mode.endsWith("dark") ? "dark" : "light" });
        const element = target === "html" ? document.documentElement : document.body;
        if (identity === "class") element.className = id;
        else element.dataset.dsTheme = id;
        const styles = getComputedStyle(document.body);
        return Object.fromEntries(names.map(name => [name, styles.getPropertyValue(name).trim()]));
      }, { id, mode, target, identity, names: Object.keys(expected) });
      expect(normalize(actual), `${mode}/${target}/${identity}`).toEqual(normalize(expected));
    }
  });

  for (const mode of modes) test(`${id}/${mode}: componentes, estados e portais`, async ({ page }, info) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", error => runtimeErrors.push(error.message));
    const exported = { light: "light", dark: "dark", "high-light": "high-light", "high-dark": "high-dark" }[mode];
    // Titles use the public client labels, so resolve IDs through Storybook's index.
    const index = await (await page.request.get("/index.json")).json();
    const entry = Object.values(index.entries as Record<string, { id: string; title: string; name: string; importPath: string }>).find(item => item.importPath.endsWith(`/${id}.stories.tsx`) && item.id.endsWith(`--${exported}`));
    expect(entry).toBeTruthy();
    await page.goto(`/iframe.html?id=${entry!.id}&viewMode=story`);
    const main = page.locator("main.client-theme-gallery");
    await expect(main).toBeVisible();
    const high = mode.startsWith("high");
    const expected = reference(id).variants[mode];
    await expect.poll(() => page.locator("body").evaluate(el => getComputedStyle(el).getPropertyValue("--primary-1").replace(/\s/g, ""))).toBe(expected["--primary-1"].replace(/\s/g, ""));
    const surface = expected["--surface-card-semantic"];
    if (high) {
      for (const family of ["primary", "secondary", "danger", "warning"]) {
        const button = main.getByTestId(`action-${family}`);
        for (const state of ["default", "hover", "active"] as const) {
          if (state !== "default") await button.hover();
          if (state === "active") await page.mouse.down();
          try {
            await expect.poll(async () => { const c = await colors(button); return ratio(c.foreground, c.background); }).toBeGreaterThanOrEqual(4.5);
          } finally { if (state === "active") await page.mouse.up(); }
        }
        await page.keyboard.press("Tab");
        await button.focus();
        const c = await colors(button);
        expect(c.outlineStyle).toBe("solid");
        expect(c.outlineWidth).toBeGreaterThanOrEqual(2);
        expect(ratio(c.outline, surface)).toBeGreaterThanOrEqual(3);
      }
      for (const type of ["info", "success", "warning", "danger"]) {
        const c = await colors(main.getByTestId(`feedback-${type}`));
        expect(ratio(c.foreground, c.background)).toBeGreaterThanOrEqual(4.5);
      }
      const field = main.getByLabel("Nome", { exact: true });
      const fieldColors = await colors(field);
      expect(ratio(fieldColors.foreground, expected["--field-surface"])).toBeGreaterThanOrEqual(4.5);
      const placeholder = await field.evaluate(el => getComputedStyle(el, "::placeholder").color);
      expect(ratio(placeholder, expected["--field-surface"])).toBeGreaterThanOrEqual(4.5);
      const checkbox = main.getByRole("checkbox").first();
      const check = await colors(checkbox);
      expect(ratio(check.background, surface)).toBeGreaterThanOrEqual(3);
      expect(ratio(mode === "high-dark" ? "0,0,0" : "255,255,255", check.background)).toBeGreaterThanOrEqual(3);
      const radio = main.getByRole("radio").first();
      expect(ratio((await colors(radio)).border, expected["--radio-surface"])).toBeGreaterThanOrEqual(3);
      for (const label of ["Notificações ativadas", "Notificações desativadas"]) {
        const control = main.getByRole("switch", { name: label, exact: true });
        const track = (await colors(control)).background;
        const knob = await control.locator(".switch-knob").evaluate(el => getComputedStyle(el).backgroundColor);
        expect(ratio(knob, track)).toBeGreaterThanOrEqual(3);
        expect(ratio(track, surface)).toBeGreaterThanOrEqual(3);
      }
      for (const color of ["blue", "green", "orange", "yellow", "red", "slate", "black"]) for (const appearance of ["solid", "outline", "soft"]) {
        const c = await colors(main.getByTestId(`status-${color}-${appearance}`));
        expect(ratio(c.foreground, appearance === "outline" ? surface : c.background)).toBeGreaterThanOrEqual(4.5);
      }
      expect(ratio(expected["--field-border-error"], expected["--field-surface"])).toBeGreaterThanOrEqual(3);
      const error = await colors(main.getByText("Confira o valor informado.", { exact: true }));
      expect(ratio(error.foreground, surface)).toBeGreaterThanOrEqual(4.5);
      for (let i = 1; i <= 12; i++) expect(ratio(expected[`--chart-${i}`], surface)).toBeGreaterThanOrEqual(3);
    }
    await main.getByRole("button", { name: "Abrir modal", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("button", { name: "Concluir" })).toBeVisible();
    expect(await dialog.evaluate(el => getComputedStyle(el).getPropertyValue("--primary-1").replace(/\s/g, ""))).toBe(expected["--primary-1"].replace(/\s/g, ""));
    await dialog.getByRole("button", { name: "Concluir" }).click();
    await expect(dialog).toHaveCount(0);
    const select = main.getByRole("combobox");
    await select.click();
    const option = page.getByRole("option", { name: "Plano básico" });
    await expect(option).toBeVisible();
    expect(await option.evaluate(el => getComputedStyle(el).getPropertyValue("--primary-1").replace(/\s/g, ""))).toBe(expected["--primary-1"].replace(/\s/g, ""));
    await option.click();
    await expect(main.locator(".client-theme-charts .apexcharts-canvas")).toHaveCount(2);
    await expect(main.locator(".apexcharts-pie-series path").first()).toBeVisible();
    expect(runtimeErrors).toEqual([]);
    await info.attach("contexto", { body: JSON.stringify({ id, mode }), contentType: "application/json" });
  });
}

test("gráficos já montados atualizam cores sem remontar a página", async ({ page }) => {
  await page.goto("/iframe.html?id=themes-clients-custom2133--dark&viewMode=story");
  await expect(page.locator(".client-theme-charts .apexcharts-canvas")).toHaveCount(2);
  const series = page.locator(".apexcharts-line-series path.apexcharts-line").first();
  const before = await series.getAttribute("stroke");
  await page.evaluate(() => { document.documentElement.dataset.dsTheme = "custom2162"; });
  await expect.poll(() => series.getAttribute("stroke")).not.toBe(before);
  const expected = reference("custom2162").variants.dark["--chart-1"].replace(/\s/g, "");
  await expect.poll(() => page.locator(".apexcharts-pie-series path").first().getAttribute("fill").then(value => value?.replace(/\s/g, ""))).toBe(`rgba(${expected},1)`);
});

test("galerias de clientes cabem no celular", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  const index = await (await page.request.get("/index.json")).json();
  for (const { id } of CLIENT_THEMES) {
    const entry = Object.values(index.entries as Record<string, { id: string; importPath: string }>).find(item => item.importPath.endsWith(`/${id}.stories.tsx`) && item.id.endsWith("--dark"));
    await page.goto(`/iframe.html?id=${entry!.id}&viewMode=story`);
    await expect(page.locator("main.client-theme-gallery")).toBeVisible();
    await expect(page.locator(".client-theme-charts .apexcharts-canvas")).toHaveCount(2);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("portais herdam a identidade aplicada como classe ou atributo no html/body", async ({ page }) => {
  await page.goto("/iframe.html?id=themes-clients-custom2133--high-dark&viewMode=story");
  const main = page.locator("main.client-theme-gallery");
  await expect(main).toBeVisible();
  for (const target of ["html", "body"]) for (const identity of ["class", "attribute"]) {
    await page.evaluate(({ target, identity }) => {
      for (const el of [document.documentElement, document.body]) {
        el.classList.remove("custom2133", "custom2178");
        el.removeAttribute("data-ds-theme");
      }
      const element = target === "html" ? document.documentElement : document.body;
      if (identity === "class") element.classList.add("custom2178");
      else element.dataset.dsTheme = "custom2178";
    }, { target, identity });
    await main.getByRole("button", { name: "Abrir modal", exact: true }).click();
    const dialog = page.getByRole("dialog");
    const close = dialog.getByRole("button", { name: "Concluir" });
    await expect(close).toBeVisible();
    expect(await close.evaluate(el => getComputedStyle(el).getPropertyValue("--primary-1").replace(/\s/g, ""))).toBe(reference("custom2178").variants["high-dark"]["--primary-1"].replace(/\s/g, ""));
    await close.click();
    await expect(dialog).toHaveCount(0);
    await main.getByRole("combobox").click();
    const option = page.getByRole("option", { name: "Plano básico" });
    await expect(option).toBeVisible();
    expect(await option.evaluate(el => getComputedStyle(el).getPropertyValue("--primary-1").replace(/\s/g, ""))).toBe(reference("custom2178").variants["high-dark"]["--primary-1"].replace(/\s/g, ""));
    await option.click();
  }
});
