import fs from "node:fs";

/** Expected URL from the original SVG, independent of the package resolver. */
export function getCountryFlagUrl(code: string) {
  const svg = fs.readFileSync(new URL(`../public/flags/${code.toLowerCase()}.svg`, import.meta.url));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}
