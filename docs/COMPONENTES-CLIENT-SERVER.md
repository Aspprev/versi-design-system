# Contrato de runtime dos componentes

Este inventario define quais exports podem ser renderizados no servidor e quais
precisam de uma fronteira client-side. A classificacao e parte da API publica do
pacote e deve ser revisada quando um componente passar a usar hooks, DOM ou uma
dependencia browser-only.

## Fronteira publicada e SSR

Os bundles públicos de componentes (raiz, core, forms, charts, overlays e
documents) declaram `"use client"`, pois agrupam hooks e contextos. A entrada
countries é neutra e pode ser usada no servidor. Não confundir renderização
SSR com execução como React Server Component: funções utilitárias exportadas
pelas entradas cliente devem ser chamadas no cliente em aplicações RSC.

Os componentes abaixo suportam SSR, mas chegam ao consumidor pela fronteira
cliente do bundle; não há um entrypoint público exclusivo para RSC:

`Button`, `Typography`, `Divider`, `LoadingDots`, `Surface`, `ModalCard`,
`Notice`, `Avatar`, `ThemedImage`, `TextGroup`, `Checkbox`,
`FormGrid`, `FormActions`, `InfoGrid`, `InfoItem`, `FilterBar`, `DocumentItem`,
`SkipLink`, `StatusBadge`.

## Componentes client-only

Esses componentes usam hooks, DOM, portais, eventos globais ou bibliotecas que
dependem do navegador. O arquivo do componente declara `"use client"` para
deixar a fronteira explicita:

| Entrada | Componentes | Motivo |
| --- | --- | --- |
| core | `PageState`, `Tooltip`, `CircularLoading`, `Pagination`, `Slider`, `InputSlider`, `PageHeading`, `PageTabsHeader`, `DomainStatusBadge`, `FocusNavigationMode`, `FormErrorNavigation`, `IconProvider`, `PortalIconProvider`, `Table`, `MobileCardTable` | hooks, eventos, posicionamento ou contexto visual |
| forms | `Input`, `InputStandalone`, `InputSelect`, `TextArea`, `InputPhone`, `PhoneInput`, `DatePicker`, `SelectMulti`, `MultiSelect`, `SelectCountry`, `CountrySelect`, `RadioGroup`, `RadioCardGroup` | Formik, portais, eventos e estado local |
| overlays | `Modal`, `InputSwitch`, `AccessibilityPreferencesPanel`, `HighContrastToggle` | Headless UI, estado e eventos |
| charts | `LazyApexChart`, `InteractiveDonutChart`, `TimeSeriesChart`, `TimeRangeSelector` | ApexCharts, DOM e listeners |
| documents | `BoletoBarCode` | `useEffect`, SVG e JsBarcode |

`Table` e seus filtros tambem sao client-only na implementacao atual porque
medem viewport, usam portais e registram listeners. A tabela deve permanecer
em uma fronteira client-side mesmo quando o restante da pagina for server-safe.

## Dependencias por camada

| Camada | Dependencias opcionais | Regra de consumo |
| --- | --- | --- |
| `core` | nenhuma integracao pesada | base visual e estrutural |
| `forms` | `formik`, `date-fns`, `react-number-format` | instalar somente se a camada de formularios for usada |
| `charts` | `apexcharts`, `react-apexcharts` | carregar apenas em telas com graficos |
| `overlays` | `@headlessui/react` | necessario para modais, switch e preferencias |
| `documents` | `jsbarcode` | necessario apenas para boleto |

Todas as dependencias opcionais permanecem como `peerDependencies` opcionais
no pacote. A entrada raiz exige o conjunto completo de peers; consumidores
novos devem preferir a camada mais estreita possível.

## Regras de SSR e testes

- Componentes server-safe devem ter um teste de `renderToStaticMarkup`.
- Componentes client-only devem ter teste em `jsdom` ou navegador e nao podem
  ser validados apenas com um teste em ambiente `node`.
- Codigo que chama `window`, `document`, `matchMedia` ou `createPortal` deve
  ficar em modulo client-only ou em utilitario chamado exclusivamente por ele.
- A matriz visual deve cobrir claro, escuro, alto contraste claro e escuro,
  dois viewports, teclado, fonte ampliada, movimento reduzido e estados de
  erro/loading/desabilitado.

O inventario e a matriz devem ser atualizados junto com qualquer mudanca de
API. O teste de contrato das entradas publicas verifica a separacao das
dependencias; o typecheck standalone verifica que os modulos continuam
compilando fora do portal.
