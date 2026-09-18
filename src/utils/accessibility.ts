export function mergeAriaDescribedBy(
  ...values: Array<string | null | undefined>
) {
  const identifiers = values
    .flatMap((value) => value?.trim().split(/\s+/) ?? [])
    .filter(Boolean);

  return identifiers.length > 0
    ? Array.from(new Set(identifiers)).join(" ")
    : undefined;
}
