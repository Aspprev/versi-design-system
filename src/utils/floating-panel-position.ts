export type FloatingPanelPlacement = "top" | "bottom" | "viewport";

type TriggerRect = {
  top: number;
  bottom: number;
  left: number;
  width: number;
};

type PanelSize = {
  width: number;
  height: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

type FloatingPanelPositionParams = {
  trigger: TriggerRect;
  panel: PanelSize;
  viewport: ViewportSize;
  gap?: number;
  margin?: number;
};

export type FloatingPanelRect = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: FloatingPanelPlacement;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

export function calculateFloatingPanelRect({
  trigger,
  panel,
  viewport,
  gap = 4,
  margin = 8,
}: FloatingPanelPositionParams): FloatingPanelRect {
  const viewportWidth = Math.max(0, viewport.width - margin * 2);
  const viewportHeight = Math.max(0, viewport.height - margin * 2);
  const width = Math.min(Math.max(0, panel.width), viewportWidth);
  const desiredHeight = Math.min(Math.max(0, panel.height), viewportHeight);
  const spaceBelow = Math.max(
    0,
    viewport.height - trigger.bottom - gap - margin,
  );
  const spaceAbove = Math.max(0, trigger.top - gap - margin);

  let top = margin;
  let placement: FloatingPanelPlacement = "viewport";

  if (spaceBelow >= desiredHeight) {
    top = trigger.bottom + gap;
    placement = "bottom";
  } else if (spaceAbove >= desiredHeight) {
    top = trigger.top - desiredHeight - gap;
    placement = "top";
  }

  return {
    top,
    left: clamp(trigger.left, margin, viewport.width - width - margin),
    width,
    maxHeight: desiredHeight,
    placement,
  };
}
