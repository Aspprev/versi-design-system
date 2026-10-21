# Prompt — corrigir legibilidade de status e componentes no VERSI DS

Trabalhe no repositório do @aspprev/versi-ds. Leia as instruções locais e preserve alterações existentes. Corrija a legibilidade dos componentes nos quatro modos: claro, escuro, alto contraste claro e alto contraste escuro. Não publique npm, não crie release e não aumente a versão automaticamente. Entregue a correção implementada e testada, não apenas um diagnóstico.

## Regra de produto

Todos os modos precisam apresentar textos, bordas, ícones, seleções e estados visíveis e confortáveis. A validação formal dos índices WCAG é obrigatória nos dois modos de alto contraste. Nos modos comuns, não aplicar um bloqueio geral baseado nesses índices, mas também não aceitar conteúdo quase invisível. Usar medições para diagnosticar e revisão visual para aprovar. Ausência da exigência formal não dispensa legibilidade.

## Reprodução e evidências já levantadas

O portal apresentou “ATIVO” preenchido legível e “REPROVADO” contornado quase invisível na ACEPREV escura. Há uma causa geral, não específica dessa marca:

- `src/components/status-badge/StatusBadge.tsx` usa `status-{color}-outline-foreground` e `status-{color}-outline-border`.
- No pacote 0.5.7 e nos snapshots exportados das propostas, diversos tokens de status mantêm valores do claro no escuro comum. Por exemplo, `status-slate-outline-foreground` é `25,28,31` sobre card `27,33,40`: aproximadamente 1,06:1. A borda slate sobre o card é aproximadamente 2,24:1. Black outline fica em aproximadamente 1,29:1; blue outline 1,70:1; red outline 1,56:1; yellow outline 2,37:1.
- A mesma combinação slate/card aparece nas sete propostas: basf, funssest, maisprevidencia, aceprev, cibrius, serpros e einvest. Nos arquivos de proposta, a correção específica dos tokens de status só foi feita dentro de `if (high)`, deixando a lacuna no modo escuro comum.
- `src/utils/resolve-status-appearance.ts` usa `slate outline` como fallback de status não mapeado. Verifique o mapeamento real de “REPROVADO”; não suponha que esse rótulo precise ser sempre slate ou troque todos os status por vermelho. Corrija o fallback para ser legível e preserve a semântica de domínio.
- Outros pares merecem revisão: nas propostas, placeholders claros têm aproximadamente 2,40:1 sobre o campo branco; ACEPREV clara tem links sobre página em aproximadamente 2,24:1 e check branco/knob branco sobre coral em aproximadamente 2,41:1. Esses números são pistas de legibilidade, não uma declaração de reprovação formal dos modos comuns.
- A leitura de componentes renderizados confirmou placeholders claros em 2,40:1 nos sete temas e ações primárias sem fundo (outline/plain), links e alguns rótulos de navegação da ACEPREV clara em aproximadamente 2,24–2,41:1. Após aguardar as transições, não apareceu outro par abaixo de 2,5:1 nos botões, campos e avisos escuros amostrados, além dos status. Isso não aprova automaticamente todos os componentes nem todos os estados: 2,5:1 foi só um corte de triagem para localizar casos graves, não a regra de aprovação de produto ou WCAG.

As evidências são de inspeção do fonte, valores exportados e leituras do catálogo do portal. Reproduza no DS atual, distinguindo o pacote instalado, o código-fonte local e as propostas novas. Não assuma que todos representam a mesma versão.

## Implementação

1. Corrigir a fonte de verdade de tokens (`tokens/design-system.tokens.json`) e executar os geradores existentes. Não editar apenas CSS gerado.
2. Definir pares de texto, borda e fundo de status por modo. Cobrir `solid`, `soft` e `outline`, todas as cores, `primary`, fallback neutro e DomainStatusBadge. Em outline, avaliar o fundo efetivo da página/card/tabela/superfície muted; não comparar o texto só com um fundo fictício ou transparente. O neutro escuro deve ter conteúdo claro legível, sem virar uma ação ou feedback da marca.
3. Auditar outros componentes: Button (flat/outline/plain), Notice, StatusBadge/DomainStatusBadge, inputs e selects, placeholder, helper/error text, ícones de campo, checkbox, radio e radio cards, switch (incluindo knob, on/off e variantes), links, navegação e itens selecionados, tabs, tabela/card, tooltip, dropdown, modal e gráficos (eixos, legendas, tooltip e seleção). Cobrir normal, hover, active, foco, selecionado e desabilitado conforme aplicável. Não tratar `color` herdado de um switch sem texto visível como o contraste real do knob.
4. Preferir correções na responsabilidade correta: token de conteúdo para texto, token de borda para contorno, token do knob/check para seleção. Identificar cores fixas, herança incorreta, tokens do claro reaproveitados no escuro, transparência, opacidade, classes conflitantes e referências de tokens resolvidas no host errado. Não usar !important, filtro de brilho ou clareamento global como solução geral.
5. Manter sucesso/erro/aviso/informação e status de domínio independentes da marca. Preservar `content-secondary` como hierarquia textual. `secondary-*`/`tertiary-*` legados não representam necessariamente as cores auxiliares de cada cliente. Estas estão em `brand-accent-1/2/3`, são opcionais e não substituem feedback.
6. Preservar identidade e paletas aprovadas. Os claros de BASF, Mais e FUNSSEST estão em produção: não redesenhar nem recolorir esses presets. Isolar os ajustes ao modo/componente necessário e documentar qualquer impacto pontual nesses claros. Não fazer mudanças amplas de API ou remover tokens legados nesta correção.
7. Garantir resultados equivalentes com classe e `data-ds-theme`, identidade no html ou body, modo/contraste no html e portais de dropdown/modal. Alto contraste tem prioridade sobre personalização de marca. Validar o CSS construído/distribuído, não só os valores do registro JSON.

## Atenção às propostas e à prévia do portal

Os arquivos `tema-*.json/css` exportados anteriormente congelam valores resolvidos, inclusive valores antigos de status nos modos comuns. Eles são referência de identidade, não justificativa para preservar defeitos de legibilidade. Ao integrar ou corrigir as propostas no DS, atualizar os valores funcionais defeituosos e documentar as diferenças; não reintroduzir os defeitos para obter igualdade com o export antigo.

A prévia por tenant no portal também aplica tokens inline no body. Atualizar apenas o pacote do DS pode não alterar a aparência enquanto essa prévia continuar impondo o snapshot antigo. Não editar o portal neste trabalho: entregar instruções dos overrides que precisam ser removidos ou sincronizados quando o pacote corrigido for consumido, mantendo a paleta da marca. Comparar o DS limpo e o portal com overrides separadamente.

## Testes e entrega

- Criar uma matriz visual por família e por modo. Incluir “ATIVO” e “REPROVADO”, todos os status por domínio e pelo menos um status desconhecido para testar fallback.
- Cobrir as sete propostas e os presets legados existentes; escalar a matriz de testes sem limitar a validação à ACEPREV.
- Medir cores computadas e fundo efetivo em componentes reais, aguardando o término das transições. Compor transparências e considerar opacidade. Excluir controles de ferramentas de desenvolvimento da conclusão sobre componentes do DS.
- Nos modos comuns, entregar antes/depois e verificar que estados e conteúdo são visíveis nos contextos reais. Nos modos de alto contraste, adicionar asserções dos índices aplicáveis de texto e controles, sem confundir testes de tokens com conformidade WCAG completa.
- Manter testes de pares de tokens e testes de renderização/cascata. Testar atualização de gráficos já montados ao mudar tema/modo. Validar foco/teclado e portais.
- Relatar cada achado como confirmado, corrigido ou ainda não validado, com componente, modo, fundo/contexto e causa. Não afirmar que todos os componentes foram aprovados se apenas os status foram exercitados.
- Ao final, listar arquivos alterados, testes executados, impactos e instruções para consumir a correção no portal. Deixar pronto para revisão sem publicar pacote.
