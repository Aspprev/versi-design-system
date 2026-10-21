# Temas de cliente — proposta para revisão

Os sete JSONs e CSSs desta pasta foram extraídos de `docs/temas-clientes-para-ds.zip` e são as referências recebidas. Os JSONs usam um esquema de exportação; o contrato nativo continua em `tokens/design-system.tokens.json`. Não há atualização de versão nem publicação nesta integração.

## Identificadores

| Cliente | `data-ds-theme` ou classe |
| --- | --- |
| BASF | `basf` |
| FUNSSEST | `funssest` |
| Mais Previdência | `maisprevidencia` |
| ACEPREV | `aceprev` |
| Cibrius | `cibrius` |
| SERPROS | `serpros` |
| E-Invest | `einvest` |

Os nomes legados permanecem disponíveis. O ajuste local anterior de `rosa1` escuro também foi preservado: `aceprev` é uma identidade independente, baseada no JSON recebido, com fundos neutros e ações alternativas neutras.

## Consumir no portal

Depois de consumir um build do pacote que contenha esta integração, importe os dois CSS uma única vez, nesta ordem:

```css
@import "@aspprev/versi-ds/styles.css";
@import "@aspprev/versi-ds/themes.css";
```

```html
<html lang="pt-BR" data-ds-theme="aceprev"
  data-color-scheme="dark" data-contrast="normal"
  data-contrast-theme="dark">
```

| Variante do JSON | `data-color-scheme` | `data-contrast` | `data-contrast-theme` |
| --- | --- | --- | --- |
| `light` | `light` | `normal` | `light` |
| `dark` | `dark` | `normal` | `dark` |
| `high-light` | `light` | `high` | `light` |
| `high-dark` | `dark` | `high` | `dark` |

A identidade pode estar no `html` ou no `body`, como classe (`class="aceprev"`) ou atributo. Modo e contraste ficam no `html`. Prefira uma única identidade no documento; o `body` permite que dropdowns e modais portados herdem os mesmos valores. Contextos de tema restritos a um contêiner precisam propagar a identidade aos seus próprios portais.

O pacote exporta `CLIENT_THEMES`, `LEGACY_THEMES`, `DESIGN_SYSTEM_THEMES`, `ClientTheme` e `DesignSystemTheme` pelas entradas raiz e `/core`. Não é necessário importar JavaScript para usar os CSS.

As cores são canais RGB: `color: rgb(var(--content-primary))`. Use `--brand-accent-1/2/3` somente em detalhes opcionais da marca. Feedback de erro, sucesso, aviso e informação continua independente. O degradê decorativo verde–azul de E-Invest não é um token RGB e não foi aplicado automaticamente a controles.

Ao adotar os novos nomes, remova os overrides temporários equivalentes do portal. Nenhum arquivo do portal foi alterado por esta integração.

Para experimentar antes de publicar, gere um tarball local com `npm run build` e `npm pack --ignore-scripts --pack-destination test-results`. No consumidor, instale o caminho desse `.tgz` para a revisão local. O número de versão continua 0.5.7; confirme que o consumidor está usando o arquivo recém-gerado. Essa operação não publica no npm.

## Preservação dos claros de produção

Cada claro preservado contém 232 tokens. As escalas de marca e os placeholders continuam preservados. Valores funcionais defeituosos são corrigidos conforme o relatório de legibilidade, com diferenças explícitas em `../correcao-legibilidade/AJUSTES-FUNCIONAIS.json`. Os demais modos contêm 233 tokens. As ações alternativas neutras são aplicadas nos modos reformulados, respeitando a exceção dos claros preservados.

A comparação com o estado local do DS 0.5.7 revelou estas diferenças, já existentes entre o snapshot exportado e o preset local:

| Novos temas | Token | Snapshot mantido | Preset local antes da integração |
| --- | --- | --- | --- |
| BASF / Mais Previdência (`laranja1`) | `--content-link` | `146, 68, 0` | `234, 113, 0` |
| FUNSSEST (`laranja2`) | `--content-link` | `181, 68, 22` | `242, 93, 33` |
| Os três claros | `--chart-1` | `15, 98, 193` | Primária laranja de cada preset |

Os três acentos `--brand-accent-*` são novos e não existiam nos presets locais. Os outros 227 valores de cada snapshot coincidem com o contexto local comparado. A implementação mantém os snapshots nos novos nomes e não modifica os presets laranja para fazê-los coincidir.

O registro agrupa valores idênticos entre clientes por variante. Cada identidade adiciona seus valores específicos. As referências exportadas continuam resolvidas nos testes; nenhuma mudança de representação pode alterar o resultado computado. O gerador também considera os tokens de cor dos temas para produzir o adaptador Tailwind.

## Validação e limites

O teste `client-themes.visual.spec.ts` compara todos os valores computados aos JSONs nos 28 contextos e nas quatro formas de aplicar a identidade. Também exercita componentes, hover/active, foco, dropdown e modal, além de trocar o tema com gráficos já montados. O teste de regressão local comparou 176 contextos legados com o CSS anterior à integração.

As verificações de alto contraste adotam os critérios aplicáveis de [contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) e [contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html): texto comum 4,5:1; indicadores necessários de controles e gráficos 3:1. Estados desabilitados são examinados visualmente, sem tratar a exceção normativa como falha. Identidade e conforto visual orientam os modos comuns; seus índices não bloqueiam esta proposta.

Essas verificações não constituem certificação WCAG completa, aprovação final das paletas ou códigos oficiais de marca. Conteúdo, composição das páginas, uso de cor, nomes acessíveis e navegação completa do portal ainda dependem de revisão no consumidor. Os gráficos usam legendas e padrões no alto contraste; dados e séries específicos precisam ser avaliados no contexto.

Gráficos montados observam mudanças de classe, atributos e estilos no `html`/`body`. Cores explicitamente fornecidas pelo consumidor continuam sendo respeitadas nos modos comuns; no alto contraste, prevalece o tema. `getChartTheme()` e `getChartSeriesRecord()` continuam funções de leitura: o consumidor deve chamá-las novamente quando construir opções externas após uma troca de tema.

Os testes reais encontraram três causas corrigidas sem alterar os RGB aprovados: regras de foco de alto contraste fixavam branco/amarelo e ignoravam o token do cliente; o donut enviava `stroke` indefinido ao ApexCharts; o gráfico de linhas enviava `annotations` indefinido ao atualizar. O alias interno `--focus-indicator-color` faz os novos clientes seguirem `--focus-ring`, mantendo os fallbacks visuais anteriores dos legados. Opções vazias dos gráficos passam a ser objetos, preservando os defaults da biblioteca.

```sh
npm run tokens:check
npm run typecheck
npm run lint
npm test
npx playwright test client-themes.visual.spec.ts
```

Abra **Temas → Clientes → [cliente]** no Storybook para revisar cada uma das quatro variantes. A toolbar e o laboratório também oferecem os sete nomes novos; **Comparação** mantém a lista dos presets legados separada.

## Arquivos principais alterados

- `tokens/design-system.tokens.json`: registro nativo, regras compartilhadas e valores específicos de cada cliente.
- `src/tokens.css`, `src/themes.css`, `tokens/tailwind-colors.cjs`: saídas do gerador.
- `src/theme-presets.ts`, `src/index.ts`, `src/core.ts`: nomes, listas e tipos públicos.
- `src/hooks/useChartTheme.ts` e os componentes `TimeSeriesChart` / `InteractiveDonutChart`: atualização de gráficos montados e correção das opções vazias.
- `stories/themes/*`, `stories/ThemeLab.stories.tsx`, `.storybook/*` e a matriz de cores: apresentação e seleção das identidades.
- `tests/visual/design-system/client-themes.visual.spec.ts` e o workflow de validação: contratos, contraste e interações.
- `scripts/generate-tokens.mjs` e `scripts/check-size.mjs`: descoberta de tokens dos presets e orçamento do CSS das sete novas famílias. O CSS dos temas e suas correções funcionais usa agrupamento de valores compartilhados, com limites de 180 kB / 18 kB gzip.
- `README.md`, `CHANGELOG.md` e esta pasta: integração, referências e diferenças conhecidas.

## Validação inicial, anterior às correções funcionais de legibilidade

- 148 testes unitários existentes passaram.
- 38 testes no navegador passaram: 7 contratos completos, 28 demonstrações, troca de tema com gráficos montados, galeria no celular e herança de portais com classe/atributo no html/body.
- Comparados 26.084 valores RGB computados com os JSONs, sem arredondamento ou alteração da paleta.
- Os 176 contextos legados comparados mantiveram seus tokens anteriores; os três claros preservados mantiveram os 232 valores de cada referência.
- As 28 demonstrações não apresentaram erros de execução dos gráficos durante as interações exercitadas. Os limites e escopo da verificação de acessibilidade estão descritos acima.

O estado atual e os impactos pontuais nos claros preservados estão em [Correção de legibilidade](../correcao-legibilidade/RELATORIO.md). As referências originais continuam disponíveis; os testes aplicam as diferenças funcionais documentadas para não reintroduzir defeitos do snapshot.
