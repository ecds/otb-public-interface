import { useEffect, useRef, useState } from "react";
import type Leaflet from "leaflet";
import type { RefObject } from "react";

export type TLeafletMap = { L: typeof Leaflet; map: Leaflet.Map };

// Creates a Leaflet map in the container once, on mount, and removes it on
// unmount. Leaflet reads `window` as soon as it's imported, so it's loaded
// here, in the browser, and only when a map needs it. Setup is read once,
// so later renders don't rebuild the map out from under its markers.
export const useLeafletMap = (
  containerRef: RefObject<HTMLDivElement | null>,
  setup: (L: typeof Leaflet, map: Leaflet.Map) => void,
) => {
  const [leaflet, setLeaflet] = useState<TLeafletMap>();
  const initialSetup = useRef(setup);

  useEffect(() => {
    let map: Leaflet.Map | undefined;
    let cancelled = false;

    Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]).then(
      ([{ default: L }]) => {
        const container = containerRef.current;
        if (cancelled || !container) return;

        map = L.map(container);
        initialSetup.current(L, map);
        setLeaflet({ L, map });
      },
    );

    return () => {
      cancelled = true;
      setLeaflet(undefined);
      map?.remove();
    };
  }, [containerRef]);

  return leaflet;
};
