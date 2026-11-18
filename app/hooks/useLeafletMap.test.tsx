import { render, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLeafletMap } from "./useLeafletMap";
import type { TLeafletMap } from "./useLeafletMap";
import type Leaflet from "leaflet";

const removed = vi.fn();
const mapFactory = vi.fn((container: HTMLElement) => ({
  container,
  remove: removed,
}));
vi.mock("leaflet", () => ({ default: { map: mapFactory } }));
vi.mock("leaflet/dist/leaflet.css", () => ({}));

let latest: TLeafletMap | undefined;
const Probe = ({
  setup = () => {},
}: {
  setup?: (L: typeof Leaflet, map: Leaflet.Map) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  latest = useLeafletMap(ref, setup);
  return <div ref={ref} />;
};

describe("useLeafletMap", () => {
  beforeEach(() => {
    removed.mockReset();
    mapFactory.mockClear();
    latest = undefined;
  });

  it("loads Leaflet, creates the map in the container and runs setup", async () => {
    const setup = vi.fn();
    render(<Probe setup={setup} />);
    await waitFor(() => expect(latest).toBeDefined());
    expect(mapFactory).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    expect(setup).toHaveBeenCalledWith(latest!.L, latest!.map);
  });

  it("doesn't rebuild the map on later renders", async () => {
    const { rerender } = render(<Probe />);
    await waitFor(() => expect(latest).toBeDefined());
    rerender(<Probe setup={vi.fn()} />);
    expect(mapFactory).toHaveBeenCalledTimes(1);
  });

  it("removes the map on unmount", async () => {
    const { unmount } = render(<Probe />);
    await waitFor(() => expect(latest).toBeDefined());
    unmount();
    expect(removed).toHaveBeenCalled();
  });

  it("never creates a map if unmounted before Leaflet loads", async () => {
    const { unmount } = render(<Probe />);
    unmount();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mapFactory).not.toHaveBeenCalled();
  });
});
