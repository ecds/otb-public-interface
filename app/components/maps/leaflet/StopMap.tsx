import { useEffect, useRef } from "react";
import { useLeafletMap } from "~/hooks/useLeafletMap";
import { addBasemap } from "~/map_styles/leaflet";
import LeafletOverlay from "./Overlay";
import StopMarkerLeaflet from "./StopMarker";
import type { TTour, TTourStop } from "~/types";

// Same view as the MapLibre stop map, whose zoom 15 is Leaflet's 16.
const ZOOM = 16;

const StopMapLeaflet = ({ tour, stop }: { tour: TTour; stop: TTourStop }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leaflet = useLeafletMap(containerRef, (L, map) => {
    map.setView([stop.lat, stop.lng], ZOOM);
    addBasemap(L, map, tour);
  });

  // Follows the current stop, rather than rebuilding the map.
  useEffect(() => {
    leaflet?.map.panTo([stop.lat, stop.lng], { animate: false });
  }, [leaflet, stop.lat, stop.lng]);

  return (
    <>
      <div ref={containerRef} className="h-full w-full" />
      {leaflet && (
        <>
          <LeafletOverlay map={leaflet.map} L={leaflet.L} />
          <StopMarkerLeaflet stop={stop} L={leaflet.L} map={leaflet.map} />
        </>
      )}
    </>
  );
};

export default StopMapLeaflet;
