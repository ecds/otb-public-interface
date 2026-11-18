import * as maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

// Creates a MapLibre map in the container once, on mount, and removes it on
// unmount. Options and setup are read then only, so later renders don't
// rebuild the map out from under its markers. Calls onWebGLFailure instead
// of throwing when there's no usable WebGL.
export const useMapLibreMap = (
  containerRef: RefObject<HTMLDivElement | null>,
  options: Omit<maplibregl.MapOptions, "container">,
  onWebGLFailure: () => void,
  setup?: (map: maplibregl.Map, container: HTMLDivElement) => void,
) => {
  const [map, setMap] = useState<maplibregl.Map>();
  const initial = useRef({ options, setup });
  // The latest callback, so a new function each render doesn't rebuild the map.
  const failure = useRef(onWebGLFailure);
  useEffect(() => {
    failure.current = onWebGLFailure;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let created: maplibregl.Map;
    try {
      created = new maplibregl.Map({ container, ...initial.current.options });
    } catch (error) {
      if (!(error instanceof maplibregl.GPUInitializationError)) throw error;
      failure.current();
      return;
    }

    // Only fired when restoring a lost WebGL context fails.
    created.on("error", ({ error }) => {
      if (error instanceof maplibregl.GPUInitializationError) failure.current();
    });

    initial.current.setup?.(created, container);
    setMap(created);

    return () => {
      setMap(undefined);
      created.remove();
    };
  }, [containerRef]);

  return map;
};
