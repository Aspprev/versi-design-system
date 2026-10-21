# Prompt para usar no repositório ds-versi

Implemente no @aspprev/versi-ds os sete temas de cliente contidos nos arquivos anexados `tema-*.json` e `tema-*.css`.

Os JSONs são o contrato de valores desta proposta e contêm quatro variantes: light, dark, high-light e high-dark. Os CSSs mostram os seletores de referência. O JSON exportado NÃO é o esquema nativo do registro do DS: converta para o esquema existente. Os valores são canais RGB separados por vírgulas. Leia as instruções locais do repositório antes de editar.

Identificadores públicos dos novos temas: custom2178, custom2156, custom2140, custom2133, custom2170, custom2162 e custom2157. Não substituir nem remover os temas legados default, azul*, verde*, laranja* e rosa1. Não modificar o portal a partir deste trabalho.

Restrições obrigatórias:

1. Preservar os valores claros exportados de custom2178 e custom2140 (snapshot de laranja1 do DS 0.5.7) e custom2156 (snapshot de laranja2 do DS 0.5.7). Não corrigir automaticamente o contraste desses claros nem alterar os presets legados para implementar os novos nomes. Compare todos os tokens, não só a primária. Se o DS local já tiver uma base diferente da 0.5.7, explicite a diferença em vez de sobrescrever silenciosamente o snapshot.
2. Nos temas claros e escuros comuns, identidade e conforto visual são os critérios; índices WCAG não são bloqueio de aprovação nesses dois modos. Nos dois modos de ALTO CONTRASTE, validar os pares aplicáveis segundo WCAG, incluindo texto, controles, foco, feedback, gráficos e estados de hover/active. Não declarar conformidade completa apenas com testes de tokens.
3. Manter fundos neutros compartilhados. Não recolorir erro, sucesso, aviso ou informação com a marca. Nos modos reformulados, as ações alternativas são neutras. Os `brand-accent-1/2/3` são acentos opcionais, não feedback nem uma obrigação de três paletas interativas.
4. Os arquivos exportam valores resolvidos para compatibilidade e revisão. Podem ser representados por referências/aliases internos para evitar repetição, desde que os valores computados se mantenham. Não excluir tokens/APIs legados nesta integração e não mapear globalmente secondary para success. A preservação do claro em produção tem prioridade sobre a limpeza desses aliases.
5. Garantir equivalência de classe e atributo data-ds-theme, com identidade no body ou no html. Modo e contraste ficam no html. Os tokens semânticos precisam resolver também no body, onde alguns já são redefinidos. Os modos comuns devem excluir data-contrast="high"; o alto contraste deve prevalecer. Evitar !important como solução geral.

Direção visual:
- custom2178: laranja principal; vermelho e amarelo discretos como apoio.
- custom2156: laranja e cinzas.
- custom2140: laranja, azul claro, oliva e verde azulado.
- custom2133: salmão/coral, dourado, lavanda e anil nos detalhes.
- custom2170: verde, marinho e verde azulado.
- custom2162: azul claro, verde-lima e pequenos detalhes laranja.
- custom2157: verde, azul e marinho. Degradê verde–azul apenas em detalhes decorativos nos modos comuns; não obrigatório em botões ou superfícies, e dispensado no alto contraste. O degradê da galeria do portal é uma composição visual e não está codificado como token RGB nestes arquivos.

Procedimento:

1. Auditar o estado atual do registro de tokens e preservar alterações locais existentes. Separar o que já está implementado do que falta; não duplicar blocos.
2. Integrar os sete presets e quatro variantes na fonte de verdade `tokens/design-system.tokens.json`, conforme o esquema e o gerador do repositório. Gerar src/tokens.css, src/themes.css e demais saídas pelo fluxo existente, sem tratar CSS gerado como fonte manual.
3. Atualizar as listas/types públicos de temas e o Storybook: uma seção por cliente, quatro modos, paleta e componentes reais com estados. Separar essas identidades dos presets legados. Não alterar a aparência padrão dos demais temas.
4. Garantir que Button, Notice, campos, checkbox, radio, switch, status, foco, portais de dropdown/modal e gráficos respondam aos tokens exportados. Verificar os gráficos já montados durante a troca de tema, sem cores antigas em cache.
5. Testar as sete identidades nos quatro modos e nos seletores suportados. Comparar os tokens computados com os JSONs de referência; validar igualdade estrita dos claros preservados. Verificar contraste dos modos altos em componentes reais. Caso um token ou estilo existente impeça o resultado correto, documentar e corrigir a causa no componente/gerador, sem mudar silenciosamente a paleta aprovada.
6. Não implementar remoções amplas de tokens ou mudanças incompatíveis de API junto com estes presets. Entregar arquivos alterados, validações realizadas e instruções para o portal consumir os nomes novos. Documentar limitações e diferenças encontradas.

Não publicar no npm, não criar release e não alterar a versão automaticamente. Deixe a integração pronta para revisão. Os arquivos são propostas para validação visual, não prova de aprovação final nem códigos oficiais certificados por manual de marca.
