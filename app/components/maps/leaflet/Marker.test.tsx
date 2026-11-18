import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LeafletMarker from "./Marker";
import type Leaflet from "leaflet";

// Like Leaflet, moves the icon and popup content into the map's own
// container, and reports the popup through the marker's events.
const mapContainer = document.body.appendChild(document.createElement("div"));
const created = vi.fn();
const zIndexOffsets: number[] = [];
const L = {
  divIcon: (options: { html: HTMLElement }) => options,
  marker: (
    _latLng: [number, number],
    { icon }: { icon: { html: HTMLElement } },
  ) => {
    created();
    const element = mapContainer.appendChild(document.createElement("div"));
    element.appendChild(icon.html);
    const handlers: Record<string, () => void> = {};
    const mapMarker = {
      bindPopup: (content: HTMLElement) => {
        mapContainer.appendChild(content);
        return mapMarker;
      },
      unbindPopup: () => mapMarker,
      togglePopup: () => handlers.popupopen?.(),
      addTo: () => mapMarker,
      getElement: () => element,
      setZIndexOffset: (offset: number) => zIndexOffsets.push(offset),
      on: (type: string, handler: () => void) => (handlers[type] = handler),
      off: (type: string) => delete handlers[type],
      closePopup: () => handlers.popupclose?.(),
      remove: () => element.remove(),
      click: () => handlers.click?.(),
    };
    return mapMarker;
  },
} as unknown as typeof Leaflet;

const map = {} as Leaflet.Map;
const base = { L, map, lat: 33.7, lng: -84.4, label: "Town Tour" };

describe("LeafletMarker", () => {
  beforeEach(() => {
    created.mockClear();
    zIndexOffsets.length = 0;
  });

  it("renders the popup with React and cleans up on unmount", () => {
    const { rerender, unmount } = render(
      <LeafletMarker {...base} popup={<a href="/town">Go to tour</a>} />,
    );
    expect(mapContainer).toContainElement(screen.getByText("Go to tour"));
    rerender(
      <LeafletMarker {...base} popup={<a href="/town">Go, updated</a>} />,
    );
    expect(screen.getByText("Go, updated")).toBeInTheDocument();
    unmount();
    expect(
      screen.queryByRole("button", { name: "Town Tour" }),
    ).not.toBeInTheDocument();
  });

  it("is a button with the label", () => {
    render(<LeafletMarker {...base} popup="Popup" />);
    expect(screen.getByRole("button", { name: "Town Tour" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens the popup from the keyboard", () => {
    render(<LeafletMarker {...base} popup="Popup" />);
    const button = screen.getByRole("button", { name: "Town Tour" });
    fireEvent.keyDown(button, { key: "Enter" });
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the popup with Escape and returns focus to the marker", async () => {
    render(<LeafletMarker {...base} popup={<a href="/town">Go to tour</a>} />);
    screen.getByRole("link", { name: "Go to tour" }).focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Town Tour" })).toHaveFocus();
  });

  it("acts on Enter and Space without a popup", () => {
    const onActivate = vi.fn();
    render(<LeafletMarker {...base} onActivate={onActivate} />);
    const button = screen.getByRole("button", { name: "Town Tour" });
    expect(button).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyDown(button, { key: " " });
    expect(onActivate).toHaveBeenCalledTimes(2);
  });

  it("anchors a pin by its point", () => {
    render(<LeafletMarker {...base} />);
    expect(screen.getByRole("button").style.translate).toBe("-50% -100%");
  });

  it("raises the current marker without rebuilding it", () => {
    const { rerender } = render(<LeafletMarker {...base} />);
    rerender(<LeafletMarker {...base} current />);
    expect(screen.getByRole("button", { name: "Town Tour" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(zIndexOffsets.at(-1)).toBe(1000);
    expect(created).toHaveBeenCalledTimes(1);
  });
});
