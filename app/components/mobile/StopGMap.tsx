import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useContext } from "react";
import { TourContext } from "~/contexts/TourContext";
import type { ReactNode } from "react";

const StopGMap = ({ children }: { children: ReactNode }) => {
  const { currentStop } = useContext(TourContext);
  // useEffect(() => {
  //   if (!currentStop) return;

  //   const lat = currentStop.lat;
  //   const lng = currentStop.lng;

  //   if (isNaN(lat) || isNaN(lng)) return;

  //   setStopLocation({ lat, lng });

  //   if (currentStop.parking_lat && currentStop.parking_lng) {
  //     setParkingLocation({
  //       lat: currentStop.parking_lat,
  //       lng: currentStop.parking_lng,
  //     });
  //   }
  // }, [currentStop]);

  if (!currentStop) {
    return (
      // The top and bottom navbars have height of 64px, hence the 100vh - 128px.
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center m-auto bg-gray-100 mt-16">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    // The top and bottom navbars have height of 64px, hence the 100vh - 128px.
    <div className="w-screen h-[calc(100vh-8rem)] mt-16">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: currentStop.lat, lng: currentStop.lng }}
          defaultZoom={15}
          disableDefaultUI
          mapId={"bf51a910020fa25a"}
          className="w-full h-full"
        >
          {children}
        </Map>
      </APIProvider>
    </div>
  );
};

export default StopGMap;
