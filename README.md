# VERSI Design System

Biblioteca React de componentes, tokens, temas e utilitários para padronizar as interfaces dos produtos VERSI.

O [Storybook](#storybook) é a documentação visual oficial: nele você pode explorar componentes, foundations, temas, padrões de composição e estados acessíveis.

Site oficial: [versitec.com.br](https://versitec.com.br/) · [Storybook online](https://versi-design-system.vercel.app/)

## Instalação

```bash
npm install @aspprev/versi-ds react react-dom
```

Requisitos do pacote:

- Node.js `>=20.19.0`;
- React `>=18.2.0 <20`;
- React DOM `>=18.2.0 <20`.

O identificador npm `@aspprev/versi-ds` é mantido por compatibilidade com as
aplicações consumidoras e não representa o nome visual atual da marca.

As integrações abaixo são opcionais e só precisam ser instaladas pelas entradas que as utilizam: `@headlessui/react`, `apexcharts`, `date-fns`, `formik`, `jsbarcode`, `react-apexcharts` e `react-number-format`.

## Uso

Importe o CSS global uma vez na entrada da aplicação:

```tsx
import "@aspprev/versi-ds/styles.css";
import "@aspprev/versi-ds/themes.css";
```

Use componentes pela raiz ou por um entrypoint público:

```tsx
import { Button, Surface, Typography } from "@aspprev/versi-ds";
import { Input, OtpCodeInput } from "@aspprev/versi-ds/forms";
import { FileDropzone, QRCode } from "@aspprev/versi-ds/documents";

export function Resumo() {
  return (
    <Surface tone="card" padding="default">
      <Typography element="h1" semanticRole="section-title">
        Meu cadastro
      </Typography>
      <Button type="button">Continuar</Button>
    </Surface>
  );
}
```

### Entrypoints

| Entry point | Conteúdo |
| --- | --- |
| `@aspprev/versi-ds` | API principal e componentes mais usados |
| `/core` | componentes base, layout, status, tabela e hooks |
| `/forms` | campos Formik e controlados, seleção e OTP |
| `/documents` | documentos, upload, FileViewer e QRCode |
| `/overlays` | modal, preferências e camadas interativas |
| `/charts` | gráficos e seletores de período |
| `/countries` | países, telefones e bandeiras |
| `/styles.css` | estilos e tokens base |
| `/themes.css` | presets de tema |

Evite deep imports. Use somente os entrypoints públicos documentados no `package.json`.

## Organização do Design System

- **Components**: controles de ação, formulários, feedback, navegação, dados, documentos, overlays e layout.
- **Foundations**: cores, tipografia, espaçamento e sombras derivados dos tokens.
- **Themes**: esquema claro/escuro, contraste, escala tipográfica e presets de identidade.
- **Hooks e utilitários**: breakpoints, acessibilidade, preferências e posicionamento.
- **Countries e charts**: dados de países/bandeiras e integrações de gráficos.

Os tokens canônicos ficam em `tokens/design-system.tokens.json`. Arquivos CSS gerados não devem ser editados manualmente.

## Storybook

Instale as dependências e inicie a documentação visual:

```bash
npm install
npm run storybook
```

O servidor usa a porta `6006`. Para a configuração standalone:

```bash
npm run storybook:standalone
```

A árvore da documentação é organizada assim:

```text
Getting Started
├── Introduction
├── Installation
├── Usage
└── Contributing

Foundations
├── Overview
├── Colors
├── Typography
├── Spacing
└── Shadows

Components
├── Actions
├── Forms
├── Feedback
├── Data Display
├── Documents
├── Navigation
├── Overlay
├── Layout
└── Accessibility

Patterns
├── Forms
└── Feedback

Themes
├── Overview
├── Comparison
└── ThemeLab

Guidelines
├── Accessibility
└── Usage
```

A toolbar permite comparar esquema de cores, preset, contraste, escala de fonte e movimento reduzido. O addon de acessibilidade permanece disponível para inspeção manual e os testes automatizados usam Axe nos cenários visuais.

## Desenvolvimento e validação

```bash
npm run tokens:check
npm run typecheck
npm test
npm run build
npm run build-storybook
npm run test:visual
npm run check:package
npm run prepack
```

O script `prepack` valida tokens, governança, segurança, TypeScript, build, tamanho e conteúdo do pacote. O projeto não possui um script `lint` separado.

Para testar o exemplo integrado:

```bash
npm run pilot:prepare
npm run test:pilot
```

Antes de uma publicação, gere um tarball local com `npm pack` e valide sua instalação nos consumidores.

## Temas

As preferências são controladas pelo consumidor no elemento `html`:

```ts
const root = document.documentElement;
root.dataset.colorScheme = "dark";
root.dataset.dsTheme = "azul1";
root.dataset.contrast = "high";
root.dataset.fontScale = "large";
root.dataset.motion = "reduce";
```

Os valores válidos estão documentados em **Themes/Overview** no Storybook. Prefira tokens semânticos, como `--surface-page`, `--content-primary`, `--border-default` e `--focus-ring`, em vez de copiar valores de uma paleta.

## Contribuição

Ao criar ou alterar um componente:

1. reutilize tokens e componentes existentes;
2. mantenha a API tipada e compatível com React;
3. garanta foco visível, teclado, nomes acessíveis, erros e estados de carregamento;
4. crie ou atualize stories com estados relevantes;
5. adicione testes unitários, de interação e de acessibilidade quando aplicável;
6. execute `npm run prepack` antes de gerar o pacote.

Detalhes de contratos, governança e segurança ficam na pasta `docs/`. A documentação de uso visual deve permanecer principalmente no Storybook.
