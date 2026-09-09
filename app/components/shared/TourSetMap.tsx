import * as maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { baseStyle } from "~/map_styles";
import TourMarker from "../shared/TourMarker";
import "maplibre-gl/dist/maplibre-gl.css";
import { Link } from "react-router";
import type { TTour, TContextRequest } from "~/types";
import TourCard from "./TourCard";

interface Props {
  tours: TTour[];
}

const calcBounds = (tours: TTour[]) => {
  if (tours.length === 1) {
    return new maplibregl.LngLatBounds(
      new maplibregl.LngLat(tours[0].bounds.west, tours[0].bounds.south),
      new maplibregl.LngLat(tours[0].bounds.east, tours[0].bounds.north),
    );
  }

  if (tours.length === 2) {
    return new maplibregl.LngLatBounds(
      new maplibregl.LngLat(
        tours[0].bounds.centerLng,
        tours[0].bounds.centerLat,
      ),
      new maplibregl.LngLat(
        tours[1].bounds.centerLng,
        tours[1].bounds.centerLat,
      ),
    );
  }

  const firstTwo = tours.splice(0, 2);

  const bounds = new maplibregl.LngLatBounds(
    new maplibregl.LngLat(
      firstTwo[0].bounds.centerLng,
      firstTwo[0].bounds.centerLat,
    ),
    new maplibregl.LngLat(
      firstTwo[1].bounds.centerLng,
      firstTwo[1].bounds.centerLat,
    ),
  );

  for (const tour of tours) {
    bounds.extend(
      new maplibregl.LngLat(tour.bounds.centerLng, tour.bounds.centerLat),
    );
  }

  return bounds;
};

const TourSetMap = ({ tours }: Props) => {
  console.log("🚀 ~ TourSetMap ~ tours:", tours);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | undefined>(undefined);

  useEffect(() => {
    if (!tours || tours.length === 0 || !mapContainerRef.current) return;

    const bounds = calcBounds(tours);

    const _map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: baseStyle,
      bounds,
      zoom: 5,
      renderWorldCopies: false,
    });

    _map.fitBounds(bounds, { padding: 100 });

    setMap(_map);

    return () => {
      _map.remove();
      setMap(undefined);
    };
  }, [tours]);

  return (
    <div ref={mapContainerRef} className="w-full h-[50vh] rounded-md">
      {tours.map((tour) => {
        if (map) {
          return (
            <TourMarker
              key={tour.slug}
              map={map}
              tour={{
                ...tour,
                center: {
                  lng: tour.bounds.centerLng,
                  lat: tour.bounds.centerLat,
                },
              }}
            >
              <TourCard tour={tour} className="hidden md:block" />
              <Link
                className="md:hidden text-lg text-blue-700 hover:text-blue-900 underline"
                to={`/${tour.slug}`}
              >
                {tour.title}
              </Link>
            </TourMarker>
          );
        }
      })}
    </div>
  );
};

export default TourSetMap;
