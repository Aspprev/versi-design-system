# Preparacao da categoria A

## Exportados no entrypoint autonomo

`Button`, `Typography`, `Divider`, `LoadingDots`, `Surface`, `ModalCard`, `Notice`, `PageState`, `Tooltip`, `Avatar`, `ThemedImage`, `IconProvider`, `CircularLoading`, `Modal`, `Pagination`, `Checkbox`, `RadioGroup`, `RadioCardGroup`, `InputSwitch`, `Slider`, `InputSlider`, `BoletoBarCode` e `TextGroup`.

## Tratamentos aplicados

- Hooks e utilitarios usados por `Tooltip`, `CircularLoading` e `Slider` foram copiados para `src/hooks` e `src/utils`.
- `RadioGroup` e `RadioCardGroup` continuam oferecendo integração Formik; `formik` foi declarado como dependencia direta.
- `Modal` e `InputSwitch` utilizam Headless UI; `@headlessui/react` foi declarado como dependencia direta.
- `Avatar` e `ThemedImage` nao dependem de Next nem de utilitarios privados do portal.
- `ThemedImage` aceita fontes claro/escuro e usa os tokens de esquema de cores no CSS publico.
- `InputSlider` foi tipado para o modo strict do TypeScript.

## Pendencia fora deste lote

`table` permanece fora da pasta autonoma por estar classificado como A/B e ainda exigir a consolidacao dos tokens de tabela e dos componentes de filtro.
