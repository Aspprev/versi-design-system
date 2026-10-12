# Release 0.5.3

Inclui as melhorias de segurança e qualidade da 0.5.2 e corrige duas falhas
de compatibilidade do CI entre Windows e Linux:

- Normaliza quebras de linha dos tokens, inclusive CRLF embutido em seletores
  do registro. `tokens:check` aceita LF/CRLF e continua detectando alterações
  reais. `.gitattributes` mantém os artefatos gerados em LF.
- Centraliza a localização do npm para execução direta por Node e via
  `npm run`, suportando os layouts Windows e Linux/macOS. A correção abrange
  os scripts de auditoria, empacotamento, piloto e teste do consumidor InfoGrid.
- Inclui testes de regressão para os dois problemas.

Não altera a API pública ou os breakpoints. Continuam válidas as orientações
de integração da [0.5.2](RELEASE-0.5.2.md), incluindo a remoção do contorno do
InfoGrid no portal e as bandeiras preservadas nas listas de países.

## Publicação

Preservar `v0.5.1` e `v0.5.2`. Primeiro enviar a branch e aguardar a execução
mais recente do CI, sobre o commit desta release. Depois enviar `v0.5.3`;
isso aciona o workflow de publicação, que repete os checks e publica o
tarball validado usando o ambiente `npm-publish` e trusted publishing.

Reexecutar workflows das tags antigas não incorpora estas correções.

## Validação local

- Tokens, governança, lint sem avisos, TypeScript e build aprovados.
- Quatro auditorias sem alertas e verificação da mitigação local aprovada.
- Conteúdo do pacote, limites de tamanho, divisão de bundles e teste do
  consumidor InfoGrid aprovados com o tarball 0.5.3.
- CSS idêntico ao anterior; sourcemaps legíveis; YAML dos workflows válido.
- Na suíte de 145 testes, 144 passaram e o teste de leitura das 250 bandeiras
  atingiu o timeout de cinco segundos durante execução concorrente com o
  build. O arquivo afetado foi repetido após o build: cinco testes aprovados,
  incluindo o teste que havia excedido o tempo. Não houve divergência de conteúdo.
- A reprodução de checkout LF extraído do Git passou em `tokens:check` com
  o gerador corrigido. A execução real no runner Linux depende do push.
- O piloto foi instalado de forma limpa pelo tarball 0.5.3 e todos os arquivos
  de `dist` coincidiram com o build desta versão.

## Comandos no terminal do repositório

Enviar a branch preparada (commit e tag locais já criados):

```powershell
git push -u origin chore/seguranca-e-qualidade
```

Aguardar o CI desta branch aprovar o commit da 0.5.3. Depois conferir e enviar
a tag para acionar o publish:

```powershell
git show v0.5.3 --no-patch
git push origin refs/tags/v0.5.3
```

Acompanhar a nova execução **Publish package**, referente a `v0.5.3`, no
GitHub Actions. Não usar `npm publish` local nem recriar as tags anteriores.
