# Release 0.5.2

Esta versão incorpora as correções de InfoGrid e bandeiras da 0.5.1 e resolve
os bloqueios de segurança encontrados na preparação daquela release.

- Atualiza `source-map-js` no DS e no piloto e o parser de seletores do build.
- Mantém Tailwind 3 para preservar os requisitos atuais de navegadores.
- Mitiga a recursão excessiva de `braces` com snapshot privado de build,
  limite de profundidade e verificação do código efetivamente instalado.
  A manutenção desta mitigação pertence ao projeto; não é um patch upstream.
- Audita os quatro escopos de DS/piloto, diferencia falhas de infraestrutura
  e salva relatórios completos.
- Compartilha a validação de segurança e publicação no CI; publica o tarball
  validado e confere a correspondência entre tag e manifestos.
- Atualiza o preparo do piloto para o artefato da versão atual e elimina os
  avisos de lint. `Divider` passa a aplicar `className` e atributos da raiz.

## Integração

Atualize JS e CSS de `@aspprev/versi-ds` para `0.5.2`, mantendo a importação de
`@aspprev/versi-ds/styles.css`. Não é necessário incluir o DS no `content`
do Tailwind nem repetir as classes internas do InfoGrid. No portal ASPPrev,
o contorno `tablet:grid-cols-3 desktop:grid-cols-6` pode ser removido:
`columns={6}` entrega 1/2/3/6 colunas em 640/1024/1440px.

`showFlags={false}` oculta somente a bandeira do campo de `InputPhone` e
`SelectCountry`; as listas continuam exibindo bandeiras.

Para desenvolver o DS, preserve `.npmrc` (`install-links=true`) e a pasta
`vendor/braces-build` no checkout. Consumidores não precisam dessa configuração.

## Validação e publicação

As validações funcionais anteriores estão no
[relatório local](VALIDACAO-SEGURANCA-E-QUALIDADE.md). A preparação da 0.5.2
executa novamente os gates de release e o teste do InfoGrid sobre o novo
tarball. O CI remoto deve passar antes de enviar a tag para publicação.

Resultados da preparação local: build, tokens, governança, limites de tamanho,
divisão de bundles, conteúdo do pacote, manifestos/tag e teste InfoGrid
aprovados. Quatro auditorias concluídas sem alertas; CSS idêntico ao anterior
e sourcemaps legíveis. A suíte funcional anterior aprovou 141 testes unitários,
28 testes de navegador e os consumidores isolados React 18/19.
O piloto foi reinstalado com o tarball 0.5.2 em instalação limpa; todos os
arquivos de `dist` foram comparados com o build desta versão e coincidiram.

Preservar a tag `v0.5.1`. A nova tag é `v0.5.2`; seu envio aciona o workflow
de publicação com trusted publishing e ambiente `npm-publish`.

Consulte [segurança do build](SEGURANCA-BUILD-COMPATIBILIDADE.md) para os
limites da mitigação local e sua manutenção.
