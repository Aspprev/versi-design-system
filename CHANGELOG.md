# Changelog

## 0.3.0 — 2026-09-22 — em preparação

### Adicionado

- `OtpCodeInput` com colagem distribuída, conclusão controlada e suporte a teclado.
- `QRCode` com descrição acessível, tamanho/correção configuráveis e estados de loading/erro.
- Primitives de upload (`FileDropzone`, `FileList` e `FileUploadProgress`) e `validateFiles`.
- `FileViewer` para fontes locais, Blob e URLs de imagem, PDF e texto.
- `useBreakpoint`, `useContainerBreakpoint`, `resolveContainerBreakpoint` e tokens de largura de conteúdo.

### Alterado

- `DatePicker` recebeu seleção por ano, navegação por teclado, retorno de foco e associações acessíveis de descrição/erro.
- `DomainStatusBadge` e `resolveStatusAppearance` aceitam mapas configuráveis por consumidor.
- `Table` e `MobileCardTable` tiveram paginação, filtros, modos responsivos e tab stops revisados.
- Filtros de tabela receberam `id`, `accessibleName` e `groupName`; Escape fecha o diálogo e devolve o foco ao gatilho.
- Stories, testes unitários, testes de interação/Axe e documentação foram ampliados para os novos contratos.

### Acessibilidade

- Reforçados foco visível, nomes e estados acessíveis, mensagens de erro, retorno de foco e redução de movimento nos componentes cobertos.
- Validações automatizadas desktop/mobile passaram para OTP, QRCode, upload, FileViewer, DatePicker e tabela.

### Compatibilidade

Esta é uma versão minor aditiva. Não há remoção de exports públicos nem alteração incompatível intencional. Aliases existentes foram preservados; as novas props são opcionais. O pacote continua reutilizável e não incorpora regras de negócio, chamadas de API ou componentes específicos dos portais.

### Migração

- Prefira os entrypoints públicos `@aspprev/versi-ds`, `/core`, `/forms` e `/documents`; não use imports internos de `src`.
- Para seleção exclusiva por ano, use `DatePicker selectionMode="year"`.
- Para uploads, mantenha transporte, autenticação e persistência no consumidor; use `validateFiles`, `FileDropzone`, `FileList` e `FileUploadProgress` para o contrato visual/controlado.
- Para status específicos do produto, passe `statusMap` ao `DomainStatusBadge` ou ao resolver, mantendo o vocabulário de negócio fora do DS.

## 0.2.0 — 2026-09-22

### Adicionado

- `OtpCodeInput` em `@aspprev/versi-ds/forms`.
- `QRCode`, `FileDropzone`, `FileList`, `FileUploadProgress` e `FileViewer` em
  `@aspprev/versi-ds/documents`.
- `useContainerBreakpoint` em `@aspprev/versi-ds/core`.

### Alterado

- `DatePicker` aceita `selectionMode="day" | "month" | "year"`; `day` continua
  sendo o padrão.
- `StatusBadge` ganhou domínios genéricos adicionais e `Table` ganhou estado
  de erro; a responsividade passou a considerar a largura do contêiner.
- A redução de movimento também respeita `prefers-reduced-motion`.
- O Storybook foi reorganizado em `Getting Started`, `Foundations`,
  `Components`, `Patterns`, `Themes` e `Guidelines`, com ordenação centralizada.
- A documentação visual passou a usar os assets oficiais da marca VERSI no
  cabeçalho, página inicial e favicon, além de novas orientações de uso e
  acessibilidade.

### Compatibilidade

Esta é uma versão minor aditiva. Aliases existentes foram preservados e os
portais continuam responsáveis por APIs, transporte, permissões e regras de
negócio. Não há remoções ou deep imports novos.

### Migração

Importe os componentes pelos entrypoints públicos. Para seleção exclusiva de
ano, substitua implementações locais por `DatePicker selectionMode="year"`;
para arquivos, controle a fila e o upload no consumidor e passe os estados a
`FileList`/`FileUploadProgress`.
