import { useContext } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { TourContext } from "~/contexts/TourContext";
import type { TTour } from "~/types/TTour";
import type { TStop } from "~/types/TStop";

interface Props {
  tour: TTour;
  stops?: TStop[];
}

const TourMap = ({ tour, stops }: Props) => {
  const { currentStop, setCurrentStop } = useContext(TourContext);

  const handelClick = (stop: TStop) => {
    setCurrentStop(stop);
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultBounds={{
          east: tour.attributes.bounds.east,
          south: tour.attributes.bounds.south,
          north: tour.attributes.bounds.north,
          west: tour.attributes.bounds.west,
        }}
        disableDefaultUI
        mapId={"bf51a910020fa25a"}
      >
        {stops?.map((stop, index) => {
          return (
            <AdvancedMarker
              key={stop.attributes.slug}
              position={{
                lat: parseFloat(stop.attributes.lat),
                lng: parseFloat(stop.attributes.lng),
              }}
              title={stop.attributes.title}
              onClick={() => handelClick(stop)}
              zIndex={stop === currentStop ? stops.length + 1 : index}
            >
              <Pin scale={stop === currentStop ? 1.5 : 1}>
                <span
                  className={`text-white ${
                    stop === currentStop ? "text-xl" : "text-base"
                  }`}
                >
                  {stop.attributes.position}
                </span>
              </Pin>
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
};

export default TourMap;
