import { useContext, useEffect, useState, type ComponentProps } from "react";
import { Controls, Description, DocsContainer, DocsContext, Primary, Stories, Title, useOf } from "@storybook/addon-docs/blocks";
import { GLOBALS_UPDATED, UPDATE_GLOBALS } from "storybook/internal/core-events";
import { themes } from "storybook/theming";
import { guidanceFor } from "./component-guidance";

export function DocumentationContainer(props: ComponentProps<typeof DocsContainer>) {
  const [dark, setDark] = useState(() => document.documentElement.dataset.colorScheme === "dark");
  useEffect(() => {
    const observer = new MutationObserver(() => setDark(document.documentElement.dataset.colorScheme === "dark"));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color-scheme"] });
    return () => observer.disconnect();
  }, []);
  return <DocsContainer {...props} theme={dark ? themes.dark : themes.light} />;
}

export function ComponentDocumentation() {
  const { preparedMeta } = useOf("meta", ["meta"]);
  const context = useContext(DocsContext);
  const [globals, setGlobals] = useState(() => context.getStoryContext(context.storyById()).globals);
  useEffect(() => {
    const onUpdated = ({ globals }: { globals: Record<string, unknown> }) => setGlobals(globals);
    context.channel.on(GLOBALS_UPDATED, onUpdated);
    return () => { context.channel.off(GLOBALS_UPDATED, onUpdated); };
  }, [context.channel]);
  const updateGlobals = (globals: Record<string, unknown>) => context.channel.emit(UPDATE_GLOBALS, { globals });
  return (
    <>
      <Title />
      <p className="versi-docs-lead">{guidanceFor(preparedMeta.title)}</p>
      <Description />
      <div className="versi-docs-preferences">
        <span>Prévia: {globals.colorScheme === "dark" ? "escura" : globals.colorScheme === "system" ? "conforme o sistema" : "clara"} · {globals.dsTheme} · {globals.contrast === "high" ? "alto contraste" : "contraste normal"}</span>
        <button type="button" onClick={() => updateGlobals({ colorScheme: "light", dsTheme: "default", contrast: "normal", fontScale: "default", motion: "full", emphasizeFocus: false, underlineLinks: false })}>Restaurar preferências</button>
      </div>
      <h2>Experimente</h2>
      <p>Altere as propriedades no painel abaixo. Use a toolbar para conferir tema, contraste e tamanho de fonte.</p>
      <Primary />
      <h2>Propriedades</h2>
      <Controls />
      <h2>Uso e acessibilidade</h2>
      <ul>
        <li>Confira o nome acessível, a navegação por teclado e os estados relevantes para o seu fluxo.</li>
        <li>Textos longos e mensagens devem continuar legíveis em telas pequenas e com fonte ampliada.</li>
        <li>Importe pela API pública de <code>@aspprev/versi-ds</code> e use os tokens semânticos do tema.</li>
      </ul>
      <p><a href="?path=/docs/guidelines-componentchoice--docs">Como escolher o componente</a> · <a href="?path=/docs/guidelines-accessibility--docs">Guia de acessibilidade</a></p>
      <Stories title="Estados e exemplos" includePrimary={false} />
    </>
  );
}
