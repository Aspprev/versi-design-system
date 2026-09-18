import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AccessibilityPreferencesPanel,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  HighContrastToggle,
} from "../../src";

describe("Accessibility preferences standalone", () => {
  it("mantem toggle de alto contraste controlado e acessivel", () => {
    const html = renderToStaticMarkup(
      <HighContrastToggle checked onChange={() => undefined} />,
    );
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("Ativado");
  });

  it("renderiza o painel controlado sem depender de persistencia", () => {
    const html = renderToStaticMarkup(
      <AccessibilityPreferencesPanel
        preferences={DEFAULT_ACCESSIBILITY_PREFERENCES}
        onPreferencesChange={() => undefined}
        showTrigger
      />,
    );
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain("Preferências de acessibilidade");
  });
});
