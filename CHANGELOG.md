# Changelog

## 0.5.9

### Corrigido

- Atualizado o Vite de 8.3.0 para 8.3.4 no lockfile do Storybook e no consumidor piloto, removendo os alertas de segurança que bloquearam a publicação da 0.5.8. A auditoria permanece obrigatória no CI.

## 0.5.8 — 2026-10-20 — temas de clientes e legibilidade

### Adicionado

- Sete identidades de cliente: basf, funssest, maisprevidencia, aceprev, cibrius, serpros e einvest, com quatro variantes e equivalência entre classe/atributo no html/body.
- Listas e tipos públicos de temas, acentos opcionais de marca e 28 demonstrações no Storybook, separadas dos presets legados.
- Testes de equivalência com os JSONs fornecidos e validação dos modos de alto contraste em componentes reais.

### Corrigido

- Legibilidade de status outline/soft no escuro, incluindo o fallback neutro, e pares de alto contraste nos fundos de página, card, tabela e muted.
- Uso de tokens de conteúdo em abas, navegação e seleções; knob e ícones de switches, estados de ações e equivalência de classe/atributo no html/body.
- Tooltips de gráficos acompanham os tokens do modo e porcentagens do donut ganham um fundo neutro legível.

- Gráficos montados acompanham alterações de identidade e modo; séries sem cores explícitas usam os tokens do tema.

### Alterado

- Tema rosa1 no modo escuro normal: coral, amarelo e lilás inspirados na identidade Aceprev; superfícies quentes e conteúdo escuro nas ações coloridas.

### Documentação

- Laboratório de legibilidade com matriz de componentes, comparação antes/depois e relatório de validação; placeholders preservados em todos os modos.

- Storybook: guia de configuração do styles.css, paleta ativa e matriz dos principais tokens nos 18 temas e quatro modos, incluindo campos desabilitados.

## 0.5.7 — 2026-10-20 — foco acessível e manutenção do repositório

### Corrigido

- Foco visível por CSS sem depender de `FocusNavigationMode`, preservando a API existente por compatibilidade.
- Campos de formulário exibem foco no contêiner sem substituir a borda de erro; prefixo do InputPhone recebe indicador interno para evitar recorte.
- Opções do SelectMulti e cards de rádio transferem o foco para os elementos visíveis.
- Indicadores usam o token semântico de foco; ajustado seu contraste nos temas claros e preservadas as cores específicas do escuro e do alto contraste.
- Abas do PageTabsHeader usam uma única entrada por Tab, setas com retorno circular, Home/End e ignoram opções desabilitadas.

### Técnico

- Adicionados testes de regressão de foco, teclado e contraste nos presets de tema.
- Padronizados os fins de linha das bandeiras geradas e do snapshot de build auditado; logs locais do Storybook passam a ser ignorados.
- Removida a dependência da posição das declarações no teste de contraste dos tokens de status.
- Atualizado o relatório de foco para separar os achados históricos das correções desta entrega.
- Limpeza ampliada ao repositório: removidos imports e helper sem uso e ativadas verificações de variáveis não utilizadas no pacote e no piloto.
- Lint ampliado para configurações e piloto, com regra específica para módulos CommonJS e exclusão do snapshot auditado de terceiros.
- Geradores de bandeiras preservam arquivos idênticos; verificação não destrutiva dos chunks e de todos os gerados integrada ao CI e ao prepack.
- CI passa a conferir também os testes de foco e os links internos do Storybook.
- Storybook ignora também builds de subprojetos, dependências instaladas e cobertura no watcher, evitando recarregamentos durante a manutenção.
- Atualizadas as instruções de manutenção e a árvore do Storybook; piloto sincronizado com o tarball local e caminho de dependência normalizado para evitar regravações desnecessárias do manifesto pelo npm.

## 0.5.6 — 2026-10-20 — organização e documentação do Storybook

### Documentado

- Catálogo pesquisável de componentes, navegação em português e documentação padronizada com propriedades, exemplos e orientações de uso.
- Novos exemplos de busca e paginação, validação por linha, estados dos campos e envio de documentos com progresso e nova tentativa.
- Fundamentos de bordas, raios e ícones, orientações de escolha de componentes e compatibilidade.
- Comparações históricas reunidas no Laboratório, mantendo os links existentes.
- Revisão de acessibilidade do foco, com limitações e correções pendentes registradas em `docs/accessibility-focus-review.md`. Esta versão não aplica essas correções aos componentes.

### Corrigido

- Exemplos interativos do Storybook passam a respeitar os controles de propriedades nos casos revisados.
- Valores da paleta e laboratório de temas acompanham as preferências globais; a documentação acompanha o esquema claro ou escuro.
- Espaçamento responsivo das prévias e recarregamentos provocados por arquivos gerados.

### Adicionado

- Verificação dos links internos e dos destinos do catálogo com `node scripts/check-storybook-navigation.mjs`, após gerar o Storybook.

## 0.5.5 — 2026-10-20 — resumo dos itens selecionados no MultiSelect

### Alterado

- MultiSelect exibe os nomes selecionados em etiquetas coloridas e um contador `+N` para os itens restantes.
- O resumo acompanha a largura do campo e permite reticências na última etiqueta visível para aproveitar o espaço disponível.
- A ação de limpar fica separada do contador e devolve o foco ao campo; os nomes completos permanecem no resumo acessível.

### Documentado

- Adicionado exemplo de largura ajustável no Storybook e testes de seleção, redimensionamento e limpeza em desktop e celular.

## 0.5.4 — 2026-10-20 — estados visuais dos formulários

### Alterado

- Reforçadas bordas e mensagens de validação nos componentes de formulário.
- Padronizados placeholders, valores preenchidos e estados desabilitados nos temas claro, escuro e de alto contraste.
- Valores preenchidos usam semibold no alto contraste; placeholders do alto contraste escuro ficam próximos ao mínimo WCAG AA de 4,5:1.
- Radio segue a geometria do portal; prefixo do InputPhone ocupa menos espaço e acompanha os estados do campo.

### Corrigido

- A normalização inicial do InputPhone preserva erros de validação existentes.
- Compensado o espaço das bordas de erro para reduzir deslocamentos internos.

### Documentado

- Padrão de crescimento por linha com FormGrid e comparações interativas de validação, placeholders e estados desabilitados no Storybook.

## 0.4.9 — 2026-09-24 — ajuste de largura da paginação

### Corrigido

- Removidas larguras fixas dos controles com rótulo para evitar quebra de “Anterior” e “Próxima” em containers estreitos.
- Adicionado `whitespace-nowrap` aos controles textuais da paginação standalone e do `Table`.

## 0.4.8 — 2026-09-24 — tamanhos e variantes da paginação

### Adicionado

- `Pagination` e `Table` agora compartilham as opções de tamanho `normal` e `small`.
- A paginação aceita controles com rótulos ou somente setas por meio das variantes `default` e `arrows`.
- A paginação interna e controlada do `Table` passa a usar os mesmos tokens de geometria e tipografia do componente standalone.

### Corrigido

- Mantida a mesma altura visual entre controles laterais e página atual em todas as variantes de paginação.

## 0.4.7 — 2026-09-24 — seleção mensal e anual do DatePicker

### Corrigido

- Removido `defaultView`; o modo inicial agora é derivado de `selectionMode`.
- Corrigidos os formatos de valor e placeholder para seleção de mês (`MM/AAAA`) e ano (`AAAA`).
- Corrigido o fechamento do calendário por clique externo e a troca de ano após uma seleção anterior.
- Meses e anos fora dos limites mínimo/máximo agora recebem indicação visual de desabilitado.

## 0.4.6 — 2026-09-24 — ajustes finais de layout do PageHeading

### Corrigido

- Ajustado o alinhamento estrutural entre o botão de retorno e o título do `PageHeading`, com cobertura atualizada nos testes unitários e visuais.

## 0.4.5 — 2026-09-24 — correção de visibilidade dos cabeçalhos

### Corrigido

- `PageHeading` e `PageTabsHeader` passaram a garantir largura disponível nos wrappers flexíveis, mantendo títulos visíveis em layouts limitados e responsivos.
- Títulos de página preservam truncamento responsivo, largura integral e o texto completo no atributo `title` quando aplicável.

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
