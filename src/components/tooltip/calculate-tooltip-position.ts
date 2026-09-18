export type TooltipPosition = "top" | "bottom" | "left" | "right";

type Rect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

type Size = {
  width: number;
  height: number;
};

type CalculateTooltipPositionParams = {
  target: Rect;
  tooltip: Size;
  preferred: TooltipPosition;
  viewportWidth: number;
  viewportHeight: number;
  gap?: number;
  margin?: number;
};

type TooltipCoordinates = {
  top: number;
  left: number;
  position: TooltipPosition;
};

const OPPOSITE_POSITION: Record<TooltipPosition, TooltipPosition> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function coordinatesFor(
  target: Rect,
  tooltip: Size,
  position: TooltipPosition,
  gap: number,
) {
  if (position === "top") {
    return {
      top: target.top - tooltip.height - gap,
      left: target.left + target.width / 2 - tooltip.width / 2,
    };
  }
  if (position === "bottom") {
    return {
      top: target.bottom + gap,
      left: target.left + target.width / 2 - tooltip.width / 2,
    };
  }
  if (position === "left") {
    return {
      top: target.top + target.height / 2 - tooltip.height / 2,
      left: target.left - tooltip.width - gap,
    };
  }
  return {
    top: target.top + target.height / 2 - tooltip.height / 2,
    left: target.right + gap,
  };
}

function fitsViewport(
  coordinates: { top: number; left: number },
  tooltip: Size,
  viewportWidth: number,
  viewportHeight: number,
  margin: number,
) {
  return (
    coordinates.top >= margin &&
    coordinates.left >= margin &&
    coordinates.top + tooltip.height <= viewportHeight - margin &&
    coordinates.left + tooltip.width <= viewportWidth - margin
  );
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

export function calculateTooltipPosition({
  target,
  tooltip,
  preferred,
  viewportWidth,
  viewportHeight,
  gap = 8,
  margin = 8,
}: CalculateTooltipPositionParams): TooltipCoordinates {
  const positions = [
    preferred,
    OPPOSITE_POSITION[preferred],
    "bottom",
    "top",
    "right",
    "left",
  ].filter(
    (position, index, values): position is TooltipPosition =>
      values.indexOf(position) === index,
  );

  for (const position of positions) {
    const coordinates = coordinatesFor(target, tooltip, position, gap);
    if (
      fitsViewport(
        coordinates,
        tooltip,
        viewportWidth,
        viewportHeight,
        margin,
      )
    ) {
      return { ...coordinates, position };
    }
  }

  const fallback = coordinatesFor(target, tooltip, preferred, gap);
  return {
    top: clamp(fallback.top, margin, viewportHeight - tooltip.height - margin),
    left: clamp(fallback.left, margin, viewportWidth - tooltip.width - margin),
    position: preferred,
  };
}

