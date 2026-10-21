/** Apex pie labels do not implement the dataLabels.background option. Add a
 * neutral SVG backdrop so labels remain readable on solids and HC patterns. */
export function decorateDonutDataLabels(root: Element | undefined, semanticColor: boolean) {
  if (!root?.isConnected) return;
  for (const label of root.querySelectorAll<SVGGraphicsElement>("text.apexcharts-pie-label")) {
    const group = label.parentElement;
    if (!group) continue;
    let backdrop = group.querySelector<SVGRectElement>("rect[data-versi-chart-label]");
    if (!backdrop) {
      backdrop = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      backdrop.setAttribute("data-versi-chart-label", "");
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.setAttribute("pointer-events", "none");
      backdrop.setAttribute("rx", "3");
      if (label.classList.contains("apexcharts-pie-label-delay")) {
        backdrop.classList.add("apexcharts-pie-label-delay");
        backdrop.style.animationDelay = label.style.animationDelay;
      }
      group.insertBefore(backdrop, label);
    }
    label.setAttribute("data-versi-semantic-label", String(semanticColor));
    const bounds = label.getBBox();
    backdrop.setAttribute("x", String(bounds.x - 3));
    backdrop.setAttribute("y", String(bounds.y - 2));
    backdrop.setAttribute("width", String(bounds.width + 6));
    backdrop.setAttribute("height", String(bounds.height + 4));
  }
}
