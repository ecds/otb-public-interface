import { useContext } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { TourContext } from "~/contexts/TourContext";
import type { TStop } from "~/types/TStop";
import { useDeviceContext } from "~/hooks/deviceContext";

const TourMap = () => {
  const { tour, stops } = useContext(TourContext);
  const { currentStop, setCurrentStop } = useContext(TourContext);
  const { isMobile } = useDeviceContext();

  const handelClick = (stop: TStop) => {
    if (isMobile) return;
    document
      .getElementById(stop.attributes.slug)
      ?.scrollIntoView({ behavior: "smooth" });
    setCurrentStop(stop);
  };

  if (tour) {
    return (
      <div className="w-screen h-[calc(100vh-132px)] my-16">
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
      </div>
    );
  }

  return <></>;
};

export default TourMap;
