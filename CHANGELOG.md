# Changelog

## 0.4.4 — 2026-09-24 — evolução de layout, contratos e Storybook

### Corrigido

- `PageHeading` e `PageTabsHeader` passaram a reservar espaço flexível para títulos e largura necessária para abas, evitando quebra indevida em tablet/desktop.
- Títulos textuais longos usam truncamento responsivo com o conteúdo completo disponível no atributo `title`; títulos compostos continuam sob controle do consumidor.
- `FileViewer` passou a aceitar source assíncrono, mantendo loading, erro e fallback no componente visual.

### Documentação

- Adicionado o plano de evolução incremental em `docs/plano-evolucao-versi-ds-rpps.md`.
- `PageTabsHeaderProps` passou a ser exportado pelos entrypoints raiz e `core`.
- `InputFormatter`, tipos de estados públicos e rejeições estruturadas de arquivos foram documentados nos entrypoints especializados.

## 0.4.3 — 2026-09-23 — largura de formulários e controle de bandeiras

### Alterado

- Controles de formulário passaram a manter `w-full` e `min-w-0` nos wrappers internos, incluindo `InputPhone` em grids, flex containers e colunas responsivas.
- Adicionada a prop opcional `showFlags` a `InputPhone`/`PhoneInput` e `SelectCountry`; o padrão permanece `true` e `false` remove a bandeira sem reservar espaço.
- `SelectMulti` passou a aplicar o `className` recebido ao wrapper público do campo.

### Compatibilidade

- Nenhum formato de valor, helper de telefone, alias deprecated ou contrato de teclado/acessibilidade foi removido.

## 0.4.2 — 2026-09-23 — correção das bandeiras nos seletores

### Corrigido

- Corrigida a resolução browser das bandeiras para que cada código ISO-2 use seu próprio asset, evitando que todos os países exibam a mesma bandeira.
- Adicionado teste de regressão para o catálogo browser consumido por `SelectCountry` e `InputPhone`.

### Compatibilidade

- Nenhuma API pública ou regra de negócio foi alterada.

## 0.4.1 — 2026-09-22 — redução do bundle de países

### Alterado

- `core` e `forms` não carregam o catálogo completo de bandeiras na entrada inicial.
- `SelectCountry` e `InputPhone` carregam as bandeiras por 20 chunks ESM internos, sem CDN, HTTP externo ou dependência nova.
- O maior chunk carregável pelo consumidor ficou abaixo de 333 KB, preservando o limite de 750 KB.

### Compatibilidade

- Mantidos os exports públicos, APIs síncronas e assinaturas de `COUNTRY_OPTIONS`, `PHONE_COUNTRY_OPTIONS`, `getCountryOptions`, `getCountryFlagUrl`, `filterCountryOptions`, `SelectCountry`, `InputPhone`, `PhoneInput`, `parsePhonePayload` e `buildPhonePayload`.
- O entrypoint `/countries` mantém o comportamento síncrono completo. Nos componentes, o SSR usa placeholder para bandeiras padrão até a hidratação; `flags.svg` customizado continua imediato.

### Validação

- Testes unitários, SSR, Playwright/Axe, Next.js e Vite aprovados sem requests externos ou rota `/flags`.

### Bundle e países na 0.4.0

- `core` e `forms` usam metadados leves de países e não carregam o catálogo completo de bandeiras na entrada inicial.
- `SelectCountry` e `InputPhone` carregam as bandeiras por chunks ESM internos, sem CDN, HTTP externo ou dependência nova; os 20 chunks ficaram abaixo de 333 KB.
- O entrypoint público `/countries` mantém as APIs síncronas completas de países e bandeiras.
- No SSR, `flags.svg` customizado continua imediato; bandeiras padrão exibem placeholder no primeiro render e são carregadas pelo pacote após a hidratação.

## 0.4.0 — 2026-09-22 — evolução de acessibilidade e contrato público

### Corrigido

- `Table` passou a tornar cada linha de dados focável por teclado, preservando `aria-label`, `aria-describedby` e foco visível.
- `MobileCardTable` passou a tornar cada item focável por teclado, preservando `role="listitem"`, nomes, descrições e interação com controles internos.
- `InputSwitch` passou a preservar `aria-label`, `aria-labelledby`, `aria-describedby` e demais atributos ARIA no elemento com `role="switch"`, inclusive durante SSR.

### Compatibilidade

- Os nove entrypoints públicos da linha 0.4.x foram confirmados no campo `exports`: raiz, `core`, `forms`, `charts`, `countries`, `documents`, `overlays`, `styles.css` e `themes.css`.
- Nenhum componente, prop ou entrypoint público foi removido.
- Consumidores que ainda declaram `@aspprev/versi-ds: ^0.3.0` devem atualizar a faixa para `^0.4.0` para adotar esta versão.

### Validação

- Adicionados testes SSR, interação, teclado, foco visível e Axe para tabela, cartões móveis e `InputSwitch` em desktop/mobile.
- Compatibilidade com zoom/reflow e redução de movimento permanece coberta pela matriz automatizada; zoom nativo, leitor de tela e contraste do sistema exigem validação manual.

## 0.3.0 — 2026-09-22 — em preparação

### Adicionado

- `OtpCodeInput` com colagem distribuída, conclusão controlada e suporte a teclado.
- `QRCode` com descrição acessível, tamanho/correção configuráveis e estados de loading/erro.
- Primitives de upload (`FileDropzone`, `FileList` e `FileUploadProgress`) e `validateFiles`.
- `FileViewer` para fontes locais, Blob e URLs de imagem, PDF e texto.
- `useBreakpoint`, `useContainerBreakpoint`, `resolveContainerBreakpoint` e tokens de largura de conteúdo.

### Alterado

- `DatePicker` recebeu seleção por ano, navegação por teclado, retorno de foco e associações acessíveis de descrição/erro.
- `DomainStatusBadge` e `resolveStatusAppearance` aceitam mapas configuráveis por consumidor.
- `Table` e `MobileCardTable` tiveram paginação, filtros, modos responsivos e tab stops revisados.
- Filtros de tabela receberam `id`, `accessibleName` e `groupName`; Escape fecha o diálogo e devolve o foco ao gatilho.
- Stories, testes unitários, testes de interação/Axe e documentação foram ampliados para os novos contratos.

### Acessibilidade

- Reforçados foco visível, nomes e estados acessíveis, mensagens de erro, retorno de foco e redução de movimento nos componentes cobertos.
- Validações automatizadas desktop/mobile passaram para OTP, QRCode, upload, FileViewer, DatePicker e tabela.

### Compatibilidade

Esta é uma versão minor aditiva. Não há remoção de exports públicos nem alteração incompatível intencional. Aliases existentes foram preservados; as novas props são opcionais. O pacote continua reutilizável e não incorpora regras de negócio, chamadas de API ou componentes específicos dos portais.

### Migração

- Prefira os entrypoints públicos `@aspprev/versi-ds`, `/core`, `/forms` e `/documents`; não use imports internos de `src`.
- Para seleção exclusiva por ano, use `DatePicker selectionMode="year"`.
- Para uploads, mantenha transporte, autenticação e persistência no consumidor; use `validateFiles`, `FileDropzone`, `FileList` e `FileUploadProgress` para o contrato visual/controlado.
- Para status específicos do produto, passe `statusMap` ao `DomainStatusBadge` ou ao resolver, mantendo o vocabulário de negócio fora do DS.

## 0.2.0 — 2026-09-22

### Adicionado

- `OtpCodeInput` em `@aspprev/versi-ds/forms`.
- `QRCode`, `FileDropzone`, `FileList`, `FileUploadProgress` e `FileViewer` em
  `@aspprev/versi-ds/documents`.
- `useContainerBreakpoint` em `@aspprev/versi-ds/core`.

### Alterado

- `DatePicker` aceita `selectionMode="day" | "month" | "year"`; `day` continua
  sendo o padrão.
- `StatusBadge` ganhou domínios genéricos adicionais e `Table` ganhou estado
  de erro; a responsividade passou a considerar a largura do contêiner.
- A redução de movimento também respeita `prefers-reduced-motion`.
- O Storybook foi reorganizado em `Getting Started`, `Foundations`,
  `Components`, `Patterns`, `Themes` e `Guidelines`, com ordenação centralizada.
- A documentação visual passou a usar os assets oficiais da marca VERSI no
  cabeçalho, página inicial e favicon, além de novas orientações de uso e
  acessibilidade.

### Compatibilidade

Esta é uma versão minor aditiva. Aliases existentes foram preservados e os
portais continuam responsáveis por APIs, transporte, permissões e regras de
negócio. Não há remoções ou deep imports novos.

### Migração

Importe os componentes pelos entrypoints públicos. Para seleção exclusiva de
ano, substitua implementações locais por `DatePicker selectionMode="year"`;
para arquivos, controle a fila e o upload no consumidor e passe os estados a
`FileList`/`FileUploadProgress`.
### Adicionado no lote seguinte

- Preservação de caret para `formatter` genérico em `Input` e `InputStandalone`.
- `suffix` canônico em `InputSlider`, suporte a `Avatar` `xl` e ações por slot em `FileViewer`.
- Rejeições de upload para arquivo vazio ou inválido.
- Estados de loading, erro e ausência de dados em charts.
- Dimensões, quiet zone e erro configuráveis em `BoletoBarCode`.
