import { useEffect, useRef } from "react";
import { useLeafletMap } from "~/hooks/useLeafletMap";
import { addBasemap } from "~/map_styles/leaflet";
import LeafletOverlay from "./Overlay";
import StopMarkerLeaflet from "./StopMarker";
import type { TTour } from "~/types";

const TourMapLeaflet = ({ tour }: { tour: TTour }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leaflet = useLeafletMap(containerRef, (L, map) =>
    addBasemap(L, map, tour),
  );
  const { north, south, east, west } = tour.bounds;

  // Fits the tour, and refits when its bounds change.
  useEffect(() => {
    leaflet?.map.fitBounds(
      [
        [south, west],
        [north, east],
      ],
      { padding: [50, 50] },
    );
  }, [leaflet, north, south, east, west]);

  // Markers only render portals, but they stay outside the container so
  // React never touches the DOM Leaflet owns.
  return (
    <>
      <div ref={containerRef} className="h-full w-full" />
      {leaflet && (
        <>
          <LeafletOverlay map={leaflet.map} L={leaflet.L} />
          {tour.stops.map((stop) => (
            <StopMarkerLeaflet
              key={stop.id}
              stop={stop}
              L={leaflet.L}
              map={leaflet.map}
            />
          ))}
        </>
      )}
    </>
  );
};

export default TourMapLeaflet;
