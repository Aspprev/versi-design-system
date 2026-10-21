# Legibilidade dos componentes — evidências para correção no DS

Data: 20/10/2026. Não foram alterados os componentes ou tokens do DS neste trabalho.

## Método e limites

Inspeção do código-fonte local do DS e dos tokens exportados das sete propostas. Medição de 2.380 pares de tokens e leitura dos componentes renderizados do pacote instalado no catálogo local do portal, nas abas Status por domínio, Componentes básicos, Formulários e Feedback, combinando sete clientes e quatro modos. As cores foram aplicadas ao body e os atributos de modo/contraste ao html. Aguardaram-se 350 ms após cada mudança para excluir cores intermediárias de transições. Controles de ferramentas de desenvolvimento e controles sem texto visível foram excluídos da triagem textual.

O corte de 2,5:1 localiza casos graves; não representa um requisito de produto nem o limite formal da WCAG. A leitura do DOM busca o fundo opaco ancestral; transparências/gradientes e opacidades compostas exigem análise adicional. Hover, clique, foco, overlays abertos e todos os estados possíveis não foram exercitados nesta rodada. As amostras de campos desabilitados e componentes que não são texto também exigem avaliação específica. Isso não é certificação de acessibilidade.

## Confirmado

| Caso | Resultado |
|---|---|
| Slate outline em card escuro, sete temas | Texto 1,06:1; borda 2,24:1 |
| Black outline em card escuro | Texto/borda 1,29:1 |
| Blue outline em card escuro | Texto 1,70:1 |
| Red outline em card escuro | Texto 1,56:1 |
| Yellow outline em card escuro | Texto 2,37:1 |
| Placeholder em campo branco, sete temas claros | 2,40:1 |
| Links/navegação e ações sem fundo na ACEPREV clara | Aproximadamente 2,24–2,41:1 |

Os status slate também aparecem em fallback de status não mapeado. A amostra renderizada reproduziu, por exemplo, PENDENTE com slate outline pouco visível. Não foi afirmado que o rótulo REPROVADO do screenshot possui um mapeamento explícito específico; o DS deve reproduzir o caminho do domínio/fallback.

Após estabilizar as transições, a triagem das abas de botões, campos e avisos em modo escuro não encontrou outros pares textuais abaixo de 2,5:1 nos elementos amostrados. Isso não comprova legibilidade suficiente de todos os componentes. Na análise de tokens, check branco e knob branco sobre coral na ACEPREV clara também merecem revisão (2,41:1), mas não foram medidos como texto renderizado do controle.

## Causa e integração

Os tokens `status-*-outline-*` herdados do claro permanecem no modo escuro comum. As propostas exportadas corrigiam status apenas nos altos contrastes. Essa lacuna precisa ser corrigida tanto na implementação do DS quanto nos snapshots funcionais usados pela prévia: esta aplica tokens inline e pode encobrir uma correção futura do pacote.

Nos modos comuns, preservar identidade sem aceitar conteúdo quase invisível. Nos altos contrastes, também testar formalmente os índices aplicáveis. Preservar os claros em produção de BASF, Mais e FUNSSEST, isolando correções necessárias ao componente/modo e documentando impactos.

## Arquivos

- [Prompt de correção](../temas-clientes/PROMPT-CORRIGIR-LEGIBILIDADE-DS.md).
- [Pares de tokens](LEGIBILIDADE-PARES-TEMAS.json).
- [Triagem de componentes renderizados](LEGIBILIDADE-COMPONENTES-TEMAS.json).
