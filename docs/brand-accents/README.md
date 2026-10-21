# Detalhes opcionais de marca

Implementação local sobre 0.5.9, sem release, publicação ou mudança de versão. Os sete clientes mantêm os valores de referência de `--brand-accent-1/2/3` nos quatro modos. A primária continua sendo a ação principal. Acentos não são aliases de secondary/tertiary, feedback, foco, seleção ou status.

## Contrato público

| Token | Uso |
| --- | --- |
| `--brand-accent-{1,2,3}` | Referência decorativa da identidade; não garante legibilidade como texto/ícone funcional |
| `--brand-accent-{n}-soft` | Fundo suave para um detalhe opcional |
| `--brand-accent-{n}-content` | Texto ou ícone sobre o fundo suave correspondente |
| `--brand-accent-{n}-border` | Borda opcional sobre esse fundo |
| `--chart-brand-accent-{n}` | Entrada de dados para o resolvedor de gráficos; pode ser ajustada para aparecer sobre a superfície do gráfico |
| `--brand-detail-gradient` | Imagem decorativa: verde → azul no custom2157 comum; `none` nos demais temas e no alto contraste |

Todos os tokens RGB usam canais separados por vírgulas: `rgb(var(--brand-accent-2-content))`. O degradê é um token do tipo imagem, usado com `background-image`, não uma cor Tailwind. Os demais novos tokens têm tipo `color` na fonte canônica e geram classes como `bg-brand-accent-2-soft`, `text-brand-accent-2-content` e `border-brand-accent-2-border`. Prefixos de acento não classificam tamanhos/raios como cor.

Nos modos comuns, os fundos suaves foram derivados misturando o acento com a superfície neutra do card; conteúdo usa o neutro de leitura, sem alterar a identidade. Os valores RGB computados estão no registro canônico e no diagnóstico [PAIRS.json](PAIRS.json). Os números comuns são diagnóstico visual, não um gate formal de conformidade. O papel de gráfico é uma projeção para dados: cores muito próximas da superfície são ajustadas nesse papel, sem modificar a referência da marca.

No alto contraste, fundo/conteúdo/borda usam neutros do modo e o gráfico usa os papéis de dados já preparados para alto contraste. O degradê é suprimido. Os pares funcionais verificam 4,5:1 para texto e 3:1 para indicadores/bordas aplicáveis sobre seus fundos. A referência decorativa sozinha não recebe essa garantia; não representa estado.

Os onze presets genéricos agora têm acentos próprios nos quatro modos, conforme [a integração dos genéricos](GENERICOS-E-IDENTIFICADORES.md). O fallback neutro fica para contextos sem apresentação específica e prevalece nos altos contrastes genéricos. Para decoração com fallback, use `rgb(var(--brand-accent-1, var(--primary-1)))`; isso não redefine a primária. Os claros de custom2178, custom2140 e custom2156 mantêm página, cards, ações padrão, paleta, feedback e placeholders existentes. Os novos detalhes só aparecem com adesão explícita.

## Componente existente

```tsx
import { Surface } from "@aspprev/versi-ds/core";

<Surface brandAccent={2} elevation="none" padding="compact" radius="sm">
  <MeuIcone aria-hidden="true" />
</Surface>
```

`brandAccent` escolhe os pares de apresentação no lugar de `tone` nessa instância. Sem a prop, a aparência existente permanece. A borda não é adicionada automaticamente; aplique `className="border"` quando necessária. O título do card continua fora desse contêiner com `content-primary`. Nenhuma biblioteca de ícones ou outro Card foi criada.

## Gráficos: catálogo estável

```tsx
import { TimeSeriesChart, InteractiveDonutChart, type ChartBrandPalette } from "@aspprev/versi-ds/charts";

// Catálogo do domínio; não refaça a lista com base no resultado filtrado.
const brandPalette: ChartBrandPalette = {
  categories: ["contribution", "loan", "support", "investment", "other"],
  roles: { contribution: "primary", loan: "accent-2", support: "accent-3", investment: "balance" },
};
const keys = dadosVisiveis.map(item => item.id);

<TimeSeriesChart ariaLabel="Contribuições" type="line" options={{ xaxis: { categories: meses } }}
  brandPalette={brandPalette} seriesKeys={keys}
  series={dadosVisiveis.map(item => ({ name: item.label, data: item.values }))} />

<InteractiveDonutChart ariaLabel="Distribuição" brandPalette={brandPalette} seriesKeys={keys}
  options={{ labels: dadosVisiveis.map(item => item.label) }}
  series={dadosVisiveis.map(item => item.total)} />
```

`seriesKeys` separa identidade de rótulo traduzido. Se omitido, linhas usam nomes das séries e donut usa labels: nesses casos eles precisam ser únicos e pertencer ao catálogo. O catálogo completo dá a cada categoria um lugar estável; uma chave desconhecida ou catálogo duplicado gera erro explicativo. Papéis são escolhas deliberadas: `primary`, `accent-1/2/3`, `balance`, `invested`. As métricas não passam a representar sucesso/erro.

Sem papel explícito, outras categorias recebem cores de dados distintas, deduplicadas e estendidas além dos doze slots existentes. Não se repetem três acentos por módulo ou posição de render. Linha e donut compartilham o resolvedor de marca; sem `brandPalette` preservam suas ordens legadas diferentes (`chart-*` e `chart-donut-*`). Os tokens de eixos, tooltip, muted, saldo e investido continuam públicos.

Nos modos comuns, custom colors explícitas continuam tendo prioridade: `options.colors` nas linhas e `colors` ou `options.colors` no donut. Em alto contraste, os papéis do modo prevalecem como no contrato anterior, com padrões/traços, legendas e percentuais sobre fundo neutro. A seleção do donut acompanha a categoria ao reordenar e é limpa se ela sair do filtro; o comportamento existente de limpar ao clicar fora continua. Gráficos já montados observam mudanças de identidade, esquema e contraste.

## Migração no portal — sem alterar arquivos do portal

| Uso temporário | Contrato público após atualizar o pacote |
| --- | --- |
| `--portal-brand-detail` como fundo/ícone suave | `--brand-accent-{n}-soft` para fundo e `--brand-accent-{n}-content` para ícone |
| Mistura local de acento com neutro | Remover a fórmula local e consumir o par gerado pelo DS |
| Borda local do detalhe | `--brand-accent-{n}-border`, se necessária |
| `HomeCardHeader` padrão | `Surface brandAccent={1}` no ícone ou o par 1 em seu wrapper atual |
| Empréstimo/perfil de investimento | Par 2 no ícone; título mantém `content-primary` |
| Atendimento/documentos | Par 3 no ícone; título mantém `content-primary` |
| Detalhe geométrico suave de SVG | `fill="rgb(var(--brand-accent-{n}-soft))"`; contorno/ícone funcional usa `content` correspondente |
| Investimentos: dois detalhes geométricos | Manter os papéis explícitos 2 e 3; não substituir globalmente todos os fills |
| Cores de séries lidas do acento pelo consumidor | `brandPalette` com catálogo e papéis, preservando métricas nomeadas |

Escolha o acento por função no mapa do portal, não pelo índice do card. Remova as misturas e exceções locais equivalentes depois de adotar o contrato, para não manter duas fontes de regras. Remova apenas as sobrescritas temporárias correspondentes; mantenha placeholders e identidade aprovados. Prévia antiga de temas pode reaplicar snapshots inline: sincronize-os ou desligue com `?previewTema=0` para avaliar o DS. Não modificar pele/cabelo, símbolos narrativos ou cores de alertas.

Não foram encontradas ilustrações próprias do DS para recolorir. O Storybook inclui um exemplo geométrico identificado como exemplo, além de ícones, detalhes em cards, comparação padrão/com acento e gráficos reais com seis categorias. Cada cliente tem os quatro modos na galeria, e `Temas → Acentos de marca` oferece troca com gráficos montados e presets genéricos. Use o grupo `Detalhes de marca · Apresentação` em Cores para inspecionar os pares.

## Validação e evidências do contrato inicial

- Na etapa inicial, 207 testes unitários passaram; o lote inclui contratos de API, catálogo de 24 categorias, papéis explícitos, preservação de padrões e geração tipada.
- 13 testes de navegador passaram: sete clientes × quatro modos; cores por categoria após filtros/reordenação; seleção por teclado, cores customizadas, tooltip ativo, layout móvel; fallbacks dos onze legados em quatro modos e quatro formas de aplicar identidade; regressões dos gráficos custom2133/rosa1 e 288 contextos com cores protegidas e placeholders preservados.
- Build do pacote e Storybook, TypeScript, lint sem avisos, tokens gerados, bundle, tamanho, conteúdo do pacote e navegação foram conferidos. O catálogo tem 328 entradas e 49 componentes. O limite de CSS contempla os novos pares opcionais; a auditoria de tamanho permanece ativa.
- Evidências: [custom2133 claro](evidencias/custom2133-light.png), [escuro](evidencias/custom2133-dark.png), [alto contraste claro](evidencias/custom2133-high-light.png), [alto contraste escuro](evidencias/custom2133-high-dark.png), [custom2157 e faixa opcional](evidencias/custom2157-light.png).

A aprovação formal dos pares medidos se restringe aos modos de alto contraste. Os modos comuns foram inspecionados visualmente e registrados. Isso não certifica combinações arbitrárias de overrides, imagens sob texto, cores customizadas ou o portal completo: esses contextos devem ser revistos no consumidor.
