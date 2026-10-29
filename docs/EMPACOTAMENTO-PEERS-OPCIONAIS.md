# Isolamento de react-number-format

`react-number-format` continua como peer opcional e externo. Os entrypoints
públicos e seus exports permanecem iguais.

O build usa fronteiras internas para `Input` e `InputPhone`, mantendo seus
imports do peer em módulos próprios. `CountryFlag` e o cálculo de posição do
painel também têm fronteiras internas: sem elas, o esbuild agrupa helpers
compartilhados com `InputPhone`, fazendo selects alcançarem o peer indiretamente.
Esses arquivos internos não são novos entrypoints públicos.

Assim, consumidores webpack com tree shaking podem importar componentes sem
formatação pela raiz ou por `/forms` sem instalar `react-number-format`.
O import ESM direto de toda a raiz ou de `/forms`, sem tree shaking, continua
carregando todos os seus exports e precisa dos peers dessas entradas.
`Input`, `InputStandalone`, `InputPhone` e `PhoneInput` continuam usando o peer.

Validação local, sem publicar:

```powershell
npm run build
npm run check:bundle
npm run test:package
```

`check:bundle` impede que chunks de formatação voltem a incluir módulos
alheios. `test:package` instala o tarball em um consumidor temporário, confirma
a ausência do peer, compila imports da raiz e controles sem formatação de
`/forms` com webpack e executa o bundle. Depois instala o peer e verifica CPF
em `Input` e `InputStandalone`, telefone em `InputPhone`, o alias `PhoneInput`,
SSR, todos os entrypoints e declarações TypeScript strict.
