import { useContext, useEffect, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { TourContext } from "~/contexts/tourContext";
import type { TStop } from "~/types/TStop";

const MobileTourMap = () => {
  const { tour, stops } = useContext(TourContext);
  const [currentStop, setCurrentStop] = useState<TStop | undefined>(undefined);

  const handleMarkerClick = (stop: TStop) => {
    setCurrentStop(stop);
    console.log("Marker clicked:", stop.attributes.title);
  };

  if (!stops) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (tour) {
    return (
      <div className="w-screen h-[calc(100vh-132px)] my-16">
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
            className="w-full h-full"
          >
            {stops?.map((stop, index) => {
              const lat = parseFloat(stop.attributes.lat);
              const lng = parseFloat(stop.attributes.lng);

              // Skip if coordinates are invalid
              if (isNaN(lat) || isNaN(lng)) {
                console.warn(
                  "Invalid coordinates for stop:",
                  stop.attributes.title
                );
                return null;
              }

              return (
                <AdvancedMarker
                  key={`stop-${stop.id}-${tour.id}`}
                  position={{ lat, lng }}
                  title={stop.attributes.title}
                  onClick={() => handleMarkerClick(stop)}
                  zIndex={stop === currentStop ? stops.length + 1 : index}
                >
                  <Pin
                    scale={stop === currentStop ? 1.3 : 1.1}
                    background={stop === currentStop ? "#dc2626" : "#ef4444"}
                    borderColor={stop === currentStop ? "#991b1b" : "#dc2626"}
                    glyphColor="white"
                  >
                    <span
                      className={`text-white font-bold ${
                        stop === currentStop ? "text-lg" : "text-sm"
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

export default MobileTourMap;
