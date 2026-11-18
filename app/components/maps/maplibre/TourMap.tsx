import { useEffect, useRef } from "react";
import { useMapLibreMap } from "~/hooks/useMapLibreMap";
import { styleFor } from "~/map_styles/forTour";
import MapLibreOverlay from "./Overlay";
import MapMarker from "./StopMarker";
import "maplibre-gl/dist/maplibre-gl.css";
import type { TTour } from "~/types";

interface Props {
  tour: TTour;
  onWebGLFailure: () => void;
}

const TourMap = ({ tour, onWebGLFailure }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { north, south, east, west } = tour.bounds;
  const map = useMapLibreMap(
    containerRef,
    {
      style: styleFor(tour),
      bounds: [
        [west, south],
        [east, north],
      ],
      fitBoundsOptions: { padding: 50 },
    },
    onWebGLFailure,
  );

  // Refits when the tour's bounds change, rather than rebuilding the map.
  useEffect(() => {
    map?.fitBounds(
      [
        [west, south],
        [east, north],
      ],
      { padding: 50 },
    );
  }, [map, north, south, east, west]);

  return (
    <>
      <div className="h-full w-full" ref={containerRef} />
      {map && (
        <>
          <MapLibreOverlay map={map} />
          {tour.stops.map((stop) => (
            <MapMarker key={stop.id} stop={stop} map={map} />
          ))}
        </>
      )}
    </>
  );
};

export default TourMap;
