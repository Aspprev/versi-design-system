import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PageHeading from "../../src/components/page-heading/PageHeading";

describe("PageHeading navigation security", () => {
  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    " \u0000\u001fjavascript:alert(1)",
    "java\tscript:alert(1)",
    "java\nscript:alert(1)",
    "java\rscript:alert(1)",
    "javascript\t:alert(1)",
  ])("never publishes an executable navigation URL: %j", href => {
    const html = renderToStaticMarkup(<PageHeading title="Title" back={{ label: "Back", href }} />);
    expect(html).not.toContain("href=");
    expect(html).not.toContain("alert(1)");
    expect(html).toContain('type="button"');
    expect(html).toContain("Back");
  });

  it.each(["/home", "../home", "#content", "?page=2", "https://example.test/home", "mailto:help@example.test", "app://home"])("preserves valid navigation: %s", href => {
    const html = renderToStaticMarkup(<PageHeading title="Title" back={{ label: "Back", href }} />);
    expect(html).toContain(`href="${href}"`);
  });
});
