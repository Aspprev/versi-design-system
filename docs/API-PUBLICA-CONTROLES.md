# API publica dos controles

Este documento registra a superficie publica dos controles de formulario. Prefira `@versi/design-system/forms`; a raiz também reexporta os controles, mas exige todos os peers opcionais. Caminhos internos de `src` não fazem parte do contrato.

Todos os controles abaixo sao client-only: usam estado, eventos de DOM, Formik, `window` ou portal durante a interacao. Eles podem ser incluidos em um componente cliente do consumidor, mas nao devem ser renderizados diretamente como Server Components.

| Export            | Funcao                                        | Dependencias de runtime            | Contrato principal                                                                                                                       |
| ----------------- | --------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `Input`           | Campo de texto com mascaras e variantes       | Formik, `react-number-format`      | `name` obrigatorio; aceita mascara, ajuda, erro, prefixo, sufixo e icones                                                                |
| `InputStandalone` | Campo de texto sem Formik                     | `react-number-format`              | Controle por `value`/`onChange`, com as mesmas mascaras do `Input`                                                                       |
| `InputSelect`     | Selecao simples com lista e busca opcional    | Formik                             | `name`, `options` e `label` opcionais; suporta renderizacao de opcao/valor                                                               |
| `TextArea`        | Texto multilinha                              | Formik                             | `name` obrigatorio; aceita ajuda, erro, prefixo, sufixo e icone                                                                          |
| `InputPhone`      | Telefone internacional com pais, DDD e numero | Formik, `react-number-format`      | `countries` opcional; use `countryList` para `all`, `include` ou `exclude`; use `buildPhonePayload`/`parsePhonePayload` no limite da API |
| `DatePicker`      | Data digitada e calendario                    | Formik, `date-fns`                 | `value` ou campo Formik; suporta `minDate`, `maxDate`, `drilldown` e `dropdown`                                                          |
| `SelectMulti`     | Selecao multipla controlada                   | Nenhuma alem das dependencias base | `options` e `value` controlados; `onReset` limpa a selecao                                                                               |
| `SelectCountry`   | Selecao de pais com bandeira                  | Formik, via `InputSelect`          | `options` opcional; use `countryList` para filtrar a lista padrao                                                                        |

Os nomes `SelectCountry`, `SelectMulti`, `InputPhone`, `DatePicker` e `Checkbox` sao os nomes canonicos. Os nomes anteriores `CountrySelect`, `MultiSelect`, `PhoneInput`, `Datepicker` e `CheckBox` continuam exportados como aliases depreciados durante a transicao.

## Regras de uso

- Importe componentes e tipos pelo entrypoint publico. O CSS deve ser importado uma vez por aplicacao com `@versi/design-system/styles.css`.
- `Input`, `InputSelect`, `TextArea`, `InputPhone`, `DatePicker` e `SelectCountry` precisam estar dentro de `Formik` quando usados com o fluxo integrado. `InputStandalone` e `SelectMulti` podem ser controlados sem Formik.
- Mensagens de erro integradas ao Formik aparecem depois que o campo esta marcado como tocado. Mensagens passadas diretamente pelas props seguem o contrato especifico de cada componente.
- Os estados visuais usam tokens semanticos do CSS publico e respondem aos atributos de tema e contraste definidos no contrato de tokens.
- Mudancas de nome, tipo de prop, markup acessivel ou comportamento de selecao exigem atualizacao deste documento, de uma story, de um teste de contrato e do registro de evolucao.

## Dependencias e compatibilidade

React e React DOM são peer dependencies (`>=18.2.0 <20`). Formik, date-fns e react-number-format são peers opcionais necessários para `/forms`. classnames, react-icons e class-variance-authority são dependências diretas. O build externaliza essas bibliotecas. Consulte o manifesto para versões compatíveis.

O repositório é independente; nome e versão existentes são `@versi/design-system` e `0.1.0`, pendentes de confirmação para release. Testes, stories e documentação interna permanecem no repositório; o npm contém dist, README e manifesto.

## Países, teclado e bandeiras

SelectCountry usa o nome como valor na lista padrão (`Brasil`), com `cca2` separado (`BR`). `countryList.codes` sempre usa ISO-2. Ambos os seletores priorizam `/flags/<cca2>.svg`; o consumidor deve servir os arquivos publicados em `dist/flags` nessa rota.

O seletor de país do InputPhone participa da ordem de Tab. Enter/Espaço ou setas abrem o painel; a busca recebe foco. Setas percorrem as opções e Enter/Espaço selecionam. Escape fecha e devolve foco ao botão; Tab fecha e avança ao telefone, Shift+Tab retorna ao botão. A busca e o painel têm nomes acessíveis. O campo usa `type="tel"` também no modo mascarado.

A escolha explícita preserva o país por ISO-2 enquanto o componente estiver montado, inclusive para países com o mesmo DDI. O payload `{ ddi, ddd, numero }` permanece compatível e não distingue esses países ao restaurar dados. A posição do painel pode ser recalculada sem retirar o foco das opções.
