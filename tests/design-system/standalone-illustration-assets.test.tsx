import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import * as assets from "../../src/components/illustrations";

const inventory = JSON.parse(readFileSync("docs/reconciliation/illustration-inventory.json", "utf8")) as {file: string; exported: keyof typeof assets; geometryHash: string; paths: number}[];

describe("assets SVG reconciliados", () => {
  it("exporta todos os 29 assets independentes de React sem perder a classe base", () => {
    expect(Object.keys(assets)).toHaveLength(29);
    for (const item of inventory) {
      const Asset = assets[item.exported];
      const html = renderToStaticMarkup(<Asset className="consumer-class" aria-label="Ilustração" />);
      const classes = html.match(/\bclass="([^"]+)"/)![1].split(" ");
      expect(classes, item.file).toContain("portal-illustration");
      expect(classes, item.file).toContain("consumer-class");
      expect(html).toContain('aria-label="Ilustração"');
      const paths = [...html.matchAll(/\bd="([^"]*)"/g)].map(m => m[1]);
      expect(createHash("sha256").update(paths.join("\n")).digest("hex"), item.file).toBe(item.geometryHash);
      expect([...html.matchAll(/<path\b/g)], item.file).toHaveLength(item.paths);
    }
  });

  it("isola IDs de máscaras e recortes entre instâncias", () => {
    const html = renderToStaticMarkup(<><assets.IllustrationPortalBanner /><assets.IllustrationPortalBanner /></>);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(html).toContain(`url(#${id})`);
  });

  it("mantém as cores narrativas solicitadas", () => {
    const banner = renderToStaticMarkup(<assets.IllustrationPortalBanner />);
    expect(banner).toContain('cx="985.5" cy="74.5" r="18.5" fill="#fff"');
    expect(banner).toContain('cx="937" cy="115" r="9" fill="#fff"');
    for (const Asset of [assets.IllustrationError, assets.IllustrationLoginHmgImg, assets.IllustrationUnderDevelopmentImage]) {
      const html = renderToStaticMarkup(<Asset />);
      expect(html).toContain('fill="#80868E"');
      expect(html).toContain('fill="#A8ADB4"');
    }
    for (const Asset of [assets.IllustrationInvestment, assets.IllustrationImpostoRendaImg]) {
      const html = renderToStaticMarkup(<Asset />);
      expect(html).toContain('fill="#EAB308"');
      expect(html).toContain('fill="#A16207"');
    }
    const unable = renderToStaticMarkup(<assets.IllustrationUnableImage />).toLowerCase();
    expect(unable).toContain('fill="#42be65"');
    expect(unable).toContain('fill="#d80813"');
    const checks = renderToStaticMarkup(<assets.IllustrationVantagens />);
    expect([...checks.matchAll(/data-illustration-role="on-support"/g)]).toHaveLength(4);
  });
});
