# Bundle de paises e bandeiras

Na versao 0.4.1, os dados de paises foram separados em metadados leves e
payloads de bandeiras.

## Contrato

O entrypoint publico `@aspprev/versi-ds/countries` continua sincronico e
preserva `COUNTRY_OPTIONS`, `PHONE_COUNTRY_OPTIONS`, `getCountryOptions`,
`getCountryFlagUrl` e `filterCountryOptions`. Em Node/SSR, mantem o mapa
completo para consumidores que precisam dessas APIs diretamente. Em bundles de
navegador, o mesmo export usa uma variante leve com URLs para as bandeiras
locais ja empacotadas.

`@aspprev/versi-ds/core` e `@aspprev/versi-ds/forms` nao importam o mapa completo.
`SelectCountry` e `InputPhone` usam somente metadados no carregamento inicial.

## Carregamento interno

Quando um componente precisa mostrar uma bandeira padrao, o pacote carrega 20
chunks ESM internos gerados por `scripts/generate-country-flag-chunks.mjs`.
Todos os chunks permanecem dentro do pacote publicado; nao ha CDN, fetch,
requisicao HTTP externa, postinstall ou dependencia nova.

No SSR, uma opcao customizada com `flags.svg` continua renderizando a imagem
imediatamente. Para a lista padrao, o primeiro render usa placeholder e a
bandeira e preenchida apos a hidratacao, quando os chunks internos terminam de
carregar. `getCountryFlagUrl` continua sincronico e retorna a data URL
historica em Node/SSR; no navegador, retorna a URL do arquivo local
correspondente.

## Validacao

`npm run check:bundle` verifica que:

- `core.js`, `forms.js`, `index.js` e `countries-browser.js` nao contem o
  payload completo de bandeiras;
- existem 20 chunks internos de bandeiras;
- nenhum chunk carregavel pelo consumidor excede 750 KB;
- o carregador nao usa `fetch` nem URLs HTTP externas.

No build validado da 0.4.1, o maior chunk carregavel pelo consumidor ficou em
332.158 bytes. O `countries.js` sincronico permanece maior por compatibilidade,
mas o export browser e os entrypoints de componentes nao agregam esse mapa.
