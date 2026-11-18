import { useEffect, useRef } from "react";
import { useMapLibreMap } from "~/hooks/useMapLibreMap";
import { styleFor } from "~/map_styles/forTour";
import MapLibreOverlay from "./Overlay";
import MapMarker from "./StopMarker";
import "maplibre-gl/dist/maplibre-gl.css";
import type { TTour, TTourStop } from "~/types";

interface Props {
  tour: TTour;
  stop: TTourStop;
  onWebGLFailure: () => void;
}

const StopMap = ({ tour, stop, onWebGLFailure }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const map = useMapLibreMap(
    containerRef,
    {
      style: styleFor(tour),
      center: [stop.lng, stop.lat],
      zoom: 15,
      attributionControl: false,
    },
    onWebGLFailure,
  );

  // Follows the current stop, rather than rebuilding the map.
  useEffect(() => {
    map?.jumpTo({ center: [stop.lng, stop.lat] });
  }, [map, stop.lng, stop.lat]);

  return (
    <>
      <div className="h-full w-full" ref={containerRef} />
      {map && (
        <>
          <MapLibreOverlay map={map} />
          <MapMarker stop={stop} map={map} />
        </>
      )}
    </>
  );
};

export default StopMap;
