import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { canUseWebGL, markWebGLUnavailable } from "~/utils/webgl_check";
import ToursMap from "./ToursMap";

vi.mock("~/utils/webgl_check", () => ({
  canUseWebGL: vi.fn(),
  markWebGLUnavailable: vi.fn(),
}));

vi.mock("./ToursLeaflet", () => ({
  default: () => <div>Leaflet map</div>,
}));

const mapConstructor = vi.fn();
vi.mock("maplibre-gl", () => {
  class GPUInitializationError extends Error {}
  return {
    GPUInitializationError,
    Map: class {
      constructor() {
        mapConstructor();
      }
      on() {}
      addControl() {}
      remove() {}
    },
  };
});

const view = { center: { lat: 33.7, lng: -84.4 }, zoom: 5 };

describe("ToursMap", () => {
  beforeEach(() => {
    vi.mocked(canUseWebGL).mockReset();
    vi.mocked(markWebGLUnavailable).mockReset();
    mapConstructor.mockReset();
  });

  it("uses MapLibre when WebGL works", () => {
    vi.mocked(canUseWebGL).mockReturnValue(true);
    render(<ToursMap markers={[]} view={view} className="" />);
    expect(mapConstructor).toHaveBeenCalled();
    expect(screen.queryByText("Leaflet map")).not.toBeInTheDocument();
  });

  it("uses Leaflet without WebGL, and never starts MapLibre", () => {
    vi.mocked(canUseWebGL).mockReturnValue(false);
    render(<ToursMap markers={[]} view={view} className="" />);
    expect(screen.getByText("Leaflet map")).toBeInTheDocument();
    expect(mapConstructor).not.toHaveBeenCalled();
  });

  it("switches to Leaflet when MapLibre can't create its WebGL context", async () => {
    const { GPUInitializationError } = await import("maplibre-gl");
    vi.mocked(canUseWebGL).mockReturnValue(true);
    mapConstructor.mockImplementation(() => {
      throw new GPUInitializationError({}, null);
    });
    render(<ToursMap markers={[]} view={view} className="" />);
    expect(await screen.findByText("Leaflet map")).toBeInTheDocument();
    expect(markWebGLUnavailable).toHaveBeenCalled();
  });
});
