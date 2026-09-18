export type OptionalValuePolicy = "hide" | "placeholder";

export const hasOptionalValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value !== "string") return true;

  const normalized = value.trim().toUpperCase();
  return normalized !== "" && normalized !== "N/A";
};

export function resolveOptionalValue<T>(
  value: T | null | undefined,
  options: {
    policy?: OptionalValuePolicy;
    placeholder?: string;
  } = {},
): T | string | null {
  if (hasOptionalValue(value)) return value as T;
  if (options.policy === "hide") return null;
  return options.placeholder ?? "-";
}
