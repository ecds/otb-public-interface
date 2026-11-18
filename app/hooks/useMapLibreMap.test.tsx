import { render } from "@testing-library/react";
import { useRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMapLibreMap } from "./useMapLibreMap";
import type { Map, MapOptions } from "maplibre-gl";

const created = vi.fn();
const removed = vi.fn();
const handlers: Record<string, (event: { error: Error }) => void> = {};
vi.mock("maplibre-gl", () => {
  class GPUInitializationError extends Error {}
  return {
    GPUInitializationError,
    Map: class {
      constructor(options: MapOptions) {
        created(options);
      }
      on(type: string, handler: (event: { error: Error }) => void) {
        handlers[type] = handler;
      }
      remove() {
        removed();
      }
    },
  };
});

let latest: Map | undefined;
const Probe = ({
  center = [1, 2] as [number, number],
  onWebGLFailure = () => {},
  setup,
}: {
  center?: [number, number];
  onWebGLFailure?: () => void;
  setup?: (map: Map) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  latest = useMapLibreMap(ref, { center }, onWebGLFailure, setup);
  return <div ref={ref} />;
};

describe("useMapLibreMap", () => {
  beforeEach(() => {
    created.mockReset();
    removed.mockReset();
    latest = undefined;
  });

  it("creates the map in the container with the options", () => {
    const setup = vi.fn();
    render(<Probe setup={setup} />);
    expect(created).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [1, 2],
        container: expect.any(HTMLDivElement),
      }),
    );
    expect(setup).toHaveBeenCalledWith(latest, expect.any(HTMLDivElement));
    expect(latest).toBeDefined();
  });

  it("doesn't rebuild the map when the options change", () => {
    const { rerender } = render(<Probe />);
    rerender(<Probe center={[3, 4]} />);
    expect(created).toHaveBeenCalledTimes(1);
  });

  it("removes the map on unmount", () => {
    const { unmount } = render(<Probe />);
    unmount();
    expect(removed).toHaveBeenCalled();
  });

  it("reports missing WebGL instead of throwing, and unmounts cleanly", async () => {
    const { GPUInitializationError } = await import("maplibre-gl");
    created.mockImplementation(() => {
      throw new GPUInitializationError({}, null);
    });
    const onWebGLFailure = vi.fn();
    const { unmount } = render(<Probe onWebGLFailure={onWebGLFailure} />);
    expect(onWebGLFailure).toHaveBeenCalled();
    expect(latest).toBeUndefined();
    expect(() => unmount()).not.toThrow();
  });

  it("reports WebGL failing after the map was made", async () => {
    const { GPUInitializationError } = await import("maplibre-gl");
    const onWebGLFailure = vi.fn();
    render(<Probe onWebGLFailure={onWebGLFailure} />);
    handlers.error({ error: new GPUInitializationError({}, null) });
    expect(onWebGLFailure).toHaveBeenCalled();
  });

  it("passes other errors through", () => {
    created.mockImplementation(() => {
      throw new Error("bad style");
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow("bad style");
  });
});
