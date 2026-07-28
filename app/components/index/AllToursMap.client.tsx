import * as maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { baseStyle } from "~/map_styles";
import TourMarker from "../shared/TourMarker";
import "maplibre-gl/dist/maplibre-gl.css";
import type { TTourSetTour , TContextRequest } from "~/types";

interface Props {
  tours: TTourSetTour[];
  request: TContextRequest;
}

const AllToursMap = ({ tours, request }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | undefined>(undefined);

  useEffect(() => {
    if (!tours || !mapContainerRef.current) return;
    const _map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: baseStyle,
      center: new maplibregl.LngLat(-83.4375901, 32.6620411),
      zoom: 5,
      renderWorldCopies: false,
    });

    _map.addControl(
      new maplibregl.FullscreenControl({ container: mapContainerRef.current }),
    );

    setMap(_map);

    return () => {
      _map.remove();
      setMap(undefined);
    };
  }, [tours]);

  return (
    <div
      id="all-tour-maps"
      ref={mapContainerRef}
      className="w-full max-w-screen h-[50vh]"
    >
      {tours.map((tour) => {
        if (map) {
          return (
            <TourMarker key={tour.slug} map={map} tour={tour}>
              <a
                className="focus-visible:border-0 focus-visible:outline-0 text-lg text-blue-500 hover:text-blue-700 underline"
                href={`${request.protocol}://${tour.tenant}.${request.host}/${tour.slug}`}
              >
                {tour.title}
              </a>
            </TourMarker>
          );
        }
      })}
    </div>
  );
};

export default AllToursMap;
