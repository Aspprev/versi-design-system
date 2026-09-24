import { expect, test, type APIRequestContext } from "@playwright/test";

const widths = [320, 640, 768, 1024, 1280, 1440];

async function getStoryId(
  request: APIRequestContext,
  title: string,
  idPart: string,
) {
  const response = await request.get("/index.json");
  expect(response.ok()).toBe(true);
  const index = await response.json() as {
    entries: Record<string, { id: string; title: string; type: string }>;
  };
  const entry = Object.values(index.entries).find(
    (candidate) =>
      candidate.type === "story" &&
      candidate.title === title &&
      candidate.id.includes(idPart),
  );

  expect(entry, `Story not found: ${title}/${idPart}`).toBeTruthy();
  return entry!.id;
}

function rectanglesOverlap(
  first: { x: number; y: number; width: number; height: number },
  second: { x: number; y: number; width: number; height: number },
) {
  return (
    first.x < second.x + second.width &&
    second.x < first.x + first.width &&
    first.y < second.y + second.height &&
    second.y < first.y + first.height
  );
}

test("PageHeading e PageTabsHeader permanecem visiveis em wrappers flexiveis", async ({
  page,
  request,
}) => {
  const pageHeadingId = await getStoryId(
    request,
    "Components/Layout/PageHeading",
    "--flexible-limited-width",
  );
  const pageTabsHeaderId = await getStoryId(
    request,
    "Components/Layout/PageTabsHeader",
    "--flexible-limited-width",
  );

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });

    await page.goto(`/iframe.html?id=${pageHeadingId}&viewMode=story`, {
      waitUntil: "networkidle",
    });
    const pageHeading = page.locator("#storybook-root h1").first();
    await expect(pageHeading).toBeVisible();
    const pageHeadingBox = await pageHeading.boundingBox();
    expect(pageHeadingBox?.width).toBeGreaterThan(0);
    expect(pageHeadingBox?.height).toBeGreaterThan(0);

    await page.goto(`/iframe.html?id=${pageTabsHeaderId}&viewMode=story`, {
      waitUntil: "networkidle",
    });
    const tabsHeading = page.locator("#storybook-root h1").first();
    const tabs = page.locator('#storybook-root [role="tablist"]').first();
    await expect(tabsHeading).toBeVisible();
    await expect(tabs).toBeVisible();

    const tabsHeadingBox = await tabsHeading.boundingBox();
    const tabsBox = await tabs.boundingBox();
    expect(tabsHeadingBox?.width).toBeGreaterThan(0);
    expect(tabsHeadingBox?.height).toBeGreaterThan(0);
    expect(tabsBox?.width).toBeGreaterThan(0);
    expect(tabsBox?.height).toBeGreaterThan(0);

    expect(
      rectanglesOverlap(tabsHeadingBox!, tabsBox!),
      `Title and tabs overlap at ${width}px`,
    ).toBe(false);
  }
});
