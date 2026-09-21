# Bandeiras e API de países

`@aspprev/versi-ds/countries` mantém `COUNTRY_OPTIONS`,
`PHONE_COUNTRY_OPTIONS`, `getCountryOptions`, `getCountryFlagUrl` e tipos.
`getCountryFlagUrl("BR")` e `getCountryFlagUrl("br")` retornam a mesma URL
`data:image/svg+xml;base64,...`. Códigos ausentes/desconhecidos retornam `""`.
As listas usam essas URLs e `getCountryOptions` continua retornando uma cópia.

## Resolução e publicação

Os 250 SVGs originais em `public/flags` **deste repositório** são a fonte dos
assets. `scripts/generate-country-flags.mjs` gera o mapa versionado
`src/data/country-flags.json` em ordem determinística. O build regenera o mapa;
`node scripts/generate-country-flags.mjs --check` verifica sincronização.
O import JSON é incorporado pelo tsup/esbuild em um chunk ESM compartilhado.
Não há transformação de SVG exigida do Next.js, Vite ou Storybook consumidor,
resolução por URL relativa a arquivo no servidor, CDN ou postinstall.
O pacote também preserva os 250 SVGs em `dist/flags` para auditoria e compatibilidade.
`check:package` verifica a igualdade byte a byte das URLs incorporadas e SVGs
originais, além de contar os 250 arquivos no conteúdo de `npm pack`.

`InputPhone` e `SelectCountry` usam primeiro `flags.svg` customizado não vazio,
depois `getCountryFlagUrl(cca2)` e por último o placeholder existente. URLs
customizadas continuam sendo responsabilidade do consumidor. O campo legado
`flags.png` permanece como metadado e não é requisitado pelos componentes.
Markup, dimensões, alt decorativo e comportamento de teclado foram preservados.

## SSR, Next.js, Vite e CSP

A resolução de assets é síncrona e não acessa `window` nem `document`. A URL é
idêntica no servidor e cliente, inclusive sob basePath. Em Next App Router,
Formik e os controles ficam em Client Components (veja o fixture); `/countries`
pode ser importado em Server Components. Use `<img>` com a URL retornada.
Se a aplicação tiver CSP, `img-src` deve permitir `data:`. Não há cache HTTP
individual nem carregamento por país: o mapa completo acompanha a entrada de
países/formulários e suas URLs também ocupam espaço no HTML de SSR.

A opção por incorporação favorece portabilidade sem configuração de loaders.
Uma futura distribuição com assets externos ao JS exigiria um contrato de
bundler/servidor separado; não faz parte desta alteração.

## Migração do portal

Instalar o pacote que contém esta alteração, remover `public/flags` usado
exclusivamente pelo DS e retirar scripts de cópia/postinstall e rotas dedicadas.
Não apagar imagens próprias que ainda sejam referenciadas por opções customizadas.
Manter os imports atuais. Conferir CSP e executar build/SSR e fluxo de seleção.
Nenhuma versão, URL de repositório ou release foi criada nesta alteração.

## Validação reproduzível

- `npm install`, `npm run typecheck`, `npm run build`, `npm test`.
- `npm run test:visual`: Storybook, teclado, imagens carregadas e Axe.
- `npm pack --dry-run`: prepack, orçamento e integridade dos 250 assets.
- `npm run test:package`: instalação isolada, entrypoints, tipos e SSR.
- `npm run test:flags-consumers`: Next.js e Vite de produção em diretório
  temporário sem public, tarball instalado, imagens e interações no Chromium.
- `npm run pilot:prepare` e `npm run test:pilot`: aplicação Vite completa.

Os testes novos de SSR verificam fallback, customização e ausência de `/flags/`
no HTML. O teste de consumidores verifica ausência de requisições a essa rota,
carregamento efetivo de imagens e erros de runtime/hidratação.

## Medição desta alteração

Comparação com o pacote anterior instalado no piloto (mesmo manifesto, sem
alterar versão):

| Artefato | Antes | Depois | Acréscimo |
| --- | ---: | ---: | ---: |
| JavaScript total de dist | 376.735 B | 5.182.902 B | 4.806.167 B |
| JavaScript total com gzip | 70.087 B | 1.771.688 B | 1.701.601 B |
| Tarball compactado | 1.505.943 B | 4.905.186 B | 3.399.243 B |

O tarball preserva SVGs originais e source maps, por isso seu acréscimo é maior
que o JavaScript compactado. São 295 arquivos publicados, incluindo os 250
SVGs. O orçamento agregado foi atualizado para considerar explicitamente o
mapa incorporado; os limites das entradas individuais e CSS foram mantidos.

`npm install`, `npm run typecheck`, `npm run build`, `npm test` (68 testes) e
`npm pack --dry-run` passaram. A verificação do tarball confirmou integridade
das bandeiras e ausência de `/flags/` nos arquivos JavaScript publicados.

## Arquivos desta implementação

- Resolução: `src/countries.ts`, `src/data/countries-source.json`,
  `src/data/country-flags.json`, `src/components/inputPhone/InputPhone.tsx`,
  `src/components/selectCountry/SelectCountry.tsx`.
- Build e distribuição: `scripts/generate-country-flags.mjs`,
  `scripts/build.mjs`, `scripts/check-package.mjs`, `scripts/check-size.mjs`,
  `scripts/test-package.mjs`, `scripts/test-flags-consumers.mjs`, `package.json`.
- Testes: `tests/design-system/standalone-countries.test.ts`,
  `standalone-country-select.test.tsx`, `standalone-flags.test.tsx`,
  `tests/flag-url.ts`, `tests/visual/design-system/countries.visual.spec.ts`,
  `tests/pilot/pilot.spec.ts`, `playwright.config.ts`.
- Consumo: `examples/flags-consumer/` (Next App Router, entrada Vite e README),
  `examples/pilot/package.json`, `examples/pilot/README.md`,
  `scripts/prepare-pilot.mjs`; removido `examples/pilot/scripts/copy-flags.mjs`
  e o diretório gerado `examples/pilot/public/flags`.
- Documentação: `README.md`, `docs/API-PUBLICA-CONTROLES.md`,
  `docs/EVOLUCAO-DESIGN-SYSTEM.md`, `MIGRACAO-DO-PORTAL.md` e este documento.

Alterações locais preexistentes em governança, CSS e arquivos do piloto foram
preservadas. Não houve publicação npm nem alteração de versão.

A suíte `npm run test:visual` passou com **50 testes** em Chromium desktop e
mobile, sem atualização de snapshots. Incluiu os 16 cenários dos seletores
(tema/contraste/viewport), teclado, carregamento de bandeiras e Axe, bloqueando
qualquer requisição a `/flags`. O timeout de inicialização do Storybook foi
ampliado de 180 para 600 segundos para acomodar o build neste ambiente.
O typecheck final também passou após atualizar os helpers do Playwright.

`npm run test:package` passou em consumidor isolado mínimo e completo:
entrypoints ESM, CSS, tipos NodeNext/strict e SSR dos dois controles.
No fixture sem public, Next.js 16.3.5/Turbopack compilou e pré-renderizou a
página com os SVGs incorporados; o Chromium confirmou imagens carregadas,
interações e ausência de erros de hidratação/runtime ou chamadas a `/flags`.
O fixture Vite 8.3.0 também passou: build de produção e os mesmos controles
no Chromium, com imagens carregadas e sem erros ou requisições a `/flags`.
Seu JavaScript completo (React + aplicação + DS) ficou em 5.142,99 kB,
1.829,51 kB gzip. Ambos os frameworks consumiram o tarball instalado via npm,
sem aliases/symlinks para os fontes do DS e sem diretório public.
