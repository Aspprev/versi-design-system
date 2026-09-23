import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import InputSwitch from "../../src/components/InputSwitch/InputSwitch";

describe("InputSwitch standalone", () => {
  it("preserva nomes e descrições ARIA no elemento switch durante SSR", () => {
    const html = renderToStaticMarkup(
      <InputSwitch
        aria-labelledby="meu-label"
        aria-describedby="meu-help meu-error"
        defaultEnable
      />,
    );

    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-labelledby="meu-label"');
    expect(html).toContain('aria-describedby="meu-help meu-error"');
    expect(html).toContain('aria-checked="true"');
  });

  it("mantém aria-label como contrato alternativo de nome acessível", () => {
    const html = renderToStaticMarkup(<InputSwitch aria-label="Notificações" />);

    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-label="Notificações"');
  });
});
