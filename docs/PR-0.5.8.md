Adiciona sete identidades de cliente com demonstrações nos quatro modos e corrige a legibilidade de status, ações, seleções, switches e gráficos. Preserva os placeholders e as escalas de marca, mantém os presets existentes e prepara os manifestos para 0.5.8.

O Storybook inclui uma matriz de componentes e comparação antes/depois dos status. O relatório em `docs/correcao-legibilidade/RELATORIO.md` documenta os pares corrigidos, limites da validação e cuidados com as sobrescritas da prévia do portal.

Validação: 203 testes unitários na suíte completa, 67 testes direcionados após os ajustes finais, 18 testes da matriz e 58 testes finais de navegador; 288 contextos de CSS construído com preservação dos placeholders. Build do pacote/Storybook, TypeScript, lint sem avisos, tokens gerados, tamanho, bundle, conteúdo do pacote e navegação conferidos. Manifestos e tag candidata v0.5.8 validados.

A publicação será acionada pelo push da tag v0.5.8 após a mesclagem.
