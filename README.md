# @aspprev/versi-ds

Biblioteca de componentes React e fundamentos visuais da VERSI para construir interfaces consistentes. Reúne controles de formulário, navegação, tabelas, gráficos, diálogos, feedback, tipografia, tokens, temas e recursos de acessibilidade.

Use o DS para compor a interface; a aplicação continua responsável por dados, validação de negócio, requisições, navegação e persistência das preferências do usuário.

## Por onde começar

1. Instale o pacote e as dependências das camadas que vai usar.
2. Importe os estilos uma vez na entrada da aplicação.
3. Configure fonte, tema e preferências no elemento `html`.
4. Comece pelos exemplos de componentes e formulários abaixo.
5. Consulte o Storybook para explorar variantes, estados e propriedades.

## Instalação e consumo

Depois da publicação:

```bash
npm install @aspprev/versi-ds react react-dom
```

Durante a preparação, instale o `.tgz` produzido por `npm pack` em um consumidor piloto. O pacote fornece ESM e declarações TypeScript; não fornece uma distribuição CommonJS. Suporta React/React DOM 18.2 ou 19. Node >=20.19 é necessário para desenvolvimento/build.

```tsx
import { Button } from "@aspprev/versi-ds/core";
import "@aspprev/versi-ds/styles.css";
import "@aspprev/versi-ds/themes.css"; // paletas opcionais, depois dos estilos

export function Example() {
  return <Button>Continuar</Button>;
}
```

O CSS já está compilado: consumidores não precisam instalar Tailwind nem escanear o pacote. Importe-o uma vez na entrada da aplicação. Ele inclui estilos base/reset do Tailwind; carregue as personalizações da aplicação depois dos estilos do DS.

Os componentes básicos não exigem um provider global. Alguns controles precisam de contexto específico, como Formik nos formulários. Se a aplicação já usa React, preserve a versão compatível instalada em vez de adicionar uma segunda cópia.

## Entrypoints públicos

Todos os sufixos abaixo pertencem a `@aspprev/versi-ds`.

| Entrada       | Conteúdo                                                                                                                         | Peers adicionais                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| raiz          | API completa de compatibilidade                                                                                                  | Instale todos os peers opcionais            |
| `/core`       | Botões, tipografia, superfícies, avisos, avatares, imagens, tooltips, paginação, tabelas, status, layout e primitivas acessíveis | Nenhum                                      |
| `/forms`      | Input/InputStandalone, InputSelect, TextArea, InputPhone, SelectCountry, SelectMulti, DatePicker, RadioGroup, RadioCardGroup     | `formik`, `date-fns`, `react-number-format` |
| `/charts`     | LazyApexChart, TimeSeriesChart, InteractiveDonutChart, TimeRangeSelector e utilitários                                           | `apexcharts`, `react-apexcharts`            |
| `/overlays`   | Modal, InputSwitch, AccessibilityPreferencesPanel, HighContrastToggle                                                            | `@headlessui/react`                         |
| `/documents`  | BoletoBarCode e DocumentItem                                                                                                     | `jsbarcode`                                 |
| `/countries`  | COUNTRY_OPTIONS, PHONE_COUNTRY_OPTIONS, getCountryOptions, getCountryFlagUrl, filterCountryOptions e tipos                       | Nenhum                                      |
| `/styles.css` | Tokens, modos, componentes e utilitários compilados                                                                              | —                                           |
| `/themes.css` | Presets de paletas                                                                                                               | —                                           |

Use as versões compatíveis declaradas em `peerDependencies`. Os peers opcionais permitem instalar somente `/core` e `/countries`; uma entrada de camada resolve todas as suas dependências estáticas, mesmo quando apenas um componente é importado. A raiz reexporta as camadas e não isola esses peers. ApexCharts é carregado dinamicamente no navegador.

Os controles integrados com Formik, incluindo SelectCountry e InputPhone, devem ficar dentro de `<Formik>`. `InputStandalone` dispensa contexto Formik, mas a entrada `/forms` ainda requer seus peers.

Instale apenas as integrações utilizadas, respeitando as faixas do manifesto:

```bash
# Formulários
npm install formik@^2.4.9 date-fns@^4.1.0 react-number-format@^5.4.4

# Gráficos
npm install apexcharts@5.3.6 react-apexcharts@^1.9.0

# Diálogos e preferências
npm install @headlessui/react@^2.2.9

# Código de barras
npm install jsbarcode@^3.12.3
```

Para gráficos, mantenha a versão de ApexCharts indicada: ela faz parte do contrato de dependências validado pelo pacote.

`CountrySelect`, `MultiSelect`, `PhoneInput`, `Datepicker` e `CheckBox` permanecem aliases depreciados. Prefira `SelectCountry`, `SelectMulti`, `InputPhone`, `DatePicker` e `Checkbox`. Não use deep imports de componentes em `dist` ou `src`.

## Escolhendo os componentes

| Necessidade                   | Componentes                                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| Ações e navegação             | Button, Pagination, PageTabsHeader                                                                    |
| Texto e hierarquia            | Typography, PageHeading, TextGroup, Divider                                                           |
| Estrutura                     | Surface, ModalCard, FormGrid, FormActions, InfoGrid, InfoItem, FilterBar                              |
| Avisos, status e carregamento | Notice, StatusBadge, DomainStatusBadge, PageState, LoadingDots, CircularLoading                       |
| Identidade e apoio visual     | Avatar, ThemedImage, IconProvider, Tooltip                                                            |
| Texto, seleção e datas        | Input, InputStandalone, InputSelect, TextArea, SelectMulti, DatePicker                                |
| Países e telefones            | SelectCountry, InputPhone                                                                             |
| Opções e valores graduais     | Checkbox, RadioGroup, RadioCardGroup, InputSwitch, Slider, InputSlider                                |
| Dados tabulares               | Table, MobileCardTable                                                                                |
| Visualizações                 | TimeSeriesChart, InteractiveDonutChart, TimeRangeSelector, LazyApexChart                              |
| Diálogos e documentos         | Modal, DocumentItem, BoletoBarCode                                                                    |
| Acessibilidade                | SkipLink, FocusNavigationMode, FormErrorNavigation, AccessibilityPreferencesPanel, HighContrastToggle |

Essa tabela organiza os componentes por finalidade. Consulte os entrypoints para escolher o import: Checkbox está em `/core`, RadioGroup em `/forms` e InputSwitch em `/overlays`, por exemplo.

## Componentes básicos na prática

```tsx
import {
  Button,
  Notice,
  StatusBadge,
  Surface,
  Typography,
} from "@aspprev/versi-ds/core";

export function Resumo() {
  return (
    <Surface tone="card" padding="default" elevation="sm">
      <Typography element="h2" semanticRole="section-title">
        Dados do cadastro
      </Typography>
      <Typography semanticRole="body">
        Confira as informações antes de continuar.
      </Typography>
      <StatusBadge tone="success" appearance="soft">
        Atualizado
      </StatusBadge>
      <Notice type="info">
        Você pode revisar os dados a qualquer momento.
      </Notice>
      <Button type="button" variant="outline" color="primary">
        Revisar
      </Button>
    </Surface>
  );
}
```

| Componente  | Propriedades frequentes                                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Button      | `variant`: flat/outline/plain; `color`: primary/secondary/tertiary/danger/warning; `size`: small/medium/large; `width`: auto/full; `loading`, `loadingLabel`, `disabled` |
| Typography  | `element`: elemento HTML; `semanticRole`: page-title/section-title/body/label/caption/helper; `size`, `weight`, `variant`                                                |
| Surface     | `tone`: card/subtle/muted/disabled/info/success/warning/danger/transparent; `padding`: none/compact/default; `elevation`: none/sm/md; `radius`: none/sm/md               |
| Notice      | `type`: info/primary/secondary/tertiary/gray/success/warning/danger; `onDismiss`, `icon`, `rounded`                                                                      |
| StatusBadge | `tone`: neutral/info/success/warning/danger; `appearance`: outline/soft/solid; `size`: sm/md                                                                             |

Em Typography, `semanticRole` define a apresentação; `element` define a semântica HTML. Use `element="h1"` para o título principal e níveis coerentes para as seções. Uma etiqueta de status precisa de texto compreensível, além da cor.

Para uma ação em andamento, use `loading` e um `loadingLabel` descritivo no Button. Dentro de formulários, declare `type="submit"` para enviar e `type="button"` para as demais ações.

## Formulários

Use Input quando o estado pertence ao Formik e InputStandalone quando a aplicação fornece `value` e `onChange` diretamente. A aplicação define a validação e o envio; o DS apresenta os controles e seus estados.

### Formulário com Formik

```tsx
import { Form, Formik } from "formik";
import { Button, FormActions, FormGrid } from "@aspprev/versi-ds/core";
import { Input, InputSelect } from "@aspprev/versi-ds/forms";

type Valores = { nome: string; categoria: string };

export function Cadastro({
  salvar,
}: {
  salvar: (values: Valores) => Promise<void>;
}) {
  return (
    <Formik<Valores>
      initialValues={{ nome: "", categoria: "" }}
      validate={(values) => {
        const errors: Partial<Record<keyof Valores, string>> = {};
        if (!values.nome.trim()) errors.nome = "Informe seu nome.";
        if (!values.categoria) errors.categoria = "Selecione uma categoria.";
        return errors;
      }}
      onSubmit={salvar}
    >
      {({ isSubmitting }) => (
        <Form>
          <FormGrid columns={2}>
            <Input name="nome" label="Nome completo" autoComplete="name" />
            <InputSelect
              name="categoria"
              label="Categoria"
              options={[
                { label: "Pessoa física", value: "pessoa-fisica" },
                { label: "Pessoa jurídica", value: "pessoa-juridica" },
              ]}
            />
          </FormGrid>
          <FormActions align="end">
            <Button
              type="submit"
              loading={isSubmitting}
              loadingLabel="Salvando cadastro"
            >
              Salvar
            </Button>
          </FormActions>
        </Form>
      )}
    </Formik>
  );
}
```

O `name` deve corresponder à chave em `initialValues`. Os erros integrados aparecem quando o campo está marcado como tocado (`touched`). Forneça `label`; o placeholder é um exemplo de preenchimento, não substitui o rótulo.

FormGrid usa uma coluna em telas menores e aplica `columns` a partir do breakpoint `tablet` (1024 px). FormActions organiza as ações em coluna no mobile e em linha nas telas maiores.

### Campo controlado sem contexto Formik

```tsx
import { useState } from "react";
import { InputStandalone } from "@aspprev/versi-ds/forms";

export function Busca() {
  const [termo, setTermo] = useState("");
  return (
    <InputStandalone
      name="busca"
      label="Buscar por nome"
      value={termo}
      onChange={(event) => setTermo(event.target.value)}
    />
  );
}
```

Input e InputStandalone oferecem máscaras como `cpf`, `cnpj`, `cep`, `phone`, `date` e `currency`. A máscara auxilia a digitação; a aplicação ainda deve validar e normalizar o valor exigido pela sua API. Use InputPhone para seleção internacional de país e DDI.

## Diálogos controlados

```tsx
import { useState } from "react";
import { Button } from "@aspprev/versi-ds/core";
import { Modal } from "@aspprev/versi-ds/overlays";

export function Detalhes() {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <Button type="button" onClick={() => setAberto(true)}>
        Ver detalhes
      </Button>
      <Modal
        isOpen={aberto}
        onClose={() => setAberto(false)}
        title="Detalhes do cadastro"
        showIcon={false}
      >
        <p>Informações complementares do cadastro.</p>
        <Button type="button" onClick={() => setAberto(false)}>
          Fechar
        </Button>
      </Modal>
    </>
  );
}
```

Mantenha o estado de abertura na aplicação e forneça um título significativo. ModalCard é uma superfície visual; use Modal quando precisar do comportamento de diálogo.

## Servidor e navegador

As entradas de componentes, inclusive `/core` e a raiz, declaram `"use client"`: agrupam componentes com hooks/contexto. Podem participar de SSR em aplicações React, mas não são entradas exclusivas de React Server Components. Funções dessas entradas devem ser chamadas no contexto cliente em aplicações RSC. `/countries` permanece sem diretiva cliente e pode ser usado no servidor. Callbacks e estado devem ser definidos em um componente cliente.

## Temas, acessibilidade e fontes

Os tokens canônicos ficam em `tokens/design-system.tokens.json`. Edite essa fonte e execute `npm run tokens:generate`; não edite os arquivos gerados manualmente.

```html
<html
  data-color-scheme="dark"
  data-ds-theme="verde3"
  data-contrast="high"
  data-contrast-theme="dark"
  data-font-scale="large"
  data-motion="reduce"
></html>
```

| Atributo              | Valores                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `data-color-scheme`   | `light`, `dark`                                                                                               |
| `data-ds-theme`       | `default`, `azul1`, `azul2`, `azul3`, `laranja1`, `laranja2`, `verde1`, `verde2`, `verde3`, `verde4`, `rosa1` |
| `data-contrast`       | `normal`, `high`                                                                                              |
| `data-contrast-theme` | `light`, `dark` (esquema do alto contraste)                                                                   |
| `data-font-scale`     | `default`, `large`, `extra-large`                                                                             |
| `data-motion`         | `full`, `reduce`                                                                                              |

As preferências são controladas pelo consumidor, que também cuida da persistência e sincronização. As classes legadas das paletas continuam disponíveis. Tokens de cores usam triplets RGB para aceitar opacidade.

O pacote não distribui nem baixa fontes. Configure `--font-nunito-sans` ou sobrescreva `--font-family-base`; sem Nunito Sans disponível, o navegador usa `sans-serif`. O Storybook carrega Nunito Sans pelo Google Fonts e precisa de rede para reproduzir essa tipografia nas referências visuais existentes. O consumidor pode hospedar a própria fonte; não há dependência de `next/font`.

### Alterar o tema em execução

No navegador, atualize os atributos do elemento raiz:

```ts
const root = document.documentElement;
root.dataset.colorScheme = "dark";
root.dataset.dsTheme = "azul1";
root.dataset.contrast = "normal";
root.dataset.contrastTheme = "dark";
root.dataset.fontScale = "large";
root.dataset.motion = "reduce";
```

Use o `html` para que diálogos e listas renderizados fora da árvore do componente recebam o mesmo tema. Aplique as preferências conhecidas antes da primeira pintura quando houver SSR. Para acompanhar o tema do sistema, a aplicação deve resolver a preferência para `light` ou `dark`.

AccessibilityPreferencesPanel recebe `preferences` e entrega mudanças parciais em `onPreferencesChange`. Mescle essas mudanças com o estado atual e sincronize os atributos CSS. O valor `fontScale="standard"` do painel corresponde a `data-font-scale="default"`; `highContrast` corresponde a normal/high e `reduceMotion` a full/reduce. O painel não persiste nem aplica automaticamente as preferências no documento.

### Usar tokens no CSS da aplicação

Prefira tokens semânticos, que expressam a função da cor, em vez de copiar valores de uma paleta:

```css
.resumo-cadastro {
  color: rgb(var(--content-primary));
  background-color: rgb(var(--surface-page));
  border: 1px solid rgb(var(--border-default));
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.resumo-cadastro:focus-visible {
  outline: 2px solid rgb(var(--focus-ring));
  outline-offset: 2px;
}
```

Tokens de cor contêm os canais RGB, sem `#` e sem a função `rgb()`; tokens de espaço e raio já incluem a unidade. Ao personalizar cores, confira também os modos escuro e de alto contraste. Evite tamanhos de fonte fixos que impeçam a escala tipográfica do DS.

O CSS distribuído inclui as classes necessárias aos componentes, não todas as classes possíveis do Tailwind. Para layouts próprios, use seu CSS ou o build Tailwind da aplicação; o `tailwind.config.cjs` deste repositório não é um export público.

### Configurar a família tipográfica

Depois de carregar a fonte escolhida, configure sua família no CSS global. Para uma alternativa sem download de fonte:

```css
:root {
  --font-nunito-sans: system-ui;
  --font-family-base: var(--font-nunito-sans), sans-serif;
}
```

Configure também `--font-nunito-sans` porque Typography usa essa variável. Trocar apenas a família do `body` não alcança todos os componentes.

### Boas práticas de acessibilidade

- Use títulos em ordem, rótulos de campos e texto que explique status e erros.
- Mantenha foco visível e verifique Tab, Enter, Espaço e Escape nos controles interativos.
- Teste claro, escuro e alto contraste, além de fonte ampliada e movimento reduzido.
- Em ações com ícone sem texto, forneça um nome acessível, como `aria-label`.
- Verifique o conteúdo da aplicação com leitor de tela; a composição e os textos também influenciam a acessibilidade.

## Países e bandeiras locais

A lista contém 250 países/territórios. `COUNTRY_OPTIONS` e `PHONE_COUNTRY_OPTIONS` são a mesma lista; `getCountryOptions()` retorna uma cópia editável. Os componentes usam a lista automaticamente quando `options`/`countries` são omitidos. Por isso, `/forms` e a raiz incluem os dados; `/core` não os exige.

```tsx
import { Formik } from "formik";
import { SelectCountry, InputPhone } from "@aspprev/versi-ds/forms";

<Formik
  initialValues={{ pais: "Brasil", telefone: { ddi: 55, ddd: "", numero: "" } }}
  onSubmit={() => {}}
>
  <form>
    <SelectCountry
      name="pais"
      label="País"
      countryList={{ mode: "include", codes: ["BR", "PT", "US"] }}
    />
    <InputPhone
      name="telefone"
      label="Telefone"
      countryList={{ mode: "exclude", codes: ["US"] }}
    />
  </form>
</Formik>;
```

`countryList` aceita `all` (padrão), `include` ou `exclude`; `codes` usa ISO-2. Na lista padrão, o **valor do SelectCountry é o nome** (`Brasil`), e `cca2` contém `BR`. O payload telefônico é `{ ddi, ddd, numero }`; países com o mesmo DDI não podem ser distinguidos ao restaurar apenas esse payload. A escolha explícita preserva o ISO-2 enquanto o componente estiver montado.

Os componentes usam SVGs locais por `cca2`, inclusive em opções customizadas: `/flags/br.svg`, por exemplo. Todos os arquivos são publicados em `dist/flags`; o consumidor precisa servi-los em `/flags` no mesmo domínio. Na raiz da aplicação consumidora:

```bash
node --input-type=module -e "import {cpSync} from 'node:fs'; import {fileURLToPath} from 'node:url'; cpSync(fileURLToPath(new URL('./flags/', import.meta.resolve('@aspprev/versi-ds/countries'))), 'public/flags', {recursive:true})"
```

Em aplicações com subpath, configure uma rota estática para `/flags` na raiz do domínio. O campo legado `flags.png` contém metadados remotos; os componentes usam o SVG local e não requisitam esse PNG. `staticDirs` serve os SVGs no Storybook.

## Desenvolvimento e validação

```bash
npm install
npm run tokens:check
npm run check:governance
npm run typecheck
npm run build
npm test
npm run check:size
npm run build-storybook
npx playwright install chromium
npm run test:visual
npm run check:package
npm run test:package
npm pack --dry-run
```

`typecheck` inclui código, stories e configuração visual. `test:package` instala um tarball em diretório temporário fora do repositório, primeiro sem peers opcionais e depois com todos eles; verifica ESM, CSS, SSR e TypeScript strict/NodeNext. Requer acesso ao registro npm e limpa seu diretório temporário.

Use `npm run storybook` (6006) ou `npm run storybook:standalone` (6007). Playwright inicia seu próprio servidor; `STORYBOOK_DS_PORT` altera a porta. As referências visuais existentes são Chromium/Windows, desktop e mobile. Revise diferenças antes de usar `npm run test:visual:update`. Axe e testes automatizados não substituem revisão manual com leitor de tela.

No Storybook, abra o grupo `Design System` e escolha um componente. Use suas stories para comparar estados e variantes, e os controles para experimentar as propriedades disponíveis. A barra de ferramentas altera esquema de cores, paleta, contraste, escala da fonte e movimento. O `ThemeLab/Playground` reúne a exploração dos temas; o painel de acessibilidade ajuda na inspeção de cada cenário.

`prepack` verifica tokens, governança, TypeScript, build, tamanho e conteúdo antes de empacotar. O tarball inclui somente `dist/`, `README.md` e o `package.json` obrigatório do npm. Stories, testes, documentação interna e ferramentas não são publicados. Sourcemaps em `dist` são intencionais para diagnóstico.

## Aplicação de exemplo

O repositório inclui uma aplicação React/Vite em `examples/pilot`, com cadastro,
validação de formulário, países/telefone, tabela, modal e controles de aparência.
Ela instala o DS a partir do tarball e usa apenas os entrypoints públicos.

Na raiz do repositório:

```bash
npm run pilot:prepare
npm run pilot:dev
```

Abra `http://127.0.0.1:4175`. Para compilar e testar o piloto em produção, execute
`npm run test:pilot`. As instruções completas estão em `examples/pilot/README.md`.
O exemplo não faz parte do pacote npm e seus dados ficam somente na memória da página.

## Problemas comuns

| Sintoma                                                  | O que conferir                                                                                                    |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Componentes sem estilo                                   | Importe styles.css uma vez na entrada da aplicação e verifique regras que o sobrescrevem.                         |
| Uma classe Tailwind própria não funciona                 | O CSS do pacote inclui as classes dos componentes; compile as classes da sua aplicação ou use CSS próprio.        |
| Erro ao resolver Formik, Headless UI ou outra integração | Instale os peers da camada importada. A entrada raiz precisa do conjunto completo.                                |
| Erro de contexto Formik                                  | Envolva os controles integrados em Formik; para Input controlado, use InputStandalone.                            |
| Bandeiras não aparecem                                   | Confirme que /flags/br.svg responde no domínio da aplicação e copie dist/flags para os arquivos públicos.         |
| SelectCountry não mostra o valor inicial                 | Na lista padrão, use Brasil como valor; BR é o código de filtragem ISO-2.                                         |
| Diálogo ou dropdown com tema diferente                   | Aplique os atributos de tema no html para alcançar também os elementos renderizados fora da árvore do componente. |
| Fonte diferente do Storybook                             | Carregue a fonte desejada e configure --font-nunito-sans; a fonte não acompanha o pacote.                         |
| Erro de hooks em aplicação RSC                           | Defina estado e callbacks em um componente cliente; consulte a seção sobre servidor e navegador.                  |

## Documentação do repositório

Para aprofundar o uso e a manutenção, consulte os arquivos abaixo no checkout do projeto. Eles não acompanham o tarball npm.

| Arquivo                           | Conteúdo                                                |
| --------------------------------- | ------------------------------------------------------- |
| docs/API-PUBLICA-CONTROLES.md     | Contratos dos controles, estado, teclado e dependências |
| docs/COMPONENTES-CLIENT-SERVER.md | Fronteiras cliente e servidor                           |
| docs/THEMELAB-E-GLOBALS-CSS.md    | Temas e personalização do CSS                           |
| tokens/README.md                  | Fonte e geração dos tokens                              |
| docs/GOVERNANCA-DESIGN-SYSTEM.md  | Contribuição, versionamento e publicação                |
| docs/EVOLUCAO-DESIGN-SYSTEM.md    | Histórico de mudanças e validações                      |

O contexto específico do portal, o plano de migração e as pendências dessa transição ficam exclusivamente em `MIGRACAO-DO-PORTAL.md`.
# versi-design-system


