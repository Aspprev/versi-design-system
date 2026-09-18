const TOOLTIP_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

export function escapeTimeSeriesTooltipText(value: unknown) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) => TOOLTIP_ENTITIES[character],
  );
}

const SAFE_TOOLTIP_COLOR =
  /^(?:#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\)|var\(--[\w-]+\)|[a-z]+)$/i;

export function normalizeTimeSeriesTooltipColor(value?: string) {
  const color = String(value ?? "").trim();
  return SAFE_TOOLTIP_COLOR.test(color) ? color : "currentColor";
}

export type TimeSeriesTooltipRow = {
  label: string;
  value: string;
  color?: string;
};

export function buildTimeSeriesTooltip({
  reference,
  rows,
}: {
  reference: string;
  rows: TimeSeriesTooltipRow[];
}) {
  const content = rows
    .map(({ label, value, color }) => {
      const marker = color
        ? `<span class="time-series-chart-tooltip-marker" style="background-color:${normalizeTimeSeriesTooltipColor(color)}"></span>`
        : "";

      return `<div class="time-series-chart-tooltip-row"><span class="time-series-chart-tooltip-name">${marker}${escapeTimeSeriesTooltipText(label)}</span><strong>${escapeTimeSeriesTooltipText(value)}</strong></div>`;
    })
    .join("");

  return `<div class="time-series-chart-tooltip"><div class="time-series-chart-tooltip-reference">${escapeTimeSeriesTooltipText(reference)}</div>${content}</div>`;
}
