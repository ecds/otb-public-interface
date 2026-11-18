import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TourContext } from "~/contexts/TourContext";
import { useStopMarker } from "./useStopMarker";
import type { ReactNode } from "react";
import type { TTour, TTourStop } from "~/types";

const device = { isMobile: false, isDesktop: true };
vi.mock("~/hooks/deviceContext", () => ({
  useDeviceContext: () => device,
}));

const stop = {
  id: 7,
  slug: "church",
  title: "Old Church",
  position: 2,
  lat: 33.7,
  lng: -84.4,
} as TTourStop;

const tour = { icon_color: "#123456" } as TTour;

const setup = ({
  stop: forStop = stop,
  currentStop,
  forTour = tour,
}: {
  stop?: TTourStop;
  currentStop?: TTourStop;
  forTour?: TTour;
} = {}) => {
  const setCurrentStop = vi.fn();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter>
      <TourContext.Provider
        value={{
          tour: forTour,
          currentStop,
          setCurrentStop,
          showMenu: false,
          setShowMenu: vi.fn(),
          setCurrentFlatPage: vi.fn(),
          setShowPermissionsModal: vi.fn(),
          currentFlatPage: undefined,
          showPermissionsModal: false,
        }}
      >
        {children}
      </TourContext.Provider>
    </MemoryRouter>
  );
  const { result } = renderHook(() => useStopMarker(forStop), { wrapper });
  return { options: result.current, setCurrentStop };
};

describe("useStopMarker", () => {
  beforeEach(() => {
    device.isMobile = false;
    device.isDesktop = true;
  });

  it("names the marker after the stop and its number", () => {
    expect(setup().options.label).toBe("Stop 2: Old Church");
    expect(setup({ stop: { ...stop, position: 0 } }).options.label).toBe(
      "Old Church",
    );
  });

  it("falls back to the tour's icon and color", () => {
    const { options } = setup({
      forTour: { ...tour, map_icon: "/tour.png" },
    });
    expect(options.image).toBe("/tour.png");
    expect(options.color).toBe("#123456");
    expect(
      setup({ stop: { ...stop, map_icon: "/stop.png" } }).options.image,
    ).toBe("/stop.png");
  });

  it("marks the current stop, matched by id", () => {
    expect(setup({ currentStop: { ...stop } }).options.current).toBe(true);
    expect(setup().options.current).toBe(false);
  });

  it("on desktop, selects the stop and moves focus to it", () => {
    const section = document.body.appendChild(document.createElement("div"));
    section.id = "church";
    section.scrollIntoView = vi.fn();
    const { options, setCurrentStop } = setup();
    expect(options.popup).toBeUndefined();
    act(() => options.onActivate!());
    expect(setCurrentStop).toHaveBeenCalledWith(stop);
    expect(section.scrollIntoView).toHaveBeenCalled();
    expect(section).toHaveFocus();
    section.remove();
  });

  it("on mobile, opens a popup instead", () => {
    device.isMobile = true;
    device.isDesktop = false;
    const { options } = setup();
    expect(options.popup).toBeDefined();
    expect(options.popupId).toBe("church-popup");
    expect(options.onActivate).toBeUndefined();
  });
});
