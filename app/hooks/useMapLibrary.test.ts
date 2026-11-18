import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { canUseWebGL, markWebGLUnavailable } from "~/utils/webgl_check";
import { useMapLibrary } from "./useMapLibrary";

vi.mock("~/utils/webgl_check", () => ({
  canUseWebGL: vi.fn(),
  markWebGLUnavailable: vi.fn(),
}));

describe("useMapLibrary", () => {
  beforeEach(() => {
    vi.mocked(canUseWebGL).mockReset();
    vi.mocked(markWebGLUnavailable).mockReset();
  });

  it("picks MapLibre when WebGL works", () => {
    vi.mocked(canUseWebGL).mockReturnValue(true);
    const { result } = renderHook(() => useMapLibrary());
    expect(result.current[0]).toBe("maplibre");
  });

  it("picks Leaflet without WebGL", () => {
    vi.mocked(canUseWebGL).mockReturnValue(false);
    const { result } = renderHook(() => useMapLibrary());
    expect(result.current[0]).toBe("leaflet");
  });

  it("falls back to Leaflet and remembers that WebGL failed", () => {
    vi.mocked(canUseWebGL).mockReturnValue(true);
    const { result } = renderHook(() => useMapLibrary());
    act(() => result.current[1]());
    expect(result.current[0]).toBe("leaflet");
    expect(markWebGLUnavailable).toHaveBeenCalled();
  });

  it("keeps the same fallBack between renders", () => {
    vi.mocked(canUseWebGL).mockReturnValue(true);
    const { result, rerender } = renderHook(() => useMapLibrary());
    const first = result.current[1];
    rerender();
    expect(result.current[1]).toBe(first);
  });
});
