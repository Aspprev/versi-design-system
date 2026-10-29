# Revisão de foco — 20/10/2026

## Resultado

Os achados abaixo registram o estado da versão 0.5.6. As correções estão preparadas para a versão 0.5.7. A revisão e os testes não constituem certificação integral de conformidade WCAG 2.2.

## Correções posteriores à revisão

- Foco padrão e alto contraste funcionam com `:focus-visible`, sem exigir `FocusNavigationMode`. Para mostrar o contorno somente na navegação por teclado, monte `<FocusNavigationMode />` uma vez no layout: mouse/toque ocultam o contorno, e Tab, setas e demais teclas de navegação o restauram. Campos de texto também respeitam esse modo. Sem o componente, permanece a heurística nativa do navegador.
- O preview global do Storybook monta `FocusNavigationMode` para aplicar essa política a todas as histórias, incluindo `InputPhone` e seu seletor de país.
- Campos com foco visível destacam o contêiner, preservando a borda de erro. O prefixo do telefone usa foco interno para evitar recorte.
- O foco dos inputs ocultos é transferido para os proxies visíveis; cards de rádio destacam o card.
- O token de foco claro usa `primary-3`, com remoção das exceções inconsistentes. Escuro e alto contraste mantêm cores próprias. Switches, abas e ações auxiliares usam o token semântico.
- As abas oferecem setas, Home/End, retorno circular e uma entrada por Tab, ignorando opções desabilitadas.
- Testes de regressão ficam em `tests/visual/design-system/focus.visual.spec.ts`, cobrindo claro/escuro, alto contraste, campos com erro, proxies, telefone, abas e contraste dos presets.

### Validação das correções

Os 38 cenários de regressão passaram em Chromium desktop e emulação móvel. A matriz verifica indicadores sem provider, preservação da borda de erro, foco dos proxies, prefixo e entrada do telefone, navegação das abas e contraste mínimo de 3:1 do token de foco nos 11 presets, em claro e escuro, sobre as superfícies de página, card e campo. Tipagem, lint, geração do pacote, geração do Storybook e integridade dos tokens também foram verificados.

## Escopo e limites

Revisão do código dos componentes e das regras compartilhadas de foco. No Chromium, foram carregadas as histórias principais das 49 famílias do catálogo em claro, escuro, alto contraste claro e alto contraste escuro: 196 cenários. A inspeção automática verificou a primeira entrada por Tab e seus estilos computados. Foram também inspecionados os estados de erro e as opções do SelectMulti.

Esses 196 cenários são uma triagem, não 196 aprovações de acessibilidade. Não cobrem todas as propriedades, todos os controles internos, todas as combinações de superfície, leitores de tela ou navegadores. Componentes puramente visuais não precisam receber foco; seus controles opcionais e o contexto consumidor precisam ser avaliados separadamente.

## Achados históricos — versão 0.5.6

| Prioridade | Componentes ou regra | Evidência e consequência |
| --- | --- | --- |
| Alta | Checkbox, RadioGroup e RadioCardGroup | As regras removem o outline e o restauram somente sob `html[data-focus-navigation="keyboard"]`. O atributo estava ausente após Tab no Storybook, e os controles focados continuaram com `outline-style: none`. |
| Alta | Infraestrutura de foco | `FocusNavigationMode` é exportado, mas não é montado automaticamente pelos componentes nem pelo preview. A conformidade não deve depender de o consumidor descobrir essa exigência. O listener atual só identifica Tab como início de navegação por teclado. |
| Alta | SelectMulti — opções | O input focado usa `peer sr-only`. O elemento visível `checkbox-control-proxy` não tem regra para `peer-focus-visible`. Um outline no input recortado não destaca a opção visível. O trigger, isoladamente, já tem foco explícito. |
| Alta | InputStandalone, Input/Formik, TextArea, InputPhone e DatePicker | Os campos compartilham `outline-none` e dependem principalmente da borda `focus-within`. Em erro, a borda de erro é mantida também no foco, sem um segundo indicador explícito na configuração padrão. Há necessidade de um foco independente do erro e do preenchimento. InputPhone também usa `overflow-hidden`, exigindo atenção ao recorte dos indicadores internos. |
| Alta | Cores de foco | Na superfície `--surface-card-semantic`, o foco resolvido do preset verde3 claro mede aproximadamente 2,85:1. O uso direto de `primary-1` no escuro mede 2,73:1 no tema padrão, 2,53:1 em verde1 e 2,89:1 em verde2. Não alcançam 3:1 nessa superfície. |
| Média | InputSwitch, PageTabsHeader e botões auxiliares de Input/InputSelect | Usam `outline-primary-1` em vez do token semântico de foco, trazendo as limitações de contraste acima. |
| Média | Slider, InputSlider, InteractiveDonutChart, TimeRangeSelector e ações de DocumentItem | Há dependência do outline nativo ou da regra global condicional em parte dos controles. O outline nativo não é automaticamente uma falha; precisa ser verificado nos navegadores suportados e nos fundos reais. |
| Média | PageTabsHeader | As abas têm `role="tab"`, mas não implementam navegação por setas e gestão de tabIndex do padrão ARIA de tabs. Todas são botões alcançáveis por Tab. É uma inconsistência de navegação do componente composto, distinta da cor do foco. |

Button, OtpCodeInput, Pagination, controles de Table, FileViewer, ações de Notice, fechar Modal, SkipLink e controles de preferências possuem indicadores explícitos no código. FileDropzone transfere o destaque para o label por `focus-within`. Isso é uma base adequada, mas não constitui aprovação de todas as variantes, cores e situações de recorte. O problema de contraste de um token compartilhado também pode afetar esses controles.

## Ajustes recomendados

1. Garantir foco por CSS com `:focus-visible`, sem exigir inicialização por JavaScript. Preservar a preferência de foco reforçado como uma melhoria adicional.
2. Nos campos compostos, destacar o contêiner quando um controle interno tiver foco visível, preservando a borda de erro. Evitar um anel cortado por overflow e distinguir o foco entre prefixo, entrada e ações auxiliares.
3. Transferir o indicador para proxies e opções visíveis de checkbox/radio.
4. Usar tokens semânticos de foco com contraste suficiente nos temas e superfícies suportados. Não assumir que a cor de marca serve como foco em qualquer fundo.
5. Conferir Tab, Shift+Tab, setas, Enter, Espaço, Escape, retorno do foco e recorte em menus, modais, tabelas e abas. Incluir estados de erro e testes nos navegadores suportados.

## Referência normativa

- [2.4.7 Focus Visible — AA](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible): indicador de foco visível ao operar por teclado.
- [1.4.11 Non-text Contrast — AA](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast): contraste do indicador personalizado com cores adjacentes, normalmente pelo menos 3:1.
- [2.4.11 Focus Not Obscured (Minimum) — AA](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum): o componente focado não pode ficar inteiramente oculto por conteúdo criado pelo autor.
- [2.4.13 Focus Appearance — AAA](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance): requisitos adicionais de área e mudança de contraste. O equivalente a um contorno de 2px é referência deste critério AAA, não uma exigência universal do nível AA.

A análise inicial não alterou componentes. As correções posteriores descritas acima devem ser conferidas no código e nos testes da versão 0.5.7. Permanecem necessários testes no contexto consumidor, incluindo sobreposições, superfícies personalizadas e os navegadores suportados.
