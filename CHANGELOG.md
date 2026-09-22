# Changelog

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
