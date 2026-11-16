import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import TourMarkerLeaflet from "./TourMarkerLeaflet";
import type { TMapMarker } from "./types";
import type Leaflet from "leaflet";

// Like Leaflet, moves the icon and popup content into the map's own
// container, and reports the popup through the marker's events.
const mapContainer = document.body.appendChild(document.createElement("div"));
const L = {
  divIcon: (options: { html: HTMLElement }) => options,
  marker: (
    _latLng: [number, number],
    { icon }: { icon: { html: HTMLElement } },
  ) => {
    const element = mapContainer.appendChild(document.createElement("div"));
    element.appendChild(icon.html);
    const handlers: Record<string, () => void> = {};
    const mapMarker = {
      bindPopup: (content: HTMLElement) => {
        mapContainer.appendChild(content);
        return mapMarker;
      },
      addTo: () => mapMarker,
      getElement: () => element,
      on: (type: string, handler: () => void) => (handlers[type] = handler),
      off: (type: string) => delete handlers[type],
      closePopup: () => handlers.popupclose?.(),
      remove: () => element.remove(),
    };
    return mapMarker;
  },
} as unknown as typeof Leaflet;

const marker = (popup: string): TMapMarker => ({
  id: "town",
  title: "Town Tour",
  lat: 33.7,
  lng: -84.4,
  popup: <a href="/town">{popup}</a>,
});

const map = {} as Leaflet.Map;

describe("TourMarkerLeaflet", () => {
  it("renders the popup with React and cleans up on unmount", () => {
    const { rerender, unmount } = render(
      <TourMarkerLeaflet L={L} map={map} marker={marker("Go to tour")} />,
    );
    expect(mapContainer).toContainElement(screen.getByText("Go to tour"));

    rerender(
      <TourMarkerLeaflet L={L} map={map} marker={marker("Go, updated")} />,
    );
    expect(screen.getByText("Go, updated")).toBeInTheDocument();

    unmount();
    expect(
      screen.queryByRole("button", { name: "Town Tour" }),
    ).not.toBeInTheDocument();
  });

  it("is a button named after the tour", () => {
    render(<TourMarkerLeaflet L={L} map={map} marker={marker("Go to tour")} />);
    expect(screen.getByRole("button", { name: "Town Tour" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("closes the popup with Escape and returns focus to the marker", async () => {
    render(<TourMarkerLeaflet L={L} map={map} marker={marker("Go to tour")} />);
    screen.getByRole("link", { name: "Go to tour" }).focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Town Tour" })).toHaveFocus();
  });
});
