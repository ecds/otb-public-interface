import * as maplibregl from "maplibre-gl";
import { useContext, useEffect, useRef, useState } from "react";
import { TourContext } from "~/contexts/TourContext";
import MapMarker from "./MapMarker";
import MapOverlay from "./MapOverlay";
import "maplibre-gl/dist/maplibre-gl.css";

const TourMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | undefined>(undefined);
  const { tour, mapStyle } = useContext(TourContext);

  useEffect(() => {
    if (!tour || !mapContainerRef.current) return;

    const bounds = new maplibregl.LngLatBounds(
      new maplibregl.LngLat(tour.bounds.west, tour.bounds.south),
      new maplibregl.LngLat(tour.bounds.east, tour.bounds.north),
    );

    const tourMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      bounds,
    });

    setMap(tourMap);

    return () => {
      tourMap.remove();
      setMap(undefined);
    };
  }, [tour, mapStyle]);

  return (
    <>
      <div className="h-full w-full" ref={mapContainerRef}></div>
      {map && (
        <>
          {tour?.stops.map((stop) => {
            return (
              <MapMarker key={`desktop-map-${stop.id}`} stop={stop} map={map} />
            );
          })}
          <MapOverlay map={map} />
        </>
      )}
    </>
  );
};

export default TourMap;
