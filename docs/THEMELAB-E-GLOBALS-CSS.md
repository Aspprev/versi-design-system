# ThemeLab e configuracao do projeto consumidor

O story `Design System/ThemeLab` e o ponto de referencia visual para validar o
Design System antes de publica-lo. Ele usa os arquivos gerados pelo registro
`tokens/design-system.tokens.json` e permite conferir as combinacoes de tema,
esquema de cores, contraste e escala tipografica.

## Como abrir

Na raiz do repositorio:

```bash
npm run storybook:standalone
```

Abra `Design System/ThemeLab/Playground`. O toolbar do Storybook tambem altera
os mesmos atributos usados pela story:

- `data-ds-theme`: identidade comercial;
- `data-color-scheme`: `light` ou `dark`;
- `data-contrast`: `normal` ou `high`;
- `data-font-scale`: `default`, `large` ou `extra-large`;
- `data-motion`: `full` ou `reduce`.

## Configuracao no projeto consumidor

O CSS do pacote deve ser importado uma vez, no shell global, nesta ordem:

```css
@import "@aspprev/versi-ds/styles.css";
@import "@aspprev/versi-ds/themes.css";
```

Depois, o projeto define os atributos no elemento `html`:

```html
<html
  data-ds-theme="verde3"
  data-color-scheme="light"
  data-contrast="normal"
  data-font-scale="default"
  data-motion="full"
></html>
```

Em uma aplicacao React, esses atributos podem ser atualizados pelo provider de
preferencias. Em SSR, aplique as preferencias conhecidas antes da primeira
pintura para evitar flash de tema.

## Sobrescritas de cliente

Sobrescritas especificas do cliente ficam no `globals.css` do consumidor e
devem vir depois dos imports. Use papeis semanticos para preservar claro,
escuro e alto contraste:

```css
html[data-ds-theme="cliente-x"] {
  --primary-1: 20, 105, 180;
  --primary-2: 12, 72, 130;
  --content-link: var(--primary-2);
}
```

Nao edite `styles.css`, `themes.css` ou `tokens.css` gerados. Quando uma
alteracao for reutilizavel por mais de um cliente, altere o registro JSON e
regenere os arquivos:

```bash
npm run tokens:generate
npm run tokens:check
```

O consumidor não precisa de Tailwind: os componentes usam o CSS público já
compilado. O arquivo tailwind.config.cjs é uma ferramenta interna de build e
não é publicado nem exportado como preset npm.

## Checklist visual

Ao alterar tokens ou componentes, confira no ThemeLab:

1. todos os presets de identidade;
2. claro e escuro;
3. alto contraste claro e escuro;
4. escala grande e extra-grande;
5. foco por teclado e movimento reduzido;
6. texto, borda, fundo, feedback e controles sem cores ilegíveis.
