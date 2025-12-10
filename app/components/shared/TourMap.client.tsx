import { useContext } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { TourContext } from "~/contexts/TourContext";
import MapOverlay from "./MapOverlay";
import MapMarker from "./MapMarker";

const TourMap = () => {
  const { currentStop, tour } = useContext(TourContext);

  if (!tour || !tour.bounds) return <></>;

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultBounds={{
          east: tour.bounds.east,
          south: tour.bounds.south,
          north: tour.bounds.north,
          west: tour.bounds.west,
        }}
        maxZoom={tour.blank_map ? 18 : undefined}
        disableDefaultUI
        mapTypeId={tour.map_type ?? "roadmap"}
        mapId={"bf51a910020fa25a"}
        restriction={{
          latLngBounds: {
            north: 84,
            south: -84,
            east: 179,
            west: -179,
          },
          strictBounds: true,
        }}
      >
        <MapOverlay />
        {tour.stops?.map((stop, index) => {
          return (
            <MapMarker
              key={stop.slug}
              stop={stop}
              zIndex={stop === currentStop ? tour.stops.length + 1 : index}
              hasIcon={Boolean(stop.icon)}
            />
          );
        })}
      </Map>
    </APIProvider>
  );
};

export default TourMap;
