import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MapLibreMarker from "./Marker";
import type { Map } from "maplibre-gl";

// Like MapLibre, moves the marker and popup elements into the map's own
// container.
const mapContainer = document.body.appendChild(document.createElement("div"));
const created = vi.fn();
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
    constructor(options: { element: HTMLElement; anchor: string }) {
      created(options);
      this.element = mapContainer.appendChild(options.element);
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

const map = {} as Map;
const base = { map, lat: 33.7, lng: -84.4, label: "Town Tour" };

describe("MapLibreMarker", () => {
  beforeEach(() => created.mockClear());

  it("re-renders and unmounts after the map has moved its elements", () => {
    const { rerender, unmount } = render(
      <MapLibreMarker {...base} popup={<a href="/town">Go to tour</a>} />,
    );
    expect(mapContainer).toContainElement(screen.getByText("Go to tour"));
    rerender(
      <MapLibreMarker {...base} popup={<a href="/town">Go, updated</a>} />,
    );
    expect(screen.getByText("Go, updated")).toBeInTheDocument();
    expect(() => unmount()).not.toThrow();
  });

  it("is a button with the label", () => {
    render(<MapLibreMarker {...base} popup="Popup" />);
    expect(screen.getByRole("button", { name: "Town Tour" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("closes the popup with Escape and returns focus to the marker", async () => {
    render(<MapLibreMarker {...base} popup={<a href="/town">Go to tour</a>} />);
    screen.getByRole("link", { name: "Go to tour" }).focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Town Tour" })).toHaveFocus();
  });

  it("acts on click, Enter and Space without a popup", () => {
    const onActivate = vi.fn();
    render(<MapLibreMarker {...base} onActivate={onActivate} />);
    const button = screen.getByRole("button", { name: "Town Tour" });
    expect(button).toHaveAttribute("tabindex", "0");
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyDown(button, { key: " " });
    expect(onActivate).toHaveBeenCalledTimes(3);
  });

  it("points a pin at the spot and centers a custom icon on it", () => {
    render(<MapLibreMarker {...base} />);
    expect(created).toHaveBeenLastCalledWith(
      expect.objectContaining({ anchor: "bottom" }),
    );
    render(<MapLibreMarker {...base} image="/icon.png" />);
    expect(created).toHaveBeenLastCalledWith(
      expect.objectContaining({ anchor: "center" }),
    );
  });

  it("marks the current marker without rebuilding it", () => {
    const { rerender } = render(<MapLibreMarker {...base} />);
    rerender(<MapLibreMarker {...base} current />);
    expect(screen.getByRole("button", { name: "Town Tour" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(created).toHaveBeenCalledTimes(1);
  });
});
