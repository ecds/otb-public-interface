import { useContext } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { TourContext } from "~/contexts/TourContext";
import MapMarker from "./MapMarker";
import { Link } from "react-router";

const MobileTourMap = () => {
  const { tour, stops, setCurrentStop } = useContext(TourContext);

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

  if (tour && stops) {
    // Sort so earlier stops are mapped on top of latter stops.
    stops.sort((a, b) => b.attributes.position - a.attributes.position);
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
            className="w-full h-full"
            onClick={() => setCurrentStop(undefined)}
          >
            {stops?.map((stop) => {
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
                <MapMarker stop={stop} key={`${stop.id}-${tour.id}`}>
                  <>
                    <h3 className="text-lg mb-2">{stop.attributes.title}</h3>
                    <Link
                      to={`/${tour?.attributes.slug}/${stop.attributes.slug}`}
                      className="text-blue-500 visited:text-purple-800 underline"
                    >
                      Go To Stop
                    </Link>
                  </>
                </MapMarker>
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
