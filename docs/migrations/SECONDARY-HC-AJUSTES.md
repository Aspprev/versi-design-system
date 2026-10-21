# Ajustes de alto contraste escuro — 21/10/2026

A escala secondary exposta no alto contraste escuro passa a ser neutra: `#E5E7EB`, `#D1D5DB`, `#9CA3AF`, `#757575`, `#1F2125`. É uma escala de papéis distintos; as amostras suaves não devem ser tratadas automaticamente como texto informativo.

A trilha desligada do switch passa de `#616161` para `#757575`. O contraste sobre `surface-muted` (`#222222`) sobe de 2,57:1 para aproximadamente 3,46:1. A bolinha preta mantém contraste acima de 3:1. O ajuste se aplica às variantes que compartilham `switch-track-off`, sem afetar o estado desabilitado.

Os valores computados para os 18 temas, incluindo as superfícies page/card/muted, estão em [SECONDARY-HC-AJUSTES.json](SECONDARY-HC-AJUSTES.json). Os testes de secondary verificam o perímetro da trilha em cada tema e os pares dos botões no alto contraste. Os snapshots históricos permanecem intactos; as expectativas aplicam somente as diferenças aprovadas por modo.

Os modos comuns, as primárias, os estados semânticos e os acentos de marca preservam seus valores anteriores. O preenchimento discreto de secondary no escuro comum, mencionado na auditoria anterior, permanece como estava.

## Exemplos

- Laboratory/Status compara Button, Notice, Surface e carregadores nos quatro modos, com modais interativos.
- SelectMulti/Próximo ao rodapé mostra a inversão do painel quando falta espaço.
- SelectMulti/Dentro de modal mantém o painel fora da área de recorte, integrado ao gerenciamento de foco do diálogo.

O painel reposiciona ao rolar ou redimensionar. Escape fecha a lista e devolve o foco; Tab fecha a lista e segue os controles do formulário. Seções e limites de seleção continuam independentes do posicionamento.
