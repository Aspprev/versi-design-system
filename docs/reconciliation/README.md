# Reconciliação do portal — 12/11/2026

**Decisão posterior:** o [Escuro + Alto contraste universal](../high-contrast-dark/README.md) substitui apenas as referências de alto contraste escuro deste relatório, incluindo a política antiga de neutros/cabelo e as paletas HC por tenant. Os outros três modos permanecem preservados.

O DS foi reconciliado com os arquivos efetivamente carregados pelo portal e com as decisões deste pedido. A entrega foi inicialmente validada sobre a **0.7.4** e está preparada para a **0.8.0**. O portal não foi editado. A adoção no consumidor ainda depende de atualizar a dependência, retirar a suavização local e substituir imports das ilustrações; não há sincronização de implantação concluída.

## Evidência e precedência

Conferidos no portal: `src/app/layout.tsx`, `src/styles/globals.css`, `src/styles/custom2178.css`, `src/utils/chart-theme.ts`, `src/context/theme-identity.ts`, `src/context/theme-provider.tsx`, `src/app/(private)/design-system/{theme-lab.tsx,client-themes.ts,client-theme-baseline.json}`, `public/images/`, `docs/{temas-custom,temas-clientes,temas-genericos,acentos-temas-genericos-para-ds}/` e os contratos pertinentes de `tests/design/` e `tests/accessibility/`.

O layout carrega `styles.css` e `themes.css` do pacote instalado **0.7.4**, depois os dois CSS locais. A auditoria usa Chromium e os **estilos compilados**, não apenas o diff Git ou o CSS fonte anterior ao processamento do Tailwind. [portal-token-audit.json](portal-token-audit.json) registra as diferenças anteriores entre fonte compilada, pacote instalado e composição do portal, para os 72 contextos. Nenhuma diferença de token foi encontrada nos outros 17 temas. As três diferenças computadas comuns em modo normal (`color`, `outline` e `outline-color`) decorrem da cor herdada do `body` no portal, não de paletas diferentes.

Os JSON/CSS antigos em docs são referências históricas, inclusive o snapshot do custom2170 baseado no DS 0.5.7 e os acentos genéricos exportados da 0.5.9. Não foram reaplicados sobre as migrações de secondary, os ajustes de paletas da 0.7.2 ou as correções de acessibilidade posteriores. O JSON atual do custom2178 confirma a principal #EA7100 e o apoio #C50022; o CSS efetivamente importado confirma os quatro modos. A antiga equivalência com laranja1 e a descrição `preservedLight` do laboratório foram superadas.

No custom2170 há uma divergência histórica relevante: o snapshot do portal descreve uma primária verde (#799A3B), mas o CSS efetivamente aplicado e o DS instalado usam azul **#0C366C no claro e #8DB8EA no escuro**. A identidade azul atual foi preservada, em vez de restaurar o snapshot antigo. A prévia opcional baseada em propostas pode voltar a exibir o verde; ela não substitui a identidade de produção na reconciliação.

`client-themes.ts`/`client-theme-baseline.json` geram propostas inline quando a prévia é ativada por `previewTema=1` ou por sessão salva. Esses valores podem ganhar de qualquer versão do pacote. O laboratório também contém cinco rascunhos experimentais, além de propostas `client-*` e um editor livre; eles não pertencem ao registro de 18 identidades de `theme-identity.ts`. Não foram promovidos a APIs de temas de produção. Não foi possível verificar o estado da sessão de uma instância real do portal; use `previewTema=0` na futura comparação do consumidor.

## Temas

Todas as linhas cobrem claro, escuro, alto contraste claro e alto contraste escuro. **S22** significa: preservar as 12 cores anteriores e a ordem, misturando cada canal com 22% de branco somente nos modos comuns; alto contraste permanece igual. **R1** significa retirar `softenDonutColor` e sua chamada em `src/utils/chart-theme.ts`, ou usar `getChartTheme` de `@aspprev/versi-ds/charts`. A função local jamais deve continuar suavizando tokens já suavizados.

| Tema | Diferença encontrada no portal | Fonte de confirmação | Situação no DS | Remoção possível no portal após adoção |
|---|---|---|---|---|
| custom2170 | Identidade, apoios, estados e foregrounds já iguais; S22 apenas na função local | Pacote instalado + CSS computado; chart-theme.ts; snapshot conferido como histórico | Identidade já existente; S22 incorporada | R1; sem override de identidade a remover |
| custom2178 | Nova principal #EA7100, apoio #C50022, escalas laranja/vermelho e dados; circular próprio | custom2178.css importado pelo layout; JSON/CSS correspondente em docs/temas-custom; pedido final | Incorporada, isolada dos presets compartilhados; foregrounds acessíveis preservados/corrigidos | Remover custom2178.css e seu import; R1 para o restante; desativar prévia antiga |
| custom2156 | Tokens já iguais; S22 local | Pacote + CSS computado + chart-theme.ts; docs/temas-custom conferidos | Já existente; S22 incorporada | R1 |
| custom2140 | Tokens já iguais, inclusive neutros posteriores; S22 local | Mesmas fontes; correções já presentes no DS | Já existente; S22 incorporada | R1 |
| custom2133 | Tokens já iguais, inclusive gradiente; S22 local | Mesmas fontes; implementação atual preservada | Já existente; S22 incorporada | R1 |
| custom2162 | Tokens já iguais; S22 local | Pacote + CSS computado + chart-theme.ts; docs/temas-custom conferidos | Já existente; S22 incorporada | R1 |
| custom2157 | Tokens já iguais; S22 local | Pacote + CSS computado + chart-theme.ts; docs/temas-custom conferidos | Já existente; S22 incorporada | R1 |
| default | Tokens/acento já iguais; S22 local | Registro de identidades + pacote + CSS computado + chart-theme.ts; docs genéricos | Já existente; S22 incorporada também sem classe/atributo | R1 |
| azul1 | Tokens/acento já iguais; S22 local | Mesmas fontes dos genéricos | Já existente; S22 incorporada | R1 |
| azul2 | Tokens/acento já iguais; S22 local | Mesmas fontes dos genéricos | Já existente; S22 incorporada | R1 |
| azul3 | Tokens/acento já iguais; S22 local | Mesmas fontes dos genéricos | Já existente; S22 incorporada | R1 |
| laranja1 | Tokens/acento já iguais; S22 local; não recebe a identidade custom2178 | Mesmas fontes dos genéricos | Já existente; S22 incorporada | R1 |
| laranja2 | Tokens/acento já iguais; S22 local | Mesmas fontes dos genéricos | Já existente; S22 incorporada | R1 |
| verde1 | Tokens/acento já iguais; S22 local | Mesmas fontes dos genéricos | Já existente; S22 incorporada | R1 |
| verde2 | Tokens/acento já iguais; S22 local | Mesmas fontes dos genéricos | Já existente; S22 incorporada | R1 |
| verde3 | Tokens/acento já iguais; S22 local | Mesmas fontes dos genéricos | Já existente; S22 incorporada | R1 |
| verde4 | Tokens/acento já iguais; S22 local | Mesmas fontes dos genéricos | Já existente; S22 incorporada | R1 |
| rosa1 | Tokens/acento já iguais, incluindo restauração posterior do escuro; S22 local | Mesmas fontes dos genéricos; implementação atual do DS | Já existente; S22 incorporada | R1 |

As diferenças aprovadas estão em [approved-overrides.json](approved-overrides.json), separadas dos snapshots antigos. [original-chart-palettes.json](original-chart-palettes.json) preserva as paletas anteriores usadas pelos testes. A fonte de verdade de produção continua sendo `tokens/design-system.tokens.json`; os CSS são gerados pelo fluxo do projeto.

## Recursos e ilustrações

| Recurso | Diferença encontrada | Fonte de confirmação | Situação no DS | Remoção possível / o que permanece no consumidor |
|---|---|---|---|---|
| Circular custom2178 | Sete cores próprias + posições 8–12 = cores 3–7 com 25% de branco; HC ajustado para pelo menos 3:1 contra a superfície | CSS aplicado + especificação final | Incorporada em --chart-donut-1…12 | CSS local e transformação local dispensáveis após atualização |
| Outros gráficos | Séries comuns não recebem a suavização; custom2178 tem as séries laranja/vermelho da identidade aplicada | chart-theme.ts e custom2178.css | Paletas anteriores preservadas para os outros 17 temas; custom2178 incorporado | Manter adaptações de dados/backend, salvo adoção equivalente da API do DS |
| Tooltip, eixos, legenda | Portal tem estilos globais de Apex/tooltip em globals.css | globals.css; estilos/components de gráficos do DS | DS já fornece tokens e estilos com escopo .versi-chart | Só remover duplicatas após usar componentes/escopo do DS; estilos de gráficos locais ainda são responsabilidade do consumidor |
| portal-banner.tsx | Dois círculos brancos, sem acento | SVG atual, coordenadas (985.5,74.5) e (937,115) + pedido | Componente incorporado; geometria preservada | Substituir import e retirar cópia local quando sem referências |
| error.tsx | Ferramenta em #80868E/#A8ADB4 | SVG atual + pedido | Incorporado | Mesma substituição de import |
| login-hmg-img.tsx | Ferramenta em #80868E/#A8ADB4 | SVG atual + pedido | Incorporado | Mesma substituição de import |
| under-development-image.tsx | Ferramenta em #80868E/#A8ADB4 | SVG atual + pedido | Incorporado | Mesma substituição de import |
| vantagens.tsx | Quatro checkbox em brand-accent-1; checks legíveis | Quatro pares de paths do SVG atual + pedido | Incorporado; agrupamento semântico support/on-support substitui tratamento de irmãos legado | Retirar cópia local após troca de import |
| investment.tsx | Moedas #EAB308, detalhes #A16207; volume preservado | SVG atual, referência Cofrinho + pedido | Incorporado | Retirar cópia local após troca de import |
| imposto-renda-img.tsx | Moedas douradas e todas as notas cinzas; subpaths já separados no portal | SVG atual + pedido | Incorporado sem reunir os paths separados | Retirar cópia local após troca de import |
| unable-image.tsx | Check #42BE65 e X #D80813 fixos; sombras mantidas | SVG atual + pedido | Incorporado sem associação a apoio/danger | Retirar cópia local após troca de import |
| contribuicao-adicional-img.tsx | Corpo e mangas: três paths à direita em acento 1, dois à esquerda em acento 2; detalhes da calça separados | SVG atual + pedido | Incorporado com todos os paths preservados | Retirar cópia local após troca de import |
| Outros 20 SVGs TSX | Assets independentes de React que ainda só existiam no portal | Todos os arquivos de public/images; inventário abaixo | Todos incorporados, incluindo Cofrinho; mesmas geometrias e cores narrativas | Substituir imports e remover as cópias sem referências |
| Classe base e IDs | classe portal-illustration precisa sobreviver a className; IDs fixos de máscara/clip podem colidir entre instâncias | SVGs atuais + renderização de múltiplas instâncias | Classe preservada; IDs isolados com React.useId | Consumidor mantém apenas props de tamanho/acessibilidade e contexto de tema |
| Tematização inline | SVG resolve papéis semânticos no tenant/modo ativo | illustrations.css existente + contratos de ilustração | Contrato já existente; novos assets usam esse contrato | Sem CSS local de ilustração necessário; não retirar a classe base |
| Foreground do botão custom2178 | Override branco geral do botão primário prejudicaria a nova principal laranja | styles.css do DS + nova paleta + contraste medido | Token de foreground opcional incorporado, com reset nos demais temas e isolamento aninhado | Botões locais que forçam branco continuam precisando de revisão no consumidor |
| Neutros, feedback e placeholders | Já incorporados ao pacote; snapshots antigos divergem de correções posteriores | Pacote instalado, registro atual, contratos de legibilidade | Preservados | Override local de field-assistive-error em HC escuro é redundante; confirmar uso ao removê-lo |
| Cor herdada do body | Portal define content-primary; outline acompanha currentColor | globals.css + diferenças computadas da auditoria | Suporte semântico já existente; regra de shell não migrada | Manter a regra do body e o layout/safe-area |
| Preferências acessíveis | Escala de fonte, redução de movimento e sublinhado de links aparecem no CSS local | globals.css e tokens/estilos atuais do DS | Tokens/contrato já existentes; integração de preferência é do consumidor | Remover apenas duplicatas comprovadas; manter persistência e controles de preferência no portal |
| Controles locais | Radios, checkbox/proxies e switch têm adaptadores CSS locais para hover, active, disabled e foco de teclado | globals.css; testes de controles; componentes e tokens atuais do DS | Suporte de tema/estado já existente no DS; adaptadores de markup local não migrados | Retirar esses adaptadores somente ao substituir os controles locais pelos componentes equivalentes do DS |
| Ações locais de autenticação | portal-auth-primary-action força primary-3 e foreground local; links de ambiente usam cor específica | Final de globals.css | Não migradas como regras de autenticação; papéis action/content do DS disponíveis | Permanecem no consumidor; revisar branco forçado ao adotar custom2178 |
| Prévia e laboratório | Pode injetar propostas antigas por inline style, incluindo preservedLight superado | TenantThemePreview, theme-lab, client-themes e baseline | Não incorporados como tokens de produção; conflito documentado | Desativar prévia antiga na adoção; atualizar/arquivar propostas no consumidor separadamente |
| SVGs estáticos e imagens restantes | Logos, ícones institucionais, assinatura e imagem raster não têm o contrato inline dos componentes | Demais arquivos de public/images | Permanecem no consumidor; nenhuma recoloração automática aplicada | Manter arquivos de marca/conteúdo; não confundir com os 29 SVGs TSX migrados |

O [inventário completo](illustration-inventory.json) lista os **29 arquivos**, nomes públicos exportados, quantidade de paths e SHA-256 da sequência de geometrias original. Os testes comparam todos os paths renderizados com essa evidência. Pele, cabelo, detalhes, opacidades e camadas não receberam uma recoloração geral.

Os atributos de preenchimento narrativos dos SVGs foram preservados. O contrato legado de `portal-illustration`, que já existe no portal, continua convertendo fills neutros (inclusive #191C1F) em tinta semântica no alto contraste. Portanto, partes desenhadas com esse neutro, inclusive cabelo e pequenos detalhes, podem aparecer claras em HC escuro como já acontecia no consumidor. Isso não foi substituído por uma nova política de recoloração dos personagens; uma separação narrativa por path desses neutros exigiria uma revisão adicional de cada desenho e de sua legibilidade.

## Acessibilidade e conflitos resolvidos

[accessibility-corrections.json](accessibility-corrections.json) registra cada valor do override do portal que não foi copiado literalmente. Foram preservados os pares semânticos de alto contraste existentes no DS, em vez de restaurar apoios coloridos como texto em HC. No modo comum, os foregrounds de ilustração foram escolhidos com pelo menos 4,5:1 e alguns conteúdos de acento foram ajustados para leitura sobre a superfície suave. A primária #EA7100 e o apoio #C50022 continuam os valores de identidade do claro. Dados em HC são ajustados somente quando necessário para 3:1 contra a superfície.

As cores circulares suaves em modo comum são decorativas/dados com rótulos; não se afirma contraste de 3:1 para todos os pares entre fatias suaves. HC preserva as paletas anteriores dos outros temas e usa cores com contraste adequado contra a superfície. Os testes não comprovam distinção universal entre pares de séries, nem dispensam legendas, valores e navegação dos componentes.

Não há conflito de token sem solução pendente dentro do DS. Permanece pendente a adoção no portal e a conferência da sessão/prévia real. Regras de autenticação, tenant, armazenamento, configuração de cliente, navegação e layout não foram migradas.

## Consumo e build

```tsx
import PortalBanner from '@aspprev/versi-ds/illustrations/portal-banner';
// Catálogo opcional com nomes completos também disponível:
import { IllustrationInvestment } from '@aspprev/versi-ds/illustrations';

<PortalBanner className="meu-banner" role="img" aria-label="Boas-vindas" />
<IllustrationInvestment aria-hidden="true" />
```

As APIs existentes de root/core/forms/charts não mudaram. Os novos módulos são opcionais: as ilustrações são compiladas separadamente por desenho, e não entram no grafo de root/core. O catálogo inteiro pesa mais que um desenho individual; prefira o subpath por arquivo. Os checks têm limite para o conjunto opcional e para cada módulo. O build também otimiza themes.css pelo mesmo Tailwind usado em styles.css, mantendo o registro e o CSS fonte gerado legíveis sem aumentar os limites anteriores.

O Storybook oferece `Foundations/Illustration assets` nos quatro modos para os 29 desenhos; o seletor global escolhe a identidade.

## Validação

| Validação | Resultado |
|---|---|
| `npm test` | 40 arquivos, 219 testes aprovados |
| Rechecagem unitária após os ajustes finais de tokens | 5 arquivos, 16 testes aprovados |
| Reconciliação em Chromium | 20 testes aprovados: 288 combinações de identidade/modo/seletor/host, padrão sem identidade, tema aninhado e 72 contextos de cores nos nove assets solicitados |
| Contratos existentes selecionados no Storybook | 97 casos verificados: 93 passaram na rodada inicial; quatro expectativas antigas foram corrigidas e os quatro casos passaram em reexecuções dirigidas |
| CSS distribuído | Todos os tokens cobertos pelos contratos históricos conferidos em 288 contextos, preservando placeholders e valores protegidos fora das diferenças aprovadas |
| `npm run typecheck` e `npm run lint -- --max-warnings=0` | Aprovados |
| `npm run build` e `npm run check:generated` | Aprovados; CSS e declarações gerados pelo fluxo oficial |
| `npm run check:size` e `npm run check:bundle` | Aprovados; limites existentes mantidos, com orçamento separado para assets opcionais |
| `npm run check:package` | Aprovado: 11 entradas/padrões de export, 250 bandeiras, 450 arquivos; pacote só inclui os arquivos permitidos |
| `npm run test:package` | Consumidores temporários mínimo e completo aprovados: ESM, SSR, TypeScript strict/NodeNext, import individual/catalogado do banner e isolamento de peers opcionais; execução com React 19 |
| `git diff --check` | Aprovado |

As quatro expectativas antigas eram: aliases `var(--chart-1/2)` comparados literalmente com cores computadas em três contratos, e uma comparação do donut com `--chart-1` em vez de `--chart-donut-1`. Os snapshots históricos foram preservados; as diferenças aprovadas são aplicadas separadamente. Uma reexecução teve colisão de arquivos de trace porque dois processos compartilharam o diretório de artefatos; a matriz foi repetida sozinha em outro diretório e passou. Não houve necessidade de alterar novamente as cores de produção por essas falhas.

Para repetir apenas a matriz nova, após `npm run build`, execute `npm run test:reconciliation`. Ela também integra a suíte normal de navegador no desktop; a duplicação em viewport móvel é dispensada porque a cascata é independente do viewport.

**Limites da conferência visual:** foram geradas capturas dos nove assets solicitados em custom2170 e custom2178 nos quatro modos. Houve inspeção visual manual de amostras no claro, escuro e HC escuro, incluindo ferramentas, círculos, camisas, moedas, notas, checkbox, check e X. Os outros 20 assets tiveram geometria, props/classe e renderização SSR conferidas, mas não uma revisão artística manual de cada path em todos os temas. A conferência visual e de contraste usa Chromium; não houve homologação em todos os navegadores, leitor de tela, dispositivo real, nem numa sessão autenticada do portal. React 18 não foi reexecutado nesta tarefa. O comportamento neutro legado em HC descrito acima permanece.

As capturas locais ficam em `test-results/reconciliation/` e não são arquivos de produção. Não houve alteração do portal, aumento de versão, commit, push, tag ou publicação.
