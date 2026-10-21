# Secondary no escuro e alto contraste — 21/10/2026

Validação do secondary atual, promovido do antigo tertiary. Foram medidos os estilos computados dos cinco componentes no Storybook local: 18 temas × escuro comum/HC claro/HC escuro = 54 contextos. Button flat/outline/plain foi observado em repouso, hover e active: 486 amostras de estado, compostas sobre página, card e muted, totalizando 1.458 pares de superfície.

Esta rodada não altera cores ou componentes. Os valores resumidos estão em [SECONDARY-CORES-VALIDACAO.json](SECONDARY-CORES-VALIDACAO.json). O relatório completo e a captura visual ficam em `test-results/secondary-colors-audit.json` e `test-results/secondary-dark-current.png`, locais e ignorados pelo Git.

> Registro anterior às correções de HC escuro. Veja [SECONDARY-HC-AJUSTES.md](SECONDARY-HC-AJUSTES.md) para os valores atuais e a validação da trilha do switch.

## Critérios

No escuro comum, o contraste é avaliado como distinção visual e leitura: não se exige o mínimo WCAG. Nos altos contrastes, verificam-se 4,5:1 para os textos e 3:1 para os elementos gráficos informativos. A razão entre preenchimento e fundo não determina sozinha a identificação de um botão: um contorno legível pode delimitá-lo.

## Resultado por modo

| Par medido — menor valor nos 18 temas | Escuro comum | HC claro | HC escuro |
| --- | ---: | ---: | ---: |
| Texto de botão/fundo nos três estados e variantes | 4,53:1 | 4,53:1 | 4,53:1 |
| Texto do Notice/fundo | 12,65:1 | 12,83:1 | 15,03:1 |
| Bolinha/trilha do switch ativo ou desligado | 3,48:1 | 4,54:1 | 3,39:1 |
| Cor opaca dos carregadores/superfície | 12,80:1 | 16,67:1 | 15,91:1 |
| Trilha do switch desligado/superfície muted | 3,95:1 | 3,61:1 | **2,57:1** |

Os números do escuro comum são descritivos; não foram usados para impor uma meta WCAG nesse modo. Os desabilitados não entram nos mínimos de controles ativos. Os pontos animados foram avaliados pela cor opaca, não por cada quadro da animação de opacidade. Esta é uma revisão de cores e delimitação dos componentes medidos, não uma certificação integral de acessibilidade.

## Pontos para ajuste

1. **Preenchimento no escuro comum.** No tema default, o fundo do botão flat e do Notice é `#191C1F`, contra página `#14191F`, card `#1B2128` e muted `#262E37`: respectivamente 1,03:1, 1,06:1 e 1,25:1. O texto continua bem legível. O botão é identificado pelo contorno claro, mas o preenchimento quase se mistura ao ambiente; no Notice essa distinção depende somente do fundo. Recomenda-se clarear discretamente o preenchimento em repouso, preservando a hierarquia de hover/active. Não é necessário atingir 3:1 entre esses fundos no modo comum.
2. **Escala bruta rosada no HC escuro.** `--secondary-1…5` ainda contém `#8F245E`, `#701846`, `#500D31`, `#F472B6` e `#37071F` nos 18 temas, por herança da antiga tertiary. Os componentes usam seus papéis funcionais neutros ou próprios de HC; por isso o botão não aparece com essa mesma paleta. A escala exposta, porém, está incoerente com o novo papel secundário neutro. Recomenda-se revisar essa escala, sem recolorir feedback, gráficos, primárias ou brand accents. Tons suaves da escala não precisam cumprir o contraste de uma cor informativa se forem usados somente como fundos.
3. **Switch desligado sobre muted no HC escuro.** A trilha `#616161` sobre `#222222` fica em 2,57:1. A bolinha preta contrasta 3,39:1 com a trilha, mas o perímetro externo não tem borda, outline ou sombra em repouso para compensar a diferença baixa. Recomenda-se reforçar a trilha ou adicionar um contorno semântico para alcançar 3:1 nessa superfície. `switch-track-off` é compartilhado com as outras variantes; uma correção deve conferir também esses usos.

Não há necessidade de clarear indiscriminadamente os textos ou aproximar o escuro comum do alto contraste. Os textos, os primeiros planos dos avisos e os carregadores medidos já apresentam leitura suficiente; os ajustes sugeridos se concentram em distinção de fundo, coerência da escala e delimitação do switch.
