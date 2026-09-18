export type ThemedImageSource =
  | string
  | {
      light: string;
      dark?: string;
    };

export function normalizeThemedImageSource(source: ThemedImageSource) {
  if (typeof source === "string") {
    return { light: source, dark: undefined };
  }

  return source;
}
