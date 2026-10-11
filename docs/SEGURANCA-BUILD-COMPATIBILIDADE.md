# Segurança do build e compatibilidade de navegadores

## Decisão

Os produtos consumidores precisam manter suporte a navegadores anteriores aos
mínimos exigidos pelo Tailwind 4. O DS continua usando Tailwind 3.4.13; não foram
introduzidos os requisitos de CSS ou de navegadores do Tailwind 4.

## Correções

- `source-map-js` foi atualizado de 1.2.1 para 1.2.2 nos lockfiles do DS e do piloto.
- `postcss-selector-parser` usa override para 7.1.6, cuja compatibilidade com o
  build e com o CSS distribuído deve passar pelos testes do pacote e de navegador.
- `braces` usa um snapshot local privado de build, `@aspprev/braces-build`, com
  a licença MIT original e limites de profundidade para o parser e os walkers.
  Consulte `vendor/braces-build/README.md` para origem, alterações e manutenção.

O snapshot não é uma correção publicada pelo upstream. É código mantido neste
repositório para mitigar GHSA-vfj7-8cjw-p6xm enquanto não há patch upstream
compatível. A mudança de nome identifica essa responsabilidade; zero alertas
de registry, sozinho, não valida a correção local.

O pacote local é uma dependência de desenvolvimento chamada `braces`, com
override `$braces` para os consumidores transitivos. `.npmrc` configura
`install-links=true`: o npm copia o pacote local e instala suas dependências,
sem depender de symlinks ou scripts de pós-instalação. Não editar `node_modules`.

## Gates obrigatórios

`npm run check:build-security` verifica a resolução real de `braces` a partir
de `micromatch` e `chokidar`, compara os arquivos instalados com o snapshot e
exercita parse/compile/expand/stringify com padrões de 4.000 níveis. Também
confere a versão do parser de seletores. Inputs acima de 100 níveis estruturais
são rejeitados antes da recursão; globs comuns preservam o comportamento.

`npm run check:security` executa esse gate e quatro auditorias: DS e piloto,
cada um com escopo completo e de produção. Falha de rede, relatório inválido
ou vulnerabilidades bloqueiam a checagem. Os relatórios ficam em
`test-results/security`, incluindo a evidência da mitigação local.

Os testes de segurança incluem ASTs externos profundos/cíclicos, limites,
globs normais, falha do registry e divergência entre tag e manifestos.
A mitigação não torna globs arbitrários seguros: padrões de build devem
permanecer confiáveis, e os limites existentes de expansão permanecem ativos.

## CI e release

Os workflows de segurança e publicação compartilham `validate.yml`, com Node 24.
Mudanças somente em stories, testes, exemplos ou configurações também acionam
validação. O fluxo gera o pacote, prepara o piloto com esse tarball, audita os
dois projetos e executa lint sem avisos, TypeScript, testes unitários, testes de
consumidores com React 18/19 e testes de navegador em desktop/mobile.

A publicação depende dessas validações, confere a tag e publica o tarball
validado pelo job anterior. O preparo do piloto usa `pack --ignore-scripts`
para evitar recursão do prepack e auditoria de um piloto desatualizado.
As validações continuam obrigatórias após o preparo.

## Evidências locais

Na branch `chore/seguranca-e-qualidade`, passaram a instalação limpa do DS e
do piloto, as quatro auditorias, a suíte de 140 testes unitários e os quatro
testes focados de auditoria após a última alteração, lint sem avisos,
TypeScript, build, tokens, governança, limites de tamanho, divisão de bundles
e conteúdo do pacote. Os consumidores isolados React 18/19 passaram com
todos os entrypoints e TypeScript strict. Passaram também os 20 testes de
países/bandeiras, os oito testes do piloto e a matriz responsiva do InfoGrid.

O CSS gerado foi comparado byte a byte com o anterior e permaneceu idêntico;
os sourcemaps gerados foram lidos com `source-map-js` atualizado. Os workflows
foram validados como YAML localmente; a execução no GitHub depende do push.

## Manutenção contínua

- Revisar semanalmente o advisory e as releases upstream do `braces`. Dependabot
  não substitui automaticamente o snapshot local por um patch do registry.
- Revisar o snapshot quando a cadeia de build mudar. Não aceitar atualizações
  apenas porque os nomes dos pacotes deixam de aparecer no audit.
- Quando houver correção upstream compatível, remover snapshot, dependência
  local e override, reinstalar e repetir os gates de segurança e compatibilidade.
- Não mover a tag `v0.5.1` para incluir estas mudanças. Preparar uma nova versão
  após revisar e validar o conjunto de alterações.

Referências:

- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- https://github.com/advisories/GHSA-rj75-hqrm-r3gf
- https://github.com/advisories/GHSA-68fv-2mgg-jv7q
- https://tailwindcss.com/docs/upgrade-guide
