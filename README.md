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

### InfoGrid em aplicações com Tailwind

O layout de `InfoGrid` vem pronto em `@aspprev/versi-ds/styles.css`. Não é
necessário incluir o pacote no `content` do Tailwind, usar `safelist` ou repetir
classes responsivas no consumidor. Os breakpoints do componente são fixos:

| `columns` | abaixo de 640px | a partir de 640px | a partir de 1024px | a partir de 1440px |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 1 |
| 2 | 1 | 2 | 2 | 2 |
| 3 (padrão) | 1 | 2 | 3 | 3 |
| 4 | 1 | 2 | 2 | 4 |
| 6 | 1 | 2 | 3 | 6 |

As regras próprias `versi-info-grid*` usam `:where()` para permitir customização
por `className`, inclusive `grid-cols-*` e variantes responsivas, independentemente
da ordem entre o CSS do DS e as utilities do Tailwind 3 do consumidor. Para usar
nomes como `mobile:`, `tablet:` e `desktop:` nas suas customizações, configure
esses nomes no Tailwind da aplicação (640px, 1024px e 1440px, respectivamente).
Classes personalizadas devem estar nos arquivos cobertos pelo `content` do consumidor.

A implementação anterior compartilhava classes de colunas com o consumidor.
Quando o CSS do consumidor vinha depois e gerava `tablet:grid-cols-3`, mas não
`desktop:grid-cols-6`, a regra de tablet também se aplicava em desktop e vencia
pela ordem de declaração e mesma especificidade. A geração da regra de desktop
no pacote estava correta. Agora o layout usa seletores próprios, sem depender
da geração parcial de utilities. Após atualizar o JS **e** o CSS do pacote,
o contorno `className="tablet:grid-cols-3 desktop:grid-cols-6"` pode ser removido
do portal: `<InfoGrid columns={6}>` é suficiente.

Validação de navegador do artefato npm: `npm run test:info-grid-consumer`
(requer Chromium instalado com `npx playwright install chromium`). O teste
empacota e extrai o DS em um consumidor, gera Tailwind somente a partir do
`src` desse consumidor e verifica `grid-template-columns` nas duas ordens de CSS,
sem Tailwind adicional e com customização explícita por `className`.

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

Na linha 0.4.x, todos os nove caminhos acima fazem parte do contrato público,
incluindo `@aspprev/versi-ds/charts`, `@aspprev/versi-ds/countries`, os cinco
entrypoints de componentes e os dois entrypoints CSS. Eles são definidos no
campo `exports` do `package.json`; arquivos internos de `src` não fazem parte
do contrato.

Evite deep imports. Use somente os entrypoints públicos documentados no `package.json`.

### APIs desta versão

```tsx
import { DatePicker, DomainStatusBadge, Table } from "@aspprev/versi-ds";
import { OtpCodeInput } from "@aspprev/versi-ds/forms";
import {
  FileDropzone,
  FileList,
  FileUploadProgress,
  FileViewer,
  QRCode,
  validateFiles,
} from "@aspprev/versi-ds/documents";
```

- `OtpCodeInput` suporta `onComplete`, colagem de código, máscara, erro e controle por `value`/`values`.
- `QRCode` suporta `description`, `ariaLabel`, `loading`, `error`, `size` e nível de correção.
- `PageHeading` e `PageTabsHeader` mantêm o bloco do título flexível em tablet/desktop, truncam títulos longos com reticências e preservam o texto completo no atributo `title` quando o título é texto simples. O retorno (`back`) e as ações continuam disponíveis.
- `Input` e `InputStandalone` aceitam `formatter={(value) => string}` para máscaras definidas pelo consumidor, sem props de domínio; as máscaras nomeadas existentes permanecem compatíveis.
- `validateFiles` retorna `code`, nome, extensão, tamanho e limite da rejeição e aceita mensagens por código; `FileViewer` também aceita `Promise<FileViewerSource>` como source.
- Upload e `FileViewer` são controlados pelo consumidor; transporte, autenticação, persistência e download não fazem parte do pacote.
- `DatePicker` aceita `selectionMode="year"` e mantém `selectionMode="day"` como padrão.
- `StatusBadge` oferece as cores `primary`, `blue`, `green`, `orange`, `yellow`, `red`, `slate` e `black` nas aparências `solid`, `soft` e `outline`. `DomainStatusBadge` aceita um `statusMap` definido pelo consumidor; o DS não associa nomes de status a cores.
- `Table` preserva os modos `fit`, `adaptive` e `scroll`; filtros e paginação respondem ao espaço do container.
- `InputPhone`/`PhoneInput` e `SelectCountry`/`CountrySelect` aceitam `showFlags` (padrão: `true`); `showFlags={false}` oculta somente a bandeira do campo, sem reservar espaço. A lista de países sempre mantém as bandeiras.
- Os controles de formulário ocupam a largura disponível do container; `className="w-full"` pode ser usado em grids, flex containers e colunas responsivas.

Consulte [`docs/API-NOVOS-COMPONENTES.md`](docs/API-NOVOS-COMPONENTES.md) e o Storybook para exemplos completos, estados de erro/carregamento e contratos de acessibilidade.

## Organização do Design System

- **Components**: controles de ação, formulários, feedback, navegação, dados, documentos, overlays e layout.
- **Foundations**: cores, tipografia, espaçamento e sombras derivados dos tokens.
- **Themes**: esquema claro/escuro, contraste, escala tipográfica e presets de identidade.
- **Hooks e utilitários**: breakpoints, acessibilidade, preferências e posicionamento.
- **Countries e charts**: dados de países/bandeiras e integrações de gráficos.

Os tokens canônicos ficam em `tokens/design-system.tokens.json`. Arquivos CSS gerados não devem ser editados manualmente.

## Bundle de paises e bandeiras

`core` e `forms` usam metadados leves. `SelectCountry` e `InputPhone` carregam
as bandeiras por chunks ESM internos do pacote, sem CDN ou requests externos.
Consulte [`docs/BUNDLE-PAISES.md`](docs/BUNDLE-PAISES.md) para a estrategia,
compatibilidade SSR e validacao do limite de 750 KB.

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

A árvore da documentação usa os nomes técnicos abaixo; a interface apresenta rótulos em português:

```text
Getting Started
  Introduction · Installation · Usage · Contributing

Foundations
  Overview · Colors · Typography · Spacing · Shadows · Borders · Icons

Components
  Overview (catálogo com busca)
  Actions · Forms · Feedback · Data Display · Documents
  Navigation · Overlay · Layout · Accessibility · Utilities

Patterns
  Overview · Forms · Feedback · Data/Table · Documents/UploadFlow
  Forms/FormStates · Forms/ValidationStates · Forms/FormValidation

Themes
  Overview · Comparison · ThemeLab

Guidelines
  Accessibility · Usage · ComponentChoice · Compatibility

Laboratory
  Forms/PlaceholderComparison · Forms/ValidationLayout
```

A toolbar permite comparar esquema de cores, preset, contraste, escala de fonte e movimento reduzido. O addon de acessibilidade permanece disponível para inspeção manual e os testes automatizados usam Axe nos cenários visuais.

## Desenvolvimento e validação

```bash
npm run tokens:check
npm run check:generated
npm run typecheck
npm test
npm run build
npm run build-storybook
npm run test:visual
npm run check:package
npm run prepack
```

O script `prepack` valida tokens e bandeiras geradas, governança, segurança, lint, TypeScript, build, tamanho e conteúdo do pacote. `npm run lint -- --max-warnings=0` cobre fontes, histórias, testes, scripts, configurações e o piloto, preservando o snapshot auditado de terceiros fora da análise de estilo.

Os workflows compartilham as validações de segurança, pacote e consumidores.
Consulte [segurança do build e compatibilidade](docs/SEGURANCA-BUILD-COMPATIBILIDADE.md)
para a correção local de build que preserva o suporte aos navegadores atuais.
`npm run check:security` audita DS e piloto nos escopos completo e de produção,
verifica a mitigação instalada e salva relatórios em `test-results/security`.
`npm run check:release -- vX.Y.Z` confere a tag candidata contra os manifestos;
no CI de publicação, a tag é obtida do evento do GitHub.

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
root.dataset.contrastTheme = "dark";
root.dataset.fontScale = "large";
root.dataset.motion = "reduce";
```

Os valores válidos estão documentados em **Themes/Overview** no Storybook. Prefira tokens semânticos, como `--surface-page`, `--content-primary`, `--border-default` e `--focus-ring`, em vez de copiar valores de uma paleta.

As identidades de cliente `custom2178`, `custom2156`, `custom2140`, `custom2133`, `custom2170`, `custom2162` e `custom2157` oferecem claro, escuro e alto contraste claro/escuro. Os presets legados continuam disponíveis. Consulte o [guia de integração e diferenças dos snapshots](docs/temas-clientes/INTEGRACAO.md) e **Temas → Clientes** no Storybook. As paletas são propostas para revisão visual.

As entradas raiz e `/core` exportam `CLIENT_THEMES`, `LEGACY_THEMES`, `DESIGN_SYSTEM_THEMES` e os tipos `ClientTheme` e `DesignSystemTheme` para construir seletores no consumidor.

## Contribuição

Ao criar ou alterar um componente:

1. reutilize tokens e componentes existentes;
2. mantenha a API tipada e compatível com React;
3. garanta foco visível, teclado, nomes acessíveis, erros e estados de carregamento;
4. crie ou atualize stories com estados relevantes;
5. adicione testes unitários, de interação e de acessibilidade quando aplicável;
6. execute `npm run prepack` antes de gerar o pacote.

Detalhes de contratos, governança e segurança ficam na pasta `docs/`. A documentação de uso visual deve permanecer principalmente no Storybook.
### Contratos adicionados no lote seguinte

- `Input` e `InputStandalone` preservam a posição do cursor ao aplicar um `formatter` genérico; máscaras de domínio continuam sendo definidas pelo consumidor.
- `InputSlider` usa `suffix` como prop canônica e mantém `sufix` apenas como alias de migração. `Avatar` aceita `xl` além dos tamanhos existentes.
- `validateFiles` também rejeita arquivos vazios ou inválidos, com mensagens customizáveis; `FileViewer` aceita um slot `actions`.
- `TimeSeriesChart` e `InteractiveDonutChart` expõem estados genéricos de carregamento, erro e ausência de dados.
- `BoletoBarCode` aceita `width`, `height`, `quietZone` e estado de erro; o payload de boleto continua sendo responsabilidade do consumidor.


## Detalhes opcionais de marca

Os acentos dos clientes têm pares de apresentação e uso explícito no Surface e nos gráficos, com fallback legado e suporte aos quatro modos. Veja [o contrato e a migração dos estilos temporários do portal](docs/brand-accents/README.md).
