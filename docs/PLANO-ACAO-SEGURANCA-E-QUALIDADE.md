# Plano de ação — Segurança e qualidade

Data da avaliação: 11/10/2026.

O diagnóstico e o roteiro abaixo preservam a avaliação inicial. Consulte a
seção final para a implementação e os resultados na branch de melhorias.

## Objetivo

Corrigir as vulnerabilidades identificadas, melhorar a validação das aplicações
consumidoras e tornar a preparação das releases mais previsível, preservando a
API pública e o comportamento visual dos componentes.

## Diagnóstico

| Escopo auditado | Resultado |
| --- | --- |
| Design System completo | 8 alertas: 6 altos e 2 moderados |
| Dependências de produção do DS (`--omit=dev`) | Zero alertas conhecidos |
| Aplicação piloto | 1 alerta alto em `source-map-js` |

Os alertas do DS estão na cadeia de ferramentas de build. Parte dos oito
alertas representa efeitos transitivos das mesmas vulnerabilidades, e não
oito falhas independentes nos componentes. A ausência de alertas na auditoria
de produção não equivale a uma certificação de segurança da biblioteca.

A publicação da versão 0.5.1 está bloqueada por `check:security`. As demais
validações realizadas passaram: 134 testes unitários, TypeScript, build,
limites de tamanho, divisão de bundles, conteúdo do pacote e testes de
navegador dos comportamentos corrigidos. O lint terminou com zero erros e
19 avisos existentes.

## Ordem de execução

| Etapa | Prioridade | Ação | Situação |
| --- | --- | --- | --- |
| 1 | Alta | Atualizar `source-map-js` no DS e no piloto | Implementado |
| 2 | Alta | Melhorar os relatórios de auditoria | Implementado |
| 3 | Alta | Automatizar os testes de integração no CI | Implementado; execução remota após push |
| 4 | Alta | Padronizar piloto e preparação de releases | Implementado |
| 5 | Alta | Resolver a cadeia vulnerável do Tailwind | Implementado mantendo Tailwind 3; snapshot local mantido pelo projeto |
| 6 | Média | Reduzir os avisos de lint | Concluído: zero erros e zero avisos |

As etapas 1 a 4 formam o primeiro lote de melhorias. A etapa 5 deve ser
desenvolvida em uma branch dedicada, pois envolve compatibilidade visual e
de navegadores. A atualização de `source-map-js`, isoladamente, não elimina
os demais alertas nem desbloqueia a publicação.

## 1. Atualizar `source-map-js`

### Ações

- Atualizar a dependência transitiva de `1.2.1` para `1.2.2` no DS e no piloto.
- Preferir a resolução compatível pelo lockfile; avaliar overrides somente
  se a atualização normal não resolver a cadeia instalada.
- Revisar os diffs dos dois lockfiles para evitar mudanças desnecessárias.
- Executar nova auditoria, build do DS e build do piloto.
- Verificar a geração e leitura dos sourcemaps.

A simulação `npm audit fix --dry-run` confirmou a atualização disponível no
DS sem exigir uma mudança de versão principal. A aplicação e a validação
dessa atualização ainda estão pendentes.

### Critérios de conclusão

- Nenhuma instalação de `source-map-js` abaixo de `1.2.2` nas árvores afetadas.
- O alerta correspondente deixa de aparecer nas auditorias.
- Builds e sourcemaps funcionam após instalação pelos lockfiles atualizados.

Referência: [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).

## 2. Melhorar o relatório de segurança

Arquivo principal: `scripts/check-security.mjs`.

### Ações

- Auditar DS e piloto mesmo quando um dos escopos apresentar vulnerabilidades.
- Apresentar pacote, gravidade, cadeia afetada e disponibilidade de correção.
- Distinguir os resultados completos dos resultados de produção.
- Salvar relatórios JSON como artefatos do CI para investigação.
- Distinguir falha de rede/registry de uma auditoria concluída com alertas.
- Consolidar o resultado e retornar falha ao final se houver bloqueios.

### Critérios de conclusão

- Uma execução mostra o resultado dos dois projetos.
- Falhas de infraestrutura não são reportadas como zero vulnerabilidades.
- A checagem continua bloqueando os achados conforme a política vigente.
- Os relatórios ficam acessíveis na execução do workflow.

## 3. Automatizar testes de integração no CI

Arquivos principais: `.github/workflows/security.yml`,
`.github/workflows/publish.yml` e `playwright.config.ts`.

### Ações

- Acionar as validações também para mudanças em testes, stories, configurações
  de navegador e exemplos consumidores.
- Executar `test:info-grid-consumer` em CI com Chromium instalado.
- Executar os testes de interação de `InputPhone` e `SelectCountry` em desktop
  e mobile, incluindo `showFlags={false}`.
- Incorporar os testes do pacote instalado pelo tarball à validação de release.
- Disponibilizar relatórios e traces de falhas como artefatos do CI.
- Organizar os jobs para que a etapa de publicação dependa das validações.

### Critérios de conclusão

- Uma alteração somente em testes ou stories dispara a validação aplicável.
- Regressões de colunas responsivas e bandeiras são detectadas automaticamente.
- O teste do consumidor usa o CSS distribuído e Tailwind com geração parcial,
  sem alias para os fontes do DS.
- A publicação não ocorre quando uma validação obrigatória falha.

## 4. Padronizar piloto e preparação de releases

### Ações

- Remover a referência desatualizada ao tarball `0.2.0` do fluxo de preparação
  do piloto e usar o artefato da versão em validação.
- Compartilhar uma preparação consistente do piloto entre os workflows de
  segurança e publicação, incluindo manifesto, lockfile e instalação.
- Padronizar a versão do Node usada nos workflows, atualmente 22 e 24,
  respeitando os requisitos das ferramentas.
- Conferir a correspondência entre tag, `package.json` e `package-lock.json`.
- Verificar instalação limpa e conteúdo do tarball antes da publicação.
- Preservar o histórico das tags já distribuídas; correções posteriores devem
  seguir o versionamento da próxima release, sem mover tags publicadas.

### Critérios de conclusão

- O piloto validado usa exatamente o artefato da release candidata.
- Os workflows reproduzem o mesmo processo de preparação.
- Divergência entre tag e versão impede a publicação.
- A preparação documentada funciona a partir de um checkout limpo.

## 5. Resolver a cadeia vulnerável do Tailwind

### Diagnóstico

- O projeto usa `tailwindcss@3.4.13`.
- `braces@3.0.3` é trazido por `chokidar` e `micromatch`; na data da avaliação,
  o aviso de segurança não apresentava uma versão corrigida de `braces`.
- `postcss-selector-parser@6.1.4` também está na cadeia do Tailwind. A correção
  disponível é `7.1.6`, fora da versão principal atualmente utilizada.
- O npm sugere Tailwind 4 para resolver parte da cadeia. Essa sugestão precisa
  ser validada por uma nova auditoria após a migração.

### Ações

- Criar uma branch dedicada para avaliar a migração para Tailwind 4.
- Confirmar os navegadores suportados pelos produtos consumidores antes da
  decisão: Tailwind 4 exige Safari 16.4+, Chrome 111+ e Firefox 128+.
- Revisar CLI, integração PostCSS, configuração de tokens e breakpoints,
  diretivas CSS, utilities e estilos padrão.
- Verificar o isolamento entre o CSS do DS e o Tailwind dos consumidores,
  preservando a customização por `className`.
- Executar testes unitários, visuais, de acessibilidade e do pacote distribuído.
- Validar o portal ASPPrev e o piloto com o novo CSS.
- Executar auditoria completa da árvore resultante e investigar alertas restantes.
- Se a migração não for compatível com os requisitos dos consumidores,
  avaliar uma correção mantida da dependência ou alternativa de build.

Não aplicar `npm audit fix --force` nem impor versões principais transitivas
sem validar compatibilidade. Não remover a auditoria das ferramentas apenas
para permitir a publicação. Eventual exceção de risco exige decisão explícita,
justificativa, escopo e prazo de revisão.

### Critérios de conclusão

- A cadeia vulnerável foi removida ou corrigida com uma solução mantida.
- A auditoria atende à política de segurança do projeto.
- A API pública, os breakpoints, os temas e os navegadores suportados foram
  validados, e eventuais mudanças estão documentadas.
- O pacote funciona nas aplicações consumidoras sem repetir classes internas
  ou exigir correções específicas de layout.

Referências:

- [Braces — GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
- [PostCSS selector parser — GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).
- [Guia oficial de migração do Tailwind](https://tailwindcss.com/docs/upgrade-guide).

## 6. Reduzir os avisos de lint

### Ações

- Priorizar dependências de hooks e callbacks, avaliando o comportamento antes
  de alterar seus arrays de dependências.
- Revisar variáveis, props e atribuições não utilizadas.
- Corrigir avisos em lotes pequenos, com validação dos componentes afetados.
- Evitar desabilitar regras de forma ampla para eliminar avisos.

### Critérios de conclusão

- Os avisos existentes foram corrigidos ou possuem justificativa localizada.
- Os componentes afetados mantêm o comportamento esperado.
- Novas alterações não aumentam a quantidade de avisos.

## Condições para liberar a próxima publicação

- Auditorias do DS e do piloto concluídas e aprovadas conforme a política.
- Instalação limpa, tokens, governança, lint e TypeScript aprovados.
- Testes unitários e testes obrigatórios de navegador aprovados.
- Build, limites de tamanho, divisão de bundles e conteúdo do pacote aprovados.
- Consumidor validado com o artefato exato da release.
- Versões dos manifestos e tag consistentes.
- Notas da release atualizadas com mudanças e requisitos de integração.

## Execução na branch `chore/seguranca-e-qualidade`

O diagnóstico e as ações propostas acima registram a avaliação inicial. As
melhorias foram implementadas nesta branch. O usuário confirmou a necessidade
de navegadores anteriores aos mínimos do Tailwind 4; por isso a migração foi
descartada. A solução usa Tailwind 3, parser de seletores 7.1.6 e um snapshot
privado de `braces` com limite de profundidade e testes próprios. Essa mitigação
tem responsabilidade de manutenção local e não representa um patch upstream.

Validações locais: instalação limpa do DS, quatro auditorias sem alertas,
140 testes unitários, TypeScript, lint sem avisos, build, tokens, limites de
tamanho e divisão de bundles. O CSS distribuído permaneceu idêntico ao anterior.
O teste do consumidor InfoGrid passou com todas as opções de colunas, limites
de breakpoints, duas ordens de CSS e customização por `className`.
Os 20 testes de bandeiras, teclado e acessibilidade passaram em desktop/mobile.
O preparo do piloto realizou instalação limpa do tarball atual e comparou
todos os arquivos distribuídos; seu build também passou. Os sourcemaps foram
lidos com a versão atualizada de `source-map-js`.
Os oito testes do piloto passaram em desktop/mobile e nos quatro temas.
Os consumidores isolados com React 18 e 19 passaram com todos os entrypoints
e declarações TypeScript em modo strict. O gate de auditoria também passou em quatro testes
focados após acrescentar a validação de relatórios malformados.

Detalhes de integração, gates e manutenção:
[Segurança do build e compatibilidade](SEGURANCA-BUILD-COMPATIBILIDADE.md).
A tag `v0.5.1` não foi movida; estas mudanças devem integrar uma nova release.
