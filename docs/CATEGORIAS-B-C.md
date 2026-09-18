# Preparação das categorias B e C

Este documento registra o segundo lote preparado na cópia autônoma do design system. Os componentes originais continuam em `src/components` e nenhum consumidor do Portal VERSI foi migrado nesta etapa.

## Categoria B — lote fundacional

Foram preparados na árvore `design-system/src/components`:

- `FormGrid` e `FormActions`, para grades e barras de ação responsivas;
- `PageHeading` e `PageTabsHeader`, com navegação de retorno baseada em HTML;
- `InfoGrid`/`InfoItem`, com `dl`, `dt` e `dd` e política explícita para valores ausentes;
- `FilterBar`, composto por `FormGrid` e `FormActions`;
- `StatusBadge`, recebendo tom e aparência já resolvidos pelo domínio;
- `DocumentItem`, com slots de detalhes, status, ações e ilustração.

`FieldFrame` foi copiado como detalhe interno da família de controles e permanece fora do entrypoint público. Os controles estabilizados são exportados individualmente, sem expor a implementação interna.

O `Input` foi o primeiro controle preparado. Ele mantém a versão integrada ao Formik e a versão `InputStandalone`, com máscaras, moeda, CPF, telefone, senha, prefixo/sufixo, ícones, ajuda, erro e estado desabilitado. `FieldFrame` concentra os estados visuais e os atributos de label/erro, enquanto `react-number-format` fica como dependência direta do pacote.

O `InputSelect` foi preparado na sequência, preservando busca, navegação por teclado, lista em portal, mensagens ARIA e integração Formik. Seu posicionamento flutuante usa utilitários locais do pacote. Com a inclusão dos controles de formulário, os limites de bundle passaram a validar JavaScript em 220 KB bruto e 45 KB gzip; CSS mantém 125 KB bruto e 25 KB gzip.

O `TextArea` foi preparado na mesma família, usando `FieldFrame` para rótulo, ajuda, erro e estado inválido. A cópia autônoma preserva integração Formik, prefixo, sufixo, ícone, foco, estado desabilitado e atributos ARIA do textarea. Stories e testes cobrem uso inicial, preenchido, ajuda, erro e desabilitado.

O `InputPhone` foi preparado como controle composto de telefone internacional. Ele mantém seleção e busca de país por nome, sigla ou DDI, máscaras por país, normalização do valor Formik, montagem e leitura do payload do portal, além de mensagens de erro e estados desabilitados acessíveis.

O `SelectMulti` foi preparado como controle controlado de seleção múltipla. Ele preserva a lista de opções, resumo acessível da quantidade selecionada, seleção por teclado, limpeza da seleção, estado inválido, estado desabilitado e uso do `FieldFrame` para rótulo e mensagem.

O `SelectCountry` foi preparado sobre o `InputSelect`, reaproveitando sua navegação, busca, mensagens ARIA e posicionamento flutuante. A variante acrescenta apresentação de bandeiras, placeholder e conteúdo de país, com fallback sem imagem e sem dependências do Next.

`Tag` e `StatusCard` permanecem fora do entrypoint e devem convergir para `StatusBadge`. A familia `Chart` foi preparada com `TimeSeriesChart`, `InteractiveDonutChart`, `TimeRangeSelector` e carregamento lazy de ApexCharts. O `Table` permanece disponivel com `Table` e `MobileCardTable`.

O `Table` preserva filtros, ordenacao, paginacao controlada e interna, linhas expansiveis, estados vazios, densidade, variantes de cabecalho e linha, modo responsivo, rolagem horizontal e cabecalho fixo. A copia removeu aliases do portal, dependencia de `next/image` e cores diretas, usando tokens semanticos para funcionar nos temas claro e escuro.

Os graficos usam `getChartTheme` para ler tokens CSS de series, eixos, grade, superficie e tooltip. A renderizacao ApexCharts ocorre somente no cliente; o pacote declara `apexcharts` e `react-apexcharts` como dependencias diretas. Donut e series temporais mantem suporte a alto contraste, redimensionamento responsivo e nomes acessiveis.

## Categoria C — infraestrutura desacoplada

Foram preparados:

- `SkipLink`, com alvo e rótulo configuráveis e sem variáveis de safe area do portal;
- `FocusNavigationMode`, que alterna o atributo de navegação por teclado ou ponteiro;
- `FormErrorNavigation`, com busca do primeiro campo inválido e respeito a `prefers-reduced-motion`.

`HighContrastToggle` e `AccessibilityPreferencesPanel` permanecem no portal porque ainda dependem de persistência, eventos e hooks de preferências específicos. A próxima etapa deve extrair uma camada controlada por props antes de exportar esses componentes.

## Critério para a próxima rodada

Antes de migrar consumidores, o lote B/C deve receber stories para variantes e estados, testes de acessibilidade em DOM e uma revisão de dependências. A adoção no portal continuará reversível enquanto o pacote estiver em dry-run.
