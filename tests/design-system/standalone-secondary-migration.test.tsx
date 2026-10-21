import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, CircularLoading, InputSwitch, LoadingDots, Notice, Typography } from "../../src";
import type { ButtonProps } from "../../src/components/button/Button";

describe("secondary promovido do tertiary na 0.7.0", () => {
  it("remove a antiga família cromática sem remover a hierarquia textual", () => {
    const registry = JSON.parse(readFileSync("tokens/design-system.tokens.json", "utf8"));
    const declarations = [...registry.tokens, ...registry.themes].flatMap((rule: { declarations: { property: string; value: string }[] }) => rule.declarations) as { property: string; value: string }[];
    expect(declarations.some(({ property, value }) => /--(?:tertiary-|action-tertiary-|switch-track-tertiary|content-brand-secondary|notice-secondary-content)/.test(property + value))).toBe(false);
    expect(declarations.some(({ property }) => property === "--secondary-1")).toBe(true);
    expect(renderToStaticMarkup(<Typography variant="secondary">Legenda</Typography>)).toContain("text-content-secondary");
    expect(renderToStaticMarkup(<Typography semanticRole="helper">Ajuda</Typography>)).toContain("text-content-muted");
  });

  it("mantém no novo secondary os tratamentos neutros das três variantes de botão", () => {
    expect(renderToStaticMarkup(<Button color="secondary">Salvar</Button>)).toContain("bg-action-secondary");
    expect(renderToStaticMarkup(<Button color="secondary" variant="outline">Salvar</Button>)).toContain("border-border-strong text-content-primary");
    expect(renderToStaticMarkup(<Button color="secondary" variant="plain">Salvar</Button>)).toContain("border-transparent text-content-primary");
    expect(renderToStaticMarkup(<Button color="secondary" loading>Salvar</Button>)).toContain("bg-action-secondary-content");
  });

  it("migra switch, aviso e carregadores mantendo a prioridade da cor explícita", () => {
    expect(renderToStaticMarkup(<InputSwitch variant="secondary" defaultEnable aria-label="Ativo" />)).toContain("bg-switch-track-secondary-on");
    expect(renderToStaticMarkup(<Notice type="secondary">Aviso</Notice>)).toContain("text-action-secondary-content");
    expect(renderToStaticMarkup(<LoadingDots color="secondary" />)).toContain("bg-content-primary");
    expect(renderToStaticMarkup(<CircularLoading color="secondary" />)).toContain("rgb(var(--content-primary))");
    expect(renderToStaticMarkup(<CircularLoading color="secondary" indicatorColor="#123456" />)).toContain('stroke="#123456"');
  });
});

// Public API regression: chromatic tertiary must no longer be accepted.
type AcceptsTertiary = "tertiary" extends NonNullable<ButtonProps["color"]> ? true : false;
const acceptsTertiary: AcceptsTertiary = false;
it("o tipo público de Button não aceita tertiary", () => expect(acceptsTertiary).toBe(false));
