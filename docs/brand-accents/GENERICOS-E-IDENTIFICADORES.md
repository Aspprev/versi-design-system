# Acentos genéricos e identificadores públicos

Alteração local sobre a versão 0.5.9, sem publicar, criar release ou aumentar a versão. A proposta de valores fica em [GENERICOS.json](GENERICOS.json); a fonte de verdade implementada continua sendo `tokens/design-system.tokens.json`, que gera CSS e Tailwind. O CSS recebido foi usado como referência de comportamento, não copiado sobre os tokens existentes.

## Presets genéricos

Os onze presets existentes permanecem: default, azul1/2/3, laranja1/2, verde1/2/3/4 e rosa1. Eles recebem os três acentos do JSON nos quatro modos. Nenhuma primária, superfície, ação, seleção, foco, cor de gráfico, feedback, status ou placeholder foi substituído.

Default implícito e os presets azuis mantêm suas primárias azuis. Seus acentos comuns são verde `#00DB9B`, lavanda `#B5A5FF` e lilás `#C9B1FF`. Os demais presets seguem os valores específicos da proposta. Laranja1 usa os apoios de custom2140; isso não altera custom2178 nem cria equivalência entre os dois temas.

Os pares `brand-accent-{n}-soft/content/border` continuam opcionais. Nos modos comuns, os fundos suaves derivam do acento e da superfície neutra; o conteúdo usa o neutro legível. Nos altos contrastes, o fallback neutro da proposta é intencional. As regras do default implícito excluem identidades explícitas; o fallback no html não substitui as definições de um customizado no html ou body.

Os gráficos padrão continuam consumindo `chart-*`, `chart-donut-*` e seus papéis nomeados. Os genéricos mantêm também os aliases de dados usados pelo resolvedor opcional; adicionar acentos decorativos não recolore automaticamente séries. Use legenda e identidade estável por categoria.

## Temas customizados

Os identificadores públicos agora são exclusivamente:

`custom2178`, `custom2156`, `custom2140`, `custom2133`, `custom2170`, `custom2162`, `custom2157`.

Use o identificador PRD em qualquer ambiente. Seletores de classe e atributo, listas/tipos públicos, metadados, nomes dos arquivos, títulos do Storybook e referências de teste usam esses IDs. Não há aliases para as identidades anteriores. Os valores dos sete temas customizados foram preservados, incluindo os pares de acento já aprovados.

Essa renomeação muda o contrato dos valores aceitos por `data-ds-theme`, classes, `ClientTheme` e `DesignSystemTheme`. Os símbolos genéricos existentes, como `CLIENT_THEMES`, permanecem; seus itens e rótulos usam os códigos públicos. Adote de forma coordenada no consumidor antes de publicar uma versão que passe a exigir os novos valores.

## Migração coordenada no portal

Nenhum arquivo do portal foi alterado. A correspondência entre identidades anteriores e códigos permanece somente no documento privado de execução fornecido pelo consumidor; ela não foi copiada para os materiais públicos do DS.

No portal, após atualizar o pacote:

1. Atualize o resolvedor de tema por cliente, constantes, valores persistidos de preferências, snapshots da prévia e seletores CSS para os códigos PRD definidos na referência privada.
2. Use o mesmo código em produção, homologação e demais ambientes. Não derive o nome do tema de códigos HMG/ANT/IMP.
3. Centralize a resolução do identificador, evitando tabelas duplicadas em componentes. Atualize links e referências antigas do Storybook para os IDs públicos.
4. Remova as sobrescritas locais equivalentes aos acentos genéricos depois de consumir os tokens do pacote. Preserve placeholders e estilos narrativos de SVGs.
5. Confira o tema sem o snapshot antigo da prévia (`?previewTema=0`) e depois com a prévia sincronizada. Para aplicar detalhes, use o [contrato público de acentos](README.md), com uso explícito por função.

Os arquivos de entrada e imagens anteriores com identificação nominal foram preservados em armazenamento local ignorado pelo Git, fora dos materiais públicos atuais. O histórico Git não foi reescrito. Novas evidências mostram os códigos públicos.

## Verificação

A comparação local antes/depois cobriu 18 temas × quatro modos × quatro formas de aplicação = 288 contextos. Não houve diferença nos customizados nem nos tokens estruturais dos genéricos; as mudanças se restringiram aos acentos permitidos. O default implícito, as formas classe/atributo no html/body, os valores de referência e os componentes nos quatro modos são exercitados no navegador. A validação formal de contraste permanece restrita aos modos de alto contraste.

Resultados: 208 testes unitários e 32 testes de navegador passaram. Build do pacote e do Storybook, TypeScript, lint sem avisos, geração, tamanho, divisão de bundles, conteúdo do pacote e navegação também passaram. A varredura de 1.229 arquivos públicos, incluindo artefatos construídos, não encontrou identificadores nominais anteriores. O catálogo contém 328 entradas e 49 componentes.

Prévia dos acentos VERSI: [default comum](evidencias/default-light.png). Os demais exemplos foram regenerados com códigos públicos; os originais anteriores permanecem apenas na área local ignorada.
