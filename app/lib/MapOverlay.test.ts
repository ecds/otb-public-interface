import { describe, it, expect, beforeAll } from "vitest";
import { createMapOverlay } from "./MapOverlay";

// Minimal google.maps stand-ins: a projection that maps lng/lat straight to
// pixels (y grows downward) and an OverlayView with a pane to attach to.
const pane = document.createElement("div");

beforeAll(() => {
  class OverlayView {
    getPanes() {
      return { overlayLayer: pane };
    }
    getProjection() {
      return {
        fromLatLngToDivPixel: (p: { lat: number; lng: number }) => ({
          x: p.lng * 10,
          y: -p.lat * 10,
        }),
      };
    }
  }
  (globalThis as unknown as { google: unknown }).google = {
    maps: { OverlayView },
  };
});

const bounds = {
  getSouthWest: () => ({ lat: 1, lng: 3 }),
  getNorthEast: () => ({ lat: 2, lng: 5 }),
} as unknown as google.maps.LatLngBounds;

type Lifecycle = { onAdd(): void; draw(): void; onRemove(): void };

const add = (rotation?: number | null) => {
  pane.innerHTML = "";
  const overlay = createMapOverlay({
    bounds,
    imageUrl: "/o.png",
    rotation,
  }) as unknown as Lifecycle;
  overlay.onAdd();
  overlay.draw();
  return { overlay, div: pane.firstElementChild as HTMLDivElement };
};

describe("createMapOverlay", () => {
  it("places the image over the upright bounds", () => {
    const { div } = add();
    expect(div.querySelector("img")!.getAttribute("src")).toBe("/o.png");
    expect(div.style.left).toBe("30px");
    expect(div.style.top).toBe("-20px");
    expect(div.style.width).toBe("20px");
    expect(div.style.height).toBe("10px");
  });

  it("turns the image clockwise about its center", () => {
    const { div } = add(30);
    expect(div.style.transformOrigin).toBe("center");
    expect(div.style.transform).toBe("rotate(30deg)");
  });

  it("treats a missing rotation as upright", () => {
    expect(add(null).div.style.transform).toBe("rotate(0deg)");
  });

  it("removes its element when taken off the map", () => {
    const { overlay } = add();
    overlay.onRemove();
    expect(pane.children).toHaveLength(0);
  });
});
