# Registro vivo — atualização do Versi Design System

Este documento acompanha a execução do `PLANO-ACAO-ATUALIZACAO-VERSI-DESIGN-SYSTEM.md`. Ele deve ser atualizado a cada passo relevante da atualização do pacote: decisão, implementação, validação, mudança de escopo, risco, release ou rollback.

## 1. Estado atual

| Campo | Valor |
|---|---|
| Projeto | `@aspprev/versi-ds` |
| Repositório | `ds-versi` |
| Branch de trabalho | `feat/versi-ds-0.3.0` |
| Versão baseline | `0.2.0` |
| Versão alvo | `0.3.0` |
| Commit baseline | `f9bc501` |
| Tag baseline | `v0.2.0` existe no histórico anterior |
| Fase atual | Fase 6 — compatibilidade, documentação e release |
| Escopo do RPPS | adiado para outra sprint |
| Consumidor de integração desta sprint | `por-portal-aspprev` |
| Status | Revisão final concluída; pacote pronto para decisão de commit/tag |
| Última atualização | 22/09/2026 |
| Próxima ação | com autorização explícita, criar commit e tag `v0.3.0`; publicação permanece separada |

## 2. Como usar este registro

Para cada avanço, adicionar uma entrada no topo das seções correspondentes, preservando o histórico anterior. Não apagar falhas intermediárias: registrar a causa, a correção e a validação final.

Cada entrada de implementação deve informar, quando aplicável:

- data;
- fase e item do plano;
- arquivos alterados;
- decisão de API;
- commit;
- comandos executados;
- resultado;
- impacto no ASPPrev;
- risco ou pendência;
- próximo passo.

## 3. Log de execução

### 2026-09-22 — criação do plano e do registro

- **Fase:** 0 — preparação e baseline.
- **Ação:** criados o plano de ação e este registro vivo a partir da auditoria completa.
- **Arquivos:** `docs/PLANO-ACAO-ATUALIZACAO-VERSI-DESIGN-SYSTEM.md` e `docs/REGISTRO-ATUALIZACAO-VERSI-DESIGN-SYSTEM.md`.
- **Decisão:** a migração do `por-portal-rpps` não faz parte desta atualização; será executada em sprint separada.
- **Baseline:** pacote `0.2.0`, commit `f9bc501`, branch `master`.
- **Validação:** documentação revisada; nenhuma alteração de runtime realizada neste passo.
- **Próximo passo:** definir a versão alvo antes do primeiro lote de código.

### 2026-09-22 — versão alvo definida

- **Fase:** 0 — preparação e baseline.
- **Ação:** `package.json` e `package-lock.json` atualizados de `0.2.0` para `0.3.0`.
- **Decisão:** usar uma release minor, preservando exports e aliases existentes; qualquer quebra identificada durante a implementação deve reabrir a decisão SemVer.
- **Arquivos de acompanhamento:** plano e registro vivo atualizados com a versão alvo.
- **Tag:** ainda não criada; `v0.3.0` só será criada após implementação, validação do tarball e revisão final.
- **Próximo passo:** executar a validação baseline e começar os quick wins da Fase 1.

### 2026-09-22 — baseline da versão 0.3.0 validado

- **Fase:** 0 — preparação e baseline concluída.
- **Validações aprovadas:** `tokens:check`, `check:governance`, `check:security`, `typecheck`, `npm test` (20 arquivos/85 testes), `build`, `check:size`, `check:package`, `test:package`, `test:flags-consumers` e `build-storybook` (1079 módulos).
- **Empacotamento:** 9 entrypoints, 250 bandeiras, 295 arquivos e aproximadamente 4,92 MB compactados; conteúdo limitado a `dist`, `README.md` e `package.json` obrigatório.
- **Consumidores:** consumidor isolado mínimo/completo, ESM, SSR, NodeNext/strict, Next.js e Vite aprovados.
- **Avisos:** Browserslist desatualizado e avisos existentes de diretivas `use client`/chunks grandes no Storybook; nenhum bloqueou o build.
- **Lint:** não há script `lint` no `package.json`; não foi possível executar uma etapa inexistente. Deve ser tratado como melhoria de automação, não como aprovação de lint.
- **Próximo passo:** iniciar a Fase 1 com foco em `data-focus-emphasis`/`data-link-emphasis`, breakpoints de container, stories faltantes e smoke test de stories.

### 2026-09-22 — contrato de ênfase de foco e links

- **Fase/item:** Fase 1 — quick wins; `data-focus-emphasis` e `data-link-emphasis`.
- **Objetivo:** fazer as preferências já expostas pelos portais produzirem comportamento visual no CSS público do DS.
- **Arquivos alterados:** `tokens/design-system.tokens.json`, arquivos gerados de tokens, `.storybook/preview.tsx`, `stories/AccessibilityPreferenceParts.stories.tsx`, `stories/ThemesOverview.mdx`, `stories/GuidelinesAccessibility.mdx`, `tests/design-system/standalone-theme-contract.test.ts` e `tests/visual/design-system/accessibility-preferences.visual.spec.ts`.
- **API/decisões:** `data-focus-emphasis="strong"` usa foco de 3px, offset de 2px e halo de 5px; `data-link-emphasis="underline"` sublinha links, preservando `[role="button"]` e permitindo exceção por `data-no-accessibility-underline`.
- **Testes executados:** `tokens:check`, `check:governance`, `typecheck`, `npm test`, `build`, `check:size` e `build-storybook`; Playwright/Axe específico em desktop e mobile.
- **Resultado:** aprovado; 20 arquivos/86 testes unitários passaram; Storybook compilado com 1079 módulos; 2 cenários Playwright/Axe passaram.
- **Avisos:** permanecem avisos informativos conhecidos de Browserslist, diretivas `use client` e chunks grandes.
- **Commit:** ainda não criado; alterações permanecem na branch `feat/versi-ds-0.3.0`.
- **Riscos/pendências:** falta revisar visualmente a matriz completa de temas/alto contraste e executar a suíte visual antes da release.
- **Próximo passo:** documentar breakpoints de viewport/container e o contrato de largura de conteúdo.

### 2026-09-22 — contrato responsivo de viewport, container e conteúdo

- **Fase/item:** Fase 1 — quick wins; breakpoints e largura de conteúdo.
- **Objetivo:** tornar explícitos os contratos de responsividade do pacote sem acoplar regras de layout de portal.
- **Arquivos alterados:** `src/hooks/useBreakpoint.tsx`, `src/hooks/useContainerBreakpoint.ts`, `src/core.ts`, `src/index.ts`, `tokens/design-system.tokens.json`, `src/tokens.css`, `stories/Responsive.stories.tsx`, `stories/GuidelinesUsage.mdx`, `tests/design-system/standalone-responsive.test.ts` e `tests/visual/design-system/responsive.visual.spec.ts`.
- **API/decisões:** exportados `Breakpoint`, `getBreakpoint`, `useBreakpoint`, `resolveContainerBreakpoint` e `useContainerBreakpoint`; mantidos os mapas de thresholds existentes; `useBreakpoint` usa snapshot SSR estável; adicionados `--content-max-width` e `--content-gutter-inline` como tokens de layout.
- **Testes executados:** `tokens:generate`, `tokens:check`, `typecheck`, `npm test` (21 arquivos/88 testes), `build`, `check:size`, `check:package`, `check:governance` e Playwright/Axe específico (desktop/mobile).
- **Resultado:** aprovado; 2 cenários responsivos com Axe passaram; todos os budgets e entrypoints permaneceram válidos.
- **Observação:** a primeira execução paralela de `check:size` encontrou `dist` em limpeza pelo build; a repetição sequencial passou.
- **Commit:** ainda não criado; alterações permanecem na branch `feat/versi-ds-0.3.0`.
- **Riscos/pendências:** a matriz completa de acessibilidade e a validação de consumidores continuarão nas fases seguintes; não foi criado um componente `ContentContainer`, apenas o contrato de tokens foi definido.
- **Próximo passo:** criar stories dedicadas de QRCode, upload e FileViewer.

### 2026-09-22 — stories dedicadas de QRCode, upload e FileViewer

- **Fase/item:** Fase 1 — quick wins; stories e smoke test de componentes priorizados.
- **Objetivo:** substituir a demonstração agrupada por exemplos descobríveis, estados de erro/carregamento e interação de upload verificável.
- **Arquivos alterados:** `stories/QRCode.stories.tsx`, `stories/FileUpload.stories.tsx`, `stories/FileViewer.stories.tsx` e `tests/visual/design-system/document-components.visual.spec.ts`.
- **Stories/API cobertas:** `QRCode` com descrição, tamanho/correção e valor longo; `FileDropzone`, `FileList` e `FileUploadProgress` com playground, validação, progresso e retry; `FileViewer` com texto, imagem, loading, erro e tipo não suportado.
- **Testes executados:** `typecheck`, `build-storybook` (1083 módulos) e Playwright/Axe específico em Chromium e Chromium Mobile.
- **Resultado:** aprovado; 6 cenários (3 componentes em desktop/mobile) passaram; seleção de arquivo por teclado e estados acessíveis foram verificados.
- **Correção durante a validação:** os IDs efetivos gerados para `FileUpload` e `FileViewer` foram confirmados no `index.json` e usados no smoke test; não houve alteração de API de runtime.
- **Commit:** ainda não criado; alterações permanecem na branch `feat/versi-ds-0.3.0`.
- **Riscos/pendências:** os textos de exemplo não substituem a validação com arquivos reais e integração de transporte pelos portais; a cobertura visual completa da matriz de acessibilidade permanece pendente.
- **Próximo passo:** iniciar a Fase 2, revisando e estabilizando `OtpCodeInput` e `QRCode` como componentes de produção.

### 2026-09-22 — estabilização de OtpCodeInput e QRCode

- **Fase/item:** Fase 2 — `OtpCodeInput` e `QRCode`.
- **Objetivo:** estabilizar comportamento de teclado, conclusão do OTP e estados de loading/erro do QRCode sem quebrar a fachada pública.
- **Arquivos alterados:** `src/components/otp-code-input/OtpCodeInput.tsx`, `src/components/qr-code/QRCode.tsx`, `stories/OtpCodeInput.stories.tsx`, `stories/QRCode.stories.tsx` e `tests/visual/design-system/otp-qr.visual.spec.ts`.
- **API/decisões:** `onComplete` dispara somente na transição para um código completo; regex com flags globais/sticky é normalizada de forma determinística; handlers de foco/teclado recebidos pelo componente são preservados; `QRCode` ganhou `loading`, `error` e `onError` opcionais, ID de descrição único, tamanho seguro e atributos `aria-busy`/`aria-invalid`.
- **Testes executados:** `typecheck`, `npm test` (21 arquivos/88 testes), `build`, `build-storybook` (1083 módulos), Playwright/Axe de OTP e QRCode (desktop/mobile), `check:size`, `check:package` e `check:governance`.
- **Resultado:** aprovado; 4 cenários de interação passaram; budgets e entrypoints permaneceram válidos; pacote gerado com `documents.d.ts` de 3,39 KB e `forms.d.ts` de 10,25 KB.
- **Observação:** uma execução do Storybook compilou o conteúdo e falhou apenas no encerramento com asserção nativa `UV_HANDLE_CLOSING` do Node/Windows; a repetição concluiu com exit code 0.
- **Commit:** ainda não criado; alterações permanecem na branch `feat/versi-ds-0.3.0`.
- **Riscos/pendências:** a validação de adapters de consumidor e integração dos componentes nos portais continua fora desta sprint; o teste unitário roda em ambiente Node/SSR e a interação é coberta pelo Playwright/Axe.
- **Próximo passo:** iniciar a Fase 3, revisando upload e `FileViewer` em produção.

### 2026-09-22 — revisão de produção de upload e FileViewer

- **Fase/item:** Fase 3 — primitives de upload e `FileViewer`.
- **Objetivo:** separar validação pura de seleção/drag-and-drop, tornar o input mais controlável e fortalecer lifecycle, leitura assíncrona e estados acessíveis do visualizador.
- **Arquivos alterados:** `src/components/file-upload/validation.ts`, `src/components/file-upload/FileDropzone.tsx`, `src/components/file-upload/FileList.tsx`, `src/components/file-upload/FileViewer.tsx`, `src/components/file-upload/index.ts`, `src/documents.ts`, `src/index.ts` e `tests/design-system/standalone-file-upload.test.tsx`.
- **API/decisões:** adicionado `validateFiles` com `FileValidationOptions`, `FileValidationReason` e `FileValidationResult`; `FileDropzone` aceita `id`, `name` e `required`, anuncia rejeições e sinaliza `aria-invalid`; `FileViewer` aceita `onLoad`/`onError`, normaliza MIME com parâmetros, limpa leitura anterior, revoga object URLs e usa sandbox em iframes.
- **Testes executados:** `typecheck`, `npm test` (22 arquivos/91 testes), `build`, `build-storybook` (1084 módulos), Playwright/Axe de documentos (desktop/mobile), `check:size`, `check:package` e `check:governance`.
- **Resultado:** aprovado; 6 cenários visuais passaram; JavaScript ficou em 5.224.139 bytes/1.780.280 gzip, dentro do budget; pacote com 9 entrypoints, 250 bandeiras, 295 arquivos e 4.926.214 bytes compactados.
- **Commit:** ainda não criado; alterações permanecem na branch `feat/versi-ds-0.3.0`.
- **Riscos/pendências:** upload continua sem transporte, persistência e autenticação; PDF remoto depende do navegador e da política de sandbox; integração nos portais permanece fora desta sprint.
- **Próximo passo:** iniciar a Fase 4, revisando `DatePicker`, status e acessibilidade transversal.

### 2026-09-22 — DatePicker, status e acessibilidade transversal

- **Fase/item:** Fase 4 — DatePicker, status e acessibilidade transversal.
- **Objetivo:** estabilizar o contrato de calendário por ano, reforçar o comportamento de foco/teclado e permitir mapas de status específicos do consumidor sem transferir vocabulário de negócio para o DS.
- **Arquivos alterados:** `src/components/datePicker/UnifiedDatePicker.tsx`, `src/components/status-badge/DomainStatusBadge.tsx`, `src/components/status-badge/index.ts`, `src/utils/resolve-status-appearance.ts`, `src/core.ts`, `src/index.ts`, `stories/DatePicker.stories.tsx`, `stories/StatusBadge.stories.tsx`, `tests/design-system/standalone-datepicker.test.tsx`, `tests/design-system/standalone-status-badge.test.tsx` e `tests/visual/design-system/datepicker.visual.spec.ts`.
- **API/decisões:** `disabled` permanece canônico e `isDisabled` continua como alias compatível; `DatePicker` ganhou `ariaLabel`, `role="combobox"`, diálogo identificável, descrição/erro associados, navegação por setas/Home/End e retorno de foco; `selectionMode="year"` foi documentado em story/teste; `DomainStatusBadge` aceita `statusMap` e o resolver público aceita opções de mapa/fallback; `normalizeStatus` e `resolveStatusAppearance` foram disponibilizados pelos entrypoints públicos.
- **Testes executados:** `typecheck`, teste focado DatePicker/StatusBadge (9 testes), `npm test` (22 arquivos/94 testes), `build`, `build-storybook` (1084 módulos), Playwright/Axe do DatePicker (2 cenários desktop/mobile), `tokens:check`, `check:governance`, `check:security`, `check:size`, `check:package`, `test:package` e `test:flags-consumers`.
- **Resultado:** aprovado; DatePicker passou por teclado, retorno de foco e Axe em desktop/mobile; pacote compilado e consumidores Next/Vite usando tarball local passaram; 0 vulnerabilidades; budgets e allowlist preservados.
- **Falhas intermediárias registradas:** o primeiro cenário visual revelou retorno de foco incompleto e depois uma violação Axe por `aria-expanded` em input sem papel `combobox`; ambos foram corrigidos e os 2 cenários finais passaram.
- **Commit:** ainda não criado; alterações permanecem na branch `feat/versi-ds-0.3.0`.
- **Riscos/pendências:** o DatePicker ainda mantém implementação interna concentrada e deve ser dividido em adapters/módulos antes de uma mudança estrutural; a matriz completa de zoom 200%/400% e revisão manual de contraste continuam pendentes; RPPS permanece fora do escopo.
- **Próximo passo:** iniciar a Fase 5, revisando tabela responsiva, filtros, paginação e contrato de conteúdo.

### 2026-09-22 — tabelas responsivas e filtros

- **Fase/item:** Fase 5 — tabelas, filtros, paginação e contrato de conteúdo responsivo.
- **Objetivo:** revisar o comportamento responsivo da tabela sem atrelar decisões de renderização ao viewport global, fortalecer a interação dos filtros e manter a fachada pública reutilizável.
- **Arquivos alterados:** `src/components/table/Table.tsx`, `src/components/table/TableView.tsx`, `src/components/table/MobileCardTable.tsx`, `src/components/table/components/filter/Filter.tsx`, `src/components/table/components/filter/FilterView.tsx`, `stories/Table.stories.tsx`, `tests/design-system/standalone-table.test.tsx` e `tests/visual/design-system/table-responsive.visual.spec.ts`.
- **API/decisões:** preservados `fit`, `adaptive` e `scroll`; paginação e modo de setas usam a largura real do container observada por `ResizeObserver`; filtros receberam props aditivas `id`, `accessibleName` e `groupName`; Escape fecha o filtro e devolve o foco ao gatilho; linhas/cards gerenciados não criam tab stop artificial; `itemsPerPage` é normalizado para um valor seguro.
- **Testes executados:** `npm run typecheck`, teste focado de tabela (4 testes), `npm test` (22 arquivos/95 testes), `npm run build`, `npm run build-storybook` (1084 módulos), Playwright/Axe de tabela (4 cenários desktop/mobile), `tokens:check`, `check:governance`, `check:security`, `check:size`, `check:package`, `test:package` e `test:flags-consumers`.
- **Resultado:** aprovado; os cenários adaptativo e de filtros passaram em Chromium desktop/mobile com Axe sem violações; builds de Next.js e Vite usando o pacote empacotado passaram; 0 vulnerabilidades e budgets/allowlist preservados.
- **Falha intermediária corrigida:** a primeira execução visual deixou a coluna Status invisível no modo desktop porque a story não definia `widthUnits`; a story foi corrigida e os 4 cenários finais passaram.
- **Commit:** ainda não criado; alterações permanecem na branch `feat/versi-ds-0.3.0`.
- **Riscos/pendências:** a separação em renderers internos distintos ainda não foi concluída; zoom 200%/400%, contraste e leitor de tela continuam exigindo revisão manual; a validação com o tarball no `por-portal-aspprev` real permanece pendente; RPPS continua fora do escopo.
- **Próximo passo:** iniciar a Fase 6 com documentação, changelog, compatibilidade e validação final de empacotamento.

### 2026-09-22 — documentação, changelog e compatibilidade pública

- **Fase/item:** Fase 6 — documentação, compatibilidade e preparação da release.
- **Objetivo:** alinhar a documentação pública à versão `0.3.0`, registrar migração e confirmar que os componentes continuam disponíveis pelos entrypoints suportados.
- **Arquivos alterados:** `README.md`, `CHANGELOG.md`, `docs/API-NOVOS-COMPONENTES.md`, `docs/API-PUBLICA-CONTROLES.md` e `docs/GOVERNANCA-DESIGN-SYSTEM.md`.
- **Documentação:** adicionados exemplos e contratos para OTP, QRCode, upload, FileViewer, DatePicker por ano, status configurável e tabela responsiva; changelog `0.3.0` criado como release em preparação; versão atual da governança corrigida.
- **Compatibilidade:** nenhuma remoção de export ou mudança incompatível intencional; os imports recomendados continuam sendo a raiz, `/core`, `/forms` e `/documents`, sem deep imports.
- **Validações:** `npm run typecheck`, `npm run build` e `npm run check:package` aprovados; pacote com 9 entrypoints, 250 bandeiras, 295 arquivos e 4.931.941 bytes compactados.
- **Observação:** as primeiras execuções de build/check-package foram bloqueadas pelo sandbox com `spawn`/`spawnSync EPERM`; a repetição autorizada fora do sandbox passou.
- **Commit:** ainda não criado; alterações permanecem na branch `feat/versi-ds-0.3.0`.
- **Próximo passo:** gerar e inspecionar o tarball local e instalá-lo no `por-portal-aspprev` real.

### 2026-09-22 — tarball e integração no por-portal-aspprev

- **Fase/item:** Fase 6 — empacotamento e validação de consumidor.
- **Objetivo:** inspecionar o pacote final e comprovar que o `por-portal-aspprev` consegue compilar usando o tarball local `0.3.0`.
- **Tarball:** `aspprev-versi-ds-0.3.0.tgz`, 4.931.948 bytes, 295 arquivos, SHA-1 `8f99c3d22f09ac7fef9b649432d500c1bb211f56`; conteúdo limitado a `dist`, `README.md` e `package.json`.
- **Comandos do pacote:** `npm pack --dry-run` e `npm pack --ignore-scripts --json`; o `prepack` executado no dry-run aprovou tokens, governança, segurança, typecheck, build, tamanho e allowlist.
- **Consumidor:** tarball instalado temporariamente em `por-portal-aspprev` com `--no-save --package-lock=false`; `npm run typecheck` e `npm run build` passaram no Next.js, com todas as rotas geradas.
- **Observação:** o `package.json` do portal ainda declara `@aspprev/versi-ds: ^0.1.1`; por isso `npm ls` sinaliza `0.3.0` como `invalid`, embora a versão instalada fisicamente seja `0.3.0`. O manifesto do portal não foi alterado nesta sprint.
- **Commit:** ainda não criado; alterações permanecem na branch `feat/versi-ds-0.3.0`.
- **Próximo passo:** revisar o diff completo, atualizar pendências finais e decidir a autorização para commit/tag.

## 4. Decisões de API

| Data | Tema | Decisão | Motivo | Impacto |
|---|---|---|---|---|
| 22/09/2026 | Tabela responsiva | `fit`, `adaptive` e `scroll` permanecem modos públicos; decisões de paginação/setas usam a largura do container observado, não apenas o viewport. | Evitar que uma tabela dentro de painel estreito seja tratada como desktop por causa da largura da janela. | Consumidores preservam a API atual e obtêm comportamento consistente em layouts compostos. |
| 22/09/2026 | Filtros de tabela | `id`, `accessibleName` e `groupName` são props aditivas; o popup é um diálogo identificável, fecha com Escape e devolve o foco ao gatilho. | Melhorar nomes acessíveis, evitar colisão de grupos de rádio e tornar o ciclo de foco previsível. | Nenhuma migração obrigatória; consumidores podem personalizar identificação e agrupamento. |
| 22/09/2026 | Paginação/tabs | `itemsPerPage` inválido ou menor que 1 é normalizado para um valor seguro; linhas/cards gerenciados não recebem tab stop artificial. | Evitar estados quebrados e impedir que elementos contêineres interrompam a navegação por teclado. | Mantém compatibilidade com valores válidos e melhora a navegação dos controles internos. |
| 22/09/2026 | OtpCodeInput | `onComplete` representa uma transição para código completo e não repete enquanto o valor continua completo. | Evitar chamadas duplicadas em re-renderizações ou edição do mesmo dígito. | Consumidores podem iniciar validação/envio uma vez por preenchimento. |
| 22/09/2026 | QRCode | `loading`, `error` e `onError` são opcionais; o componente mantém fallback interno e sem dependência de transporte. | Permitir estados de infraestrutura sem acoplar o DS a API ou autenticação. | Produtos podem controlar loading/erro e manter o mesmo componente visual. |
| 22/09/2026 | Upload | `validateFiles` é puro e retorna aceitos/rejeitados; `FileDropzone` permanece responsável somente pela seleção e interação. | Separar validação de transporte e permitir testes/adapters sem DOM. | Produtos podem conectar upload próprio sem importar regra de negócio. |
| 22/09/2026 | FileViewer | `source` continua resolvido pelo consumidor; `onLoad`/`onError` comunicam o lifecycle sem fazer fetch no DS. | Manter proxy, autenticação e persistência fora do pacote. | O visualizador pode ser integrado a fontes locais ou URLs já autorizadas. |
| 22/09/2026 | RPPS | Não migrar nem alterar o RPPS nesta sprint. | Separar evolução do pacote da migração do consumidor. | O DS deve preservar compatibilidade e preparar adapters. |
| 22/09/2026 | Upload | DS fornece seleção, validação e apresentação; produto fornece transporte, sessão, persistência e regra de negócio. | Evitar acoplamento a Formik/API/campos de negócio. | Permite reutilização nos dois portais. |
| 22/09/2026 | FileViewer | DS recebe source resolvido; proxy, autenticação e download específico permanecem no produto. | Separar renderização de infraestrutura. | ASPPrev pode migrar gradualmente. |
| 22/09/2026 | Status | `StatusBadge` continua visual; resolver de domínio deve ser configurável. | Evitar crescimento de vocabulário de negócio no core. | Mapas específicos continuam nos produtos. |
| 22/09/2026 | DatePicker | `disabled` é o nome canônico; `isDisabled` permanece como alias; `selectionMode="year"`, `ariaLabel`, `role="combobox"` e retorno de foco fazem parte da fachada pública. | Preservar compatibilidade e formalizar o contrato acessível do calendário. | Consumidores podem adotar seleção por ano sem deep import ou migração imediata. |
| 22/09/2026 | Status | `DomainStatusBadge` aceita `statusMap`; `resolveStatusAppearance` aceita mapa/fallback e continua com a assinatura anterior válida. | Permitir vocabulário específico do produto sem incorporar regras de negócio ao DS. | Cada portal controla seus status desconhecidos e domínios próprios. |
| 22/09/2026 | Aliases | Não remover aliases nesta versão sem uma major planejada. | Preservar consumidores existentes. | Depreciações serão documentadas. |

Adicionar novas decisões acima desta tabela, sem apagar as anteriores.

## 5. Checklist por fase

### Fase 0 — Preparação e baseline

- [x] Versão alvo definida (`0.3.0`).
- [x] Baseline registrado.
- [x] Escopo RPPS separado.
- [x] Matriz de browsers/React/Node confirmada pelos testes de pacote e consumidores.
- [x] Contratos de não regressão verificados por public API, entrypoints, build e pacote.

### Fase 1 — Quick wins

- [ ] Encoding da tabela revisado.
- [x] Breakpoints de viewport/container documentados.
- [x] Contrato de largura de conteúdo definido.
- [x] `data-focus-emphasis` e `data-link-emphasis` resolvidos.
- [ ] Aliases canônicos documentados.
- [x] Smoke test de stories/IDs criado.
- [x] Stories dedicadas de QR/upload/FileViewer criadas.
- [ ] Matriz de acessibilidade criada e executada.

### Fase 2 — OtpCodeInput e QRCode

- [x] API OTP revisada.
- [x] Máscara RegExp estabilizada.
- [x] `onComplete` documentado e testado.
- [x] OTP validado por teclado e Axe.
- [x] QRCode com estados de erro/loading documentado.
- [x] QRCode validado por nome, descrição e contraste.
- [ ] Adapters de consumidor documentados.

### Fase 3 — Upload e FileViewer

- [x] Tipos públicos de arquivo definidos.
- [x] Validador puro criado/testado.
- [x] Dropzone controlável e acessível.
- [x] Lista/item/progresso/retry documentados.
- [x] Lifecycle de object URL revisado.
- [x] Erros de imagem/PDF/texto tratados.
- [x] Stories e testes completos.

### Fase 4 — DatePicker, status e acessibilidade

- [x] API `disabled`/`isDisabled` definida.
- [x] Seleção por ano validada.
- [ ] Internals do DatePicker separados sem quebra de façade.
- [x] Resolver de status configurável.
- [x] Foco, live regions e reduced motion revisados nos componentes cobertos.

### Fase 5 — Tabelas e conteúdo responsivo

- [x] Modelo headless existente revisado, preservando colunas, ordenação, filtros e paginação.
- [ ] Renderers table/adaptive/card separados estruturalmente; `MobileCardTable` permanece isolado, mas o modo adaptive ainda reutiliza a tabela.
- [x] Filtros com foco, Escape e retorno ao gatilho validados.
- [x] Largura do container aplicada para as decisões de paginação/setas.
- [x] MobileCardTable revisado quanto a tab stops artificiais e semântica de teclado; zoom e leitor de tela manuais permanecem pendentes.

### Fase 6 — Compatibilidade e release

- [x] README/stories/docs atualizados.
- [x] Changelog atualizado.
- [x] Evolução registrada.
- [x] Exports e tipos verificados.
- [ ] Tokens e governança aprovados.
- [ ] Typecheck/lint/testes/build aprovados.
- [ ] Storybook estático aprovado.
- [ ] Segurança e tamanho aprovados.
- [x] Tarball gerado e inspecionado.
- [x] Tarball instalado/validado no ASPPrev; typecheck e build passaram, com a faixa declarada do portal ainda pendente de migração.
- [ ] Piloto validado.
- [ ] Revisão final concluída.
- [ ] Tag criada somente após aprovação.

## 6. Registro de implementações

Use este formato para cada lote:

```md
### AAAA-MM-DD — título do lote

- **Fase/item:**
- **Objetivo:**
- **Arquivos alterados:**
- **API/decisões:**
- **Testes executados:**
- **Resultado:**
- **Commit:**
- **Riscos/pendências:**
- **Próximo passo:**
```

### Lotes futuros

Próximo lote planejado: Fase 6 — documentação, changelog, compatibilidade, tarball e revisão final antes de tag/publicação.

## 7. Registro de validações

| Data | Comando/cenário | Fase | Resultado | Observações |
|---|---|---|---|---|
| 22/09/2026 | Revisão documental da auditoria | 0 | Aprovado | Base para este plano; sem alteração de runtime. |
| 22/09/2026 | `npm run tokens:check` | 0 | Aprovado | Tokens consistentes. |
| 22/09/2026 | `npm run check:governance` | 0 | Aprovado | Governança standalone aprovada. |
| 22/09/2026 | `npm run check:security` | 0 | Aprovado | 0 vulnerabilidades no DS e no piloto. |
| 22/09/2026 | `npm run typecheck` | 0 | Aprovado | Fontes, stories e configuração visual. |
| 22/09/2026 | `npm test` | 0 | Aprovado | 20 arquivos e 85 testes. |
| 22/09/2026 | `npm run build` | 0 | Aprovado | Entradas JS/TS, CSS e bandeiras gerados. |
| 22/09/2026 | `npm run check:size` | 0 | Aprovado | Todos os orçamentos dentro do limite. |
| 22/09/2026 | `npm run check:package` | 0 | Aprovado | 9 entrypoints, 250 bandeiras e allowlist correta. |
| 22/09/2026 | `npm run test:package` | 0 | Aprovado | Consumidor isolado mínimo/completo, ESM, SSR e strict. |
| 22/09/2026 | `npm run test:flags-consumers` | 0 | Aprovado | Next.js/Turbopack e Vite em produção. |
| 22/09/2026 | `npm run build-storybook` | 0 | Aprovado | 1079 módulos; avisos informativos conhecidos. |
| 22/09/2026 | `npm run lint` | — | Indisponível | Script não existe no `package.json`; criar automação posteriormente. |
| 22/09/2026 | `npm run typecheck` após stories dedicadas | 1 | Aprovado | Stories e teste visual compilados sem erros. |
| 22/09/2026 | `npm run build-storybook` após stories dedicadas | 1 | Aprovado | 1083 módulos; IDs `fileupload`, `fileviewer` e `qrcode` presentes no catálogo. |
| 22/09/2026 | Playwright/Axe de QRCode, upload e FileViewer | 1 | Aprovado | 6 cenários em Chromium e Chromium Mobile; teclado, estados e acessibilidade verificados. |
| 22/09/2026 | `npm test` após estabilização do OTP/QRCode | 2 | Aprovado | 21 arquivos e 88 testes. |
| 22/09/2026 | `npm run build` após estabilização do OTP/QRCode | 2 | Aprovado | Entrypoints e declarações DTS gerados. |
| 22/09/2026 | `npm run build-storybook` após estabilização do OTP/QRCode | 2 | Aprovado | 1083 módulos; segunda execução encerrou com exit code 0. |
| 22/09/2026 | Playwright/Axe de OTP e QRCode | 2 | Aprovado | 4 cenários em Chromium e Chromium Mobile; conclusão, teclado, loading e erro verificados. |
| 22/09/2026 | `npm run check:size` | 2 | Aprovado | JavaScript: 5.220.423 bytes / 1.779.830 gzip, dentro do budget. |
| 22/09/2026 | `npm run check:package` | 2 | Aprovado | Entry points e allowlist do pacote preservados. |
| 22/09/2026 | `npm run check:governance` | 2 | Aprovado | Governança standalone aprovada. |
| 22/09/2026 | `npm run typecheck` após revisão de upload/FileViewer | 3 | Aprovado | Fontes, stories e teste visual compilados sem erros. |
| 22/09/2026 | `npm test` após revisão de upload/FileViewer | 3 | Aprovado | 22 arquivos e 91 testes. |
| 22/09/2026 | `npm run build` após revisão de upload/FileViewer | 3 | Aprovado | 9 entrypoints e declarações DTS gerados. |
| 22/09/2026 | `npm run build-storybook` após revisão de upload/FileViewer | 3 | Aprovado | 1084 módulos. |
| 22/09/2026 | Playwright/Axe de upload e FileViewer | 3 | Aprovado | 6 cenários em Chromium e Chromium Mobile. |
| 22/09/2026 | `npm run check:size` após revisão de upload/FileViewer | 3 | Aprovado | Todos os budgets dentro do limite. |
| 22/09/2026 | `npm run check:package` após revisão de upload/FileViewer | 3 | Aprovado | 9 entrypoints, 250 bandeiras, 295 arquivos e allowlist correta. |
| 22/09/2026 | `npm run check:governance` após revisão de upload/FileViewer | 3 | Aprovado | Governança standalone aprovada. |
| 22/09/2026 | Teste unitário específico de upload/FileViewer | 3 | Aprovado | 1 arquivo e 3 testes. |
| 22/09/2026 | Teste unitário específico de DatePicker/StatusBadge | 4 | Aprovado | 2 arquivos e 9 testes. |
| 22/09/2026 | `npm run typecheck` após Fase 4 | 4 | Aprovado | Fontes, stories e testes compilados sem erros. |
| 22/09/2026 | `npm test` após Fase 4 | 4 | Aprovado | 22 arquivos e 94 testes. |
| 22/09/2026 | `npm run build` após Fase 4 | 4 | Aprovado | Entrypoints e declarações DTS gerados. |
| 22/09/2026 | Playwright/Axe do DatePicker | 4 | Aprovado | 2 cenários em Chromium e Chromium Mobile; ano, setas, Escape, retorno de foco e Axe verificados. |
| 22/09/2026 | `npm run build-storybook` após Fase 4 | 4 | Aprovado | 1084 módulos; avisos informativos conhecidos. |
| 22/09/2026 | `npm run tokens:check` após Fase 4 | 4 | Aprovado | Tokens consistentes. |
| 22/09/2026 | `npm run check:security` após Fase 4 | 4 | Aprovado | 0 vulnerabilidades no DS e no piloto. |
| 22/09/2026 | `npm run check:size` após Fase 4 | 4 | Aprovado | JavaScript: 5.229.257 bytes / 1.782.034 gzip, dentro do budget. |
| 22/09/2026 | `npm run check:package` após Fase 4 | 4 | Aprovado | 9 entrypoints, 250 bandeiras, 295 arquivos e allowlist correta. |
| 22/09/2026 | `npm run test:package` após Fase 4 | 4 | Aprovado | Consumidor isolado mínimo/completo, ESM, SSR e NodeNext/strict. |
| 22/09/2026 | `npm run test:flags-consumers` após Fase 4 | 4 | Aprovado | Tarball local validado em Next/Turbopack e Vite em produção, sem requests de flags. |
| 22/09/2026 | Teste unitário específico de tabela | 5 | Aprovado | 1 arquivo e 4 testes; modos responsive, `itemsPerPage` seguro e ausência de tab stop artificial verificados. |
| 22/09/2026 | `npm test` após Fase 5 | 5 | Aprovado | 22 arquivos e 95 testes. |
| 22/09/2026 | `npm run typecheck` após Fase 5 | 5 | Aprovado | Fontes, stories e testes compilados sem erros. |
| 22/09/2026 | `npm run build` após Fase 5 | 5 | Aprovado | Entrypoints e declarações DTS gerados. |
| 22/09/2026 | Playwright/Axe de tabela responsiva e filtros | 5 | Aprovado | 4 cenários em Chromium e Chromium Mobile; adaptive, diálogo de filtro, Escape, retorno de foco e Axe verificados. |
| 22/09/2026 | `npm run build-storybook` após Fase 5 | 5 | Aprovado | 1084 módulos; avisos informativos conhecidos. |
| 22/09/2026 | `npm run tokens:check` após Fase 5 | 5 | Aprovado | Tokens consistentes. |
| 22/09/2026 | `npm run check:governance` após Fase 5 | 5 | Aprovado | Governança standalone aprovada. |
| 22/09/2026 | `npm run check:security` após Fase 5 | 5 | Aprovado | 0 vulnerabilidades no DS e no piloto. |
| 22/09/2026 | `npm run check:size` após Fase 5 | 5 | Aprovado | JavaScript: 5.232.476 bytes / 1.782.542 gzip, dentro do budget. |
| 22/09/2026 | `npm run check:package` após Fase 5 | 5 | Aprovado | 9 entrypoints, 250 bandeiras, 295 arquivos e allowlist correta. |
| 22/09/2026 | `npm run test:package` após Fase 5 | 5 | Aprovado | Consumidor isolado mínimo/completo, ESM, SSR e NodeNext/strict. |
| 22/09/2026 | `npm run test:flags-consumers` após Fase 5 | 5 | Aprovado | Tarball local validado em Next/Turbopack e Vite em produção, sem requests de flags. |
| 22/09/2026 | `npm run typecheck` após documentação Fase 6 | 6 | Aprovado | Fontes, stories e declarações públicas compilados sem erros. |
| 22/09/2026 | `npm run build` após documentação Fase 6 | 6 | Aprovado | ESM, CSS e declarações DTS regenerados; 9 entrypoints disponíveis. |
| 22/09/2026 | `npm run check:package` após documentação Fase 6 | 6 | Aprovado | 9 entrypoints, 250 bandeiras, 295 arquivos e allowlist correta; 4.931.941 bytes compactados. |
| 22/09/2026 | `npm pack --dry-run` / `npm pack --ignore-scripts --json` | 6 | Aprovado | Tarball `aspprev-versi-ds-0.3.0.tgz`, 295 arquivos, 4.931.948 bytes; sem conteúdo fora da allowlist. |
| 22/09/2026 | Instalação temporária do tarball no `por-portal-aspprev` | 6 | Aprovado com pendência | `@aspprev/versi-ds@0.3.0` instalado fisicamente; manifesto do portal ainda declara `^0.1.1`, sem alteração nesta sprint. |
| 22/09/2026 | `por-portal-aspprev` — `npm run typecheck` | 6 | Aprovado | TypeScript do portal passou usando o tarball local. |
| 22/09/2026 | `por-portal-aspprev` — `npm run build` | 6 | Aprovado | Next.js compilou e gerou todas as rotas de produção. |
| 22/09/2026 | `npm test` na revisão final | 6 | Aprovado | 22 arquivos e 95 testes passaram; primeira execução no sandbox falhou por `spawn EPERM` e a repetição autorizada passou. |
| 22/09/2026 | `npm run build-storybook` na revisão final | 6 | Aprovado | 1084 módulos; build concluído com avisos informativos conhecidos de `use client` e chunks grandes. |

Adicionar cada execução real, inclusive falhas intermediárias e a repetição que as resolveu.

### Matriz de acessibilidade

| Cenário | Componentes | Status | Evidência |
|---|---|---|---|
| Teclado completo | OTP, QR, upload, DatePicker, tabela, overlays | Pendente | — |
| Foco visível/retorno | Modal, selects, DatePicker, filtros, upload | Pendente | — |
| Leitor de tela | forms, OTP, QR, upload, FileViewer, status, tabela | Pendente | — |
| Zoom 200% | forms, modal, DatePicker, upload, tabela | Pendente | — |
| Zoom 400% | DatePicker, OTP, upload, tabela adaptive, viewer | Pendente | — |
| Alto contraste | controls, status, QR, chart, tabela | Pendente | — |
| Movimento reduzido | modal, loading, tooltip, cards, viewer | Pendente | — |
| Mobile/tablet/desktop | tabela, filtros, DatePicker, upload, conteúdo | Pendente | — |
| Tabela adaptive e filtros | tabela responsiva, filtros, paginação | Aprovado | Playwright/Axe: 4 cenários Chromium desktop/mobile em 22/09/2026; revisão manual de zoom/leitor de tela ainda pendente. |
| DatePicker por ano | teclado, foco, Escape, retorno e Axe | Aprovado | Playwright/Axe: 2 cenários Chromium desktop/mobile em 22/09/2026. |

## 8. Registro de release

| Campo | Status |
|---|---|
| Versão alvo | `0.3.0` |
| Tipo SemVer | Minor, condicionado à preservação de compatibilidade |
| Changelog | Pendente |
| Tarball | Pendente |
| Validação ASPPrev | Pendente |
| Validação piloto | Pendente |
| Tag | Pendente |
| Publicação npm | Pendente e condicionada à revisão final |

### Checklist de promoção

- [ ] Todos os critérios do plano atendidos ou exceções aprovadas.
- [ ] Não existem mudanças não documentadas na API pública.
- [ ] O tarball contém somente o conteúdo permitido.
- [ ] O ASPPrev instala e compila usando o tarball.
- [ ] O RPPS não foi alterado nesta sprint.
- [ ] A versão e o changelog foram revisados.
- [ ] A tag corresponde exatamente ao `package.json`.
- [ ] A publicação foi explicitamente autorizada após revisão final.

## 9. Riscos e pendências abertas

| ID | Risco/pendência | Impacto | Plano de resposta | Status |
|---|---|---|---|---|
| R-001 | RPPS usa implementação local paralela. | Alto | Adiar para sprint de migração; preservar compatibilidade agora. | Aberto, controlado |
| R-002 | Preferências de foco/link podem não ter efeito CSS. | Alto | Implementar contrato ou removê-lo da promessa. | Mitigado; contrato implementado e testado |
| R-003 | Upload pode absorver regra de negócio. | Alto | Revisar props e manter transporte/persistência fora do DS. | Aberto |
| R-004 | DatePicker e tabela possuem alto acoplamento interno. | Médio/alto | Fazer split interno preservando façade. | Aberto |
| R-005 | Mudança de versão ainda não definida. | Médio | Definir antes do primeiro lote de código. | Mitigado; alvo 0.3.0 definido |
| R-006 | Storybook pode manter IDs antigos. | Médio | Smoke test do catálogo e revisão de build. | Aberto |
| R-007 | A tabela adaptive ainda reutiliza a implementação de tabela antes de um split completo de renderers. | Médio | Planejar separação estrutural em evolução futura, preservando a fachada atual. | Aberto, controlado |
| R-008 | A validação visual automatizada não substitui zoom 200%/400%, leitor de tela e contraste manuais. | Médio | Executar matriz manual na Fase 6 antes da tag. | Aberto |
| R-009 | O `por-portal-aspprev` ainda declara a dependência `^0.1.1`, incompatível com o tarball `0.3.0` quando avaliada pelo `npm ls`. | Médio | Atualizar o manifesto do portal somente na sprint de migração/adoção; não alterar o consumidor nesta release do DS. | Aberto, controlado |

## 10. Histórico de alterações deste registro

| Data | Alteração |
|---|---|
| 22/09/2026 | Documento criado com baseline, escopo, decisão de adiar RPPS e checklist inicial. |
| 22/09/2026 | Registrados os quick wins de ênfase de foco/links e responsividade; validações atualizadas. |
| 22/09/2026 | Registradas as implementações de OTP/QRCode, upload/FileViewer e suas validações. |
| 22/09/2026 | Registrada a Fase 4: DatePicker por ano, contrato de foco/teclado, status configurável e validações desktop/mobile. |
| 22/09/2026 | Registrada a Fase 5: tabela adaptativa, filtros com ciclo de foco, normalização de paginação e validações desktop/mobile. |
| 22/09/2026 | Registrada a Fase 6: documentação, changelog, tarball `0.3.0` e build real do `por-portal-aspprev`. |
