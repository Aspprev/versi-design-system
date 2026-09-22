import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("distingue viewport de container e responde à largura disponível", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=foundations-responsive--playground&viewMode=story",
    { waitUntil: "networkidle" },
  );

  const root = page.locator("#storybook-root");
  await expect(root).toBeVisible();
  await expect(root.getByText("Viewport versus container")).toBeVisible();

  const containerBreakpoint = root.locator("dl > div").nth(1).locator("dd").first();
  const widthControl = root.getByRole("slider", {
    name: "Largura simulada do container",
  });

  await widthControl.fill("300");
  await expect(containerBreakpoint).toHaveText("mobile");

  await widthControl.fill("1100");
  await expect(containerBreakpoint).toHaveText(
    (page.viewportSize()?.width ?? 0) < 640 ? "mobile" : "desktop",
  );

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
