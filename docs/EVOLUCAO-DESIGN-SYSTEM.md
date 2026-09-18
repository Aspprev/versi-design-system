# Evolução do Design System

## 2026-09-18 — aplicação piloto consumindo o tarball

- Criado `examples/pilot`, aplicação React/Vite privada com manifesto, lockfile,
  TypeScript e node_modules próprios. Consome core/forms/overlays/countries e CSS
  via pacote instalado, sem aliases ou imports dos fontes do DS.
- Tela de contatos com Formik, validação, Input, SelectCountry, InputPhone,
  Table, Notice, Modal, SkipLink e controles de tema/contraste/paleta/escala.
  Os dados permanecem na memória da página, sem backend ou conexão com o portal.
- Fonte system-ui e CSS baseado nos tokens; as 250 bandeiras são copiadas do
  pacote instalado e servidas pelo próprio consumidor.
- Criado `scripts/prepare-pilot.mjs`: executa npm pack com prepack, deriva o nome
  do tarball do manifesto atual, instala o arquivo no piloto, verifica ausência
  de symlink e copia os ativos. Não altera nome/versão de release nem publica.
- Adicionados comandos pilot:prepare, pilot:build, pilot:dev e test:pilot;
  configuração Playwright própria e testes de produção desktop/mobile.
- Tipos do piloto limitados ao node_modules local para evitar inclusão automática
  dos tipos MDX/Storybook da pasta pai. Vite usa configuração PostCSS própria vazia,
  pois o CSS do pacote já está compilado e não exige Tailwind no consumidor.
- Inspeção visual identificou uma borda do SkipLink fora do foco. Alterado top-2
  para top-0 para ocultá-lo completamente; o piloto verifica a posição inicial,
  acesso por Tab e salto para o conteúdo. Tarball reconstruído e reinstalado.
- README e MIGRACAO-DO-PORTAL.md apontam para o exemplo; instruções completas em
  examples/pilot/README.md. Artefatos, dependências e bandeiras copiadas são
  ignorados pelo Git. O exemplo não entra no tarball do DS.

Resultados finais do piloto registrados após a conclusão dos testes abaixo.

## 2026-09-18 — README como guia de uso do DS

- README reorganizado em torno da finalidade do DS, primeiros passos, camadas,
  catálogo por necessidade e instalação das integrações opcionais.
- Adicionados exemplos de composição visual, Formik com validação/envio,
  InputStandalone controlado, Modal, aplicação de temas e uso de tokens CSS.
- Documentadas propriedades frequentes, semântica da tipografia, máscaras,
  responsividade dos formulários, fontes e responsabilidades de acessibilidade.
- Incluída tabela de diagnóstico para estilos, peers, Formik, bandeiras e temas.
- Contexto do portal, estado da separação e pendências de transição concentrados
  em MIGRACAO-DO-PORTAL.md; o README mantém apenas uma indicação desse documento.
- Alteração exclusivamente documental. Exemplos conferidos com os contratos
  locais dos componentes; sem mudanças de runtime, dependências ou exports.
- Validação: os seis exemplos TSX do README passaram pelo TypeScript em modo
  strict, usando as declarações públicas do pacote. Blocos Markdown conferidos.
  A suíte de componentes não foi repetida para esta alteração documental.

## 2026-09-17 — preparação do repositório independente para npm

Revisão concluída em 2026-09-18, após a verificação adicional com React 18.2.

Revisão limitada ao `ds-versi`. O repositório estava sem commits, com os arquivos
do projeto não rastreados; este registro descreve as alterações da revisão e
não presume uma comparação com uma release anterior. Não havia um registro
de evolução nesta cópia, por isso este arquivo foi criado.

Nome e versão preservados: `@versi/design-system`, `0.1.0`. Nenhuma publicação,
push, migração de imports ou alteração de arquivos do portal foi realizada.

### Problemas encontrados e correções

- **Autonomia do build:** removida a procura de ferramentas no node_modules da
  pasta pai. Temas e bandeiras ausentes agora interrompem o build.
- **Fronteira cliente:** bundling descartava as diretivas dos fontes. As seis
  entradas de componentes agora recebem `use client`; sourcemaps compensam a
  linha adicionada. Countries permanece neutro. Documentada a diferença entre
  SSR e RSC, inclusive para funções utilitárias das entradas cliente.
- **Empacotamento:** criado prepack com tokens, governança, typecheck, build,
  tamanho e verificação de conteúdo. Check-package inspeciona nove exports,
  arquivos publicados e correspondência exata das 250 bandeiras.
- **Isolamento real:** criado teste que instala o tarball em diretório temporário
  fora do repositório, sem symlinks ou arquivos do portal. Verifica core/countries
  sem peers opcionais; depois verifica todas as entradas com os peers, SSR,
  resolução dos CSS e declarações TypeScript strict/NodeNext sem skipLibCheck.
- **Tipos externos:** ApexCharts 5.16.0, resolvido pela faixa antiga, referencia
  ApexDrilldownEvent fora de seu escopo e falha no consumidor strict. Fixada a
  versão 5.3.6, já declarada como mínimo no projeto, validada pelo teste isolado.
  Novas versões deverão passar por esse teste antes de ampliar a faixa.
- **Dependência de build:** auditoria online identificou aviso baixo no esbuild
  transitivo do tsup (GHSA-g7r4-m6w7-qqqr). Audit fix não resolveu a faixa 0.27;
  aplicado override restrito a tsup para esbuild ^0.28.1 e revalidado o build.
- **Tamanho:** o controle anterior só media arquivos de entrada pequenos e
  ignorava os chunks. Incluído orçamento agregado de 450.000 bytes / 85.000
  gzip para todos os JS, além dos limites existentes de CSS e bandeiras.
- **Storybook:** substituído nextjs-vite por react-vite nas 42 stories e nas
  configurações. Removido Next.js e criado PostCSS local. Globals iniciais
  explícitos para tema, contraste, escala e movimento.
- **Typecheck:** criada configuração para stories/preview/Playwright. Corrigida
  a instanciação genérica de Table na story, antes não verificada pelo tsc.
- **Seleção de países:** stories Selected/Disabled de SelectCountry usavam BR
  como valor, embora a lista padrão use Brasil. Corrigidas e documentadas.
  Teste de bandeiras agora confere cada ISO-2, além da contagem total.
- **InputPhone:** removido tabindex=-1 do seletor; adicionados nome/estado
  acessível, diálogo rotulado, busca rotulada, setas/Home/End, seleção nativa
  por Enter/Espaço, Escape/Tab e retorno de foco. A mudança de posição não
  retira foco da opção. Campo mascarado usa type=tel. Desabilitar fecha o painel.
  Escolha explícita preserva ISO-2 mesmo quando dois países compartilham DDI,
  sem alterar o payload público. Atualizado o contrato de teste do telefone.
- **Contraste:** Axe identificou texto preto sobre fundo escuro no dropdown
  portaled de SelectCountry/InputSelect. Aplicado text-field-content no painel,
  sem depender da herança do contêiner de origem.
- **Validação visual:** Playwright agora constrói e serve o Storybook estático
  em loopback, sem reutilizar servidor possivelmente antigo. Preservadas as
  referências existentes. Adicionados testes de países/teclado/SVG/Axe em dois
  esquemas, dois contrastes e dois viewports, e smoke test por grupo do catálogo.
- **Documentação:** README refeito com todos os exports, peers por camada,
  Formik, CSS, temas, fontes, flags, RSC/SSR, validação e pendências. Migração
  reescrita sem texto corrompido; governança, contrato dos controles, tokens e
  ThemeLab corrigidos para os comandos deste repositório. Corrigida a afirmação
  de que a lista de países não participa do bundle raiz/forms.
- **Limpeza:** removido setup de testes com variáveis de sessão/API do portal,
  que não era necessário, e cache gerado .next. Nenhum componente funcional foi removido. Artefatos
  de build e relatórios continuam ignorados e fora do npm.

### Arquivos alterados ou adicionados

- package.json, package-lock.json.
- scripts/build.mjs, scripts/check-size.mjs; novos scripts/check-package.mjs,
  scripts/test-package.mjs e scripts/serve-storybook.mjs.
- .storybook/main.ts, .storybook/preview.tsx, postcss.config.cjs,
  playwright.config.ts, vitest.config.ts e tsconfig.stories.json.
- Todas as 42 stories em stories/\*.stories.tsx (troca do import de tipos);
  SelectCountry.stories.tsx e Table.stories.tsx também receberam as correções citadas.
- src/countries.ts (comentário), src/components/inputPhone/InputPhone.tsx,
  src/components/inputSelect/InputSelect.tsx.
- tests/design-system/standalone-countries.test.ts,
  tests/design-system/standalone-phone-input.test.tsx; novos
  tests/visual/design-system/countries.visual.spec.ts e catalog.visual.spec.ts.
- tests/setup.ts removido.
- README.md, MIGRACAO-DO-PORTAL.md, tokens/README.md,
  docs/GOVERNANCA-DESIGN-SYSTEM.md, docs/COMPONENTES-CLIENT-SERVER.md,
  docs/API-PUBLICA-CONTROLES.md, docs/THEMELAB-E-GLOBALS-CSS.md e este registro.

### Resultados de validação

Ambiente: Windows, Node 24.14.0, Chromium/Playwright. Resultado da rodada final:

| Comando                           | Resultado                                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| npm install                       | OK; auditoria final com zero vulnerabilidades                                                   |
| npm run tokens:check              | OK; arquivos gerados consistentes                                                               |
| npm run check:governance          | OK                                                                                              |
| npm run typecheck                 | OK; fontes, stories e configuração visual                                                       |
| npm run build                     | OK; sete entradas JS/TS, dois CSS e 250 SVGs                                                    |
| npm test                          | OK; 17 arquivos, 58 testes                                                                      |
| npm run check:size                | OK; JS total 376.735 bytes / 70.089 gzip; styles.css 86.768 bytes                               |
| npm run build-storybook           | OK; framework React/Vite; reconstruído também pela suíte visual                                 |
| npm run test:visual               | OK; 50 testes em 4,7 minutos                                                                    |
| npm run check:package             | OK; nove exports, 250 bandeiras, allowlist do tarball                                           |
| npm run test:package              | OK com React 19; mínimo sem peers opcionais e completo, ESM/SSR/CSS/TS strict                   |
| npm run test:package -- --react18 | OK com React 18.2.0; consumidor mínimo e completo, incluindo TypeScript strict sem skipLibCheck |
| npm pack --dry-run                | OK com prepack; 295 arquivos, aproximadamente 1,5 MB compactados / 4,8 MB extraídos             |

A suíte visual contém 32 comparações com as imagens originais + Axe, 16 testes
de teclado/bandeiras/Axe para SelectCountry/InputPhone e dois smoke tests que
percorrem os 42 grupos de stories (desktop e mobile). Nenhuma referência visual
foi alterada. Claro, escuro, alto contraste claro/escuro, escala ampliada e
movimento reduzido foram exercitados. A cobertura de Axe permanece limitada
aos cenários declarados; o smoke test do catálogo verifica renderização/erros,
não todas as interações e não executa Axe em cada variante.

O tarball contém apenas dist/, README.md e package.json obrigatório. Inclui
dist/flags com todos os SVGs correspondentes à lista, além de JS, declarações,
CSS, sourcemaps e manifesto de build. Não inclui docs, stories, testes ou portal.
Os logs finais estão nos artefatos ignorados test-results/visual-validation.log
e test-results/pack-validation.log; relatório visual em playwright-report/design-system.

Restam avisos informativos de Browserslist desatualizado e do bundler do
Storybook (diretivas de módulo/chunks), sem falha de build. A fronteira cliente
do pacote publicado é validada separadamente por check:package.

As primeiras tentativas de build/testes falharam com spawn EPERM no sandbox;
os comandos foram reexecutados com permissão para subprocessos. Uma instalação
também encontrou ENOTCACHED em modo restrito e foi concluída com acesso ao npm.
Não eram defeitos de TypeScript do pacote. Falhas intermediárias dos novos
testes ajudaram a corrigir IDs de stories, espera de compilação e o contraste
real do dropdown; não houve atualização automática de referências visuais.

### Pendências antes de publicar

- Confirmar nome npm e versão existentes, URL remota e acesso ao escopo.
- Confirmar licença MIT declarada, titularidade e proveniência de SVGs/dados.
  Nenhuma informação de autoria/URL foi inventada.
- Testar o tarball em uma aplicação piloto de produção; configurar fonte e
  rota /flags, inclusive quando houver subpath. Migrar o portal depois.
- Fazer revisão manual com leitor de tela. A matriz automatizada não certifica
  todos os estados de todos os componentes.
- O preview usa Google Fonts, e as referências existentes dependem de Nunito
  Sans e Chromium/Windows. O pacote npm não baixa nem inclui fontes.
- O payload telefônico não armazena ISO-2: restaurar um DDI compartilhado não
  identifica o país original. Não foi introduzida uma quebra nesse contrato.

A primeira tentativa da validação adicional React 18 excedeu o limite de
240 segundos no TypeScript completo. A repetição isolada concluiu com sucesso,
sem ampliar o timeout nem relaxar a checagem de tipos. A retomada também removeu
o log intermediário countries-validation.log; os logs finais foram preservados.

Referências técnicas consultadas: [Storybook React/Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite)
e [conteúdo obrigatório do pacote npm](https://docs.npmjs.com/files/package.json/).
