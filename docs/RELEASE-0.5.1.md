# Release 0.5.1

- Corrige o layout responsivo de `InfoGrid` quando o Tailwind do consumidor gera
  apenas parte das mesmas utilities. O componente usa seletores próprios com
  baixa especificidade, preservando todas as opções de `columns` e overrides
  explícitos por `className`.
- `showFlags={false}` em `InputPhone`/`PhoneInput` e
  `SelectCountry`/`CountrySelect` oculta somente a bandeira do campo. As listas
  de países mantêm suas bandeiras, inclusive após busca e troca de seleção.
- Inclui testes de navegador do artefato npm para os breakpoints do InfoGrid e
  testes de interação em desktop/mobile para as bandeiras dos seletores.

## Atualização dos consumidores

Atualize `@aspprev/versi-ds` para `0.5.1`, incluindo o JS e o CSS distribuídos.
Mantenha a importação de `@aspprev/versi-ds/styles.css`.
O contorno `className="tablet:grid-cols-3 desktop:grid-cols-6"` pode ser removido
do portal ASPPrev: `<InfoGrid columns={6}>` entrega 1, 2, 3 e 6 colunas nos
breakpoints de 640px, 1024px e 1440px. Não é necessário incluir o pacote no
`content` do Tailwind nem configurar `safelist`.

## Publicação

A tag anotada `v0.5.1` identifica o commit desta release. O workflow
`.github/workflows/publish.yml` publica no npm ao receber a tag, usando o
ambiente `npm-publish` e trusted publishing.

## Validações

- Tokens e governança: aprovados.
- Lint: 0 erros, 19 warnings existentes.
- TypeScript: fontes e stories aprovados.
- Suíte unitária: 29 arquivos, 134 testes aprovados.
- Build, limites de tamanho, divisão de bundles e conteúdo do pacote: aprovados.
- InfoGrid: tarball 0.5.1 aprovado em Chromium para todas as opções de colunas,
  limites dos breakpoints, duas ordens de CSS e overrides por `className`.
- Bandeiras: 4 testes de interação aprovados em Chromium desktop/mobile para
  `InputPhone` e `SelectCountry`.
- `prepack`: bloqueado pela auditoria descrita abaixo.

### Bloqueio de publicação encontrado na preparação

Em 11/10/2026, `npm run prepack` aprovou tokens e governança, mas foi
interrompido por `check:security`: o audit do DS reportou 8 vulnerabilidades
(6 high e 2 moderate), incluindo efeitos transitivos. Os pacotes reportados
foram `braces`, `chokidar`, `fast-glob`, `micromatch`, `postcss-nested`,
`postcss-selector-parser`, `source-map-js` e `tailwindcss`.

A consulta ao registry confirmou `braces@3.0.3` como versão mais recente,
ainda afetada por GHSA-vfj7-8cjw-p6xm. O npm sugeriu Tailwind 4 para resolver
parte da cadeia; essa migração não foi incluída nas correções desta release.
O audit do piloto não chegou a executar, pois o audit do DS interrompe o script.

O commit e a tag locais registram as correções, mas **a publicação permanece
bloqueada pela auditoria**. Enviar a tag dispara o workflow, que deverá parar
na etapa de segurança enquanto esse bloqueio não for resolvido. A checagem
de segurança foi preservada.
