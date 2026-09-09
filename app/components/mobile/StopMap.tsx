import * as maplibregl from "maplibre-gl";
import { useContext, useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { TourContext } from "~/contexts/TourContext";
import MapMarker from "../desktop/MapMarker";

const StopMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | undefined>(undefined);
  const { mapStyle, currentStop } = useContext(TourContext);

  useEffect(() => {
    if (!mapContainerRef.current || !currentStop) return;

    const stopMap = new maplibregl.Map({
      container: mapContainerRef.current,
      center: [currentStop.lng, currentStop.lat],
      zoom: 15,
      style: mapStyle,
      attributionControl: false,
    });

    setMap(stopMap);

    return () => {
      stopMap.remove();
      setMap(undefined);
    };
  }, [currentStop, mapStyle]);

  if (currentStop) {
    return (
      <>
        <div className="h-full w-full" ref={mapContainerRef}></div>
        {map && <MapMarker stop={currentStop} map={map} />}
      </>
    );
  }

  return <></>;
};

export default StopMap;
