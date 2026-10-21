# Usos de secondary

Conferência de 21/10/2026. A escala `secondary-1…5` é uma paleta de marca; não equivale a `brand-accent-1/2/3` nem ao texto neutro `content-secondary`.

| Componente | Seleção explícita | Tokens consumidos |
| --- | --- | --- |
| Button | `color="secondary"`, flat/outline/plain | `action-secondary-*` e `content-brand-secondary` |
| InputSwitch | `variant="secondary"` | `switch-track-secondary-on`, inclusive camada de interação; desligado e desabilitado usam tokens próprios |
| Notice | `type="secondary"` | `action-secondary` e `action-secondary-content`, incluindo ícones e controles |
| LoadingDots | `color="secondary"` | `content-brand-secondary` |
| CircularLoading | `color="secondary"` | `content-brand-secondary`; `indicatorColor` explícito tem prioridade |

Typography `variant="secondary"` e textos auxiliares de formulários, tabelas, gráficos e documentos usam **content-secondary**, uma cor neutra. Não devem acompanhar mudanças da paleta de marca.

## Vínculos indiretos

O registro canônico mantém aliases da escala para os fundos de ação, conteúdo de marca e trilha ligada do switch. Há também aliases de fallback em feedback de sucesso e, no alto contraste escuro, feedback de informação e `chart-invested`. Os overrides de tema/modo podem substituir esses valores. Assim, mudar a escala bruta pode afetar feedback ou gráficos indiretamente; não é seguro tratá-la apenas como decoração. Os novos acentos de marca permanecem opcionais e separados.

## Resultado da validação

Foram medidos os valores calculados no navegador para 18 temas × quatro modos, totalizando 72 contextos: conteúdo/fundo de ação em repouso, hover e active; bolinha/trilha ligada do switch; e cores dos dois carregadores sobre página, card e superfície muted. Os pares de ação atingiram 4,5:1 e os pares não textuais semânticos atingiram 3:1 nessa matriz. Isso não constitui uma auditoria integral dos componentes ou de fundos personalizados.

O CircularLoading ainda consumia `secondary-1` diretamente: sobre `surface-muted`, no alto contraste escuro, resultou em 2,44:1 nos 18 temas. Foi alinhado ao token `content-brand-secondary` já usado pelo LoadingDots, que passou nas três superfícies em todos os contextos. A escala, os placeholders e os demais papéis não foram alterados. Cores fornecidas por `indicatorColor` continuam sob controle do consumidor.

A matriz visual de botões, avisos e switches está em **Laboratory/Legibility** no Storybook. A medição dos carregadores considera a cor opaca do indicador; não certifica cada quadro da animação de opacidade do LoadingDots.
