# Escuro + Alto contraste universal

Implementação local no VERSI DS, preparada para a versão **0.8.0** após a validação inicial sobre a 0.7.4. Nenhum arquivo do portal foi editado; sem commit, push, tag ou publicação pelo agente. Esta decisão substitui somente o alto contraste escuro descrito nas referências anteriores.

## Ativação e precedência

A política ativa exclusivamente com `html[data-color-scheme="dark"][data-contrast="high"]`. Não depende de `data-contrast-theme`: um valor antigo desse atributo não permite que o tenant recupere sua paleta neste modo. Cobre os 18 temas registrados, classe e `data-ds-theme`, html/body e escopos aninhados. Previews com tokens inline normais também são vencidos nos escopos públicos. Portais montados no body herdam a mesma política, mesmo quando o tema foi aplicado em outro elemento.

Os valores estão na fonte canônica `tokens/design-system.tokens.json`; o gerador preserva a propriedade `important` sem misturá-la aos valores RGB. O CSS gerado mantém essa prioridade estritamente dentro da combinação indicada. Os ajustes de renderização de SVGs, tooltips, avisos e gráficos ficam em `src/high-contrast-dark.css`, importado por `styles.css`. Não é preciso um novo import público de CSS.

As referências principais foram os arquivos atuais do portal `src/styles/high-contrast-dark.css`, `tests/accessibility/high-contrast-dark.test.ts`, `src/utils/chart-theme.ts`, `public/images/` e `src/app/_portal/header/components/user-visualization-button.tsx`. `docs/TEMA-ESCURO-ALTO-CONTRASTE.md` contém decisões intermediárias: o azul principal das ilustrações e a primeira paleta suave de gráficos foram descartados, conforme os valores finais do CSS e deste pedido.

## Alterações incorporadas

| Recurso | Resultado no DS | Referência confirmada | Remoção possível após atualizar o consumidor |
|---|---|---|---|
| Estrutura e tipografia | Página preta, cards #121212, muted #202020; texto principal #FFFF00, secundário claro, links #AAAAFF e desabilitado #00FF00 | CSS final do portal; tokens computados | Declarações correspondentes em high-contrast-dark.css |
| Ações e seleção | Ações primária/secundária amarelas com foreground preto; seleção branca sobre #005A00; foco amarelo e bordas claras | CSS final e contrato dos componentes | Overrides de paleta/foreground, após conferir os componentes locais |
| Primária outline pressionada | Foreground branco da seleção sobre #005A00 (8,53:1), sem mudar o preto das ações preenchidas | Falha reproduzida na matriz completa de estados; Button e selection-content | Incorporada no DS; nenhuma correção específica do portal necessária |
| Correção adicional da validação de release | No claro + alto contraste de custom2178, outline pressionada usa selection-content #833F00 sobre #F5F0EB (9,02:1), em vez do foreground branco de marca (1,13:1) | Matriz completa e comparação dos 72 pares de seleção | Incorporada em styles.css; nenhuma paleta alterada. Única mudança adicional de foreground fora do escuro HC; outros temas claros e modos comuns preservados |
| Feedback e status | Informação #93C5FD/#0C1A2C, sucesso #6EE7A0/#082012, atenção #FFE680/#261E00, erro #FFB3BD/#2A1016, neutro #D4DBE2/#181C22 e laranja #FFC08A/#281808; soft/outline/solid preservam seus papéis | CSS e testes de acessibilidade do portal | Overrides dos papéis semânticos |
| Avisos | Notice recebe um marcador semântico e usa a cor de seu papel também com textColor="default", exclusivamente neste modo; gray usa o par neutro | Requisito de avisos semânticos e componentes atuais | Recolorações locais de Notice equivalentes |
| Campos | Superfície #121212, foreground claro, erro rosa, desabilitado e placeholder desabilitado verdes; placeholder comum #C7C7C7 | CSS final | Overrides de campo deste modo; os outros três modos mantêm os placeholders anteriores |
| Gráficos | Doze cores vivas iguais em chart/donut, apoios de gráfico, saldo e investimento distintos; cinzas de atenuação; eixos, grade e tooltips legíveis | CSS final e chart-theme.ts | Overrides de tokens; não manter outra paleta paralela |
| Texturas e interação | Padrões existentes do donut e estilos das linhas mantidos; identificação por legenda, valores e teclado; limites pretos de 2px entre fatias luminosas | Componentes de gráfico e comportamento HC existente | Não remover legendas, padrões, valores ou navegação |
| Rótulos numéricos | Halo preto de 4px antes do preenchimento; backdrop semântico anterior continua | CSS final e decorador de labels do DS | Regra local equivalente de apexcharts-datalabels |
| Tooltips/slider | content-inverse branco e surface-tooltip preto; borda clara; títulos e conteúdos internos legíveis, inclusive portal do Tooltip | CSS final; componentes Tooltip e Slider | Overrides de tooltip/slider/Apex equivalentes |
| Ilustrações | Principal e apoio 1 amarelos; apoio 2 verde, apoio 3 lilás; variantes suaves próprias; ink preto puro; cores completas CSS válidas e tokens de canais preservados | CSS final, SVGs e decisão de reversão para amarelo | Blocos locais de variáveis de ilustração |
| Banner | Campo amarelo, área escura preta, texto completo preto, dois círculos brancos; roupas azul/rosa/lilás | portal-banner.tsx e seletores finais do CSS | Seletores locais do banner ao usar o componente do DS |
| Pix recorrente | Quatro notas no mesmo apoio verde; marcadores condicionais preservam o lilás anterior nos outros modos | pix-recorrente-img.tsx atual | Cópia local após substituir o import pelo componente do DS |
| Busca | Aro e cabo da lupa pretos apenas neste modo | Dois paths identificados em search.tsx | Cópia local após substituir o import |
| Ajustes anteriores | Ferramentas cinzas; checkbox de Vantagens em uma cor; moedas #EAB308/detalhes #A16207 e notas cinzas; check #42BE65/X #D80813 fixos de Acesso indisponível; camisas completas da contribuição | SVGs atuais e contrato anterior do DS | Cópias locais dos componentes adotados; geometria e classes base preservadas |
| Visualizar como usuário | Par semântico action-secondary-background/content coerente nos quatro modos; escala secondary-1 preservada | globals.css e user-visualization-button.tsx atuais; 72 contextos medidos | **Pendente no consumidor:** substituir bg-secondary-1 por bg-action-secondary-background antes de retirar o override; ver contrato abaixo |

A paleta viva final é **#39FF70, #66B3FF, #FFB000, #CC99FF, #FF859D, #00FFE5, #FF78F1, #FFFF00, #00D4FF, #BCFF00, #FF9944, #AFA0FF**. Não há suavização de 22% neste modo. As quatro cores atenuadas são as do CSS final; elas são distintas e destinam-se às séries não selecionadas. A meta ampliada de 7:1 se aplica às doze cores vivas contra página, card e muted; as atenuadas continuam distinguíveis, com contraste de pelo menos 3:1 sobre esses fundos.

## Diferenças técnicas em relação à cópia literal do CSS

A validação de release acrescentou uma correção de componente no claro + alto contraste de custom2178, explicitada na tabela acima. Ela troca somente o foreground da primária outline pressionada pelo papel da seleção, sem alterar tokens, SVGs, ações secundárias ou modos comuns. Os outros três modos continuam com os mesmos tokens e cores dos SVGs; essa preservação não deve ser interpretada como ausência da correção pontual de componente no HC claro.

- Não foram reintroduzidos `tertiary-*`, `action-tertiary-*` ou aliases antigos de secondary. `text-tertiary` continua válido. `--portal-primary-content` não é API do DS; os foregrounds corretos pertencem aos papéis action-*.
- `--illustration-primary-content` e `--illustration-brand-accent-N-content` são **canais RGB**. Os locais `--illustration-accent`, `--illustration-ink`, `--illustration-support`, `--illustration-on-primary` e semelhantes são **cores CSS completas**. Foi corrigida a inconsistência do CSS local, que colocava rgb(...) em primary-content e poderia produzir rgb(rgb(...)).
- Textos/checks sobre apoios suaves usam branco, evitando o preto do apoio sólido sobre variantes escuras. Os papéis explicitamente semânticos success/error/warning das ilustrações continuam ligados aos status correspondentes, em vez de serem todos amarelos. Cores narrativas fixas não recebem essa conversão.
- Os ícones derivados de switch foram explicitados na política universal com seus papéis success/danger/warning. Checks nativos e proxies usam o símbolo preto neste modo, inclusive com data-contrast-theme antigo.
- Os checks semânticos de Ativar Pix e Mobile Inbox recebem foreground preto neste modo, mantendo o símbolo legível sobre o sucesso claro. Seus fills brancos nos outros modos foram preservados. O check e o X de Acesso indisponível continuam fixos nas cores solicitadas.
- `data-illustration-informative` permite usar texto/símbolos informativos sobre superfícies da interface sem reutilizar o ink narrativo preto de cabelo. `data-illustration-on-success` identifica o foreground semântico legado. Nenhum painel foi acrescentado atrás dos SVGs.
- As mudanças de nota/lupa são condicionais por marcador semântico: não copiamos os fills/acentos alterados para todos os modos. O banner preserva a classe base e acrescenta portal-banner; o texto usa uma variável com fallback branco e o campo recebe um papel específico.
- Foram eliminadas 47 regras de tokens antigas exclusivas de HC escuro. O orçamento combinado de CSS continua **390 KB**: 10 KB foram realocados de themes.css para styles.css, sem elevar o total. O CSS distribuído combinado caiu de 381.975 para aproximadamente 341 mil bytes. Nenhum limite de JS foi aumentado.

Não há conflito de valores pendente no DS. A homologação e a adoção no portal permanecem pendentes; o estado de uma sessão real de preview não foi acessado.

## Adoção no portal

Depois de atualizar a dependência e trocar os imports dos assets que ainda forem locais, poderá ser retirado `src/styles/high-contrast-dark.css` e seu import no layout. Fazer essa retirada somente após comparar a renderização do consumidor com o DS: os seletores de assets precisam encontrar os marcadores das versões migradas.

Se o consumidor conservar temporariamente seus SVGs locais, manter os marcadores/classe de banner e as associações de paths de Pix/lupa até substituir os imports; o DS não altera arquivos TSX externos. A geometria é a mesma, mas as correções condicionais do DS dependem de seus atributos.

A função `softenDonutColor` de `src/utils/chart-theme.ts` deve ser retirada ao adotar os tokens circulares centralizados da reconciliação anterior, ou substituída pelo `getChartTheme` público de `@aspprev/versi-ds/charts`. A proteção contra suavização em HC já existe no consumidor; não é preciso uma transformação nova para este modo.

Devem continuar no consumidor: o botão/autorização de visualização como usuário e sua classe semântica; autenticação, códigos e seleção de cliente; persistência e controles de preferência; laboratório e estado de preview; layout, safe areas e regras exclusivas do portal. Não retirar esses comportamentos ao remover os overrides de cor.

## Contrato de ações secundárias nos quatro modos

`secondary-1` é uma escala de paleta e não promete correspondência com `action-secondary-content`. Não foi recolorida para corrigir o uso misto do portal. O contrato reutilizável já existente no DS é:

`bg-action-secondary-background text-action-secondary-content`

Para interações, usar os pares `hover:bg-action-secondary-background-hover hover:text-action-secondary-content-hover` e `active:bg-action-secondary-background-active active:text-action-secondary-content-active`. Ícones devem herdar `currentColor`. O Button secundário do DS já usa os papéis semânticos.

| Modo | Contrato confirmado nos 18 temas | Menor contraste do estado padrão |
|---|---|---|
| Claro | Par semântico existente preservado | 12,83:1 |
| Escuro comum | Foreground e ícone legíveis sobre o background semântico; nenhuma alteração da escala legada | 11,23:1 |
| Claro + alto contraste | Par semântico existente preservado | 12,83:1 |
| Escuro + alto contraste | #000000 sobre #FFDF00, hover/ativo sobre #FFEF80 | 15,81:1 |

Os 72 contextos e os três estados por contexto passaram no contraste de texto de pelo menos 4,5:1; no alto contraste escuro, pelo menos 7:1. O limite anterior do claro + alto contraste foi preservado: há estado de interação com 4,64:1, portanto não se afirma 7:1 em todos os seus estados. Valores, estados e contraste da combinação legada estão em [secondary-action-contrast.json](secondary-action-contrast.json). O par misto pode chegar a 1:1 no escuro comum.

A primária outline foi conferida separadamente com o componente compilado em [primary-outline-contrast.json](primary-outline-contrast.json): foreground e ícone de seleção nos dois modos HC e foreground anterior preservado nos modos comuns. Os modos comuns mantêm o contrato anterior, inclusive combinações abaixo de 4,5:1 registradas nessa evidência; a matriz histórica registra esses estados para revisão e não aplica um gate global de contraste aos modos comuns. Esta release não estende a correção de foreground a esses modos, respeitando a preservação solicitada. Essa limitação não se aplica ao par semântico secundário validado acima.

No portal atual, `src/styles/globals.css` aplica branco somente no escuro comum a `.portal-user-visualization-button`. **Esse override ainda é necessário com o markup atual.** Após adotar o pacote com esta política e seus CSS, substituir `bg-secondary-1` pelo background semântico acima, manter `text-action-secondary-content`, conferir que o ícone herda a cor e testar os quatro modos sem overrides de tokens anteriores. Só então remover a regra local de cor em globals.css. A classe identificadora pode continuar; a lógica de visualização/autorização permanece no portal. Atualizar somente a dependência sem trocar a classe de background não resolve o contrato.

## Validação e limites

- Baseline em `other-modes-baseline.json`: hashes de todos os tokens computados e de fill/stroke/opacidades dos 29 SVGs em **54 contextos** (18 temas × três modos preservados). A comparação passou sem diferenças. A geometria é conferida separadamente pelo inventário da reconciliação anterior.
- Política testada com classe/atributo em html/body/escopo, 18 temas, um preview por atributo e tokens inline normais; também com data-contrast-theme propositalmente desatualizado. Portais no body mantêm o par branco/preto.
- Texto comum e pares de ações/status/campos/seleção: meta de 7:1; foco, bordas e limites relevantes: pelo menos 3:1. Doze séries vivas: meta de projeto de 7:1 contra os três fundos definidos. Limites pretos separam as fatias adjacentes, sem exigir que duas cores vivas luminosas tenham contraste de 3:1 entre si.
- Foram medidos componentes reais nos 18 temas: ações e estados, avisos com ícones, tooltip com título/valor em portal, valor e teclado do slider, legenda/texturas, halo dos labels e interação por teclado do donut. A troca de modo atualiza os gráficos montados.
- O Storybook oferece `Laboratory/High contrast dark/Universal`. Capturas locais ficam em `test-results/high-contrast-dark/`.

Validações concluídas: 222 testes unitários; regressão de 54 contextos sem diferenças; política de precedência e SVGs; 72 pares secundários com estados; seis contratos históricos de navegador aprovados (dois skips móveis existentes); laboratório de componentes reais aprovado. Build, tipos, lint, geração de tokens, tamanho, bundles e estrutura de pacote aprovados. A revisão visual usa Chromium e amostras de componentes/ilustrações, sem homologação de todas as telas do portal, todos os tamanhos/dispositivos ou todos os pares de sobreposição possíveis. Não houve auditoria completa com leitores de tela, todos os fluxos de teclado, zoom/reflow ou demais critérios WCAG. **Estes testes e metas de paleta não constituem certificação AAA completa.**
