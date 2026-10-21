# Cores de ilustrações

Contrato aditivo para SVG inline, distribuído em `@aspprev/versi-ds/styles.css`. Não altera automaticamente componentes, imagens externas, logos, fotografias ou cores narrativas. A implementação do portal foi usada como referência, sem editar o projeto consumidor. Nenhuma versão npm foi publicada nesta tarefa.

## Integração

```tsx
import "@aspprev/versi-ds/styles.css";
import "@aspprev/versi-ds/themes.css";

<svg className="versi-illustration" role="img" aria-label="Documento confirmado">
  <rect data-illustration-role="background" width="240" height="120" />
  <rect data-illustration-role="surface" data-illustration-stroke="outline"
    x="12" y="12" width="216" height="96" strokeWidth="2" />
  <g data-brand-accent="2" data-brand-accent-tone="soft">
    <rect data-illustration-role="support" x="24" y="24" width="180" height="60" />
    <text data-illustration-role="on-support" x="36" y="60">IR ✓</text>
  </g>
</svg>
```

Use a classe no SVG e mantenha fundo e primeiro plano no mesmo grupo marcado. Retire `data-brand-accent-tone="soft"` para o acento sólido. Somente elementos explicitamente marcados recebem acentos: não distribua cores por ordem dos paths nem substitua todos os fills. Grupos aninhados podem escolher outros índices 1/2/3.

O documento mantém o contrato de tema do DS. Por exemplo, alto contraste escuro usa `data-color-scheme="dark"`, `data-contrast="high"` e `data-contrast-theme="dark"` no html; a identidade pode estar no html ou body, por classe ou `data-ds-theme`.

## Papéis

| `data-illustration-role` | Variável de cor CSS | Função |
| --- | --- | --- |
| `background` | `--illustration-background` | Fundo da composição |
| `surface` | `--illustration-surface` | Papel, cartão ou plano próximo |
| `ink`, `detail`, `muted` | `--illustration-ink/detail/muted` | Tinta, detalhes e conteúdo de apoio |
| `outline` | `--illustration-outline` | Área preenchida que representa contorno |
| `accent`, `on-primary` | `--illustration-accent/on-primary` | Primária e primeiro plano correspondente |
| `accent-soft`, `on-soft` | `--illustration-accent-soft/on-soft` | Acento suave e conteúdo neutro |
| `support`, `on-support` | `--illustration-support/support-content` | Par escolhido pelo grupo de acento opcional |
| `highlight` | `--illustration-highlight` | Realce; acompanha o primeiro plano semântico em HC |
| `success`, `on-success` | `--illustration-success/on-success` | Confirmação e seu símbolo/texto |
| `error`, `on-error` | `--illustration-error/on-error` | Erro e seu símbolo/texto |
| `warning`, `on-warning` | `--illustration-warning/on-warning` | Aviso e seu símbolo/texto |

`data-illustration-stroke="outline"` aplica a cor ao stroke. Defina uma espessura adequada ao desenho e ao tamanho de exibição. `on-support` inclui um contorno fino da própria cor para reforçar letras/checks. Esses contornos não substituem o contraste do primeiro plano.

As variáveis de estrutura acima são **cores CSS completas**, por compatibilidade com o portal: `fill="var(--illustration-surface)"`. Não coloque outro `rgb()` em volta delas. Já `--illustration-primary-content` e `--illustration-brand-accent-{1,2,3}-content`, gerados pelo registro canônico, são **canais RGB**, como os demais tokens de paleta: o contrato os usa com `rgb(var(...))`.

## Modos e acessibilidade

Nos modos comuns, a classe de compatibilidade mantém os papéis do portal: fundo muted, superfície card, tinta action-neutral, contornos existentes, primária no claro, link no escuro e mistura de 22% para os detalhes suaves. A nova classe `versi-illustration` usa conteúdo primário como tinta, legível também no escuro. A tela de dispositivo no escuro mantém a mistura anterior de 75% card e 25% branco. Cores narrativas, pele, cabelo e fills brancos sem marcação não são recoloridos globalmente.

As referências `brand-accent-1/2/3` mantêm seus valores. Cada acento sólido tem um primeiro plano preto ou branco calculado para leitura; a variante suave usa conteúdo neutro sobre a mistura com a superfície. Quem sobrescrever as referências de marca no consumidor deve conferir e, se necessário, sobrescrever também `--illustration-brand-accent-{n}-content`. O mesmo cuidado vale para `--illustration-primary-content` ao mudar a primária localmente.

No alto contraste, os três acentos decorativos são ignorados. Os fundos sólidos usam ação primária/conteúdo primário de ação; os suaves usam superfície muted/conteúdo neutro e contorno. Tinta, detalhes e contornos usam conteúdo primário. No alto contraste escuro, símbolos sobre a primária clara/amarela ficam escuros, em vez de brancos. A mutação das três referências de marca é testada e não muda os pares renderizados em HC.

Sucesso, erro e aviso usam os pares semânticos solid de status verde, vermelho e amarelo, incluindo seus primeiros planos. Esses papéis prevalecem sobre uma marcação decorativa acidental. Não use um acento de marca para comunicar confirmação, falha ou advertência.

## Compatibilidade com os ativos do portal

`portal-illustration` continua aceita. Foram mantidos os atributos `data-brand-accent`, `data-brand-accent-tone`, `data-brand-accent-check`, `data-brand-accent-label`, `data-illustration-on-primary`, `data-illustration-success` e `--illustration-device-screen`, com suporte equivalente a erro/aviso. Os seletores dos fills neutros antigos ficam restritos ao SVG opt-in. Imagens `<img src="...svg">` não recebem CSS interno; para isso é necessário SVG inline.

Os checks/letras legados sem grupo mantêm branco com contorno escuro nos modos comuns. Em HC passam ao primeiro plano semântico. Novos ativos devem compartilhar um grupo `data-brand-accent` com seu fundo e usar `on-support`, especialmente na variante suave. Para estados, marque o fundo com `success/error/warning` e o conteúdo com `on-success/on-error/on-warning`.

No portal, remova o bloco local duplicado de ilustrações ao adotar o contrato do pacote; enquanto houver coexistência, carregue as regras do DS depois dele. Overrides locais mais específicos ou inline continuam tendo prioridade, portanto uma versão antiga desse bloco pode esconder as correções. Este trabalho não removeu nem editou esses overrides no portal.

## Exemplos e regressão

Storybook: **Foundations/Illustrations**, com claro, escuro e os dois altos contrastes; use a toolbar para escolher qualquer um dos 18 temas. Os exemplos mostram primária clara, texto IR, checks nos três acentos sólidos/suaves, três superfícies, estados semânticos e um ativo com marcações legadas.

`PAIRS.json` registra 72 contextos e os primeiros planos adicionados. Os testes de navegador medem cores computadas, incluindo color-mix, símbolos, texto e contornos: mínimo 3:1 para informação gráfica e 4,5:1 para texto nos 18 temas em HC claro/escuro. Também verificam modos comuns, cores narrativas, prioridade dos estados, independência dos acentos em HC e ausência de recoloração fora das classes opt-in. Isso cobre os pares e exemplos marcados; cada ativo novo precisa usar os papéis corretamente e considerar escala, opacidade e fundo real.

### Validação local — 21/10/2026

[VALIDACAO.json](VALIDACAO.json) contém as cores computadas e os mínimos de cada tema/alto contraste. Passaram três testes unitários novos e 21 testes de navegador, incluindo a preservação do contrato anterior de secondary. Foram exercitados 72 contextos de tema/modo; os 36 de alto contraste atenderam aos limites pedidos, com mínimo medido de 4,562:1 tanto para texto quanto para símbolos. A verificação adicional por classe/atributo no html/body cobriu 144 combinações HC. Nenhum token anterior mudou na comparação dos 72 contextos.

Build do pacote e Storybook, lint, tipos, gerados, navegação e bundle passaram. O CSS distribuído ficou em 136.811 bytes (20.960 gzip); o orçamento bruto de styles.css passou de 135.000 para 140.000 bytes para incluir as regras opt-in de ilustrações, mantendo o limite gzip de 27.000. O orçamento de themes.css permaneceu em 250.000/23.000, com 246.856/19.847 medidos. A versão do pacote foi mantida na preparação existente e não houve publicação npm.
