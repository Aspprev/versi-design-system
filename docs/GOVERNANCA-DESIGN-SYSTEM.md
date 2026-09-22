# Governança do @aspprev/versi-ds

Este documento rege o repositório independente `ds-versi`. O portal será consumidor versionado em uma etapa posterior.

## Estado atual

Nome e versão do manifesto nesta preparação: `@aspprev/versi-ds`, `0.3.0`.
A tag e a publicação no npm ainda estão pendentes de revisão final, tarball e
validação nos consumidores. A URL remota do repositório continua pendente.

A API é definida pelos nove exports em `package.json`: raiz, core, forms, charts, overlays, documents, countries, styles.css e themes.css. Arquivos internos não são contrato público. A lista de conteúdo publicável é `dist` e `README.md`, além do manifesto obrigatório do npm.

## Versionamento

Usar SemVer:

- `patch`: correção compatível de comportamento, acessibilidade ou estilo.
- `minor`: novo componente, variante ou prop compatível.
- `major`: remoção/renomeação de export ou alteração incompatível de props, markup ou tokens.

Toda mudança relevante deve atualizar `docs/EVOLUCAO-DESIGN-SYSTEM.md`, testes de contrato e documentação afetada. Não alterar a versão automaticamente sem definição da release.

## Contribuição

Cada alteração deve:

1. Ser genérica e não depender de arquivos, serviços, contexto ou regras do portal.
2. Usar tokens e funcionar em claro, escuro e alto contraste, respeitando escala e movimento reduzido.
3. Preservar nome acessível, teclado, foco, estados de erro, desabilitado e carregamento.
4. Atualizar stories, testes relevantes e documentação de props.
5. Usar exports públicos, sem deep imports.
6. Passar tokens:check, check:governance, typecheck, build, test, check:size, build-storybook, test:visual, check:package e test:package.
7. Inspecionar `npm pack --dry-run`. Mudanças nas referências visuais exigem revisão das diferenças, não atualização automática indiscriminada.

## Depreciação

Preservar APIs substituídas por pelo menos um ciclo compatível. Marcar `@deprecated`, documentar a substituição e registrar o plano de remoção. Remover somente em versão major depois da migração dos consumidores.

## Revisão e promoção

Antes de uma nova versão: confirmar licença/proveniência dos ativos, acesso ao
escopo npm, validações e teste do tarball em consumidor piloto. Registrar
rollback. A migração do portal deve ocorrer separadamente, preservando cópias
locais até os consumidores concluírem build e testes.
