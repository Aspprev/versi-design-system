# Revisão de segurança do Design System

Revisão local em 2026-09-18, preservando as alterações anteriores do repositório.

## Dependências

Consultas online (sem limitar ao cache):

- `npm audit --json --offline=false`: 0 vulnerabilidades conhecidas, em todas as severidades.
- `npm --prefix examples/pilot audit --json --offline=false`: 0 vulnerabilidades conhecidas.

Essa checagem foi automatizada em `npm run check:security` e passou a fazer
parte do `prepack`, impedindo que um tarball seja preparado quando o DS ou o
piloto tiver uma vulnerabilidade reportada pelo registry.

O workflow `.github/workflows/security.yml` repete a auditoria, typecheck,
testes e build em pushes, pull requests e semanalmente. O Dependabot acompanha
os dois manifests npm (`/` e `/examples/pilot`) e abre atualizações separadas.

O workflow `.github/workflows/publish.yml` foi adicionado para publicar somente
tags `v*`, em runner hospedado pelo GitHub, com `id-token: write`, Node 24,
auditoria, typecheck, testes e build antes de `npm publish --access public`.
Ele usa o ambiente GitHub `npm-publish`; configure a proteção e o trusted
publisher no npm antes de criar a primeira tag de release.

Os relatórios abrangem as versões resolvidas nos lockfiles, incluindo ferramentas
de desenvolvimento. Não foi necessário atualizar dependências, aplicar
`npm audit fix --force` ou alterar a versão do pacote. Isso não certifica todas
as combinações de peers permitidas pelo manifesto nem dependências do portal.

## Link de retorno do PageHeading

O componente encaminhava `back.href` diretamente para `<a href>`. Se uma
aplicação fornecer esse valor a partir de entrada controlada por um atacante,
um protocolo `javascript:` pode executar código ao clicar no link em React 18.
O pacote declara compatibilidade com React a partir de 18.2.0; não pode depender
somente do bloqueio implementado por versões mais novas do React.

A análise foi confirmada no código oficial do React 18.2.0:
[sanitizeURL](https://github.com/facebook/react/blob/v18.2.0/packages/react-dom/src/shared/sanitizeURL.js)
e [feature flag desativada](https://github.com/facebook/react/blob/v18.2.0/packages/shared/ReactFeatureFlags.js).
Não foi constatada exploração no portal; o risco depende da origem do valor.

A correção descarta esse protocolo, reconhecendo maiúsculas/minúsculas,
controles C0 no início, tabulações e quebras de linha que o navegador ignora.
O componente usa o botão de retorno existente, preservando `back.onClick`.
Links relativos, fragmentos e outros protocolos mantêm o comportamento anterior.
A checagem é síncrona, compatível com SSR e não usa APIs do navegador.

Os testes de regressão exigem ausência de href executável no HTML e preservação
dos links legítimos. Não substituem validação de destino/autorização no consumidor.

## Outros pontos inspecionados

- Tooltips próprios dos gráficos: textos escapados e cor inline validada.
  Callbacks/options customizados do ApexCharts continuam sendo código confiável
  fornecido pelo consumidor, não um sanitizador de HTML arbitrário.
- Fontes dos 250 SVGs: busca por scripts, eventos inline, foreignObject,
  conteúdo incorporado ativo e URLs executáveis sem ocorrências nesses arquivos.
- Código de componentes: não encontrados usos diretos de eval, Function,
  document.write, innerHTML ou dangerouslySetInnerHTML.
- Servidor local de Storybook: bind em 127.0.0.1 e verificação de caminho relativo.
- Os lockfiles do DS e do piloto não contêm Next.js nem react-server-dom-*.
  Os avisos de RSC dizem respeito ao runtime/framework da aplicação consumidora;
  uma auditoria do DS não substitui a auditoria do portal. Consulte o
  [aviso oficial do React](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components).

Esta é uma revisão direcionada, não um pentest nem garantia de ausência de
vulnerabilidades desconhecidas. Nenhuma release ou publicação foi realizada.

Para publicar com provenance, habilite trusted publishing no npm para o
repositório e workflow de release depois de confirmar a organização dona do
pacote; essa configuração exige acesso administrativo e não foi inventada
neste repositório.
