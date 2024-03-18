import { useContext } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import TourSiteContext from "~/contexts/tourSiteContext";
import type { TTour } from "~/types/TTour";
import type { TStop } from "~/types/TStop";

interface Props {
  tour: TTour;
}

const TourMap = ({ tour }: Props) => {
  const { currentStop, setCurrentStop } = useContext(TourSiteContext);

  const handelClick = (stop: TStop) => {
    document
      .getElementById(stop.attributes.slug)
      ?.scrollIntoView({ behavior: "smooth" });
    setCurrentStop(stop);
  };

  return (
    <APIProvider apiKey={"AIzaSyD-G_lDtvChv-P3nchtQYHoCLfFzn9ylr8"}>
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
        {tour.stops.map((stop) => {
          return (
            <AdvancedMarker
              key={stop.attributes.slug}
              position={{
                lat: parseFloat(stop.attributes.lat),
                lng: parseFloat(stop.attributes.lng),
              }}
              title={stop.attributes.title}
              onClick={() => handelClick(stop)}
            >
              <Pin scale={stop === currentStop ? 1.5 : 1}>
                <span
                  className={`text-white text-${
                    stop === currentStop ? "xl" : "base"
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
