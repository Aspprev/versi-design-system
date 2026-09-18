# Migração do Design System

## Estado do repositório independente

Este documento concentra o contexto da separação do portal, as pendências da
transição e o roteiro de adoção. O README é o guia geral de uso do Design System.

O pacote foi extraído para um repositório independente e não importa arquivos
do portal. A preparação técnica não equivale à publicação: a revisão anterior
não publicou uma release nem definiu uma URL remota. O nome e a versão do
manifesto continuam sujeitos à confirmação para a primeira publicação.

A revisão atua apenas em `ds-versi`. O caminho efetivo neste ambiente é `C:\Users\AlineRodrigu_ipo\Desktop\ASPPrev\Projetos INOVACAO\_POR\ds-versi` (o caminho informado na solicitação tinha uma separação diferente em `AlineRodrigu\_ipo`). Nenhum arquivo do portal foi alterado ou removido. A migração dos imports será uma etapa posterior.

O pacote conserva os componentes funcionais, aliases de compatibilidade, tokens, paletas, 250 bandeiras SVG locais, dados de países, stories e testes. O nome `@aspprev/versi-ds` e a versão `0.1.0` foram preservados conforme o manifesto existente; não constituem confirmação de release.

## Ajustes para autonomia

- Build resolve ferramentas somente no `node_modules` deste repositório e falha se temas/bandeiras estiverem ausentes.
- Storybook usa React/Vite com PostCSS/Tailwind local; Next.js deixou de ser dependência de desenvolvimento.
- Entradas de componentes conservam a fronteira `use client` após bundling. SSR e RSC são contratos distintos; consulte o README.
- Peers opcionais são isolados por camada. A raiz exige o conjunto completo; `/core` e `/countries` funcionam sem esses peers.
- `check:package` verifica exports, todas as bandeiras e a lista de arquivos do tarball. `test:package` instala um tarball fora do repositório e verifica ESM/SSR/TypeScript strict.
- `prepack` reconstrói e valida o pacote antes de empacotar. `check:size` inclui os chunks compartilhados.
- `typecheck` abrange também stories e configuração de testes visuais.
- InputPhone recebeu navegação por teclado, rótulos acessíveis, foco e seleção explícita por ISO-2. As stories de SelectCountry usam o valor padrão correto (`Brasil`).

## Roteiro de validação

Execute a sequência completa do README, incluindo `npm run test:package` e `npm pack --dry-run`. Resultados e limitações desta revisão estão registrados em `docs/EVOLUCAO-DESIGN-SYSTEM.md`.

O conteúdo do npm deve conter somente `dist`, `README.md` e o `package.json` obrigatório. Não publicar stories, testes, cache, relatórios ou arquivos do portal. `dist/flags` precisa conter as 250 bandeiras.

## Piloto antes de migrar o portal

A aplicação piloto está em `examples/pilot`. Ela instala o tarball local em um
node_modules próprio, sem importar os fontes do DS. Para preparar e abrir,
execute `npm run pilot:prepare` e `npm run pilot:dev`; para validar o build de
produção, execute `npm run test:pilot`. Instruções e escopo ficam em
`examples/pilot/README.md`. Este piloto não modifica nem conecta serviços do portal.

1. Confirmar nome npm, versão de release, acesso ao escopo e URL remota. A URL ainda não foi fornecida; não criar metadados fictícios.
2. Confirmar a licença MIT já declarada, titularidade e proveniência dos dados/SVGs. O repositório não forneceu um texto de licença com titular para publicação.
3. Gerar o tarball com `npm pack` e instalá-lo em uma aplicação piloto independente.
4. Importar `/styles.css` uma única vez e `/themes.css` depois dele. Configurar a fonte do consumidor e os atributos de tema/contraste/escala/movimento.
5. Copiar `dist/flags` para uma rota pública `/flags` no consumidor (comando no README); conferir aplicações hospedadas sob subpath.
6. Instalar peers das camadas usadas. Formik envolve os controles integrados. A entrada raiz requer todos os peers.
7. Validar build de produção, teclado, leitor de tela, temas e responsividade nesse consumidor. Registrar a versão e um caminho de rollback.
8. Publicar somente após essa revisão. A migração gradual dos imports e eventual retirada das cópias do portal pertencem à etapa seguinte.

## Limitações conhecidas

- O payload telefônico `{ ddi, ddd, numero }` não armazena ISO-2; ao remontar, países que compartilham DDI são ambíguos. A seleção explícita é preservada enquanto o controle estiver montado.
- Nunito Sans não é distribuída no npm. O Storybook usa Google Fonts; as referências visuais atuais dependem dessa fonte e de Chromium/Windows. O consumidor pode hospedar sua fonte.
- Testes automáticos e Axe não certificam toda a acessibilidade; revisão manual com tecnologias assistivas continua necessária.
- O repositório estava sem commits e com os arquivos não rastreados no início. Revisar o conjunto antes do primeiro commit; não usar esse estado para inferir alterações no portal.
