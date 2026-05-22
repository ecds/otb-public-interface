import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useContext, useEffect, useState } from "react";
import Directions from "~/components/mobile/Directions";
import DeviceLocationMarker from "~/components/mobile/mapMarkers/DeviceLocation";
import ParkingMarker from "~/components/mobile/mapMarkers/Parking";
import StopMarker from "~/components/mobile/mapMarkers/Stop";
import MobileStopGMap from "~/components/mobile/MobileStopGMap";
import StopMap from "~/components/mobile/StopMap";
import TravelModeSelector from "~/components/mobile/TravelModeSelector";
import MapOverlay from "~/components/shared/MapOverlay";
import { PermissionsContext } from "~/contexts/PermissionsContext";
import { StopMapContext } from "~/contexts/StopMapContext";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceLocation } from "~/hooks/deviceLocation";
import type { TTravelMode } from "~/types/TTravelMode";

const MODE_COOKIE_NAME = "transportation-mode";

const WALKING: TTravelMode = {
  title: "WALKING",
  icon: "walking",
  default: true,
};

const StopMapRoute = () => {
  const locationAllowed = true;
  const { tour, currentStop } = useContext(TourContext);
  const { setShowPermissionsModal } = useContext(PermissionsContext);
  const { gMaps } = useContext(PermissionsContext);

  // const [stopLocation, setStopLocation] = useState<
  //   google.maps.LatLngLiteral | undefined
  // >();

  // const [parkingLocation, setParkingLocation] = useState<
  //   google.maps.LatLngLiteral | undefined
  // >(undefined);

  // const [selectedTravelMode, setSelectedTravelMode] = useState<
  //   TTravelMode | undefined
  // >(undefined);

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

  return (
    <>
      {gMaps ? (
        <MobileStopGMap>
          <MapOverlay />
          <ParkingMarker />
          <StopMarker />
          <MapControl position={ControlPosition.TOP_RIGHT}>
            <Directions />
          </MapControl>
          {locationAllowed && (
            <>
              <MapControl position={ControlPosition.TOP_LEFT}>
                <TravelModeSelector />
              </MapControl>
              <DeviceLocationMarker />
            </>
          )}
          <MapControl position={ControlPosition.BOTTOM}>
            <div className="mb-6 mx-auto p-2 bg-white/65 border border-black rounded-md text-lg text-nowrap truncate text-black overflow-hidden max-w-[80vw]">
              {currentStop?.position}: {currentStop?.title}
            </div>
          </MapControl>
        </MobileStopGMap>
      ) : (
        <>
          <div className="w-screen h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] mt-16">
            <StopMap />
          </div>
          <button
            className="md:hidden text-xs text-center w-full my-auto underline"
            onClick={() => setShowPermissionsModal(true)}
          >
            Allow Google Maps and location to see directions.
          </button>
        </>
      )}
    </>
  );
};

export default StopMapRoute;
