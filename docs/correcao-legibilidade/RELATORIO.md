# Correção de legibilidade — VERSI DS

Correções implementadas e versão 0.5.8 preparada localmente, sem commit, tag ou publicação. A base anterior era 0.5.7. Os placeholders comuns, de alto contraste e desabilitados foram expressamente excluídos da correção e têm sua preservação verificada por testes.

## Ambientes distinguidos

- **Pacote instalado no portal:** 0.5.7, sem os sete identificadores novos no `dist/themes.css`; o status slate outline no `dist/styles.css` instalado usa `25,28,31`.
- **Fonte local anterior à correção:** já continha os sete clientes e as quatro variantes, ainda não publicados. Os snapshots funcionais mantinham o defeito dos status no escuro comum. `BASELINE-ANTES.json` registra seus valores RGB computados, não apenas o número da versão.
- **Propostas fornecidas:** os `tema-*.json/css` originais continuam intactos em `docs/temas-clientes`. Permanecem referência de identidade; defeitos funcionais não são reintroduzidos para obter igualdade com esses arquivos.
- **Fonte corrigida:** `tokens/design-system.tokens.json` continua sendo a fonte de verdade. Os CSS e o adaptador Tailwind foram gerados pelo fluxo existente. `AJUSTES-FUNCIONAIS.json` documenta as diferenças intencionais em relação à baseline para os testes e a migração da prévia.

## Achados e tratamento

| Componente / contexto | Situação | Causa e correção |
| --- | --- | --- |
| Status outline, escuro, página/card/tabela/muted | Confirmado e corrigido | Tokens claros eram reutilizados. Definidos texto e borda claros por cor, com neutros independentes da marca. |
| Status soft, escuro | Corrigido | Conteúdo claro sobre fundos escuros discretos, sem reutilizar a superfície clara. |
| Status primary outline/soft | Corrigido | Usava diretamente `primary-*`. Passa a ter tokens próprios de conteúdo, borda e fundo vinculados ao papel semântico de link. O solid continua ligado à ação primária. |
| Status no alto contraste | Confirmado e corrigido | Alguns pares funcionavam no card mas falhavam em muted. Os pares são definidos considerando todos os quatro fundos efetivos. |
| DomainStatusBadge / desconhecidos | Confirmado e preservado | O DS não tem mapeamento de negócio embutido. Resolver, precedência e fallback continuam os mesmos; corrigida a paleta do fallback. |
| Ações outline/plain, links e navegação | Confirmado e corrigido | Rótulos usavam a primária de preenchimento como texto. Abas, períodos, seleções e detalhes de navegação passam a usar os papéis de conteúdo, sem mudar a escala de marca. |
| Button hover/active no alto contraste | Corrigido | O fundo podia mudar sem atualizar o primeiro plano. Acrescentados tokens de conteúdo por estado, mantendo os tokens anteriores e seus fallbacks. |
| Checkbox / radio selecionados | Corrigido nos papéis funcionais | Marca branca/círculo sobre algumas cores claras tinha pouca definição. Ajustados apenas os tokens de seleção; as escalas primary/secondary/tertiary e brand-accent ficam intactas. |
| Radio cards e itens selecionados | Corrigido | Fundos claros de `primary-5` reapareciam no escuro. Usados fundo semântico de ação sem preenchimento ou par de seleção, conforme a anatomia. |
| Switch on/off, knob e ícones | Confirmado e corrigido | Foram avaliados fundo real do knob e trilha, não o `color` herdado do botão. Criados papéis próprios para ícones. Corrigido knob do alternador de tema e referências que resolviam no host errado. |
| Helper de erro no alto contraste escuro legado | Confirmado e corrigido | Usava vermelho profundo sobre preto. Passa a resolver o conteúdo semântico de erro no contexto correto. |
| Campos, selects e ícones | Exercitados | Texto preenchido, erro, ícones, seleções e estados desabilitados entram na galeria. Placeholders permanecem exatamente como antes. |
| Tabela / card | Exercitados | Status são medidos sobre o fundo real. A tabela da galeria usa uma área limitada, para não sobrepor os exemplos seguintes. |
| Tooltip / dropdown / modal | Exercitados | Herança pelo body, primeiro plano e fundo efetivo; estilos do pacote são injetados sem o CSS do Storybook nos testes distribuídos. |
| Gráficos montados, eixos e legendas | Exercitados | Troca de tema/modo e seleção sem recarregar a página, com leitura do fill real do texto SVG. |
| Tooltip dos gráficos | Corrigido | A biblioteca injeta CSS próprio. Regras limitadas a `.versi-chart` usam tokens semânticos, com especificidade suficiente e sem novo `!important`. |
| Porcentagens do donut | Confirmado e corrigido | O texto sobre fatias claras ou padrões tinha fundo variável. Incluído um retângulo SVG neutro atrás de cada rótulo; todos os valores continuam visíveis. Apex pie não implementa a opção `dataLabels.background`. |
| Equivalência html/body, classe/atributo | Confirmado e corrigido | Referências herdadas e regras de modo antigas produziam resultados diferentes. Os contextos são alinhados ao resultado canônico anterior de html/atributo, somado às correções documentadas. |
| Calendário e preferências | Corrigido no fonte, cobertura parcial | Substituídos usos diretos de primária como conteúdo. Os fluxos completos de calendário e de todas as preferências não foram reexecutados nesta matriz; não são declarados integralmente aprovados. |

## Antes / depois medido

Status outline no card escuro da custom2133 (`27,33,40`), sem overrides inline. Outros temas usam os mesmos pares funcionais de status no escuro.

| Cor | Antes | Depois |
| --- | ---: | ---: |
| Slate / fallback | 1,06:1 | 10,92:1 |
| Black | 1,29:1 | 13,16:1 |
| Blue | 1,70:1 | 8,99:1 |
| Red | 1,56:1 | 8,55:1 |
| Yellow | 2,37:1 | 12,30:1 |

Essas medições dos modos comuns são evidência diagnóstica, não um bloqueio geral WCAG nem aprovação automática por ultrapassar um corte numérico. Há uma história **Laboratório → Legibilidade → Antes e depois dos status**, com os valores anteriores identificados como referência e os componentes atuais sem overrides.

## Mapeamento real do portal

Consulta somente de leitura a `por-portal-aspprev/src/config/status-map.ts` e ao adaptador `src/components/status-badge/domain-status-badge.tsx`:

- 46 status no mapa global, com exceções por domínio.
- `REPROVADO` não está no mapa: usa `{ color: "slate", appearance: "outline" }`.
- `ATIVO` é green solid, exceto em `loan`, onde é blue solid.
- O mapa não foi alterado nem transferido para a API de negócio do DS.

`PORTAL-STATUS-MAP-REFERENCIA.json` é um snapshot de leitura usado apenas na documentação e nas histórias. A matriz reproduz os 46 status e dois casos de fallback em cada um dos 11 domínios. Assim, a correção não transforma REPROVADO arbitrariamente em vermelho.

## Impacto nos claros em produção

custom2178, custom2140 e custom2156 mantêm suas escalas de marca, acentos, superfícies e placeholders. Os ajustes funcionais são pontuais: definição da trilha off e do knob/ícone de tema, papéis de conteúdo em navegação/seleção e comportamento de estados quando aplicável. O controle de contrato continua semântico, sem depender da paleta de identidade. Os links de conteúdo desses três claros já eram mais escuros e não são redesenhados.

Os ajustes exatos por tema/modo estão em `AJUSTES-FUNCIONAIS.json`. Tokens legados e props públicas não foram removidos. O status primário e estados de ação ganharam papéis adicionais; a entrada `styles.css` também recebe defaults funcionais para o tema padrão, inclusive sem `themes.css`.

## Validação e limites

- Pares matemáticos de status, ações, controles, ícones, feedback e gráficos no alto contraste, além de regressões de fallback e proteção dos placeholders/hierarquia textual.
- Cores computadas, fundos ancestrais, transparência e opacidade de grupo em componentes reais, aguardando as transições da subárvore.
- Matriz das famílias nos 18 temas e quatro modos. Status são examinados em página, card, tabela e muted; domínio e fallback também são renderizados.
- CSS distribuído validado em documentos isolados e nos componentes reais, removendo todos os estilos do Storybook antes de carregar `dist/styles.css` / `dist/themes.css`. O tema padrão também é exercitado com apenas `styles.css`.
- Gráficos montados, tooltip, seleção, foco, teclado e portais têm testes próprios. Para texto SVG, a medição usa `fill`; para as porcentagens, considera o retângulo efetivamente pintado atrás do texto.
- A matriz completa de cores roda no desktop; há verificação responsiva específica e as galerias de cliente também têm teste em viewport de celular.

No alto contraste, os pares aplicáveis seguem [contraste mínimo de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) e [contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html). Textos comuns usam 4,5:1; textos grandes e indicadores não textuais aplicáveis usam 3:1. Controles desabilitados são registrados e revisados visualmente, respeitando a exceção normativa; seu `color` não é confundido com o knob. Os placeholders são protegidos contra alterações e ficam fora da presente aprovação.

Não há declaração de conformidade WCAG completa. Cores/formatadores e HTML customizados pelo consumidor, sobreposições arbitrárias, imagens/gradientes sob texto, todos os fluxos de calendário e o portal completo continuam dependentes de validação no contexto. As propostas não são códigos oficiais de manual de marca.

## Consumir no portal e sincronizar a prévia

Nenhum arquivo do portal foi modificado. O pacote instalado ainda é 0.5.7; não basta olhar esse número para saber se contém o build local corrigido. Para teste antes de publicar, use um tarball local recém-gerado e confirme o CSS carregado.

1. Importe `styles.css` e depois `themes.css` do build corrigido.
2. Aplique um identificador novo (`custom2133`, `custom2178`, etc.) em uma única identidade no html ou body. Não deixe uma classe legada conflitante no outro host.
3. Modo/contraste ficam no html; mantenha `data-contrast-theme` alinhado ao esquema efetivo.
4. **Desligue a prévia antiga com `?previewTema=0` para avaliar o DS limpo.** O componente `TenantThemePreview` aplica e reaplica snapshots inline no body; atualizar apenas o CSS não vence esses valores.
5. Para manter a prévia, sincronize suas funções/snapshots ou deixe que os valores funcionais venham do pacote. Mantenha somente a identidade necessária e os placeholders desejados; não reintroduza a paleta funcional antiga.

Ao ajustar o código da prévia, interrompa a reaplicação dos snapshots antes de limpar os valores. Remover uma vez pelo DevTools não é uma migração: a prévia observa mudanças de modo e pode escrevê-los novamente. Os tokens funcionais incluem `--status-*`, `--action-*`, `--feedback-*`, `--selection-*`, `--switch-*`, `--checkbox-*`, `--radio-*`, `--chart-*`, `--focus-ring`, `--content-link`, `--content-brand-secondary`, `--content-on-brand` e `--field-assistive-error`. **Não remova/recalcule placeholders, content-secondary ou as escalas de marca para fazer esta limpeza.**

Use a lista de diferenças documentadas para sincronizar a prévia e compare separadamente: DS limpo, prévia atualizada e prévia antiga. O teste de reprodução confirma que `style="--status-slate-outline-foreground:25,28,31"` no body volta a encobrir a correção; removê-lo restaura o valor correto.

## Verificação final — 20/10/2026

- 203 testes unitários passaram na suíte completa; outros 67 testes direcionados passaram após ampliar a cobertura de controles e gráficos.
- 18 testes da matriz de componentes passaram nos quatro modos. A rodada final do CSS distribuído, interações, gráficos e celular passou com 58 testes.
- Os 288 contextos de CSS construído confirmaram os valores esperados e a preservação dos placeholders, incluindo variantes desabilitadas.
- Build do pacote e do Storybook, TypeScript, lint sem avisos, geração de tokens, tamanho, composição do bundle, conteúdo do pacote e navegação passaram. O catálogo contém 322 entradas e 49 componentes.
- Evidências conferidas visualmente: [status antes/depois](evidencias/status-custom2133-antes-depois.png), [controles claros](evidencias/controles-custom2133-claro.png) e [gráficos escuros](evidencias/graficos-custom2133-escuro.png).

## Referências de implementação

- `tokens/design-system.tokens.json` e suas saídas geradas: pares por modo e normalização de host.
- `StatusBadge`, `Button`, `InputSwitch`, radio cards, seleções, abas, períodos, preferências e calendário: papéis funcionais.
- `src/components/chart/donut-data-labels.ts`, componentes de gráfico e `src/styles.css`: rótulos e tooltips sem cores fixas inadequadas.
- `stories/laboratory/Legibility.stories.tsx`: matriz completa e comparação antes/depois.
- `tests/design-system/standalone-legibility.test.ts` e os testes `legibility*.visual.spec.ts`: matemática, CSS distribuído e interações.
- Baseline e diferenças nesta pasta; referências recebidas preservadas. Os limites de CSS foram ajustados ao conteúdo efetivo, mantendo verificações de tamanho e compressão.

```sh
npm run build
npm run tokens:check
npm run typecheck
npm run lint -- --max-warnings=0
npm test
npx playwright test legibility.visual.spec.ts legibility-distribution.visual.spec.ts legibility-interactions.visual.spec.ts legibility-mobile.visual.spec.ts
```
