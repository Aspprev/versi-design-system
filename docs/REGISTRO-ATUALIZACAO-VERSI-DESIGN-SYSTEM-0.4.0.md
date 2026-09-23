# Registro vivo — atualização do Versi Design System 0.4.0

Este documento registra decisões, alterações, validações, riscos e pendências da branch `feat/versi-ds-0.4.0`. O registro anterior da versão `0.3.0` permanece em [`REGISTRO-ATUALIZACAO-VERSI-DESIGN-SYSTEM.md`](REGISTRO-ATUALIZACAO-VERSI-DESIGN-SYSTEM.md).

## 1. Estado atual

| Campo | Valor |
|---|---|
| Pacote | `@aspprev/versi-ds` |
| Branch | `feat/versi-ds-0.4.0` |
| Baseline | `v0.3.0` / `cf5d5bd` |
| Versão alvo inicial | `0.4.0`, sujeita à decisão SemVer |
| Release preparado | `0.4.0`, publicação ainda pendente |
| RPPS | Fora do escopo |
| Fase atual | 1 — acessibilidade manual e automatizada |
| Status | Release 0.4.0 preparado; validações automáticas aprovadas; manuais pendentes |
| Próxima ação | revisão final do tarball e validação manual de acessibilidade |

## 2. Log de execução

### 2026-09-22 — abertura da fase 0.4.0

- **Ação:** criada a branch `feat/versi-ds-0.4.0` a partir do commit tagueado `v0.3.0` (`cf5d5bd`).
- **Documentos:** criado `docs/PLANO-ACAO-VERSI-DESIGN-SYSTEM-0.4.0.md` e este registro.
- **Escopo:** hardening, acessibilidade, lint, compatibilidade, Storybook e refatorações internas sem quebra; RPPS permanece separado.
- **Validação:** branch criada com working tree limpo; nenhum código de runtime alterado.
- **Próximo passo:** executar o baseline técnico e construir a matriz de acessibilidade da fase.

### 2026-09-22 — baseline técnico da fase 0.4.0

- **Fase:** 0 — baseline e observabilidade.
- **Validações aprovadas:** `tokens:check`, `check:governance`, `check:security`, `typecheck`, `npm test` (22 arquivos/95 testes), `build`, `check:size`, `check:package`, `test:package`, `test:flags-consumers` e `build-storybook` (1084 módulos).
- **Empacotamento:** 9 entrypoints, 250 bandeiras, 295 arquivos e 4.931.948 bytes compactados; budgets preservados.
- **Consumidores:** ESM, SSR, NodeNext/strict, Next.js e Vite aprovados; nenhum request de `/flags` indevido.
- **Avisos:** Browserslist desatualizado e avisos existentes de diretivas `use client`, chunks grandes e timings do Storybook; nenhum bloqueou o build.
- **Lint:** continua indisponível porque não há script `lint` no `package.json`; será tratado na Fase 2.
- **Resultado:** baseline aprovado; a fase pode avançar para a matriz de acessibilidade sem alteração de runtime.
- **Próximo passo:** executar testes manuais e automatizados de teclado, foco, leitor de tela, zoom, contraste e movimento reduzido.

### 2026-09-22 — matriz automatizada de acessibilidade

- **Ação:** criada a matriz [`MATRIZ-ACESSIBILIDADE-VERSI-DESIGN-SYSTEM-0.4.0.md`](MATRIZ-ACESSIBILIDADE-VERSI-DESIGN-SYSTEM-0.4.0.md), separando evidência automatizada de validação manual.
- **Suíte nova:** `tests/visual/design-system/accessibility-hardening.visual.spec.ts`, cobrindo SkipLink, movimento reduzido no DatePicker e tabela adaptive em viewport estreito/escala ampliada, nos projetos desktop e mobile.
- **Correção aplicada:** normalizados textos em português usados como nomes acessíveis do DatePicker (`referência`, `mês` e `calendário`), incluindo story e contratos de teste.
- **Resultado:** 6/6 cenários Playwright/Axe aprovados; teste unitário focado do DatePicker com 5/5 testes aprovado; typecheck aprovado.
- **Observação:** a verificação de leitor de tela, zoom nativo de 200%/400% e contraste/forced colors continua manual e pendente.

### 2026-09-22 — hardening automatizado de zoom e contraste

- **Suíte ampliada:** `tests/visual/design-system/accessibility-hardening.visual.spec.ts` passou em 12/12 cenários, incluindo Chromium desktop/mobile, `forced-colors: active` e viewports equivalentes a 200%/400% de zoom.
- **Resultado:** tabela adaptive preservou reflow, visibilidade e ausência de overflow nos proxies automatizados; Axe não encontrou violações.
- **Limite da evidência:** os proxies não substituem o zoom nativo do navegador, Windows High Contrast/forced colors do sistema nem a validação com leitor de tela.

### 2026-09-22 — lint incremental e gates de qualidade

- **Configuração:** criado `eslint.config.js` em flat config com ESLint, TypeScript e regras fundamentais de hooks do React.
- **Escopo:** fontes, stories, testes, scripts e configurações do pacote; artefatos gerados permanecem ignorados.
- **Integração:** adicionado o script `npm run lint`, incorporado ao `prepack` e aos workflows de publicação e segurança.
- **Resultado:** lint aprovado com 0 erros e 29 warnings legados documentados; `npm run prepack` aprovado, incluindo tokens, governança, segurança, typecheck, build, size e package check.
- **Correção pontual:** preservada a lógica do sanitizador legado do `Input` com exceções locais para os escapes intencionais.

### 2026-09-22 — primeiro lote de redução de warnings

- **Escopo:** DatePicker, Input, tabela e filtro de tabela.
- **Ajustes:** removidos imports/parâmetros sem uso; corrigida a inicialização de navegação do DatePicker; a prop pública `error` do Input passou a participar do estado visual de erro.
- **Resultado:** warnings reduzidos de 29 para 24; nenhum erro bloqueante; testes focados do DatePicker/Input aprovados (5/5).
- **Compatibilidade:** nenhum entrypoint, nome de componente ou prop pública foi removido.

### 2026-09-22 — release 0.4.0 de acessibilidade e contrato público

- **Table:** linhas de dados agora têm `tabIndex={0}`, foco visível e `aria-describedby` apontando para as células da própria linha; `aria-label` foi preservado.
- **MobileCardTable:** itens agora têm `tabIndex={0}`, mantendo `role="listitem"`, foco visível, nome e descrição.
- **InputSwitch:** substituída a camada que sobrescrevia nomes ARIA por um botão nativo com `role="switch"`, `aria-checked`, teclado, foco, atributos ARIA do consumidor e input de formulário controlado.
- **Exports:** confirmados como oficiais na linha 0.4.x os nove caminhos: raiz, `core`, `forms`, `charts`, `countries`, `documents`, `overlays`, `styles.css` e `themes.css`; README e changelog atualizados.
- **Release candidate:** `package.json`, lockfile e changelog preparados para `0.4.0`; tarball local gerado como `aspprev-versi-ds-0.4.0.tgz`.

### 2026-09-22 — integração do tarball 0.4.0 no consumidor

- **Instalação:** o tarball `aspprev-versi-ds-0.4.0.tgz` foi instalado temporariamente no `por-portal-aspprev` com `--no-save --package-lock=false`.
- **Resultado:** typecheck e build de produção do portal aprovados.
- **Compatibilidade:** `npm ls` identifica a instalação física como `0.4.0`, mas reporta `invalid` porque o manifesto do portal ainda declara `^0.3.0`; a atualização do manifesto permanece fora desta sprint.

### 2026-09-22 — validação manual de acessibilidade concluída

- **Escopo:** leitor de tela, navegação completa por teclado, foco visível, zoom nativo de 200% e 400%, contraste/forced colors e redução de movimento.
- **Resultado:** validação manual informada como aprovada pelo usuário; nenhum bloqueio adicional registrado.
- **Registro:** matriz de acessibilidade atualizada com os cenários manuais aprovados.

### 2026-09-22 — build final do Storybook

- **Resultado:** `npm run build-storybook` aprovado com 1084 módulos.
- **Avisos conhecidos:** diretivas `use client`, chunks grandes e timings do plugin; nenhum erro de compilação.
- **Pendência externa:** a validação do Storybook publicado será feita após o deploy/push, antes da publicação no npm.

## 3. Decisões de API

| Data | Tema | Decisão | Motivo |
|---|---|---|---|
| 22/09/2026 | Compatibilidade | Preservar os entrypoints e props públicas da `0.3.0` durante refatorações internas. | Evitar que melhoria estrutural force migração dos consumidores. |
| 22/09/2026 | RPPS | Não alterar nem migrar o `por-portal-rpps` nesta fase. | Manter a sprint de migração separada. |
| 22/09/2026 | SemVer | Release definido como `0.4.0`, pois a entrega evolui comportamento público de teclado, foco e atributos ARIA sem remover APIs. | Alinhar a versão ao impacto real da entrega. |

## 4. Checklist

- [x] Branch criada a partir de `v0.3.0`.
- [x] Plano de ação criado.
- [x] Registro vivo criado.
- [x] Baseline técnico executado.
- [x] Matriz automatizada de acessibilidade executada.
- [x] Correções de Table, MobileCardTable e InputSwitch implementadas.
- [x] Tarball 0.4.0 validado no consumidor prioritário.
- [x] Matriz manual de acessibilidade executada.
- [x] Lint definido e integrado.
- [ ] Refatorações internas testadas.
- [ ] Storybook publicado validado.
- [x] Tarball e consumidor validados.
- [x] Revisão final e SemVer decididos.

## 5. Validações

| Data | Comando/cenário | Resultado | Observação |
|---|---|---|---|
| 22/09/2026 | `git switch -c feat/versi-ds-0.4.0` | Aprovado | Branch criada a partir de `v0.3.0`; working tree limpo. |
| 22/09/2026 | `npm run tokens:check` | Aprovado | Tokens consistentes. |
| 22/09/2026 | `npm run check:governance` | Aprovado | Governança standalone aprovada. |
| 22/09/2026 | `npm run check:security` | Aprovado | 0 vulnerabilidades no DS e no piloto. |
| 22/09/2026 | `npm run typecheck` | Aprovado | Fontes, stories e declarações públicas compilados sem erros. |
| 22/09/2026 | `npm test` | Aprovado | 22 arquivos e 95 testes. |
| 22/09/2026 | `npm run build` | Aprovado | ESM, CSS e declarações DTS regenerados. |
| 22/09/2026 | `npm run check:size` | Aprovado | Todos os budgets dentro do limite. |
| 22/09/2026 | `npm run check:package` | Aprovado | 9 entrypoints, 250 bandeiras, 295 arquivos e allowlist correta. |
| 22/09/2026 | `npm run test:package` | Aprovado | Consumidor isolado mínimo/completo, ESM, SSR e NodeNext/strict. |
| 22/09/2026 | `npm run test:flags-consumers` | Aprovado | Next/Turbopack e Vite em produção, sem requests indevidos de flags. |
| 22/09/2026 | `npm run build-storybook` | Aprovado | 1084 módulos; avisos informativos conhecidos. |
| 22/09/2026 | `npx vitest run tests/design-system/standalone-datepicker.test.tsx --config vitest.config.ts` | Aprovado | 1 arquivo e 5 testes. |
| 22/09/2026 | `npx playwright test tests/visual/design-system/accessibility-hardening.visual.spec.ts --config=playwright.config.ts` | Aprovado | 6 cenários; Chromium desktop e mobile; Axe sem violações. |
| 22/09/2026 | `npx playwright test tests/visual/design-system/accessibility-hardening.visual.spec.ts --config=playwright.config.ts` (matriz ampliada) | Aprovado | 12 cenários; proxies de 200%/400%, forced colors, desktop/mobile; Axe sem violações. |
| 22/09/2026 | `npm run typecheck` após ajustes do DatePicker | Aprovado | Fontes e stories compilados sem erros. |
| 22/09/2026 | `npm run lint` | Aprovado | 0 erros; 24 warnings legados não bloqueantes após o primeiro lote de limpeza. |
| 22/09/2026 | `npm run prepack` | Aprovado | Tokens, governança, segurança, lint, typecheck, build, size e package check. |
| 22/09/2026 | `npx vitest run tests/design-system/standalone-table.test.tsx tests/design-system/standalone-input-switch.test.tsx --config vitest.config.ts` | Aprovado | 2 arquivos e 6 testes SSR. |
| 22/09/2026 | `npx playwright test tests/visual/design-system/table-responsive.visual.spec.ts tests/visual/design-system/priority-components.visual.spec.ts --config=playwright.config.ts` | Aprovado | 14 cenários desktop/mobile com Axe, teclado e foco. |
| 22/09/2026 | `npm test` | Aprovado | 23 arquivos e 97 testes. |
| 22/09/2026 | `npm run build-storybook` | Aprovado | 1084 módulos; avisos informativos conhecidos. |
| 22/09/2026 | `npm test` | Aprovado | 23 arquivos e 97 testes na versão 0.4.0. |
| 22/09/2026 | `npm run prepack` | Aprovado | Tokens, governança, segurança, lint, typecheck, build, size e package check; 0 erros e 24 warnings legados no lint. |
| 22/09/2026 | `npm pack --ignore-scripts` | Aprovado | `@aspprev/versi-ds@0.4.0`, 9 entrypoints, 295 arquivos e 4,9 MB compactados. |
| 22/09/2026 | `por-portal-aspprev`: instalação temporária do tarball 0.4.0 | Aprovado com pendência | Typecheck e build aprovados; `npm ls` reporta `invalid` porque o manifesto ainda declara `^0.3.0`. |
| 22/09/2026 | Validação manual de acessibilidade | Aprovado | Leitor de tela, teclado, foco, zoom nativo 200%/400%, contraste e redução de movimento validados pelo usuário. |

## 6. Riscos e pendências

| ID | Risco/pendência | Resposta | Status |
|---|---|---|---|
| R-001 | Matriz manual de acessibilidade ainda não executada. | Validação manual concluída e registrada na matriz. | Mitigado |
| R-002 | O portal ainda precisa declarar oficialmente a versão adotada do pacote. | Tratar na sprint de adoção do `por-portal-aspprev`; não alterar o RPPS. | Aberto |
| R-003 | Refatoração de DatePicker/tabela pode gerar regressão estrutural. | Criar testes de contrato antes de alterar internals. | Aberto, controlado |
| R-004 | Lint inicial identificou 24 warnings legados remanescentes em componentes, stories e scripts. | Configuração incremental implantada; reduzir warnings por domínio sem reformatar o legado inteiro. | Parcialmente mitigado |
| R-005 | Havia mojibake em textos acessíveis do DatePicker e ainda existem ocorrências legadas em outros arquivos. | Corrigir o DatePicker nesta fase; inventariar e tratar as demais ocorrências na etapa de qualidade/documentação. | Parcialmente mitigado |

## 7. Próximas ações

1. Criar o commit e a tag `v0.4.0` após a revisão final local.
2. Atualizar a dependência para `^0.4.0` na sprint de adoção do `por-portal-aspprev`.
3. Reduzir os 24 warnings legados restantes por domínio, priorizando componentes de formulário e tabela.
4. Publicar no npm somente após revisão explícita do pacote e da tag.
