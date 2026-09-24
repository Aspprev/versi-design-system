# Plano de evolução do `@aspprev/versi-ds` para os portais POR

**Data do plano:** 23/09/2026  
**Baseline:** `@aspprev/versi-ds` 0.4.3  
**Consumidores analisados:** `por-portal-rpps` e `por-portal-aspprev`  
**Status:** plano aprovado para implementação incremental; nenhum componente foi alterado nesta etapa.

## 1. Objetivo e fronteira

Evoluir o Design System para concentrar primitivas visuais, estados, acessibilidade, responsividade e contratos de interação reutilizáveis, sem transportar para o pacote regras de negócio, APIs, autenticação, permissões, rotas, tenant, Formik obrigatório ou integrações específicas.

O DS será responsável por renderização e comportamento genérico. Os portais continuarão responsáveis por dados, mensagens de domínio, navegação, permissões, chamadas de API, upload real, proxy/autorização de documentos, transformação de gráficos e contratos de backend.

Temas, paleta, tokens semânticos, `themes.css`, `styles.css` e identidade visual dos portais ficam fora desta evolução.

## 2. Evidências da inspeção

- O pacote possui exports especializados em `core`, `forms`, `overlays`, `charts` e `documents`, além do entrypoint raiz por compatibilidade.
- O DS já possui `PageHeading`, `PageTabsHeader`, `Typography`, formulários, tabelas, badges, estados, overlays, upload/viewer, QR Code, código de barras, gráficos, sliders e tooltip. A maior parte do trabalho será estabilização de contrato, acessibilidade, documentação e compatibilidade, não criação indiscriminada de novas famílias.
- `PageTabsHeader` já é usado no RPPS em Meu Benefício e Fale Conosco, e no ASPPrev em Meu Benefício, Minhas Contribuições, Meu Saldo e Fale Conosco.
- O título de `PageHeading` está dentro de um bloco apenas `min-w-0`; o cabeçalho de abas não dá ao bloco do título `flex-1`, enquanto a navegação não explicita `shrink-0`. Essa composição explica a quebra indevida de títulos como “Contracheques”.
- No RPPS, a migração já é apoiada por `src/components/page-tabs/PageTabsHeader.tsx`, que reexporta o componente do DS. As regras de URL, seleção e títulos permanecem nas páginas consumidoras.
- O ASPPrev mantém localmente wrappers de domínio como `upload-file`, `fileViewer`, `otpCodeInput`, `status-card` e `technical-code`, pois carregam integração, autenticação ou regras de negócio. Esses wrappers são referência de fronteira, não candidatos a migração integral.
- A matriz do RPPS classifica `PageHeading`, `PageTabsHeader`, formulários, estados, tabelas, badges e documentos como migração, adaptador ou evolução do DS; classifica shell, navegação, sessão, upload/viewer autenticados e componentes de domínio como responsabilidade do portal.

## 3. Componentes envolvidos e contratos atuais

### 3.1 Layout e tipografia

| Componente | Contrato atual observado | Direção |
| --- | --- | --- |
| `PageHeading` | `title`, `subtitle`, `back`, `actions`, `className`, `contentClassName`, `spacing`; aceita link seguro ou callback no retorno | Preservar API, adicionar contrato explícito de largura/truncamento e manter `back` |
| `PageTabsHeader` | `title`, `tabs`, `activeTab`, `onTabChange`, `className`, `size`; abas com `id`, `label`, `icon`, `notification`, `disabled` | Preservar contrato; corrigir composição flex sem mover navegação para o DS |
| `Typography` | `element`, `semanticRole`, `variant`, `size`, `weight`, `className`; papéis `page-title`, `section-title`, `body`, `label`, `caption`, `helper` | Documentar semântica e adicionar comportamento de título longo via API/classes genéricas |

### 3.2 Formulários

`Input`/`InputStandalone`, `InputSelect`, `TextArea`, `DatePicker`, `InputPhone`/`PhoneInput`, `SelectCountry`/`CountrySelect`, `RadioGroup`, `InputSwitch`, `SelectMulti`/`MultiSelect` e `OtpCodeInput` já possuem exports públicos em `forms`. A evolução deve preservar `value`, `name`, `onChange`, `onBlur`, `error`, reset, estados controlados/não controlados e integração opcional com Formik.

O contrato canônico será genérico: formatter/máscara, `selectionMode="year"`, serialização de telefone/país, valor vazio, opções e OTP controlado. Props de domínio como `protocolo`, `beneficio`, `solicitacao` e `pep` não entrarão no DS.

### 3.3 Documentos

`FileDropzone`, `FileList`, `FileUploadProgress`, `FileViewer`, `DocumentItem`, `QRCode` e `BoletoBarCode` são ou serão expostos por `documents`. O contrato deve cobrir seleção, rejeição estruturada, progresso, remoção, retry, slots de ação, source assíncrono, loading, erro, download e preview, sem executar upload, chamar API, conhecer AWS, Formik, proxy ou permissões.

### 3.4 Dados, status e superfícies

`Table`, `MobileCardTable`, `Pagination`, `StatusBadge`, `DomainStatusBadge`, `DocumentItem`, `Modal`, `ModalCard`, `Notice`, `PageState`, `LoadingDots`, `CircularLoading`, `Surface`, `Avatar`, `Slider`, `InputSlider`, gráficos e `Tooltip` serão revisados quanto a estados, slots, responsividade, acessibilidade e compatibilidade. Mapas de status, dados, regras de paginação e composição de domínio continuarão nos portais.

## 4. Mudanças propostas

### 4.1 Correção prioritária de títulos

- Tornar o wrapper de conteúdo de `PageHeading` um item flexível (`flex-1 min-w-0`) quando usado em cabeçalhos horizontais.
- Manter `min-w-0` no item flex que contém título/subtítulo e preservar `contentClassName` para extensões controladas.
- Fazer o bloco de tabs ocupar somente a largura necessária (`shrink-0`/largura intrínseca em tablet e desktop), preservando overflow horizontal onde necessário.
- Aplicar truncamento responsivo ao título em tablet/desktop, evitando quebra de palavras e overflow; manter quebra natural em telas pequenas quando for a opção mais legível.
- Expor o texto completo por `title` ou API equivalente sem exigir tooltip obrigatório.
- Não remover nem alterar semanticamente `back`; validar link e callback existentes.
- Cobrir títulos curtos, longos, subtítulos, ações, tabs com notificações e tabs desabilitadas.

### 4.2 Tipografia e contratos de layout

- Documentar papéis semânticos e relação entre papel, token de tamanho e peso.
- Permitir classes/propriedades específicas de comportamento de título sem introduzir nomes de domínio.
- Manter os tokens atuais e não alterar paleta ou temas.
- Usar `Typography` em stories de títulos longos, ações e responsividade.

### 4.3 Formulários

- Definir formatter/máscara genérico com comportamento previsível para digitação, colagem, caret, blur, valor vazio e reset.
- Manter `selectionMode` como API canônica do `DatePicker` e documentar migração de `onlyYear` por adaptador.
- Normalizar nomes canônicos e manter aliases (`PhoneInput`, `CountrySelect`, `Datepicker`, `MultiSelect`, `CheckBox`) somente enquanto houver consumidor.
- Documentar contratos de telefone, país, valor vazio e serialização sem impor formato de backend.
- Estabilizar `OtpCodeInput` controlado, colagem, foco, setas, Backspace, teclado, erro e API de ref; deixar OTP específico de autenticação nos portais até a validação.

### 4.4 Documentos e viewer

- Refinar tipos de rejeição com código, nome, tamanho, extensão e mensagem customizável, evitando obrigar MIME técnico ou inglês na UI.
- Garantir callbacks `onFilesAccepted`, `onFilesRejected`, `onRemove` e `onRetry`, slots de ação e estados de arquivo inválido/vazio/excedido.
- Receber limites e mensagens do consumidor; não fixar 5 MB nem mensagens do RPPS.
- Manter `FileViewer` genérico para source assíncrono e estados de loading/erro/download/preview; wrappers autenticados permanecem nos portais.
- Reutilizar `QRCode` e `BoletoBarCode` sem incorporar payload técnico, proxy ou regras de domínio.

### 4.5 Tabelas, status, overlays e dados

- Consolidar contrato desktop/mobile para tabela, filtros, ações, paginação controlada, expansão, vazio, loading, erro e overflow.
- Manter `StatusBadge` como aparência/estado genérico; mapas e enumerações de domínio permanecem consumidores.
- Preferir `StatusBadge` em usos semanticamente de estado; não criar `Tag` redundante.
- Generalizar slots e fechamento de `Modal`, `ModalCard`, `Notice` e `PageState`; manter adaptadores para `dismissible`, `instant` e `isSuccess` até a migração dos consumidores.
- Preservar altura/layout durante loading, mensagens customizáveis e conteúdo responsivo.
- Avaliar `useContainerBreakpoint` somente com evidência de mais de um consumidor real; não adicionar container query por antecipação.
- Documentar `Avatar` `xl`/fallback, `Slider`, `InputSlider`, gráficos com estados vazios/erro/loading e `Tooltip` em hover, foco, touch, Escape, conteúdo longo e reposicionamento.

## 5. Riscos de incompatibilidade e mitigação

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Alteração do flex de `PageHeading`/tabs | Mudança visual em todos os cabeçalhos | Testes unitários/visuais em 320, 375, 768, 1024, 1440 e 1920 px nos dois portais |
| Truncamento esconder texto | Perda de contexto ou acessibilidade | `title`/descrição acessível, story de título longo e validação com teclado/leitor |
| Mudança de props de formulário | Erros de compilação ou payload diferente | Tipos aditivos, aliases temporários, testes de `value`/`name`/`onChange`/`onBlur`/reset e validação de submit |
| Formatter quebrar caret/colagem | Experiência incorreta em máscaras | Testes de teclado, colagem, seleção e valor vazio antes de migrar consumidores |
| `DatePicker` legado `onlyYear` | Falha em fluxos existentes | Adaptador documentado para `selectionMode="year"`; remoção somente após busca global |
| OTP genérico divergir do fluxo de autenticação | Código não enviado ou foco incorreto | Manter wrapper do portal e migrar somente após contrato e testes completos |
| Upload/viewer assumir infraestrutura | Acoplamento a AWS/proxy/permissão | DS recebe dados/callbacks; integração e validação de segurança continuam nos portais |
| Status/Tag ganhar enum de negócio | Acoplamento e baixa reutilização | API baseada em aparência/tone e label fornecido pelo consumidor |
| Modal remover legado cedo | Regressão de fechamento/motion | Adaptadores versionados e busca global antes de remover props |
| Export incorreto ou deep import | Falha de build de consumidor | Atualizar entrypoints e validar `dist` pelo processo oficial, sem deep imports |
| Tema mudar incidentalmente | Regressão visual ampla | Não editar tokens, `themes.css`, `styles.css` ou configuração de tema nesta fase |

## 6. Ordem de implementação

Cada lote só avança depois de atualizar tipos, stories e documentação, executar testes/lint/typecheck/build aplicáveis, validar ambos os portais em desktop/tablet/mobile e registrar incompatibilidades na matriz do RPPS.

### Lote 1 — Layout, tipografia e estados de alto fan-out

`PageHeading`, `PageTabsHeader`, `Typography`, `Button`, `Notice`, `LoadingDots`, `Modal`, `ModalCard` e `PageState`.

Primeiro implementar a correção de títulos e seus testes. Depois estabilizar slots, loading/erro/vazio/sucesso, fechamento, motion e documentação, sem remover wrappers locais prematuramente.

### Lote 2 — Formulários

`Input`, `InputSelect`, `TextArea`, `DatePicker`, `PhoneInput`, `CountrySelect`, `RadioGroup`, `InputSwitch`, `SelectMulti` e `OtpCodeInput`.

Começar pelos contratos canônicos e aliases; só então aplicar formatter/máscara, `selectionMode="year"`, serialização e OTP. O portal permanece dono da validação de domínio e do Formik específico.

### Lote 3 — Tabelas e estados semânticos

`Table`, `MobileCardTable`, `Pagination`, `StatusBadge`, `DomainStatusBadge` e `DocumentItem`.

Validar contrato único desktop/mobile, expansão, filtros, ações, overflow, paginação controlada e mapas de status externos.

### Lote 4 — Documentos

`FileDropzone`, `FileList`, `FileUploadProgress`, `FileViewer`, `QRCode` e `BoletoBarCode`.

Estabilizar tipos de rejeição, callbacks e estados. Validar primeiro wrappers genéricos e depois integração dos portais, mantendo upload real, proxy e autenticação locais.

### Lote 5 — Gráficos, controles visuais e responsividade avançada

Gráficos, `Slider`, `InputSlider`, `Tooltip` e eventual responsividade baseada em container.

Só adicionar ou expandir primitive de container query se houver mais de um uso real documentado após os lotes anteriores.

### Fase final — Temas e limpeza

Fora desta etapa de contratos. Após a estabilização e validação nos dois portais, revisar tokens, paletas, temas, classes e remoção de duplicidades com uma decisão separada.

## 7. Fronteira preservada nos portais

Permanecem nos portais `Header`, `BasicHeader`, `SideMenu`, `Navigation`, `Structure`, `RouteAccessBoundary`, cards de domínio, `StatusCard`, `RouteCard`, `PEPModal`, `FileUploader` com integração de negócio, `FileViewer` dependente de proxy/autenticação, `TechnicalCode`, OTP específico enquanto o contrato não estiver estabilizado, serviços, hooks e tipos de sessão, tenant, autenticação e API.

Esses componentes podem consumir primitivas do DS internamente, mas não serão movidos integralmente para o pacote.

## 8. Critérios de aceite

- O título não quebra indevidamente em nenhum consumidor de `PageTabsHeader`; títulos longos não causam overflow e o texto completo continua acessível.
- `PageHeading` continua suportando `back`, `subtitle`, ações, link seguro e callback.
- Nenhuma API ou regra específica do RPPS entra no DS.
- Cada componente alterado possui tipos públicos, entrypoint correto, stories, documentação de props/estados/responsividade e exemplos controlados/não controlados quando aplicável.
- Estados normal, loading, erro, vazio e desabilitado estão cobertos onde fizerem sentido.
- APIs legadas só permanecem em adaptadores documentados; nenhum componente local é removido sem busca global por consumidores.
- Os consumidores atuais dos dois portais compilam; TypeScript, lint, testes e build do DS passam sem novos erros.
- Testes de teclado, foco, acessibilidade, reflow e responsividade cobrem desktop, tablet e mobile.
- Limites, mensagens, dados, rotas, permissões, autenticação, upload e proxy continuam controlados pelos portais.
- Nenhum tema, paleta, token semântico, `themes.css` ou `styles.css` é alterado nesta fase.

## 9. Entrega esperada ao final da execução

1. Resumo das alterações por lote.
2. Componentes criados, evoluídos e mantidos como adaptadores.
3. Mudanças de API e aliases/depreciações.
4. Componentes que permanecem nos portais e justificativa.
5. Testes, lint, typecheck, build e validações nos dois consumidores.
6. Incompatibilidades registradas na matriz e pendências remanescentes.
7. Impactos esperados no `por-portal-rpps` e no `por-portal-aspprev`.

## 10. Referências utilizadas

- `por-portal-rpps/docs/matriz-particularidades-componentes-rpps-versi-ds.md`
- `por-portal-rpps/docs/plano-acao-versi-ds-proxima-versao.md`
- `por-portal-rpps/docs/plano-padronizacao-componentes-versi-ds.md`
- `src/components/page-heading/PageHeading.tsx`
- `src/components/page-tabs/PageTabsHeader.tsx`
- `src/components/typography/typography.tsx`
- `por-portal-rpps/src/app/(private)/meu-beneficio/meu-beneficio.tsx`
- `por-portal-rpps/src/app/(private)/fale-conosco/fale-conosco.tsx`
- consumidores equivalentes de `por-portal-aspprev` analisados durante o inventário.

## 11. Status desta execução

- **Lote 1:** implementada a correção de composição flexível, truncamento responsivo, preservação de `back`, export de tipos e cobertura de títulos longos.
- **Lote 2:** adicionada a API genérica `formatter` para inputs; `DatePicker` com `selectionMode="year"` e `OtpCodeInput` controlado já estavam disponíveis e foram preservados.
- **Lote 3:** adicionados estados controlados de loading/erro a `Table` e `MobileCardTable`; contratos de status e expansão existentes foram preservados.
- **Lote 4:** rejeições de arquivo agora expõem código, nome, extensão, tamanho, limite e mensagens customizáveis; `FileViewer` aceita source assíncrono; lista de arquivos aceita slot de ações.
- **Lote 5:** gráficos, sliders, tooltip e container query permanecem em validação específica, sem alteração de temas.
## 12. Atualização do lote seguinte

- **Input:** caret preservado para `formatter` genérico; máscaras de protocolo/ano continuam como responsabilidade de adapter, sem props de domínio no DS.
- **InputSlider/Avatar:** `suffix` canônico com alias `sufix` e suporte reutilizável a `Avatar` `xl`.
- **Upload/FileViewer:** rejeição de arquivo vazio/inválido e slot `actions` no viewer.
- **Charts:** estados genéricos explícitos de loading, erro e ausência de dados.
- **Barcode:** `width`, `height`, `quietZone` e erro configuráveis, sem alterar o payload de boleto.
- **Pendente para integração:** atualizar os adapters dos portais para aplicar efetivamente as máscaras de protocolo/ano e consumir os novos contratos; esses repositórios permanecem fora da árvore gravável desta sessão.
