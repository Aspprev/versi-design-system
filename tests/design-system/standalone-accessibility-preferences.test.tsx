import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AccessibilityPreferencesPanel,
  ContrastPreference,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  FontSizePreference,
  HighContrastToggle,
  ReadingPreferences,
  ThemePreference,
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

  it("expõe as preferências extraídas com contratos controlados", () => {
    const html = renderToStaticMarkup(
      <>
        <ThemePreference value="dark" onChange={() => undefined} />
        <ContrastPreference checked onChange={() => undefined} />
        <FontSizePreference value="large" onChange={() => undefined} />
        <ReadingPreferences
          reduceMotion
          emphasizeFocus={false}
          underlineLinks
          onChange={() => undefined}
        />
      </>,
    );
    expect(html).toContain("Tema escuro");
    expect(html).toContain("Alto contraste");
    expect(html).toContain('value="large"');
    expect(html).toContain("Reduzir animações");
    expect(html).toContain("Sublinhar links");
  });
});
