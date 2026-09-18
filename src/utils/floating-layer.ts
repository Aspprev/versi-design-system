export type FloatingLayer = "popover" | "tooltip";

export function getFloatingLayerClass(
  trigger: HTMLElement | null | undefined,
  layer: FloatingLayer,
) {
  if (trigger?.closest('[role="dialog"][aria-modal="true"]')) {
    return "z-modal-overlay";
  }

  return layer === "popover" ? "z-popover" : "z-tooltip";
}
