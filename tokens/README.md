# Registro de tokens

`design-system.tokens.json` e a fonte canonica dos valores visuais do Design System.

O registro contem as regras base, os overrides dos modos de acessibilidade e os
presets de identidade. Os arquivos `src/tokens.css`, `src/themes.css` e
`tokens/tailwind-colors.cjs` sao gerados automaticamente; nao edite esses
arquivos diretamente.

Para regenerar os arquivos:

```bash
npm run tokens:generate
```

Para validar divergencias sem alterar arquivos:

```bash
npm run tokens:check
```
