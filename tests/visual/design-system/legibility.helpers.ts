import type { Locator, Page } from "@playwright/test";

export async function settle(control: Locator) {
  await control.evaluate(async element => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const animations = element.getAnimations({ subtree: true });
    for (let parent=element.parentElement;parent;parent=parent.parentElement) animations.push(...parent.getAnimations());
    await Promise.all(animations.filter(animation=>animation.effect?.getTiming().iterations!==Infinity).map(animation => animation.finished.catch(() => undefined)));
  });
}

/** Compose actual backgrounds, color alpha and ancestor group opacity. */
export async function readLegibility(page: Page, selector = "main.legibility-matrix", paint?: "color" | "background" | "border") {
  return page.evaluate(({ scopeSelector, paint }) => {
    type Pixel = [number, number, number, number];
    const parse = (css: string): Pixel => {
      const n = css.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
      return [n[0], n[1], n[2], n[3] ?? 1];
    };
    const over = (front: Pixel, back: Pixel): Pixel => {
      const alpha = front[3] + back[3] * (1 - front[3]);
      return alpha ? [0, 1, 2].map(i => (front[i] * front[3] + back[i] * back[3] * (1 - front[3])) / alpha).concat(alpha) as Pixel : [0, 0, 0, 0];
    };
    const pixel = (el: Element, ink: Pixel): Pixel => {
      let value = ink;
      if (el instanceof SVGElement && ["text", "tspan"].includes(el.localName)) {
        const backdrop = el.closest(".apexcharts-datalabels")?.querySelector("rect[data-versi-chart-label]");
        if (backdrop) value = over(value, parse(getComputedStyle(backdrop).fill));
      }
      for (let node: Element | null = el; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        value = over(value, parse(style.backgroundColor));
        value[3] *= Number(style.opacity);
      }
      return over(value, [255, 255, 255, 1]);
    };
    const luminance = (color: Pixel) => color.slice(0, 3).reduce((sum, n, i) => {
      n /= 255;
      return sum + (n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][i];
    }, 0);
    const ratio = (a: Pixel, b: Pixel) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
    const scope = document.querySelector(scopeSelector)!;
    const elements = paint ? [scope] : [scope, ...Array.from(scope.querySelectorAll("*"))];
    return elements.filter(el => (paint || (el instanceof HTMLInputElement && Boolean(el.value) && !["checkbox", "radio"].includes(el.type)) || Array.from(el.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())) && el.getBoundingClientRect().width > 2 && el.getBoundingClientRect().height > 2 && !el.closest(".sr-only, [hidden]") && (paint || !el.closest("[aria-hidden=true]")) && el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })).map(el => {
      const style = getComputedStyle(el);
      const background = pixel(paint === "background" || paint === "border" ? el.parentElement ?? el : el, [0, 0, 0, 0]);
      const textColor = el instanceof SVGElement && ["text", "tspan"].includes(el.localName) ? style.fill : style.color;
      const foreground = paint === "background" ? pixel(el, [0, 0, 0, 0]) : pixel(el, parse(paint === "border" ? style.borderTopColor : textColor));
      const disabled = Boolean(el.closest(":disabled, [aria-disabled=true]") || el.closest("label")?.querySelector(":disabled"));
      const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.666 && Number(style.fontWeight) >= 700);
      const uncertainBackground = [el, ...Array.from((function* () { for (let p = el.parentElement; p; p = p.parentElement) yield p; })())].some(node => getComputedStyle(node).backgroundImage !== "none");
      return {
        text: (el instanceof HTMLInputElement ? el.value : el.textContent?.trim())?.slice(0, 100), family: el.closest("section")?.id ?? "heading", audit: el.getAttribute("data-audit"),
        context: el.closest("[data-status-context]")?.getAttribute("data-status-context"), color: el.getAttribute("data-color"), appearance: el.getAttribute("data-appearance"),
        foreground: foreground.slice(0, 3), background: background.slice(0, 3), ratio: ratio(foreground, background),
        borderRatio: ratio(pixel(el, parse(style.borderTopColor)), background), minimum: large ? 3 : 4.5, disabled, uncertainBackground,
      };
    });
  }, { scopeSelector: selector, paint });
}
