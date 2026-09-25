export type StatusDomain =
  | "generic"
  | "beneficiary"
  | "document"
  | "loan"
  | "benefit"
  | "signature"
  | "participation"
  | "claim"
  | "payment"
  | "protocol"
  | "request";

export type StatusBadgeColor =
  | "primary"
  | "blue"
  | "green"
  | "orange"
  | "yellow"
  | "red"
  | "slate"
  | "black";

/** @deprecated Use StatusBadgeColor in new status maps. */
export type StatusTone = "info" | "warning" | "success" | "danger" | "neutral";
export type StatusAppearance = "outline" | "soft" | "solid";

export interface StatusAppearanceConfig {
  color: StatusBadgeColor;
  appearance: StatusAppearance;
}

/** Legacy map value accepted so existing consumers can migrate incrementally. */
export interface LegacyStatusAppearanceConfig {
  tone: StatusTone;
  appearance: StatusAppearance;
}

export type StatusAppearanceMap = Readonly<
  Record<string, StatusAppearanceConfig | LegacyStatusAppearanceConfig>
>;

export interface StatusResolverOptions {
  map?: StatusAppearanceMap;
  color?: StatusBadgeColor;
  tone?: StatusTone;
  appearance?: StatusAppearance;
  fallback?: StatusAppearanceConfig;
}

export type ResolvedStatusAppearance = StatusAppearanceConfig;

const TONE_TO_COLOR: Record<StatusTone, StatusBadgeColor> = {
  info: "blue",
  warning: "yellow",
  success: "green",
  danger: "red",
  neutral: "slate",
};

export const normalizeStatus = (status: unknown): string =>
  String(status ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

const isLegacyConfig = (
  config: StatusAppearanceConfig | LegacyStatusAppearanceConfig,
): config is LegacyStatusAppearanceConfig => "tone" in config;

const normalizeConfig = (
  config: StatusAppearanceConfig | LegacyStatusAppearanceConfig,
): StatusAppearanceConfig =>
  isLegacyConfig(config)
    ? { color: TONE_TO_COLOR[config.tone], appearance: config.appearance }
    : config;

/**
 * Resolves only consumer configuration. Status names intentionally have no
 * built-in business mapping in the Design System.
 *
 * Precedence: statusMap, explicit color, legacy tone, fallback.
 */
export const resolveStatusAppearance = (
  status: unknown,
  domain: StatusDomain = "generic",
  options?: StatusResolverOptions,
): ResolvedStatusAppearance => {
  void domain;
  const normalized = normalizeStatus(status);

  if (normalized && options?.map) {
    const mappedAppearance = Object.entries(options.map).find(
      ([key]) => normalizeStatus(key) === normalized,
    )?.[1];

    if (mappedAppearance) return normalizeConfig(mappedAppearance);
  }

  if (options?.color) {
    return {
      color: options.color,
      appearance: options.appearance ?? "outline",
    };
  }

  if (options?.tone) {
    return {
      color: TONE_TO_COLOR[options.tone],
      appearance: options.appearance ?? "outline",
    };
  }

  return options?.fallback ?? { color: "slate", appearance: "outline" };
};

export const getStatusBadgeColorFromTone = (
  tone: StatusTone,
): StatusBadgeColor => TONE_TO_COLOR[tone];
