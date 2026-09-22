import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("aplica ênfase de foco e links pelo contrato público", async ({ page }) => {
  await page.goto(
    "/iframe.html?id=components-accessibility-preferences--applied-reading-preferences&viewMode=story",
    { waitUntil: "networkidle" },
  );

  const root = page.locator("#storybook-root");
  await expect(root).toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(() => ({
        focus: document.documentElement.dataset.focusEmphasis,
        links: document.documentElement.dataset.linkEmphasis,
      })),
    )
    .toEqual({ focus: "strong", links: "underline" });

  const link = page.getByRole("link", { name: "Link de exemplo" });
  const button = page.getByRole("button", { name: "Botão focável" });

  await expect
    .poll(() => link.evaluate((element) => getComputedStyle(element).textDecorationLine))
    .toContain("underline");

  await button.focus();
  await expect
    .poll(() =>
      button.evaluate((element) => ({
        outlineStyle: getComputedStyle(element).outlineStyle,
        outlineWidth: getComputedStyle(element).outlineWidth,
        boxShadow: getComputedStyle(element).boxShadow,
      })),
    )
    .toMatchObject({ outlineStyle: "solid", outlineWidth: "3px" });

  const axeResults = await new AxeBuilder({ page })
    .include("#storybook-root")
    .analyze();

  expect(
    axeResults.violations,
    axeResults.violations
      .map((violation) => `${violation.id}: ${violation.help}`)
      .join("\n"),
  ).toEqual([]);
});
