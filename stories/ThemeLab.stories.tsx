import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  InputStandalone,
  Notice,
  StatusBadge,
  Surface,
  Typography,
} from "../src";

const THEME_OPTIONS = [
  "default",
  "azul1",
  "azul2",
  "azul3",
  "laranja1",
  "laranja2",
  "verde1",
  "verde2",
  "verde3",
  "verde4",
  "rosa1",
] as const;

type ThemeId = (typeof THEME_OPTIONS)[number];
type ColorScheme = "light" | "dark";
type Contrast = "normal" | "high";

const TOKEN_GROUPS = [
  {
    label: "Conteudo",
    tokens: ["--content-primary", "--content-secondary", "--content-link"],
  },
  {
    label: "Superficie",
    tokens: ["--surface-page", "--surface-card-semantic", "--surface-muted"],
  },
  {
    label: "Acoes",
    tokens: [
      "--action-primary-background",
      "--action-primary-background-hover",
      "--action-primary-content",
    ],
  },
  {
    label: "Feedback",
    tokens: [
      "--feedback-success-strong",
      "--feedback-warning-strong",
      "--feedback-danger-strong",
    ],
  },
] as const;

const cssCode = `/* globals.css do projeto consumidor */
@import "@aspprev/versi-ds/styles.css";
@import "@aspprev/versi-ds/themes.css";

/* A identidade e as preferencias ficam no elemento raiz. */
html {
  --font-nunito-sans: "Nunito Sans";
}

html[data-ds-theme="verde3"] {
  /* sobrescritas locais devem vir depois dos imports */
  --content-link: var(--primary-2);
}

/* No Tailwind, importe o preset do DS como adaptador opcional. */`;

function setRootAttribute(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute(name, value);
}

function ThemeLab() {
  const [theme, setTheme] = useState<ThemeId>("default");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const [contrast, setContrast] = useState<Contrast>("normal");
  const [fontScale, setFontScale] = useState("default");
  const [tokenValues, setTokenValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const previous = {
      theme: root.getAttribute("data-ds-theme"),
      colorScheme: root.getAttribute("data-color-scheme"),
      contrast: root.getAttribute("data-contrast"),
      contrastTheme: root.getAttribute("data-contrast-theme"),
      fontScale: root.getAttribute("data-font-scale"),
    };

    return () => {
      const restore = (name: string, value: string | null) => {
        if (value === null) root.removeAttribute(name);
        else root.setAttribute(name, value);
      };
      restore("data-ds-theme", previous.theme);
      restore("data-color-scheme", previous.colorScheme);
      restore("data-contrast", previous.contrast);
      restore("data-contrast-theme", previous.contrastTheme);
      restore("data-font-scale", previous.fontScale);
    };
  }, []);

  useEffect(() => {
    setRootAttribute("data-ds-theme", theme);
    setRootAttribute("data-color-scheme", colorScheme);
    setRootAttribute("data-contrast", contrast);
    setRootAttribute("data-contrast-theme", colorScheme);
    setRootAttribute("data-font-scale", fontScale);

    const frame = window.requestAnimationFrame(() => {
      const styles = getComputedStyle(document.documentElement);
      const values = Object.fromEntries(
        TOKEN_GROUPS.flatMap((group) => group.tokens).map((token) => [
          token,
          styles.getPropertyValue(token).trim(),
        ]),
      );
      setTokenValues(values);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [colorScheme, contrast, fontScale, theme]);

  const activeLabel = useMemo(
    () => (theme === "default" ? "Padrao" : theme),
    [theme],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <Typography semanticRole="page-title" element="h1">
          ThemeLab
        </Typography>
        <Typography variant="secondary" size="md">
          Laboratorio do contrato de tema do Design System. Use os controles
          abaixo para conferir o mesmo componente em diferentes combinacoes.
        </Typography>
      </div>

      <Surface padding="default" tone="subtle" elevation="none">
        <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Tema de identidade
            <select
              className="h-control-md rounded-sm border border-field-border-default bg-field-surface px-2 text-field-content"
              value={theme}
              onChange={(event) => setTheme(event.target.value as ThemeId)}
            >
              {THEME_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "default" ? "Padrao" : option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Esquema
            <select
              className="h-control-md rounded-sm border border-field-border-default bg-field-surface px-2 text-field-content"
              value={colorScheme}
              onChange={(event) =>
                setColorScheme(event.target.value as ColorScheme)
              }
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Contraste
            <select
              className="h-control-md rounded-sm border border-field-border-default bg-field-surface px-2 text-field-content"
              value={contrast}
              onChange={(event) => setContrast(event.target.value as Contrast)}
            >
              <option value="normal">Normal</option>
              <option value="high">Alto contraste</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Escala da fonte
            <select
              className="h-control-md rounded-sm border border-field-border-default bg-field-surface px-2 text-field-content"
              value={fontScale}
              onChange={(event) => setFontScale(event.target.value)}
            >
              <option value="default">Padrao</option>
              <option value="large">Grande</option>
              <option value="extra-large">Muito grande</option>
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm text-content-secondary">
          Atributos ativos: <strong>{activeLabel}</strong> / {colorScheme} /{" "}
          {contrast}
          {fontScale !== "default" ? ` / ${fontScale}` : ""}.
        </p>
      </Surface>

      <div className="grid gap-4 desktop:grid-cols-2">
        <Surface padding="default" tone="card">
          <Typography semanticRole="section-title" element="h2" size="lg">
            Amostra dos componentes
          </Typography>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button color="primary">Acao primaria</Button>
            <Button color="secondary" variant="outline">
              Acao secundaria
            </Button>
            <Button color="tertiary" variant="plain">
              Acao simples
            </Button>
            <StatusBadge tone="success" appearance="solid">
              Ativo
            </StatusBadge>
          </div>
          <div className="mt-4 grid gap-3">
            <InputStandalone
              label="Campo de exemplo"
              placeholder="Digite um valor"
            />
            <Notice type="info" rounded>
              Este aviso usa os tokens semanticos do tema ativo.
            </Notice>
          </div>
        </Surface>

        <Surface padding="default" tone="card">
          <Typography semanticRole="section-title" element="h2" size="lg">
            Tokens computados
          </Typography>
          <div className="mt-4 grid gap-4">
            {TOKEN_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-sm font-bold text-content-secondary">
                  {group.label}
                </p>
                <div className="grid gap-2">
                  {group.tokens.map((token) => (
                    <div
                      className="flex min-w-0 items-center justify-between gap-3 rounded-sm border border-border-subtle px-2 py-1 text-xs"
                      key={token}
                    >
                      <code className="truncate text-content-secondary">
                        {token}
                      </code>
                      <span className="flex shrink-0 items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-4 w-4 rounded-full border border-border-default"
                          style={{
                            backgroundColor: `rgb(${tokenValues[token]})`,
                          }}
                        />
                        <code>{tokenValues[token] || "-"}</code>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Surface padding="default" tone="subtle" elevation="none">
        <Typography semanticRole="section-title" element="h2" size="lg">
          Como configurar no projeto consumidor
        </Typography>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-content-primary">
          <li>
            Importe `styles.css` primeiro e `themes.css` depois no arquivo
            global de estilos do projeto.
          </li>
          <li>
            Defina `data-ds-theme` no elemento `html` usando um preset aprovado.
          </li>
          <li>
            Defina `data-color-scheme`, `data-contrast`, `data-font-scale` e
            `data-motion` no mesmo elemento para as preferencias do usuario.
          </li>
          <li>
            Coloque sobrescritas do cliente depois dos imports e prefira tokens
            semanticos. Nao altere os arquivos gerados do pacote.
          </li>
        </ol>
        <pre className="mt-4 overflow-x-auto rounded-sm bg-surface-action-neutral p-4 text-xs text-content-inverse">
          <code>{cssCode}</code>
        </pre>
        <Notice type="warning" rounded className="mt-4">
          <strong>Ordem importa:</strong> o CSS do DS fornece os defaults; o
          `globals.css` do consumidor pode sobrescrever tokens depois dos
          imports. Isso permite adaptar a marca sem alterar os componentes.
        </Notice>
      </Surface>
    </div>
  );
}

const meta = {
  title: "Design System/ThemeLab",
  component: ThemeLab,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Laboratorio para validar presets de identidade, claro/escuro, alto contraste e escala de fonte. A configuracao demonstrada deve ser reproduzida no globals.css do projeto consumidor, sempre importando styles.css antes de themes.css.",
      },
    },
  },
} satisfies Meta<typeof ThemeLab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
