# API dos novos componentes

## Formulários

`OtpCodeInput` está disponível em `@aspprev/versi-ds/forms` e aceita `length`,
`value` ou `values`, `onChange`, `onComplete`, `autoFocus`, `mask`,
`disabled`, `error`, `errorText`, `label` e `helperText`. A colagem de um código
completo é distribuída entre os campos. O consumidor controla a validação e o
envio.

## Documentos e arquivos

`QRCode` gera um QR no cliente a partir de `value`, com `size`, `level`,
`includeMargin`, `fgColor`, `bgColor`, `ariaLabel` e `description`.

`FileDropzone` controla somente seleção/arraste e chama `onFilesAccepted` ou
`onFilesRejected`; `FileList` exibe itens controlados e callbacks `onRemove` e
`onRetry`; `FileUploadProgress` expõe progresso determinado ou indeterminado.
Nenhum desses componentes faz upload ou chamada de API.

`FileViewer` recebe URL, Blob ou `{ url, blob, contentType, fileName }`, e
renderiza imagens, PDF e texto. Autorização, obtenção, sanitização adicional e
download específico permanecem no consumidor.

## Evolução dos existentes

`DatePicker` agora aceita `selectionMode="month" | "year"`, mantendo
`selectionMode="day"` como padrão. `StatusDomain` ganhou domínios genéricos
de solicitação, protocolo, requerimento e pagamento. `Table` aceita
`errorMessage` e seus controles de paginação respeitam contêineres estreitos.

`useContainerBreakpoint(ref, { breakpoints })` usa `ResizeObserver` e não
conhece shell, menu, router ou portal consumidor.

Todos os contratos são client-only quando usam eventos, estado ou observação
do DOM. Importe sempre pelas entradas públicas `core`, `forms` e `documents`.
