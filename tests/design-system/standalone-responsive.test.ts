import { describe, expect, it } from "vitest";
import {
  breakpoints,
  getBreakpoint,
  resolveContainerBreakpoint,
} from "../../src/core";

describe("Responsive public contract", () => {
  it("mantem os thresholds oficiais de viewport", () => {
    expect(breakpoints).toEqual({
      mobile: 640,
      tablet: 1024,
      desktop: 1440,
      tv: 1920,
    });
    expect(getBreakpoint(639)).toBe("mobile");
    expect(getBreakpoint(640)).toBe("mobile");
    expect(getBreakpoint(1024)).toBe("tablet");
    expect(getBreakpoint(1440)).toBe("desktop");
    expect(getBreakpoint(1920)).toBe("tv");
  });

  it("resolve thresholds de container sem depender da ordem do mapa", () => {
    expect(resolveContainerBreakpoint(0)).toBe("mobile");
    expect(resolveContainerBreakpoint(639)).toBe("mobile");
    expect(resolveContainerBreakpoint(640)).toBe("tablet");
    expect(resolveContainerBreakpoint(1024)).toBe("desktop");
    expect(resolveContainerBreakpoint(1440)).toBe("wide");
    expect(
      resolveContainerBreakpoint(760, {
        wide: 960,
        compact: 0,
        regular: 640,
      }),
    ).toBe("regular");
  });
});
