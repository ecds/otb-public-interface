import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { createMapOverlay } from "./MapOverlay";

// Minimal google.maps stand-ins: a projection that maps lng/lat straight to
// pixels (y grows downward), a map showing lng 0–10, lat 0–5, and an
// OverlayView with a pane to attach to.
const pane = document.createElement("div");
const removeListener = vi.fn();
const map = {
  getBounds: () => ({
    getSouthWest: () => ({ lat: 0, lng: 0 }),
    getNorthEast: () => ({ lat: 5, lng: 10 }),
  }),
  addListener: vi.fn(() => ({ remove: removeListener })),
};

// Records what's drawn; jsdom has no canvas of its own.
const context = {
  setTransform: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  drawImage: vi.fn(),
  fillRect: vi.fn(),
  fillStyle: "",
};

beforeAll(() => {
  class OverlayView {
    getPanes() {
      return { overlayLayer: pane };
    }
    getMap() {
      return map;
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
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
});

beforeEach(() => {
  vi.clearAllMocks();
  pane.innerHTML = "";
});

const bounds = {
  getSouthWest: () => ({ lat: 1, lng: 3 }),
  getNorthEast: () => ({ lat: 2, lng: 5 }),
} as unknown as google.maps.LatLngBounds;

type Lifecycle = { onAdd(): void; draw(): void; onRemove(): void };

const add = (rotation?: number | null, background?: string) => {
  const overlay = createMapOverlay({
    bounds,
    imageUrl: "/o.png",
    rotation,
    background,
  }) as unknown as Lifecycle;
  overlay.onAdd();
  // Stand in for the image having loaded.
  const img = (overlay as unknown as { img: HTMLImageElement }).img;
  Object.defineProperty(img, "complete", { value: true });
  Object.defineProperty(img, "naturalWidth", { value: 100 });
  overlay.draw();
  return { overlay, canvas: pane.firstElementChild as HTMLCanvasElement };
};

describe("createMapOverlay", () => {
  it("covers only the visible map, not the whole overlay", () => {
    const { canvas } = add();
    expect(canvas.tagName).toBe("CANVAS");
    expect(canvas.style.left).toBe("0px");
    expect(canvas.style.top).toBe("-50px");
    expect(canvas.style.width).toBe("100px");
    expect(canvas.style.height).toBe("50px");
  });

  it("draws the image over the upright bounds", () => {
    add();
    // Bounds center (40, -15) is (40, 35) on a canvas whose top is at -50.
    expect(context.translate).toHaveBeenCalledWith(40, 35);
    expect(context.drawImage).toHaveBeenCalledWith(
      expect.any(HTMLImageElement),
      -10,
      -5,
      20,
      10,
    );
  });

  it("turns the image clockwise about its center", () => {
    add(30);
    expect(context.rotate).toHaveBeenCalledWith(Math.PI / 6);
  });

  it("treats a missing rotation as upright", () => {
    add(null);
    expect(context.rotate).toHaveBeenCalledWith(0);
  });

  it("fills the visible map before drawing the image on a blank map", () => {
    add(0, "#9a9a9a");
    expect(context.fillStyle).toBe("#9a9a9a");
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 100, 50);
    expect(context.fillRect.mock.invocationCallOrder[0]).toBeLessThan(
      context.drawImage.mock.invocationCallOrder[0],
    );
  });

  it("leaves the base map showing otherwise", () => {
    add();
    expect(context.fillRect).not.toHaveBeenCalled();
  });

  it("redraws when the map pans", () => {
    add();
    expect(map.addListener).toHaveBeenCalledWith(
      "bounds_changed",
      expect.any(Function),
    );
  });

  it("removes its canvas and listener when taken off the map", () => {
    const { overlay } = add();
    overlay.onRemove();
    expect(pane.children).toHaveLength(0);
    expect(removeListener).toHaveBeenCalled();
  });
});
