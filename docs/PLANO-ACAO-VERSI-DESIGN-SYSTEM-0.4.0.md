# Plano de ação — Versi Design System 0.4.0

**Repositório:** `@aspprev/versi-ds`
**Branch:** `feat/versi-ds-0.4.0`
**Baseline:** `v0.3.0` / commit `cf5d5bd`
**Consumidor prioritário:** `por-portal-aspprev`
**RPPS:** fora do escopo desta fase

## 1. Objetivo

Consolidar a versão `0.3.0` em uma base mais observável, acessível e sustentável, reduzindo riscos antes de novas ampliações de componentes. Esta fase prioriza validação real, qualidade de automação e refatorações internas sem alterar desnecessariamente a fachada pública.

## 2. Princípios

- Preservar os entrypoints públicos e evitar deep imports.
- Manter o pacote genérico, sem regras de negócio ou dependências específicas dos portais.
- Preferir mudanças aditivas e compatíveis; qualquer quebra exige decisão major.
- Tratar acessibilidade manual e automatizada como critério de aceite.
- Não migrar nem alterar o `por-portal-rpps` nesta fase.
- Não publicar uma nova versão sem tarball, consumidor real e revisão final.

## 3. Escopo

### Incluído

- Matriz manual de acessibilidade: teclado, foco, leitor de tela, contraste, zoom 200%/400% e redução de movimento.
- Automação de lint e integração com os comandos de qualidade existentes.
- Hardening de tabelas, DatePicker, upload, FileViewer, OTP, QRCode e status.
- Refatoração interna do DatePicker e separação progressiva dos renderers da tabela, preservando a API pública.
- Verificação do Storybook publicado e prevenção de regressões de IDs/catalogação.
- Documentação de compatibilidade, depreciações e migração.
- Testes de consumidor com React 18/19 e os entrypoints públicos.

### Fora do escopo

- Migração do `por-portal-rpps`.
- Regras de negócio, APIs, autenticação, transporte de arquivos ou persistência.
- Header, SideMenu, modal de PEP ou qualquer componente específico de portal.
- Publicação automática e alterações diretas na `master`.

## 4. Fases de execução

### Fase 0 — baseline e observabilidade

- [ ] Confirmar branch limpa a partir de `v0.3.0`.
- [ ] Registrar versão alvo somente após o baseline técnico.
- [ ] Inventariar scripts de qualidade e lacunas de cobertura.
- [ ] Definir matriz de browsers, React e Node suportados.

### Fase 1 — acessibilidade manual e automatizada

- [ ] Executar teclado completo e foco visível em componentes interativos.
- [ ] Testar leitores de tela e nomes/estados acessíveis.
- [ ] Validar zoom 200% e 400% em formulários, tabelas, DatePicker, upload e FileViewer.
- [ ] Revisar contraste normal/alto e movimento reduzido.
- [ ] Registrar evidências, falhas, correções e exceções aprovadas.

### Fase 2 — qualidade e lint

- [ ] Escolher configuração compatível com TypeScript, React e Storybook atuais.
- [ ] Adicionar script `lint` sem reformatar arquivos não relacionados.
- [ ] Corrigir erros introduzidos pela fase e separar avisos legados.
- [ ] Integrar lint ao `prepack`/CI quando a execução for determinística.

### Fase 3 — refatorações internas sem quebra

- [ ] Extrair adapters/módulos do DatePicker mantendo a fachada atual.
- [ ] Separar modelo headless, renderer de tabela e renderer de cards progressivamente.
- [ ] Manter `fit`, `adaptive`, `scroll`, paginação, filtros e aliases compatíveis.
- [ ] Adicionar testes de contrato antes de remover ou alterar internals.

### Fase 4 — Storybook e compatibilidade

- [ ] Validar catálogo publicado e IDs de stories após o deploy.
- [ ] Criar smoke tests para stories críticas e entrypoints.
- [ ] Testar consumidores com React 18 e React 19 quando possível.
- [ ] Atualizar documentação de migração e depreciações.

### Fase 5 — release candidate

- [ ] Atualizar changelog e registro vivo.
- [ ] Executar tokens, governança, segurança, lint, typecheck, testes, build e Storybook.
- [ ] Gerar tarball e inspecionar allowlist, exports e declarações.
- [ ] Instalar o tarball no `por-portal-aspprev` e validar typecheck/build.
- [ ] Registrar explicitamente a pendência de migração do RPPS.
- [ ] Fazer revisão final antes de definir a versão SemVer e criar tag.

## 5. Critérios de aceite

- Nenhuma quebra pública não documentada.
- Todos os entrypoints continuam disponíveis e sem deep imports.
- Testes unitários, de interação, visual/Axe e de consumidor aprovados.
- Lint disponível ou exceção documentada com causa técnica.
- Matriz manual de acessibilidade executada e registrada.
- Storybook publicado sem stories órfãs ou IDs inválidos.
- Tarball reproduzível e limitado ao conteúdo permitido.
- `por-portal-aspprev` instala e compila com a versão candidata.
- RPPS permanece inalterado.

## 6. SemVer e promoção

A versão alvo inicial é `0.4.0`, condicionada à preservação da compatibilidade. Se a fase produzir apenas correções internas/documentais, reavaliar `0.3.x`. Uma tag só pode ser criada após os critérios de aceite, revisão final e autorização explícita.

## 7. Entregáveis

- Código e testes da fase.
- Stories e documentação atualizadas.
- Matriz de acessibilidade com evidências.
- Changelog e registro vivo.
- Relatório de compatibilidade e riscos.
- Tarball local validado no consumidor prioritário.
