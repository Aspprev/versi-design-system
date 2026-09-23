# Matriz de acessibilidade — Versi Design System 0.4.0

Esta matriz separa evidências automatizadas de verificações que dependem de
tecnologia assistiva, navegador e sistema operacional reais. Uma aprovação de
Axe não substitui a validação manual.

## Evidências automatizadas

| Cenário | Cobertura | Evidência |
|---|---|---|
| Teclado e foco | OTP, DatePicker, filtros de tabela, upload, preferências e primitives | `tests/visual/design-system/priority-components.visual.spec.ts`, `datepicker.visual.spec.ts`, `table-responsive.visual.spec.ts` e `accessibility-hardening.visual.spec.ts` |
| Nomes e estados acessíveis | QRCode, FileViewer, erros de formulário, diálogo de filtros, DatePicker | Playwright + Axe nos testes visuais dos componentes |
| Temas e contraste automatizável | claro/escuro, contraste alto, presets e escala ampliada | `tests/visual/design-system/matrix.visual.spec.ts` |
| Movimento reduzido | `data-motion="reduce"` e `prefers-reduced-motion` | `accessibility-preferences.visual.spec.ts` e `accessibility-hardening.visual.spec.ts` |
| Layout responsivo | desktop/mobile, container estreito e tabela adaptive | `responsive.visual.spec.ts` e `table-responsive.visual.spec.ts` |
| Zoom e forced colors (proxy automatizado) | viewport equivalente a 200%/400% e `forced-colors: active` | `accessibility-hardening.visual.spec.ts`; a confirmação com zoom nativo e Windows High Contrast continua manual |
| Catálogo | stories críticas e grupos do Storybook | `catalog.visual.spec.ts` e build com 1084 módulos |

## Verificação manual obrigatória

| Cenário | Componentes | Procedimento | Status |
|---|---|---|---|
| Leitor de tela | forms, OTP, QRCode, upload, FileViewer, status e tabela | NVDA/Firefox ou VoiceOver/Safari; verificar ordem, nome, estado e mensagens | Aprovado na validação manual informada pelo usuário |
| Zoom 200% | formulários, DatePicker, upload, tabela e overlays | Zoom nativo do navegador; verificar ausência de perda de conteúdo e operação | Aprovado na validação manual informada pelo usuário |
| Zoom 400% | DatePicker, OTP, upload, FileViewer e tabela adaptive | Zoom nativo; validar reflow, rolagem necessária e foco visível | Aprovado na validação manual informada pelo usuário |
| Contraste | controles, status, QRCode, tabela e estados de erro | Windows High Contrast/forced colors e contraste visual | Aprovado na validação manual informada pelo usuário |
| Teclado sem mouse | componentes compostos e overlays | Tab, Shift+Tab, Enter, Espaço, setas, Home/End e Escape | Aprovado; automatizado e validado manualmente |
| Movimento reduzido | loading, DatePicker, tabela, cards e viewer | `prefers-reduced-motion` do sistema e preferência do consumidor | Aprovado; automatizado e validado manualmente |

## Critério de fechamento

A fase só será considerada encerrada quando os cenários manuais tiverem
evidência registrada, ou quando uma exceção for aprovada e documentada. Falhas
que exigirem mudança de API devem ser tratadas antes do release candidate.
