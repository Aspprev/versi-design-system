export function resolveInteractiveDonutColors({
  count,
  colors,
  mutedColors,
  selectedIndex,
}: {
  count: number;
  colors: string[];
  mutedColors: string[];
  selectedIndex: number | null;
}) {
  if (colors.length === 0 || mutedColors.length === 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const color = colors[index % colors.length];

    if (selectedIndex === null || index === selectedIndex) return color;

    return mutedColors[index % mutedColors.length];
  });
}

export function resolveRelativeDonutSelection({
  currentIndex,
  direction,
  count,
}: {
  currentIndex: number | null;
  direction: -1 | 1;
  count: number;
}) {
  if (count <= 0) return null;
  if (currentIndex === null) return direction > 0 ? 0 : count - 1;

  return (currentIndex + direction + count) % count;
}

const TOOLTIP_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

export function escapeDonutTooltipText(value: unknown) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) => TOOLTIP_ENTITIES[character],
  );
}
