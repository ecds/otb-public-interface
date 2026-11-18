import { describe, expect, it, vi } from "vitest";
import { addBasemap, BLANK_BACKGROUND } from "./leaflet";
import type Leaflet from "leaflet";

const setup = () => {
  const addTo = vi.fn();
  const L = {
    tileLayer: vi.fn(() => ({ addTo })),
  } as unknown as typeof Leaflet;
  const container = document.createElement("div");
  const map = { getContainer: () => container } as unknown as Leaflet.Map;
  return { L, map, container, addTo };
};

describe("addBasemap", () => {
  it("adds OpenStreetMap tiles without a tour", () => {
    const { L, map, addTo } = setup();
    addBasemap(L, map);
    expect(L.tileLayer).toHaveBeenCalledWith(
      expect.stringContaining("tile.openstreetmap.org"),
      expect.anything(),
    );
    expect(addTo).toHaveBeenCalledWith(map);
  });

  it("adds imagery for a satellite tour", () => {
    const { L, map } = setup();
    addBasemap(L, map, { map_type: "satellite", blank_map: false });
    expect(L.tileLayer).toHaveBeenCalledWith(
      expect.stringContaining("World_Imagery"),
      expect.anything(),
    );
  });

  it("adds no tiles for a blank map, just the gray", () => {
    const { L, map, container } = setup();
    addBasemap(L, map, { map_type: "road", blank_map: true });
    expect(L.tileLayer).not.toHaveBeenCalled();
    expect(container.style.background).not.toBe("");
    expect(BLANK_BACKGROUND).toBe("#9a9a9a");
  });
});
