# Auditoria completa do Versi Design System

**Escopo:** `@aspprev/versi-ds`, `por-portal-rpps` e `por-portal-aspprev`  
**Data da auditoria:** 22/09/2026  
**Tipo:** auditoria arquitetural, de produto, acessibilidade, integração e governança  
**Alterações realizadas durante a auditoria:** somente este documento

## 1. Resumo executivo

O `@aspprev/versi-ds` já possui uma base suficientemente madura para ser tratado como biblioteca compartilhada: tokens gerados, temas semânticos, CSS de acessibilidade, entrypoints públicos, componentes de formulários, documentos, tabelas, status, overlays e um conjunto relevante de testes, stories e verificações de empacotamento.

O principal problema não é a ausência de componentes isolados. É a falta de uma estratégia única de adoção entre os produtos. O `por-portal-aspprev` consome o pacote publicado por entrypoints públicos e concentra wrappers de negócio onde eles pertencem. O `por-portal-rpps`, embora declare `@aspprev/versi-ds` no `package.json`, não apresentou imports do pacote em `src` na versão auditada e mantém uma cópia local de grande parte do design system. Isso cria divergência visual, duplicação de correções de acessibilidade, risco de APIs incompatíveis e baixa previsibilidade para futuras versões.

### Principais conclusões

| Área | Conclusão | Prioridade |
|---|---|---:|
| Integração | Formalizar a migração do RPPS para o pacote público ou documentar explicitamente a transição. | Crítica |
| Upload | Os dois portais repetem um uploader com validação, drag-and-drop, lista e progresso; a lógica de transporte e Formik deve continuar no produto, mas primitives e validação genérica podem ser compartilhadas. | Alta |
| Acessibilidade | O DS tem bons primitives para foco, erro de formulário, contraste, movimento reduzido e preferências; persistência/aplicação ainda estão no portal ASPPrev. Os atributos `data-focus-emphasis` e `data-link-emphasis` não têm regras correspondentes no CSS do pacote. | Alta |
| Formulários | `Input`, `InputSelect` e `DatePicker` misturam responsabilidades visuais, Formik, parsing e posicionamento. | Alta |
| Tabelas | Existe uma boa evolução para mobile e container width, mas `Table`, `TableView` e `MobileCardTable` ainda concentram modelo, renderização, filtros, paginação e responsividade. | Alta |
| Status | `StatusBadge` é reutilizável; `DomainStatusBadge` é útil, mas seu mapa semântico inclui vocabulário de domínio e deve ser governado com cuidado. | Média |
| Storybook | A documentação visual é ampla, mas nem todo componente possui story dedicada e alguns componentes relacionados só aparecem em stories agrupadas. | Média |
| Empacotamento | Os subpaths públicos estão organizados e há testes de contrato; o root exporta praticamente tudo por compatibilidade, o que reduz a clareza de tree shaking e aumenta a superfície pública. | Média |

### Recomendação geral

Manter o Versi como uma biblioteca agnóstica de produto, consolidar primitives e adapters em camadas, priorizar o contrato de integração do RPPS e evoluir a acessibilidade como uma capacidade transversal. A próxima versão deve ser planejada como uma versão de estabilização e convergência, não como uma coleção de novos componentes sem governança de adoção.

## 2. Método e limites

Foram analisados:

- o código-fonte, tokens, CSS, temas, tipos e entrypoints do `ds-versi`;
- componentes, hooks, utilitários, providers, stories, documentação, testes e scripts do pacote;
- imports, componentes locais, hooks, utilitários, uploaders, viewers, tabelas, status, QR codes, OTP e acessibilidade dos dois portais;
- `package.json`, scripts, dependências e convenções de consumo;
- duplicações entre os produtos e oportunidades de abstração sem transportar regra de negócio para o DS.

Não foram feitos durante esta auditoria:

- alterações de código-fonte;
- alterações de dependências, lockfiles ou configuração;
- instalação, remoção ou movimentação de arquivos;
- publicação, `git add`, commit, tag ou push.

As contagens abaixo representam o estado do checkout auditado e devem ser atualizadas caso os repositórios evoluam antes da implementação do roadmap.

## 3. Retrato dos três projetos

### 3.1 Versi Design System

- Pacote: `@aspprev/versi-ds`.
- Versão observada: `0.2.0`.
- Node declarado: `>=20.19.0`.
- React peer: `>=18.2 <20`.
- Cerca de 50 famílias de componentes em `src/components`.
- 3 hooks públicos/centrais em `src/hooks`.
- 6 utilitários diretos em `src/utils`, além de utilitários locais de componentes.
- 60 arquivos de Storybook entre stories TS/TSX/MDX.
- 26 arquivos de testes, incluindo contratos públicos, acessibilidade, visuais e piloto.
- Entrypoints de código: root, `core`, `forms`, `documents`, `overlays`, `charts` e `countries`.
- Entrypoints de estilo: `styles.css` e `themes.css`.

### 3.2 por-portal-aspprev

- Pacote: `novoportalaspprev`, versão observada `2.0.0`.
- Dependência declarada: `@aspprev/versi-ds: ^0.1.1`, atrás da versão observada no DS.
- Uso real por entrypoints públicos: `core`, `forms`, `overlays`, `countries`, `documents` e `charts`.
- Contagem aproximada de ocorrências de imports no `src`: core 352, forms 82, overlays 114, countries 8, documents 5 e charts 6.
- Mantém wrappers e adapters locais para upload, FileViewer, tag, status-card, QR técnico e preferências de acessibilidade.
- Possui uma camada local robusta para persistência, hidratação, eventos, preferência do sistema, tenant e sessão.

Este é o melhor consumidor de referência para validar compatibilidade real do DS.

### 3.3 por-portal-rpps

- Pacote: `novoportalrpps`, versão observada `1.1.0`.
- Dependência declarada: `@aspprev/versi-ds: ^0.2.0`.
- Não foram encontrados imports de `@aspprev/versi-ds` em `src` na auditoria; o produto usa componentes locais via `@/components/...`.
- Mantém cópias locais de Button, Input, InputSelect, DatePicker, OTP, tabela, status, upload, viewer, modal, gráficos e outros componentes.
- Possui cerca de 49 diretórios de componentes, 8 arquivos de hooks e 51 arquivos de utilitários.
- O código local fornece evidência importante de necessidades reais, mas não deve continuar sendo a fonte paralela de primitives compartilhados.

## 4. Arquitetura atual do DS

### 4.1 Estrutura observada

```text
Versi Design System
├── foundations
│   ├── tokens/design-system.tokens.json
│   ├── src/tokens.css (gerado)
│   ├── src/themes.css
│   └── src/styles.css
├── components
│   ├── foundations/layout/typography
│   ├── forms/inputs
│   ├── feedback/status/loading
│   ├── navigation/focus/error
│   ├── overlays
│   ├── documents/uploads
│   ├── data/table/charts
│   └── accessibility-preferences
├── hooks
├── utils
├── public entrypoints
│   ├── index.ts
│   ├── core.ts
│   ├── forms.ts
│   ├── documents.ts
│   ├── overlays.ts
│   ├── charts.ts
│   └── countries.ts
├── stories
├── tests
└── package/build/governance
```

A arquitetura por subpath é uma boa decisão. O problema atual é que o root mantém uma superfície muito ampla e existem aliases históricos para o mesmo conceito, o que dificulta descobrir a API canônica.

### 4.2 Pontos fortes arquiteturais

- Separação de entrypoints por famílias de dependências.
- CSS de tokens gerado a partir de uma fonte declarativa.
- Temas por atributos/classes e presets de identidade.
- Uso de tipos públicos para tabelas, status, forms, documentos e acessibilidade.
- Componentes de alto risco já acompanhados por testes de contrato e visuais.
- Uso de CSS/atributos globais para capacidades transversais sem acoplamento a um portal específico.
- Ausência de chamadas de API, autenticação ou regras de negócio nos componentes do pacote.
- Compatibilidade explícita com React 18 e 19.

### 4.3 Riscos arquiteturais

1. Formik aparece diretamente em componentes fundamentais. Isso aumenta o custo de integração para consumidores que usam outro gerenciamento de formulário e dificulta a composição headless.
2. Alguns componentes acumulam parsing, estado controlado/não controlado, posicionamento, formulário, responsividade e apresentação.
3. Aliases como `Datepicker/DatePicker`, `PhoneInput/InputPhone`, `MultiSelect/SelectMulti`, `CountrySelect/SelectCountry` e `Checkbox/CheckBox` tornam a nomenclatura pública ambígua.
4. O pacote não oferece um provider de tema/preferências; cada portal implementa resolução, persistência e bootstrap de forma própria.
5. Não há uma camada pública clara de primitives headless para upload, tabela e acessibilidade.
6. O contrato de conteúdo responsivo está parcialmente distribuído entre `useBreakpoint`, `useContainerBreakpoint` e lógica local dos portais.

## 5. Inventário de foundations e tokens

| Fundação | Estado observado | Avaliação |
|---|---|---|
| Cores primitivas | Presentes no JSON de tokens e geradas para CSS. | Boa base; falta governança visual automatizada para todos os estados. |
| Cores semânticas | Conteúdo, ação, superfície, borda, feedback, campos, switch, rádio, checkbox, loading e chart. | Boa direção; revisar cobertura de upload/viewer e estados de tabela. |
| Temas | `default`, `azul1`, `azul2`, `azul3`, `laranja1`, `laranja2`, `verde1`–`verde4`, `rosa1`, com variações dark/high contrast. | Forte diferencial; precisa de matriz de contraste contínua. |
| Tipografia | Tokens de tamanho, peso, leading e escala global. | Suporta `large` e `extra-large`; deve ser validada a 200% e 400% em cenários completos. |
| Espaçamento | Escala declarada e usada pelos componentes. | Consolidar valores hardcoded identificados nos portais. |
| Radius/shadows/blur | Presentes. | Adequados como foundation; revisar uso em componentes novos. |
| Breakpoints | mobile 640, tablet 1024, desktop 1440 e tv 1920; hooks de viewport e container. | Boa base, mas falta contrato de largura máxima/conteúdo. |
| Alturas de controle | Tokens de controles e elementos do shell. | Reutilizar explicitamente em upload, OTP e tabelas. |
| Shell/gutters | Tokens existentes. | Não há ainda um `ContentContainer` público que expresse o contrato. |
| Z-index | Escala declarada. | Alguns produtos usam valores arbitrários muito altos; documentar limites. |
| Movimento | `data-motion` e `prefers-reduced-motion`. | Implementado globalmente; componentes devem evitar animações próprias sem fallback. |
| Foco | `data-focus-navigation`, focus ring e variantes de alto contraste. | Bom fundamento; falta atender foco/link emphasis usados pelo portal. |
| Escala de fonte | `data-font-scale` com `large` e `extra-large`. | Deve ser incluída nos testes de layout de tabelas, modal, upload e DatePicker. |

### 5.1 Lacunas de tokens

- Não foi encontrada uma camada semântica explícita para largura máxima de conteúdo e gutters responsivos, apesar de os portais possuírem necessidade recorrente.
- `data-focus-emphasis` e `data-link-emphasis` aparecem no modelo de preferências do portal ASPPrev, mas não foram encontrados como regras CSS correspondentes no `styles.css`/tokens do DS. A API pode comunicar uma preferência sem produzir efeito visual.
- Upload, FileViewer, estado de progresso, estado de arquivo inválido e estados de tabela não têm uma família de tokens tão explícita quanto forms e feedback.
- As regras de alto contraste incluem ajustes pontuais para checkbox e charts, mas precisam de matriz sistemática para todos os novos componentes.
- O tratamento de QR code usa contraste próprio no componente, o que é defensável como validação de entrada, mas deve ser documentado como regra de componente e não substitui a validação de contraste do entorno.

## 6. Inventário completo de componentes

Na tabela, “agrupada” significa que o componente aparece em uma story de documentação mais ampla; “dedicada” significa uma story identificável para a família. “Maturidade” considera API, teste, documentação e uso nos portais, não apenas existência do arquivo.

### 6.1 Foundations, layout e identidade

| Componente | Papel/API | Story/teste | Maturidade | Prioridade |
|---|---|---|---|---:|
| `avatar` | Avatar e fallback visual. | Dedicada; cobertura de core/visual. | Estável | Baixa |
| `divider` | Separação visual. | Dedicada; core. | Estável | Baixa |
| `icon-provider` | Provider de ícones e fallback. | Dedicada; core. | Estável | Média |
| `surface` | Container de superfície semântica. | Dedicada; core/visual. | Estável | Média |
| `themed-image` | Alternância por tema. | Dedicada; tema. | Estável | Média |
| `typography` | Tipografia e variantes. | Dedicada; foundation/visual. | Estável | Alta |
| `text-group` | Agrupamento de label, texto auxiliar e conteúdo. | Dedicada; core. | Estável | Média |
| `page-heading` | Cabeçalho de página e ações. | Dedicada; core. | Estável | Média |
| `page-tabs` | Cabeçalho/tabs de página. | Story não isolada de forma evidente; cobertura indireta. | Em consolidação | Média |
| `info-grid` | Grade de informações rotuladas. | Dedicada; core. | Estável | Média |
| `form-layout` | Grid e ações de formulário. | Dedicada; forms. | Estável | Alta |
| `filter-bar` | Barra de filtros e ações. | Story/cobertura parcial. | Em evolução | Alta |

### 6.2 Forms e entrada de dados

| Componente | Papel/API | Story/teste | Maturidade | Prioridade |
|---|---|---|---|---:|
| `button` | Ação, variantes, loading, ícones. | Dedicada; core/visual/a11y. | Madura | Alta |
| `input` | Input com label, erro, máscaras e adapter Formik. | Dedicada e Formik; prioridade visual. | Madura, API acoplada | Crítica |
| `text-area` | Textarea com estados. | Dedicada; contrato. | Estável | Alta |
| `input-select` | Select pesquisável/portalizado e Formik. | Dedicada; contrato. | Madura, API acoplada | Crítica |
| `input-phone` / `phone-input` | Telefone e máscara. | Dedicada; contrato. | Estável com alias | Média |
| `date-picker` | Input, calendário, navegação, day/month/year. | Dedicada; teste específico. | Importante, grande | Crítica |
| `select-multi` / `multi-select` | Seleção múltipla. | Dedicada; contrato. | Madura, alias | Alta |
| `select-country` / `country-select` | Seleção de país/bandeira. | Dedicada; countries/visual. | Estável | Média |
| `checkbox` | Checkbox nativo/proxy e estados. | Dedicada; core/a11y. | Estável | Alta |
| `radio-group` | Grupo de rádio. | Dedicada; core/a11y. | Estável | Alta |
| `radio-card-group` | Radio em cards. | Dedicada; prioridade visual. | Estável | Alta |
| `input-slider` / `slider` | Slider e input associado. | Dedicada; contrato. | Estável | Média |
| `input-switch` | Switch/toggle. | Dedicada; overlays/a11y. | Estável | Alta |
| `otp-code-input` | Código de uso único, paste e teclado. | Dedicada; prioridade visual/standalone. | Nova e promissora | Crítica |

### 6.3 Feedback, status e loading

| Componente | Papel/API | Story/teste | Maturidade | Prioridade |
|---|---|---|---|---:|
| `status-badge` | Badge visual genérico e `DomainStatusBadge`. | Dedicada; status contrato/visual. | Madura, domínio acoplado | Alta |
| `notice` | Mensagem informativa/feedback. | Dedicada; core. | Estável | Alta |
| `page-state` | Loading/empty/error de página. | Dedicada; core/visual. | Estável | Alta |
| `loading-dots` | Loading inline. | Dedicada; core. | Estável | Média |
| `circular-loading` | Loading circular responsivo. | Dedicada; core. | Estável | Média |

### 6.4 Navegação, foco e overlays

| Componente | Papel/API | Story/teste | Maturidade | Prioridade |
|---|---|---|---|---:|
| `modal` | Dialog/overlay e gerenciamento de foco. | Dedicada; contrato/a11y. | Madura | Crítica |
| `modal-card` | Composição visual de modal. | Dedicada; core. | Estável | Média |
| `tooltip` | Tooltip responsivo. | Dedicada; core. | Estável, revisar mobile | Média |
| `pagination` | Paginação acionável. | Dedicada; core. | Estável | Alta |
| `skip-link` | Navegação rápida. | Cobertura em primitives/docs. | Estável | Alta |
| `focus-navigation` | Detecção de navegação por teclado. | Primitives/docs; teste indireto. | Estável | Alta |
| `form-error-navigation` | Foco no primeiro erro após submit. | Primitives/docs; teste indireto. | Promissora | Alta |
| `accessibility-preferences` | Painel e partes de preferências. | Stories dedicadas/parts/a11y. | Evoluindo | Crítica |

### 6.5 Documentos, arquivos, QR e código de barras

| Componente | Papel/API | Story/teste | Maturidade | Prioridade |
|---|---|---|---|---:|
| `document-item` | Item de documento e ações. | Dedicada; core/visual. | Estável | Alta |
| `barcode` | Boleto/código de barras. | Story de Boleto; documentos. | Estável | Média |
| `qr-code` | QR com opções visuais e nome acessível. | Documentação agrupada; cobertura indireta. | Nova | Crítica |
| `file-upload` | `FileDropzone`, `FileList`, progresso e validação. | Documentação agrupada; gaps de stories/testes isolados. | Parcial | Crítica |
| `file-viewer` | Visualização de URL/Blob/texto/JSON/imagem/PDF. | Documentação agrupada; precisa cobertura própria. | Nova/parcial | Crítica |

### 6.6 Dados e visualização

| Componente | Papel/API | Story/teste | Maturidade | Prioridade |
|---|---|---|---|---:|
| `table` | Tabela genérica, filtros, ordenação, paginação e mobile. | Dedicada; contrato/visual/a11y. | Madura, grande | Crítica |
| `chart` | Apex charts e componentes de dados. | Dedicadas; chart, tema e visual. | Estável, dependência pesada | Média |

## 7. Hooks, utilitários, providers e contextos

### 7.1 Hooks públicos/centrais

| Hook | Função | Observações |
|---|---|---|
| `useBreakpoint` | Breakpoint baseado na viewport. | Começa em mobile e observa resize; pode ser estabilizado com `matchMedia`/`useSyncExternalStore` para SSR e menos renders. |
| `useContainerBreakpoint` | Breakpoint baseado em `ResizeObserver`. | É a direção correta para tabelas e layouts; revisar dependência de objetos `thresholds` recriados. |
| `useHighContrastPreference` | Observa `data-contrast` no document root. | Útil, mas depende da aplicação externa do atributo; não é um sistema completo de preferências. |

### 7.2 Utilitários

| Utilitário | Uso | Recomendação |
|---|---|---|
| `accessibility.ts` | Helpers de acessibilidade. | Expandir apenas com APIs agnósticas e documentadas. |
| `chart-theme.ts` | Tema/contraste para Apex. | Manter no subpath de charts para não contaminar o core. |
| `floating-layer.ts` | Camada/posicionamento. | Consolidar contratos de overlay e portalização. |
| `floating-panel-position.ts` | Posicionamento de painel flutuante. | Compartilhar entre select, filtros e DatePicker após estabilizar foco/escape. |
| `optional-value.ts` | Normalização de valor opcional. | Baixo risco; pode permanecer interno se não houver consumidor. |
| `resolve-status-appearance.ts` | Normalização e mapeamento de status. | Tornar o mapa injetável; reduzir vocabulário de domínio no core. |

### 7.3 Providers e contextos

O DS possui `PortalIconProvider`/`IconProvider`, mas não possui um provider geral de tema ou acessibilidade. Isso é aceitável para evitar imposição de persistência, tenant e storage, porém deixa cada portal responsável por uma parte crítica do contrato visual.

Recomendação: adicionar, em uma camada opcional, um provider neutro de preferências que apenas leia/escreva um modelo controlável e aplique atributos. Persistência, sessão, feature flag e tenant devem continuar no produto.

## 8. Auditoria de APIs públicas e nomenclatura

### 8.1 API pública atual

Os subpaths públicos são:

```text
@aspprev/versi-ds
@aspprev/versi-ds/core
@aspprev/versi-ds/forms
@aspprev/versi-ds/documents
@aspprev/versi-ds/overlays
@aspprev/versi-ds/charts
@aspprev/versi-ds/countries
@aspprev/versi-ds/styles.css
@aspprev/versi-ds/themes.css
```

O agrupamento é coerente e evita deep imports. Os testes de entrypoints e public API são uma salvaguarda importante.

### 8.2 Pontos positivos

- Os portais consumidores usam subpaths, principalmente o ASPPrev.
- Há tipos exportados para as APIs mais complexas.
- CSS é publicado por entrypoint dedicado.
- Dependências opcionais de charts e countries são separadas dos componentes básicos.
- O pacote define `files` para limitar o conteúdo publicado.

### 8.3 Melhorias necessárias

- Definir uma API canônica para cada alias e marcar aliases históricos como deprecated antes de remoção.
- Evitar novos nomes com prefixo `I` em interfaces públicas quando o pacote já usa estilos mistos; escolher uma convenção.
- Harmonizar `disabled` e `isDisabled`; o `DatePicker` expõe os dois conceitos.
- Harmonizar controlled/uncontrolled APIs. `InputSelect`, `DatePicker`, OTP e upload devem declarar claramente a fonte de verdade.
- Evitar APIs que exigem Formik em componentes que poderiam aceitar `value`, `onChange`, `onBlur`, `name` e `error` genericamente.
- Documentar quais callbacks são de evento DOM e quais são callbacks de valor semânticos.
- Considerar exports `package.json` com condições explícitas de `types`, `import` e `default` se a estratégia de build evoluir.

## 9. Auditoria detalhada por componente e família

### 9.1 Button

**Estado:** API madura com variantes flat/outline/plain, cores, tamanhos, largura, ícones e loading.

**Pontos fortes:** usa botão nativo, expõe `aria-busy`, permite `loadingLabel`, preserva atributos nativos e tem testes de core/visual.

**Riscos:** mapas visuais e de classes estão próximos da implementação; consumidores podem depender de combinações não documentadas. O contrato de loading deve garantir que o nome acessível não desapareça.

**Recomendação:** manter como primitive estável; documentar matriz de variantes e adicionar teste explícito de nome acessível em loading, disabled e ícones-only.

### 9.2 Input e TextArea

**Estado:** maduros e muito usados, porém com acoplamento significativo a Formik e máscaras.

**Pontos fortes:** label, helper, erro, prefix/suffix, mensagens e estados visuais já fazem parte do contrato.

**Riscos:** parsing/máscara, integração de formulário e markup visual ficam juntos. Isso torna a API extensa e dificulta uso com React Hook Form ou estado próprio.

**Recomendação:** separar uma base `Field`/`InputControl` agnóstica de formulário de adapters Formik. Manter máscaras como utilitários ou plugins explícitos. O adapter não deve ser necessário para renderizar um input acessível.

### 9.3 InputSelect e MultiSelect

**Estado:** usados nos produtos e ricos em comportamento: busca, opções customizadas, portal e posicionamento.

**Riscos:** uso de Formik dentro do componente, semântica de `onChange` próxima de evento nativo em uma API que é seleção semântica, controlled value pouco evidente e complexidade de foco/escape/outside click.

**Recomendação:** expor contrato controlado de valor, separar combobox/listbox headless da integração Formik e compartilhar `floating-panel-position`. Testar teclado, leitura de opção selecionada, escape, foco após fechar e conteúdo em 200%/400%.

### 9.4 DatePicker

**Estado:** um dos componentes mais importantes do pacote, já com seleção de dia, mês e ano via `selectionMode`, `navigationVariant`, min/max, erro e navegação por teclado.

**Pontos fortes:** cobre a necessidade de seleção por ano e possui atenção a ARIA e controles de navegação.

**Riscos:** implementação grande, múltiplos formatos de data, `value` Date/string/null, `disabled` e `isDisabled`, parsing e posicionamento na mesma unidade. A seleção de ano deve ser testada em todos os temas e escalas de fonte.

**Recomendação:** dividir em:

1. `DateField`/input e parsing;
2. `CalendarPopover` e posicionamento;
3. `CalendarNavigation`;
4. `CalendarGrid`/seleção de dia;
5. `MonthYearSelector`;
6. adapter de formulário.

Preservar `DatePicker` como façade. A seleção de ano deve ter foco determinístico, nome acessível, limite de min/max e anúncio de mudança quando necessário.

### 9.5 OtpCodeInput

**Estado:** componente prioritário, já presente no DS e com story/teste visual.

**Pontos fortes:** valor agregado e array de valores, paste, teclado, autoFocus, máscara, erro, helper, label e ref com `focus`/`clear`.

**Riscos:** `RegExp` global/sticky pode manter estado entre chamadas de `test`; `onComplete` precisa de contrato explícito para não disparar repetidamente em cada render/edição; a diferença entre controlado e não controlado precisa estar documentada.

**Recomendação:** manter a API, corrigir/evitar estado mutável de RegExp, especificar `onComplete`, incluir `aria-describedby`, anunciar erro e conclusão sem depender apenas de cor. O adapter Formik deve ser separado do primitive.

### 9.6 QRCode

**Estado:** primitive genérico baseado em `qrcode`, com `ariaLabel`, `description`, cores, tamanho e nível de correção.

**Pontos fortes:** não acopla conteúdo a portal, valida contraste básico e usa role de imagem.

**Riscos:** valor inválido fica em estado de geração sem uma mensagem de erro pública; o fallback de contraste não cobre todos os formatos CSS; a cobertura de story/teste não é claramente dedicada. O portal ainda possui um QR técnico baseado em `qrcode.react` com nome acessível insuficiente.

**Recomendação:** adicionar story dedicada, testes de valor inválido, loading/error, descrição, contraste e redução de movimento; documentar se o output é canvas ou SVG e padronizar a migração do wrapper do portal.

### 9.7 Upload de arquivos

**Estado:** o DS possui `FileDropzone`, `FileList` e `FileUploadProgress`, mas o contrato ainda é mais visual que um fluxo completo de upload.

**Pontos fortes:** validação de tipo/extensão, múltiplos arquivos, tamanho, aceitos/rejeitados e composição por partes.

**Riscos:** falta um contrato controlado completo para lista e estado de cada arquivo; input/nome/id/labels acessíveis são limitados; a separação entre seleção local, validação, upload e remoção não é suficientemente explícita.

**Recomendação:** oferecer primitives controladas:

- `FileDropzone` para seleção e drag-and-drop;
- `FileList` para representação;
- `FileUploadItem` para estado individual;
- `FileUploadProgress` para progresso;
- `createFileValidator`/tipos de erro puros;
- callbacks `onFilesSelected`, `onReject`, `onRemove`, `onRetry`;
- sem `fetch`, Formik obrigatório, `alert`, confirmação de negócio ou armazenamento interno imposto.

O transporte, retry com API, persistência, nome do campo e regra de documento obrigatório permanecem nos portais.

### 9.8 FileViewer

**Estado:** primitive novo/parcial para URL, Blob, texto, JSON, imagem e PDF.

**Pontos fortes:** aceita fontes variadas, fallback, loading/error e download.

**Riscos:** iframe PDF sem contrato de sandbox, eventos de erro incompletos em iframe/imagem, gestão de object URL e concorrência assíncrona exigem cobertura; downloads autenticados e proxy não devem ser escondidos no DS.

**Recomendação:** documentar claramente que o DS renderiza uma fonte já resolvida. Adicionar `onLoad`, `onError`, `title` obrigatório para iframe quando aplicável, estratégia de revogação de object URL, fallback textual acessível, estado de erro sem depender de cor e opção de renderização segura. Fetch autenticado, proxy, sessão e expiração ficam no produto.

### 9.9 StatusBadge e DomainStatusBadge

**Estado:** `StatusBadge` é uma boa primitive; `DomainStatusBadge` adiciona resolução por domínio.

**Pontos fortes:** tons e appearances explícitos, empty/placeholder, normalização de acentos e API simples.

**Riscos:** o arquivo `resolve-status-appearance` conhece estados de beneficiário, documento, assinatura, pagamento, protocolo e solicitação. Isso aproxima o core de vocabulário dos produtos; novos domínios podem gerar alterações frequentes e inesperadas.

**Recomendação:** manter `StatusBadge` no core e transformar o resolver em mapa configurável/injetável. Os produtos podem fornecer mapas de domínio. Se o mapa atual for mantido no DS, documentá-lo como conjunto compartilhado de convenções e cobrir todos os status com tabela de decisão.

### 9.10 Table e MobileCardTable

**Estado:** família madura e central, com overflow `fit`/`adaptive`/`scroll`, filtros, paginação, sticky header, densidade, variantes e tabela em cards.

**Pontos fortes:** usa `table` real na versão tabular, `scope`, `aria-sort`, labels acessíveis, live regions de paginação, modo compacto e suporte à largura do container.

**Riscos:** `TableView` concentra filtro/posicionamento/renderização/paginação; `MobileCardTable` cria uma representação paralela com semântica de lista e `tabIndex=0` por item, que precisa de validação para não produzir foco redundante. A lógica ainda mistura viewport (`useBreakpoint`) e largura do container. Há strings corrompidas em algumas saídas observadas (`até`, `página`), que devem ser verificadas na origem/encoding.

**Recomendação:** extrair modelo headless de colunas, filtros, ordenação e paginação; manter renderers separados para tabela, adaptive compact e cards. Preferir `useContainerBreakpoint` quando o layout depende da largura disponível. Garantir que filtros tenham foco inicial, escape, retorno de foco e anúncio de alteração.

### 9.11 Acessibilidade e navegação

**Estado:** `FocusNavigationMode`, `FormErrorNavigation`, `SkipLink`, painel de preferências e tokens de contraste/movimento formam uma boa fundação.

**Pontos fortes:** foco visível condicional a teclado, navegação ao primeiro erro, respeito a reduced motion, MutationObserver para atributos e partes reutilizáveis do painel.

**Riscos:** aplicação/persistência de preferências ainda está no portal; `findFirstInvalidField` usa posição visual para ordenar campos e pode divergir da ordem DOM em layouts complexos; a navegação por erro depende da mutação de `aria-invalid`; faltam contratos automatizados para foco de todos os overlays.

**Recomendação:** documentar o ciclo de vida das preferências, fornecer utilitários neutros para aplicar atributos e garantir testes de teclado, screen reader semantics, zoom, high contrast e reduced motion.

## 10. Comparação de padrões entre os portais

| Padrão | RPPS | ASPPrev | Decisão recomendada |
|---|---|---|---|
| Button/Input/Form | Cópias locais amplas. | Usa DS por subpaths, com wrappers. | Migrar RPPS e manter adapters de formulário no produto/adapter. |
| OTP | Cópia local de baixo nível por índice. | Também mantém cópia local. | Padronizar no `OtpCodeInput` do DS e criar adapter de formulário separado. |
| QR | `technical-qr-code` com `qrcode.react`, preto/branco. | `TechnicalQrCode` semelhante. | Usar `QRCode` do DS com label/description e documentar formato. |
| Upload | Uploader local com Context, Formik, alerta e progresso simulado. | Uploader local muito semelhante, usando Button/Modal do DS. | Compartilhar primitives/validação; manter transporte e regras de negócio locais. |
| FileViewer | Viewer local com preview e object URL. | Viewer local com proxy autenticado, sessão e Next Image. | Usar DS para renderização genérica; manter fetch/proxy/auth no produto. |
| Status | Cópias locais de StatusBadge/DomainStatusBadge/StatusCard/Tag. | Wrappers locais sobre DS. | DS fornece visual; mapas/status-card permanecem adapters de domínio. |
| DatePicker | Cópia local e custom wrapper. | Usa DS e wrappers de formulário. | Uma API canônica no DS, sem duplicação local. |
| Tabelas | `FilterableTable`, `MobileCardTable` e variantes locais. | Usa `Table`/`MobileCardTable` e lógica de consumo. | Evoluir primitives de tabela; filtros de negócio permanecem no portal. |
| Preferências | Não evidenciado como adoção centralizada. | Implementação completa de persistência, tenant e sessão. | DS pode fornecer modelo/aplicação genérica; gating e storage permanecem ASPPrev. |
| Responsividade | `useContentBreakpoint` e conteúdo local. | hooks/utilitários locais e DS. | Consolidar contrato container-aware no DS, não o shell do portal. |

## 11. Duplicações e oportunidades de abstração

### 11.1 Upload — maior oportunidade transversal

Os dois portais possuem uploaders com a mesma forma geral: seleção, drag-and-drop, validação, lista, remoção e progresso. A implementação atual inclui lógica de negócio que não deve ir para o DS: nome fixo de campo `anexarArquivo`, `setFieldValue`, confirmação de remoção, categoria de documentos, transporte, sessão, API e regras do formulário.

O DS deve compartilhar a mecânica genérica, não o fluxo de negócio. A melhor forma é um conjunto de primitives controladas e uma função pura de validação. O produto pode compor o conjunto em seu próprio `FileUploader`.

### 11.2 Acessibilidade — separar capacidade de UI de política

O painel do DS já foi dividido em partes. O portal ASPPrev possui a camada de política que resolve sistema, storage, tenant, sessão e feature flags. Não se deve mover essa camada para o DS. A oportunidade é expor um modelo neutro e funções de aplicação/serialização opcionais, mantendo o provider/persistência do produto.

### 11.3 OTP e QR — convergência de implementação

Há uma necessidade real compartilhada e duas implementações locais. O DS já possui as primitives adequadas. A migração deve ser acompanhada de testes de integração em cada portal para preservar callbacks, máscara, nome acessível e formato visual.

### 11.4 Status — primitive comum, mapa de domínio local

O visual e os estados podem ser centralizados. `StatusCard`, `Tag`, status de benefício, PEP, requerimento e fluxos de assinatura são composição de produto. O core deve aceitar um resolver configurável em vez de crescer indefinidamente com estados específicos.

### 11.5 Responsive content e breakpoints

O `useContentBreakpoint` do RPPS demonstra que viewport não é suficiente. O DS já possui `useContainerBreakpoint`, mas precisa de API estável, documentação e integração com componentes que tenham largura disponível limitada. Um `ContentContainer` visual só deve ser criado se houver evidência de markup e comportamento repetidos nos dois produtos; o shell de portal não deve ser absorvido.

## 12. O que deve permanecer nos produtos

Não devem entrar no DS:

- chamadas de API, fetch autenticado, proxy de arquivos ou tratamento de sessão;
- autenticação, segundo fator como fluxo de negócio, recuperação e expiração de sessão;
- header, SideMenu, shell específico, rotas e navegação do portal;
- modal de PEP e regras de declaração/negócio;
- mapas de status exclusivamente de benefício, requerimento ou domínio local, salvo se explicitamente compartilhados;
- nomes de campos Formik e regras de obrigatoriedade de documentos;
- feature flags, tenant, permissões e habilitação condicional de acessibilidade;
- regras de upload por tipo de requerimento, limite de negócio ou endpoint;
- formatação e parsing específicos de um backend;
- layouts de páginas e cards de uma jornada específica.

## 13. Acessibilidade

### 13.1 Pontos fortes

- Uso de elementos nativos em Button, inputs, tabela e controles.
- Labels, helper text e estados de erro já fazem parte de várias APIs.
- Focus ring baseado em navegação por teclado.
- Skip link e navegação automática para erro de formulário.
- `aria-sort`, `scope`, regiões live e nomes acessíveis nas tabelas.
- Suporte a alto contraste, tema escuro, escala de fonte e movimento reduzido.
- OTP com suporte a paste e navegação por teclado.
- Painel de acessibilidade dividido em partes reutilizáveis.

### 13.2 Lacunas prioritárias

1. Testar toda a matriz de componentes prioritários em teclado, 200% e 400%, high contrast, dark e reduced motion.
2. Garantir foco inicial e retorno de foco em Modal, DatePicker, Select, filtros de tabela e FileViewer.
3. Tornar upload acessível sem depender do drag-and-drop: botão/label claro, input nomeado, mensagens de rejeição anunciadas e estado por arquivo.
4. Definir nome, descrição e anúncio de erro do QR.
5. Garantir que PDF/iframe tenha título e tratamento de falha.
6. Corrigir a lacuna de `data-focus-emphasis`/`data-link-emphasis` ou remover esses campos do contrato até que tenham efeito real.
7. Revisar elementos `tabIndex=0` em `MobileCardTable` para evitar focos redundantes quando o conteúdo já possui controles.
8. Evitar que filtros e menus portais desapareçam fora da viewport em zoom alto.
9. Verificar contraste real de cada preset e seus estados hover/focus/disabled, não só tokens base.
10. Validar textos e encoding em mensagens de tabela e paginação.

### 13.3 Matriz de validação recomendada

| Cenário | Componentes mínimos |
|---|---|
| Teclado completo | Button, Input, Select, MultiSelect, DatePicker, OTP, Modal, Tooltip, upload, tabela/filtros, paginação |
| Leitor de tela | Formulários, OTP, QR, upload, FileViewer, status, tabela, erro de formulário |
| Zoom 200% | FormLayout, Modal, DatePicker, Select, upload, tabela |
| Zoom 400% | DatePicker, OTP, upload, tabela adaptive, FileViewer |
| Contraste alto | Button, checkbox/radio, status, tabela, QR, charts, foco |
| Movimento reduzido | Modal, DatePicker, MobileCardTable, loading, tooltip, FileViewer |
| Mobile/tablet/desktop | Tabela, filtros, DatePicker, tooltip, upload, conteúdo com container |

## 14. Storybook, testes e documentação

### 14.1 Estado atual

O pacote possui stories de foundations, temas, acessibilidade, formulários, tabela, charts, status, documentos e componentes prioritários. Há 60 arquivos de stories, mas alguns componentes só aparecem em stories agrupadas. Em particular, upload, FileViewer e QRCode merecem páginas dedicadas; FocusNavigation, FormErrorNavigation, SkipLink e PageTabs também precisam de exemplos de uso mais explícitos.

Os testes abrangem contratos públicos, componentes de prioridade, entrypoints, tokens/temas, visual, acessibilidade e piloto. O conjunto é acima da média para um pacote interno, mas a cobertura está mais concentrada nos componentes já priorizados do que na matriz completa de APIs.

### 14.2 Melhorias de documentação

- Uma página de “como escolher o componente” para cada família.
- API canônica versus aliases legados.
- Guia de integração sem Formik e com Formik.
- Guia de upload separando seleção, validação, transporte e persistência.
- Guia de FileViewer com fonte já resolvida versus fonte autenticada no produto.
- Guia de QR acessível.
- Guia de tabela: `table`, `adaptive`, `scroll`, `MobileCardTable` e container breakpoint.
- Guia de acessibilidade com responsabilidades do DS e do consumidor.
- Matriz de compatibilidade React, Node, browser e SSR.
- Exemplos de migração do componente local para o DS nos dois portais.

### 14.3 Storybook online

O endereço informado para a publicação é `https://versi-design-system.vercel.app/`. O Storybook deve tratar IDs de stories como contrato de build: referências antigas, como `design-system-accessibilityprimitives--docs`, precisam ser removidas ou atualizadas quando o nome/ID da story mudar. A auditoria recomenda um smoke test que valide os IDs publicados e a renderização das páginas críticas após cada build.

## 15. Build, dependências e empacotamento

### 15.1 Dependências

O pacote usa `class-variance-authority`, `classnames`, `qrcode` e `react-icons` como dependências diretas. ApexCharts, React, Formik, date-fns, jsbarcode e react-number-format aparecem como peers conforme a família consumida.

Isso é razoável para manter o core menor, mas o contrato de peers precisa continuar documentado por subpath. O consumidor deve saber quais imports exigem Formik, charts ou bibliotecas de input.

### 15.2 Tree shaking e root export

Os subpaths favorecem tree shaking e isolamento de dependências. O root exporta quase tudo por compatibilidade, o que mantém uma API conveniente, mas pode incentivar imports indiscriminados. Recomenda-se:

- manter root por compatibilidade;
- orientar novos exemplos para subpaths;
- medir bundle por entrypoint;
- evitar importar charts/countries no core;
- considerar um relatório de tamanho por cenário consumidor.

### 15.3 Tipos e ESM

O pacote é ESM-only com tipos gerados em `dist`. Isso deve permanecer documentado. Antes de uma mudança major, validar consumidores Next/Vite e ferramentas que ainda esperam CommonJS. Não há justificativa para adicionar deep imports ou expor caminhos internos.

### 15.4 Scripts e governança

Existem scripts para build, clean, tokens generate/check, size, governance, security, package, Storybook, testes unitários/visuais, flags e piloto. A disciplina de executar toda essa matriz deve ser mantida no CI e registrada no changelog/release checklist.

## 16. Problemas técnicos classificados

| Problema | Evidência | Impacto | Severidade |
|---|---|---|---:|
| Dependência do DS não usada no RPPS | `package.json` declara o pacote, mas não há imports em `src`. | Divergência e falsa sensação de integração. | Crítica |
| Cópias locais extensas | RPPS replica várias famílias; ASPPrev mantém OTP/QR/upload/viewer/status wrappers. | Correções duplicadas e APIs divergentes. | Alta |
| Formik acoplado em primitives | Input/InputSelect e uploaders locais. | Baixa reutilização e maior custo de migração. | Alta |
| DatePicker grande e API duplicada | `disabled`/`isDisabled`, parsing e UI na mesma implementação. | Manutenção e compatibilidade. | Alta |
| Tabela com responsabilidades concentradas | TableView reúne filtros, layout, paginação e responsive. | Dificulta evolução e acessibilidade. | Alta |
| Preferências parcialmente implementadas no DS | Portal usa `data-focus-emphasis`/`data-link-emphasis` sem CSS correspondente observado. | Opção comunicada ao usuário pode não ter efeito. | Alta |
| Upload sem primitive headless completa | Dois produtos têm lógica paralela. | Bugs e inconsistência em documentos. | Alta |
| FileViewer com riscos de lifecycle/iframe | object URLs, erro de iframe/imagem e sandbox. | Falha de memória, UX e segurança de conteúdo. | Alta |
| QR local sem a11y consistente | wrappers técnicos pretos/brancos e sem nome explícito. | Informação inacessível. | Alta |
| Aliases públicos | Vários pares para o mesmo conceito. | DX e migrações ambíguas. | Média |
| Viewport versus container | Hooks e tabelas misturam critérios. | Layout incorreto em shell com sidebar. | Média |
| Stories agrupadas | Upload/FileViewer/QRCode não possuem cobertura dedicada clara. | Descoberta e regressão visual menores. | Média |
| Strings/encoding em tabela | Saída observada com `até` e `página`. | Problema visível e potencial acessibilidade. | Média |

## 17. Proposta de arquitetura futura

```text
@aspprev/versi-ds
├── foundations
│   ├── tokens
│   ├── themes
│   ├── motion/focus/accessibility CSS
│   └── content-width/breakpoint contract
├── primitives
│   ├── Field / InputControl
│   ├── Overlay / FloatingPanel
│   ├── Focus / LiveRegion / ErrorSummary helpers
│   ├── File primitives
│   ├── Table model primitives
│   └── Status visual primitive
├── composed components
│   ├── DatePicker façade
│   ├── Select/MultiSelect
│   ├── OtpCodeInput
│   ├── QRCode
│   ├── FileViewer
│   ├── Table renderers
│   └── AccessibilityPreferencesPanel
├── optional adapters
│   ├── Formik
│   ├── ApexCharts
│   └── country data
└── public subpaths
```

A regra de dependência recomendada é: foundations não dependem de produtos; primitives dependem apenas de foundations; componentes compostos podem depender de primitives; adapters de Formik/charts/countries ficam em subpaths; produtos podem compor adapters de negócio sem fazer o caminho inverso.

## 18. Novos componentes e extensões recomendados

| Proposta | Problema/origem | Prioridade | Complexidade | Camada |
|---|---|---:|---:|---|
| `FileUploadItem`/`FileUploadList` controlados | Uploaders duplicados nos dois portais. | P0 | Média | Primitive |
| `createFileValidator` e tipos de rejeição | Validação repetida e mensagens inconsistentes. | P0 | Baixa | Utility |
| `FileUploadController` headless opcional | Estado de seleção/retry/progresso sem impor transporte. | P1 | Alta | Headless |
| `FileViewer` hardening | Necessidade compartilhada de preview; portal tem proxy/auth. | P0 | Média | Composto |
| `QRCode` error/loading e story dedicada | QR local sem contrato a11y. | P0 | Baixa | Componente |
| `OtpCodeInput` adapter de formulário | Dois portais mantêm OTP local. | P0 | Baixa | Adapter |
| `AccessibilityPreferences` model/apply utilities | Portal ASPPrev implementa persistência própria. | P1 | Média | Utility/provider opcional |
| `ContentContainer` ou contrato de largura | Responsividade baseada em conteúdo aparece no RPPS. | P1 | Média | Foundation/composição |
| Table headless model | FilterableTable local e TableView grande. | P1 | Alta | Headless |
| Resolver de status injetável | Mapas de domínio no core. | P1 | Média | Utility |
| `FocusScope`/`LiveRegion` públicos | Repetição de requisitos de foco/anúncio. | P2 | Média | Primitive |

Não recomendamos criar novos componentes visuais duplicados para `EmptyState`, `Tag`, `StatusCard`, `TechnicalQrCode` ou `FileUploader` antes de consolidar as primitives existentes.

## 19. Candidatos a split, merge e depreciação

### Splits recomendados

- `Input` em controle visual, máscara e adapter de formulário.
- `InputSelect` em combobox/listbox headless, floating layer e adapter de formulário.
- `DatePicker` em input, calendário, seleção e adapter.
- `Table` em modelo de dados, filtros/ordenação, paginação e renderers.
- Upload em seleção, validação, item/lista, progresso e controller opcional.
- Preferências em partes visuais, modelo/aplicação e integração de persistência.

### Merges ou façade canônica

- `PhoneInput` e `InputPhone` devem convergir para um nome canônico.
- `SelectCountry` e `CountrySelect` devem convergir para um nome canônico.
- `SelectMulti` e `MultiSelect` devem convergir para um nome canônico.
- `Datepicker` e `DatePicker` devem convergir para `DatePicker`.
- `Checkbox` e `CheckBox` devem convergir para `Checkbox`.
- `MobileCardTable` não deve ser mesclado visualmente com `Table`, mas pode compartilhar o modelo headless.
- `StatusBadge` e `DomainStatusBadge` não devem ser mesclados; o segundo deve receber resolver injetável.

### Estratégia de compatibilidade

Manter aliases por pelo menos uma major, emitir aviso de depreciação em documentação/types quando possível e oferecer codemods ou exemplos de migração. Não remover exports sem checar os dois portais.

## 20. Roadmap priorizado

### Quick wins — alto impacto e baixo esforço

1. Corrigir/validar encoding das mensagens de tabela.
2. Criar stories dedicadas para `QRCode`, `FileDropzone`, `FileList`, `FileUploadProgress` e `FileViewer`.
3. Adicionar stories de foco, erro e zoom para OTP, DatePicker, upload e tabela.
4. Documentar a diferença entre `useBreakpoint` e `useContainerBreakpoint`.
5. Documentar subpaths como caminho preferencial e root como compatibilidade.
6. Verificar o contrato de `data-focus-emphasis`/`data-link-emphasis` e implementá-lo ou retirar sua promessa.
7. Criar uma matriz pública de aliases e APIs canônicas.
8. Criar um teste de smoke para IDs e páginas críticas do Storybook publicado.

### Curto prazo — 1 ciclo

1. Integrar `OtpCodeInput` nos dois portais, preservando adapters locais.
2. Integrar `QRCode` acessível nos wrappers técnicos.
3. Publicar tipos/validação genérica de upload e migrar a apresentação local.
4. Endurecer `FileViewer` com lifecycle, erros de mídia/PDF e contrato de source.
5. Criar adapter de formulário para primitives sem Formik obrigatório.
6. Padronizar `disabled`, `isDisabled`, controlled value e callbacks semânticos.
7. Adicionar testes de teclado, Axe e visual para os novos fluxos.

### Médio prazo — 2 a 3 ciclos

1. Extrair modelo headless de tabela e filtros.
2. Dividir internamente o DatePicker mantendo façade compatível.
3. Formalizar `ContentContainer`/content width e ampliar uso de container breakpoint.
4. Tornar o resolver de status configurável.
5. Oferecer camada opcional de aplicação de preferências de acessibilidade.
6. Migrar o RPPS gradualmente para os entrypoints públicos e eliminar cópias duplicadas por domínio.

### Longo prazo

1. Deprecar aliases históricos em uma major planejada.
2. Publicar matriz de compatibilidade e tamanhos por subpath.
3. Criar conformance tests compartilhados que possam ser executados pelos dois portais.
4. Evoluir para uma arquitetura de primitives/headless + componentes compostos + adapters opcionais.
5. Consolidar governança de tokens, temas, mapas de status e contratos de acessibilidade.

## 21. Matriz impacto x esforço

|  | Baixo esforço | Médio esforço | Alto esforço |
|---|---|---|---|
| Alto impacto | Stories dedicadas; encoding; docs de breakpoints; lacuna de focus/link emphasis; aliases | OTP/QR nos portais; upload validation; FileViewer hardening; adapters de formulário | Migração do RPPS; table headless; split estrutural do DatePicker |
| Médio impacto | Matriz de aliases; smoke test Storybook; docs de API | Resolver de status injetável; content width; testes de zoom | Provider/modelo completo de preferências; conformance suite |
| Baixo impacto | Melhorias de exemplos isolados | Refino visual de componentes estáveis | Mudança ampla de build sem evidência de problema |

## 22. Plano de integração recomendado para os portais

### ASPPrev

1. Atualizar a dependência para a versão alvo somente após validar os contratos públicos.
2. Substituir `TechnicalQrCode` pelo `QRCode` com `ariaLabel`/description.
3. Substituir o input local de OTP pelo DS e preservar a integração de formulário em wrapper local.
4. Migrar a camada visual do uploader para primitives do DS; manter proxy, sessão, Formik e regras de documento.
5. Usar `FileViewer` para renderização e manter `fileProxySafe`, expiração de sessão e download autenticado no produto.
6. Mapear as preferências locais para o modelo do DS e validar focus/link emphasis.

### RPPS

1. Inventariar cada import local e mapear para entrypoint público.
2. Começar por OTP, QR, upload, FileViewer, status e DatePicker.
3. Criar uma camada temporária de adapters locais para minimizar impacto nas páginas.
4. Remover cópias somente quando os testes de cada jornada passarem.
5. Manter header, SideMenu, PEP, auth, API e regras de formulário no RPPS.
6. Remover a dependência declarada não utilizada ou concluir a adoção; manter ambos os estados indefinidos não é recomendável.

## 23. Checklist de release futuro

Antes de uma nova versão:

- [ ] API canônica e aliases revisados.
- [ ] Changelog com breaking changes, depreciações e migração.
- [ ] Stories dedicadas de todos os componentes novos.
- [ ] Testes unitários, interação, visual e Axe.
- [ ] Teclado, foco, leitor de tela, contraste, zoom 200/400 e reduced motion.
- [ ] Mobile/tablet/desktop e container width.
- [ ] Token generate/check e validação de temas.
- [ ] Typecheck, lint, testes, build, governança, segurança, tamanho e package check.
- [ ] Tarball local criado.
- [ ] Tarball instalado em RPPS e ASPPrev.
- [ ] Smoke test dos entrypoints públicos e CSS.
- [ ] Revisão de dependências e peers.
- [ ] Revisão final sem publicação automática.

## 24. Conclusão

O Versi Design System está em uma posição boa para evoluir, mas precisa transformar componentes já existentes em contratos confiáveis e efetivamente adotados pelos dois produtos. O trabalho de maior retorno não é adicionar mais uma camada visual: é eliminar a bifurcação do RPPS, convergir OTP/QR/upload/FileViewer, separar primitives de adapters, estabilizar DatePicker e tabela e fechar as lacunas de acessibilidade e conteúdo responsivo.

O próximo marco recomendado é uma release de convergência com foco em integração e acessibilidade. A publicação deve ocorrer somente após tarball local instalado nos dois portais, execução da matriz completa de qualidade e revisão final da API pública.
