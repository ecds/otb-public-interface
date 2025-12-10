import { useContext } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { StopMapContext } from "~/contexts/StopMapContext";
import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const MobileStopMap = ({ children }: { children: ReactNode }) => {
  const { stopLocation } = useContext(StopMapContext);

  if (!stopLocation) {
    return (
      // The top and bottom navbars have height of 64px, hence the 100vh - 128px.
      <div className="h-[calc(100vh-128px)] flex items-center justify-center m-auto bg-gray-100 mt-16">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    // The top and bottom navbars have height of 64px, hence the 100vh - 128px.
    <div className="w-screen h-[calc(100vh-128px)] mt-16">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={stopLocation}
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

export default MobileStopMap;
