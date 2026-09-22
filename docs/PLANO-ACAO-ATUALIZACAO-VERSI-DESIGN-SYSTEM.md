# Plano de ação — atualização do Versi Design System

**Repositório:** `@aspprev/versi-ds`  
**Baseline:** versão `0.2.0`, commit `f9bc501` na branch `master`  
**Referência:** `AUDITORIA-VERSI-DESIGN-SYSTEM.md`  
**Escopo desta execução:** evolução do pacote e validação com o `por-portal-aspprev`  
**Fora do escopo desta execução:** migração do `por-portal-rpps`, que será tratada em outra sprint

## 1. Objetivo

Aplicar as melhorias priorizadas na auditoria sem transformar o Versi em uma camada de negócio dos portais. A atualização deve entregar componentes reutilizáveis, APIs públicas estáveis, acessibilidade verificável, documentação executável e um pacote npm validado em um consumidor real.

O resultado esperado é uma release do DS pronta para ser adotada pelo `por-portal-aspprev` e preparada para a futura migração do RPPS, sem exigir que a migração do RPPS aconteça nesta sprint.

## 2. Princípios de execução

1. **Biblioteca antes do produto:** nenhuma API de autenticação, sessão, tenant, endpoint, Formik field name, regra de benefício ou layout de portal entra no DS.
2. **Compatibilidade primeiro:** preservar exports e props atuais sempre que possível; deprecar antes de remover.
3. **Subpaths públicos:** nenhum consumidor novo usará deep import.
4. **Acessibilidade como contrato:** teclado, foco, nomes, estados, erro, contraste, zoom e reduced motion entram junto com a implementação.
5. **Tokens como fonte:** evitar valores visuais arbitrários e atualizar a fonte declarativa antes dos artefatos gerados.
6. **Teste próximo da mudança:** cada componente novo ou alterado terá teste unitário/interação, story e cobertura de acessibilidade proporcional ao risco.
7. **Integração controlada:** nesta execução, validar o pacote no ASPPrev e no piloto local; não alterar nem migrar o RPPS.
8. **Release reproduzível:** a versão só será promovida após tarball local, instalação em consumidor, validações completas e revisão final.

## 3. Escopo e não escopo

### Incluído

- OtpCodeInput e seus contratos de teclado, paste, erro e formulário.
- QRCode acessível e convergência dos exemplos técnicos.
- Primitives de upload de arquivos e validação genérica.
- FileViewer com lifecycle, estados e documentação de source.
- DatePicker, incluindo seleção por ano e revisão de API.
- StatusBadge/DomainStatusBadge e resolver configurável.
- Tabelas responsivas, filtros, paginação e breakpoints baseados em container.
- Tokens, temas e CSS necessários para as melhorias.
- Acessibilidade, stories, testes, documentação, changelog e empacotamento.
- Validação de tarball no `por-portal-aspprev` e no exemplo/piloto do DS.

### Explicitamente adiado

- Migração de imports e componentes locais do `por-portal-rpps`.
- Alteração de regras de negócio, rotas, autenticação, PEP, header, SideMenu ou shell de qualquer portal.
- Transporte de upload, proxy autenticado, persistência de arquivos e integração com backend.
- Persistência obrigatória de preferências de acessibilidade no DS.
- Remoção de aliases públicos em uma versão não major.

## 4. Estratégia de releases

O baseline do pacote é `0.2.0` e a versão alvo desta atualização foi definida como `0.3.0`. A versão será mantida como minor enquanto as novas APIs forem compatíveis:

- **patch:** correções compatíveis de acessibilidade, estilo, teste ou lifecycle;
- **minor:** novos componentes, novas props ou extensões compatíveis;
- **major:** remoção de alias, alteração incompatível de markup/props, mudança de tokens com impacto de layout ou alteração de requisito de peer.

Não remover aliases históricos nesta execução. Se a padronização exigir mudança, manter façade compatível, marcar depreciação e registrar a remoção para uma major futura.

## 5. Fases de execução

### Fase 0 — Preparação e baseline

**Objetivo:** congelar o ponto de partida e transformar a auditoria em contratos verificáveis.

**Tarefas:**

- [ ] Confirmar a nova versão alvo no `package.json` antes do primeiro lote de implementação.
- [ ] Registrar a versão e o commit no documento vivo `docs/REGISTRO-ATUALIZACAO-VERSI-DESIGN-SYSTEM.md`.
- [ ] Transformar os contratos atuais de public API e entrypoints em checklist de não regressão.
- [ ] Definir matriz de browsers/React/Node usada pela release.
- [ ] Definir quais mudanças exigem visual review e quais exigem migração documentada.
- [ ] Confirmar que o RPPS permanece fora do escopo e não será alterado.

**Saída:** baseline aprovado, versão alvo definida e registro vivo iniciado.

### Fase 1 — Quick wins de qualidade, acessibilidade e documentação

**Objetivo:** corrigir riscos baratos antes de aumentar a superfície funcional.

**Tarefas:**

- [ ] Corrigir e testar encoding de mensagens de tabela/paginação.
- [ ] Formalizar a diferença entre `useBreakpoint` e `useContainerBreakpoint`.
- [ ] Definir o contrato de largura de conteúdo, gutters e breakpoints.
- [ ] Resolver `data-focus-emphasis` e `data-link-emphasis`: implementar regras no DS ou retirar a promessa da API até existir suporte.
- [ ] Documentar aliases canônicos e aliases legados.
- [ ] Criar smoke test de stories críticas e IDs publicados.
- [ ] Adicionar stories dedicadas para QRCode, upload e FileViewer.
- [ ] Criar a matriz de acessibilidade para teclado, foco, zoom 200%/400%, contraste e reduced motion.

**Critério de aceite:** nenhum quick win fica sem teste ou documentação associada; o build atual continua verde.

### Fase 2 — Primeiro lote funcional: OtpCodeInput e QRCode

**Objetivo:** consolidar as necessidades pequenas, compartilhadas e de alto impacto.

#### OtpCodeInput

- [ ] Revisar controlled/uncontrolled e precedência entre `value` e `values`.
- [ ] Garantir máscara sem estado mutável em `RegExp` global/sticky.
- [ ] Definir semântica e frequência de `onComplete`.
- [ ] Garantir label, helper, erro, `aria-describedby` e anúncio de conclusão/erro.
- [ ] Validar Tab, Shift+Tab, setas, Home/End, Backspace, Delete, paste e autoFocus.
- [ ] Criar adapter opcional para formulário sem acoplar o primitive ao Formik.
- [ ] Adicionar story de estados e testes de interação/Axe.

#### QRCode

- [ ] Definir formato de saída e comportamento de loading/erro.
- [ ] Validar `ariaLabel`, `description`, valor inválido e conteúdo não visual.
- [ ] Revisar contraste de `fgColor`/`bgColor` e formatos de cor aceitos.
- [ ] Criar story dedicada com níveis, margem, tamanhos e erro.
- [ ] Adicionar teste de acessibilidade e integração de consumo.
- [ ] Documentar substituição segura dos wrappers técnicos nos produtos, sem alterar o RPPS nesta sprint.

**Critério de aceite:** APIs públicas documentadas, teclado completo, testes verdes e sem dependência de regra de negócio.

### Fase 3 — Upload de arquivos e FileViewer

**Objetivo:** criar uma base reutilizável para os fluxos duplicados sem transportar API ou formulário de produto.

#### Upload

- [ ] Definir tipos públicos para arquivo aceito, rejeitado, erro e status.
- [ ] Separar seleção/drag-and-drop de validação e de transporte.
- [ ] Tornar `FileDropzone` plenamente controlável quanto a `id`, `name`, label, descrição, erro e disabled.
- [ ] Consolidar `FileList`, item individual, progresso, retry e remoção.
- [ ] Criar utilitário puro de validação de tamanho, MIME/extensão e quantidade.
- [ ] Garantir mensagens anunciadas, foco visível, alternativa sem drag-and-drop e estados de erro por arquivo.
- [ ] Não adicionar `fetch`, Formik obrigatório, `alert`, confirmação de negócio ou nome de campo.
- [ ] Criar stories de seleção, rejeição, múltiplos arquivos, progresso, retry, disabled, alto contraste e zoom.
- [ ] Adicionar testes unitários, interação, Axe e visual.

#### FileViewer

- [ ] Definir contrato de source resolvido: URL, Blob ou objeto com metadados.
- [ ] Corrigir/revisar criação e revogação de object URLs.
- [ ] Tratar race conditions e desmontagem durante leitura assíncrona.
- [ ] Adicionar `onLoad`/`onError` onde fizer sentido e mensagens acessíveis.
- [ ] Exigir/documentar título de iframe e revisar sandbox do PDF.
- [ ] Separar renderização genérica de fetch/proxy/download autenticado.
- [ ] Criar stories próprias para imagem, PDF, texto, JSON, fallback, loading e erro.
- [ ] Adicionar testes de lifecycle, erro, acessibilidade e download local.

**Critério de aceite:** os primitives podem ser compostos no ASPPrev sem conhecer sessão, endpoint ou nome de campo; nenhuma regra de upload do portal entra no pacote.

### Fase 4 — DatePicker, status e acessibilidade transversal

**Objetivo:** estabilizar componentes existentes que concentram risco de API e interação.

#### DatePicker

- [ ] Mapear a API atual e escolher `disabled` como nome canônico.
- [ ] Preservar `isDisabled` temporariamente como alias documentado, se necessário.
- [ ] Separar internamente input/parsing, popover, navegação, grid e seleção mês/ano.
- [ ] Testar `selectionMode="year"` com min/max, teclado, foco e mudança de ano.
- [ ] Validar strings, locale, parsing e value Date/string/null.
- [ ] Testar zoom 200%/400%, mobile e container estreito.
- [ ] Criar adapter de formulário separado.

#### Status

- [ ] Manter `StatusBadge` como primitive visual.
- [ ] Tornar `resolveStatusAppearance` configurável ou aceitar mapa do consumidor.
- [ ] Cobrir status desconhecido, vazio, acentuado, domínio e placeholder.
- [ ] Documentar a fronteira entre visual compartilhado e mapa de negócio.

#### Acessibilidade transversal

- [ ] Garantir focus ring e link emphasis nos atributos oficiais.
- [ ] Cobrir focus trap/return em Modal, Select, DatePicker e filtros.
- [ ] Testar leitores de tela nos componentes P0.
- [ ] Validar `prefers-reduced-motion` e `data-motion="reduce"` em animações novas.
- [ ] Verificar contraste de estados disabled, hover, focus, erro e high contrast.

**Critério de aceite:** APIs compatíveis, comportamento de teclado documentado e matriz P0/P1 aprovada.

### Fase 5 — Tabelas responsivas e contrato de conteúdo

**Objetivo:** evoluir responsividade sem duplicar tabela visual ou acoplar o DS ao shell do portal.

- [ ] Definir o modelo headless de colunas, ordenação, filtros e paginação.
- [ ] Separar modelo de renderers `table`, `adaptive` e cards.
- [ ] Revisar foco e retorno do popover de filtros.
- [ ] Usar largura de container quando a decisão for baseada no espaço disponível.
- [ ] Revisar semântica de `MobileCardTable`, especialmente `tabIndex=0` e controles internos.
- [ ] Definir `ContentContainer` somente se o markup e o comportamento forem realmente compartilhados.
- [ ] Documentar `fit`, `adaptive` e `scroll` com exemplos de escolha.
- [ ] Testar filtros, ordenação, paginação, tabela vazia/erro, sticky header e zoom.
- [ ] Testar mobile, tablet, desktop e contêiner estreito com e sem sidebar simulada.

**Critério de aceite:** tabela acessível em todos os modos e sem regressão de API nos consumidores atuais.

### Fase 6 — Compatibilidade, documentação e pacote

**Objetivo:** preparar a release para adoção e para a futura migração do RPPS.

- [ ] Atualizar README, stories MDX, API docs e exemplos.
- [ ] Atualizar `CHANGELOG.md` com novidades, correções, depreciações e migração.
- [ ] Atualizar `docs/EVOLUCAO-DESIGN-SYSTEM.md` com o resumo técnico da release.
- [ ] Conferir exports root e subpaths; evitar deep imports nos exemplos.
- [ ] Atualizar testes de public API e entrypoints.
- [ ] Gerar tokens e conferir arquivos derivados.
- [ ] Executar typecheck, lint, testes, acessibilidade, visual, build, Storybook, governança, segurança, tamanho e package check.
- [ ] Gerar tarball com `npm pack`/script equivalente.
- [ ] Instalar o tarball no `por-portal-aspprev` e executar typecheck/build/testes aplicáveis.
- [ ] Validar o exemplo/piloto local com o tarball.
- [ ] Não instalar nem migrar o RPPS nesta fase; registrar a preparação da futura migração.
- [ ] Fazer revisão final da API, SemVer e conteúdo do tarball.

**Critério de aceite:** tarball instalável e validado no ASPPrev/piloto, sem falha na matriz de qualidade.

## 6. Ordem recomendada de commits

Manter commits pequenos e temáticos para facilitar revisão e rollback:

1. `chore: definir baseline e contratos da próxima versão`
2. `fix: corrigir acessibilidade e quick wins do design system`
3. `feat: estabilizar otp e qrcode`
4. `feat: evoluir primitives de upload e file viewer`
5. `refactor: separar adapters e estabilizar datepicker`
6. `feat: evoluir status, tabelas e breakpoints de container`
7. `docs: atualizar exemplos, migração e changelog`
8. `release: preparar versi-ds vX.Y.Z`

O texto pode ser adaptado à convenção do repositório, mas cada commit deve passar nos testes proporcionais à alteração e deixar o documento vivo atualizado.

## 7. Matriz de validação obrigatória

| Validação | Quando | Critério |
|---|---|---|
| `npm run tokens:check` | tokens/temas/CSS | gerados e consistentes |
| `npm run check:governance` | toda fase relevante e release | contratos e regras aprovados |
| `npm run typecheck` | cada lote | fontes, stories e testes tipados |
| `npm run lint` | cada lote | sem novos erros; avisos justificados |
| `npm test` | cada lote | testes unitários e contratos verdes |
| testes de interação | OTP, QR, upload, DatePicker, tabela | teclado, foco e estados aprovados |
| Axe/a11y | P0/P1 e release | sem violações conhecidas nos cenários cobertos |
| `npm run test:visual` | alterações visuais | diferenças revisadas manualmente |
| `npm run build` | cada lote e release | todas as entradas compilam |
| `npm run build-storybook` | stories e release | build publicado sem story crítica quebrada |
| `npm run check:size` | dependência/componente | orçamento preservado ou aumento justificado |
| `npm audit`/segurança | dependências e release | vulnerabilidades tratadas/documentadas |
| `npm run check:package` | release | allowlist, exports e conteúdo corretos |
| `npm run test:package` | release | tarball isolado, ESM, SSR e tipos |
| piloto/tarball ASPPrev | release | instalação e build do consumidor aprovados |

Se algum script tiver outro nome no `package.json`, registrar o comando efetivamente usado no documento vivo, sem omitir a categoria de validação.

## 8. Critérios de pronto da atualização

A atualização só estará pronta quando:

- [ ] todos os itens P0 estiverem implementados ou formalmente adiados;
- [ ] as APIs públicas estiverem documentadas e testadas;
- [ ] não houver deep imports novos;
- [ ] o `por-portal-aspprev` consumir o tarball com sucesso;
- [ ] o RPPS continuar explicitamente fora da alteração desta sprint;
- [ ] acessibilidade e responsividade tiverem evidência de teste;
- [ ] changelog, evolução, stories e exemplos estiverem atualizados;
- [ ] SemVer estiver justificado;
- [ ] o tarball tiver sido inspecionado e validado;
- [ ] houver revisão final antes de qualquer publicação npm.

## 9. Gestão de riscos

| Risco | Mitigação | Responsável pelo acompanhamento |
|---|---|---|
| API quebra o ASPPrev | adapters, testes de contrato e tarball antes da release | implementação do DS |
| RPPS diverge durante a sprint | não alterar RPPS; registrar decisão e manter aliases | manutenção da próxima sprint |
| Upload absorve regra de negócio | revisar toda prop em busca de endpoint, sessão, campo ou Formik | revisão arquitetural |
| Foco funciona no desktop e falha no zoom | matriz explícita de zoom/container e testes de interação | acessibilidade |
| Bundle aumenta com QR/upload/viewer | check de tamanho por entrypoint e dependências peer quando adequado | empacotamento |
| Token gerado é editado diretamente | validar fonte JSON e rodar `tokens:check` | foundations |
| Storybook publica ID inválido | smoke test do catálogo e revisão do build estático | documentação |
| Release sem rollback claro | tarball, commit/tag separados e checklist final | release |

## 10. Próximo passo imediato

1. Definir a versão alvo da atualização.
2. Atualizar o registro vivo com essa decisão.
3. Iniciar a Fase 1 e fechar os quick wins antes do lote de componentes.
4. Implementar OtpCodeInput e QRCode como primeiro lote funcional.
