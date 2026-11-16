import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TourMarkerMapLibre from "./TourMarker";
import type { Map } from "maplibre-gl";
import type { TMapMarker } from "~/types";

// Like MapLibre, moves the marker and popup elements into the map's own
// container.
const mapContainer = document.body.appendChild(document.createElement("div"));
vi.mock("maplibre-gl", () => ({
  Popup: class {
    handlers: Record<string, () => void> = {};
    setDOMContent(element: HTMLElement) {
      mapContainer.appendChild(element);
      return this;
    }
    on(event: string, handler: () => void) {
      this.handlers[event] = handler;
      return this;
    }
    off() {
      return this;
    }
    remove() {
      this.handlers.close?.();
      return this;
    }
  },
  Marker: class {
    element: HTMLElement;
    constructor({ element }: { element: HTMLElement }) {
      this.element = mapContainer.appendChild(element);
    }
    setLngLat() {
      return this;
    }
    addTo() {
      return this;
    }
    setPopup() {
      return this;
    }
    remove() {
      this.element.remove();
    }
  },
}));

const marker = (popup: string): TMapMarker => ({
  id: "town",
  title: "Town Tour",
  lat: 33.7,
  lng: -84.4,
  popup: <a href="/town">{popup}</a>,
});

describe("TourMarkerMapLibre", () => {
  it("re-renders and unmounts after the map has moved its elements", () => {
    const map = {} as Map;
    const { rerender, unmount } = render(
      <TourMarkerMapLibre map={map} marker={marker("Town Tour")} />,
    );
    expect(mapContainer).toContainElement(screen.getByText("Town Tour"));

    rerender(
      <TourMarkerMapLibre map={map} marker={marker("Town Tour, updated")} />,
    );
    expect(screen.getByText("Town Tour, updated")).toBeInTheDocument();
    expect(() => unmount()).not.toThrow();
  });
});

describe("TourMarkerMapLibre keyboard access", () => {
  it("is a button named after the tour", () => {
    render(
      <TourMarkerMapLibre map={{} as Map} marker={marker("Go to tour")} />,
    );
    const button = screen.getByRole("button", { name: "Town Tour" });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the popup with Escape and returns focus to the marker", async () => {
    render(
      <TourMarkerMapLibre map={{} as Map} marker={marker("Go to tour")} />,
    );
    const link = screen.getByRole("link", { name: "Go to tour" });
    link.focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Town Tour" })).toHaveFocus();
  });
});
