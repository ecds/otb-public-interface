import { useEffect, useRef, useState } from "react";
import TourMarkerLeaflet from "./TourMarkerLeaflet";
import type { TMapMarker, TMapView } from "./types";
import type Leaflet from "leaflet";

interface Props {
  markers: TMapMarker[];
  view: TMapView;
  className: string;
}

// For browsers without WebGL. Leaflet reads `window` as soon as it's
// imported, so it's loaded here, in the browser, and only when needed.
const ToursLeaflet = ({ markers, view, className }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leaflet, setLeaflet] = useState<{
    L: typeof Leaflet;
    map: Leaflet.Map;
  }>();
  // Later changes don't rebuild the map.
  const [initialView] = useState(view);

  useEffect(() => {
    let map: Leaflet.Map | undefined;
    let cancelled = false;

    Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]).then(
      ([{ default: L }]) => {
        const container = containerRef.current;
        if (cancelled || !container) return;

        map = L.map(container);
        if ("bounds" in initialView) {
          const { north, south, east, west } = initialView.bounds;
          map.fitBounds(
            [
              [south, west],
              [north, east],
            ],
            { padding: [50, 50] },
          );
        } else {
          // MapLibre's 512-pixel tiles put its zoom levels one step out from
          // Leaflet's 256-pixel ones.
          map.setView(
            [initialView.center.lat, initialView.center.lng],
            initialView.zoom + 1,
          );
        }

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        setLeaflet({ L, map });
      },
    );

    return () => {
      cancelled = true;
      map?.remove();
      setLeaflet(undefined);
    };
  }, [initialView]);

  return (
    <div ref={containerRef} className={className}>
      {leaflet &&
        markers.map((marker) => (
          <TourMarkerLeaflet
            key={marker.id}
            L={leaflet.L}
            map={leaflet.map}
            marker={marker}
          />
        ))}
    </div>
  );
};

export default ToursLeaflet;
