import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { TourContext } from "~/contexts/TourContext";
import MapMarker from "./MapMarker";
import type { Map } from "maplibre-gl";
import type { TTourStop } from "~/types";

vi.mock("~/hooks/deviceContext", () => ({
  useDeviceContext: () => ({ isMobile: false, isDesktop: true }),
}));

const anchors: string[] = [];
vi.mock("maplibre-gl", () => ({
  Popup: class {
    setDOMContent() {
      return this;
    }
  },
  Marker: class {
    element: HTMLElement;
    constructor({ element, anchor }: { element: HTMLElement; anchor: string }) {
      anchors.push(anchor);
      this.element = document.body.appendChild(element);
    }
    setLngLat() {
      return this;
    }
    addTo() {
      return this;
    }
    on() {
      return this;
    }
    off() {
      return this;
    }
    remove() {
      this.element.remove();
    }
  },
}));

const stop = {
  slug: "church",
  title: "Old Church",
  position: 2,
  lat: 33.7,
  lng: -84.4,
  map_icon: "/icons/church.png",
} as TTourStop;

const renderMarker = (setCurrentStop = vi.fn()) =>
  render(
    <MemoryRouter>
      <TourContext.Provider
        value={{
          tour: undefined,
          currentStop: undefined,
          setCurrentStop,
          showMenu: false,
          setShowMenu: vi.fn(),
          setCurrentFlatPage: vi.fn(),
          setShowPermissionsModal: vi.fn(),
          currentFlatPage: undefined,
          mapStyle: {} as never,
          showPermissionsModal: false,
        }}
      >
        <MapMarker stop={stop} map={{} as Map} fitBounds={false} />
      </TourContext.Provider>
    </MemoryRouter>,
  );

describe("MapMarker with a custom icon", () => {
  it("is a named marker button centered on the stop", () => {
    renderMarker();
    const marker = screen.getByRole("button", { name: "Stop 2: Old Church" });
    expect(marker.querySelector("img")).toHaveAttribute(
      "src",
      "/icons/church.png",
    );
    expect(marker).toHaveAttribute("tabindex", "0");
    expect(anchors.at(-1)).toBe("center");
  });

  it("goes to the stop with Enter", () => {
    const setCurrentStop = vi.fn();
    renderMarker(setCurrentStop);
    fireEvent.keyDown(
      screen.getByRole("button", { name: "Stop 2: Old Church" }),
      { key: "Enter" },
    );
    expect(setCurrentStop).toHaveBeenCalledWith(stop);
  });
});
