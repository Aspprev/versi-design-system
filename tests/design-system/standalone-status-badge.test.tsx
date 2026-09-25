import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  DomainStatusBadge,
  resolveStatusAppearance,
  StatusBadge,
  type StatusBadgeColor,
  type StatusAppearance,
  type StatusAppearanceMap,
} from "../../src";

const colors: StatusBadgeColor[] = [
  "primary",
  "blue",
  "green",
  "orange",
  "yellow",
  "red",
  "slate",
  "black",
];
const appearances: StatusAppearance[] = ["solid", "soft", "outline"];

const statusTokenRegistry = JSON.parse(
  readFileSync(resolve(process.cwd(), "tokens/design-system.tokens.json"), "utf8"),
) as {
  tokens: Array<{
    selector: string;
    declarations: Array<{ property: string; value: string }>;
  }>;
};

const statusTokenRule = statusTokenRegistry.tokens.at(-1);

function statusRgb(property: string): [number, number, number] {
  const value = statusTokenRule?.declarations.find(
    (declaration) => declaration.property === property,
  )?.value;
  if (!value) throw new Error(`Missing status token ${property}`);
  return value.split(",").map(Number) as [number, number, number];
}

function relativeLuminance([red, green, blue]: [number, number, number]): number {
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

function contrastRatio(
  foreground: [number, number, number],
  background: [number, number, number],
): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("StatusBadge standalone", () => {
  it("renderiza todas as cores da paleta nas variantes solid, soft e outline", () => {
    for (const color of colors) {
      for (const appearance of appearances) {
        const html = renderToStaticMarkup(
          <StatusBadge color={color} appearance={appearance}>
            Status
          </StatusBadge>,
        );

        if (color === "primary") {
          expect(html).toContain(
            appearance === "solid"
              ? "bg-action-primary"
              : appearance === "soft"
                ? "bg-primary-5"
                : "border-primary-1",
          );
        } else {
          expect(html).toContain(`status-${color}-${appearance}`);
        }
        expect(html).toContain("Status");
      }
    }
  });

  it("mantem primary ligado aos tokens de tema e separa a paleta fixa", () => {
    const primary = renderToStaticMarkup(
      <StatusBadge color="primary" appearance="solid">
        Primario
      </StatusBadge>,
    );
    const blue = renderToStaticMarkup(
      <StatusBadge color="blue" appearance="solid">
        Azul
      </StatusBadge>,
    );
    const themesCss = readFileSync(resolve(process.cwd(), "src/themes.css"), "utf8");
    const tokensCss = readFileSync(resolve(process.cwd(), "src/tokens.css"), "utf8");

    expect(primary).toContain("bg-action-primary");
    expect(primary).toContain("text-action-primary-content");
    expect(blue).toContain("bg-status-blue-solid-background");
    expect(themesCss).toContain("--primary-5: 255, 235, 215");
    expect(themesCss).toContain("--primary-5: 229, 245, 236");
    expect(tokensCss).toContain("--status-blue-solid-background: 0, 108, 226");
    expect(tokensCss).not.toContain(
      "--status-blue-solid-background: var(--primary-1)",
    );
  });

  it("mantem contraste AA nos estados solid da paleta fixa", () => {
    for (const color of colors.filter((value) => value !== "primary")) {
      expect(
        contrastRatio(
          statusRgb(`--status-${color}-solid-foreground`),
          statusRgb(`--status-${color}-solid-background`),
        ),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("resolve mapas arbitrarios com acentos, caixa e espacos extras", () => {
    const statusMap = {
      "EXIGÊNCIA PENDENTE": { color: "yellow", appearance: "soft" },
      "Status do Cliente": { color: "primary", appearance: "outline" },
    } satisfies StatusAppearanceMap;

    expect(
      resolveStatusAppearance("  exigencia   pendente ", "generic", {
        map: statusMap,
      }),
    ).toEqual({ color: "yellow", appearance: "soft" });
    expect(
      resolveStatusAppearance("status DO cliente", "generic", {
        map: statusMap,
      }),
    ).toEqual({ color: "primary", appearance: "outline" });

    const html = renderToStaticMarkup(
      <DomainStatusBadge status="  Status do Cliente " statusMap={statusMap} />,
    );
    expect(html).toContain("border-primary-1");
    expect(html).toContain("Status do Cliente");
  });

  it("aplica a precedencia statusMap, color, tone e fallback", () => {
    const statusMap = {
      Pendente: { color: "red", appearance: "solid" },
    } satisfies StatusAppearanceMap;

    expect(
      resolveStatusAppearance("Pendente", "generic", {
        map: statusMap,
        color: "green",
        tone: "warning",
        appearance: "soft",
      }),
    ).toEqual({ color: "red", appearance: "solid" });
    expect(
      resolveStatusAppearance("Desconhecido", "generic", {
        color: "orange",
        tone: "danger",
        appearance: "soft",
      }),
    ).toEqual({ color: "orange", appearance: "soft" });
    expect(
      resolveStatusAppearance("Desconhecido", "generic", {
        tone: "success",
      }),
    ).toEqual({ color: "green", appearance: "outline" });
    expect(
      resolveStatusAppearance("Desconhecido", "generic", {
        fallback: { color: "black", appearance: "solid" },
      }),
    ).toEqual({ color: "black", appearance: "solid" });
  });

  it("aceita tone como API legada sem impor associacoes por nome de status", () => {
    expect(
      resolveStatusAppearance("Pendente", "generic", {
        map: { Pendente: { tone: "warning", appearance: "soft" } },
      }),
    ).toEqual({ color: "yellow", appearance: "soft" });

    const html = renderToStaticMarkup(
      <>
        <StatusBadge tone="success" appearance="solid">
          Ativo
        </StatusBadge>
        <DomainStatusBadge status="Pendente" />
      </>,
    );

    expect(html).toContain("bg-status-green-solid-background");
    expect(html).toContain("border-status-slate-outline-border");
  });

  it("trata status vazio e fallback desconhecido sem hardcodear vocabulario", () => {
    expect(renderToStaticMarkup(<DomainStatusBadge status="" />)).toBe("");
    expect(
      renderToStaticMarkup(
        <DomainStatusBadge
          status="STATUS ESPECIFICO DO CLIENTE"
          fallback={{ color: "slate", appearance: "outline" }}
        />,
      ),
    ).toContain("border-status-slate-outline-border");
  });
});
