import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useContext, useEffect, useState } from "react";
import Directions from "~/components/mobile/Directions";
import DeviceLocationMarker from "~/components/mobile/mapMarkers/DeviceLocation";
import ParkingMarker from "~/components/mobile/mapMarkers/Parking";
import StopMarker from "~/components/mobile/mapMarkers/Stop";
import MobileStopMap from "~/components/mobile/MobileStopMap";
import TravelModeSelector from "~/components/mobile/TravelModeSelector";
import MapOverlay from "~/components/shared/MapOverlay";
import PermissionsContext from "~/contexts/PermissionsContext";
import { StopMapContext } from "~/contexts/StopMapContext";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceLocation } from "~/hooks/deviceLocation";
import { travelModes } from "~/mappings";
import { createCookie, getCookieValue } from "~/utils/cookies";
import type { TTravelMode } from "~/types/TTravelMode";

const MODE_COOKIE_NAME = "transportation-mode";

const WALKING: TTravelMode = {
  title: "WALKING",
  icon: "walking",
  default: true,
};

const StopMapRoute = () => {
  const { locationAllowed } = useContext(PermissionsContext);
  const { tour, currentStop } = useContext(TourContext);
  const { deviceLocation } = useDeviceLocation();

  const [stopLocation, setStopLocation] = useState<
    google.maps.LatLngLiteral | undefined
  >();

  const [parkingLocation, setParkingLocation] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);

  const [selectedTravelMode, setSelectedTravelMode] = useState<
    TTravelMode | undefined
  >(undefined);

  useEffect(() => {
    if (!currentStop) return;

    const lat = parseFloat(currentStop.lat);
    const lng = parseFloat(currentStop.lng);

    if (isNaN(lat) || isNaN(lng)) return;

    setStopLocation({ lat, lng });

    if (currentStop.parking_lat && currentStop.parking_lng) {
      setParkingLocation({
        lat: parseFloat(currentStop.parking_lat),
        lng: parseFloat(currentStop.parking_lng),
      });
    }
  }, [currentStop]);

  useEffect(() => {
    if (!locationAllowed || !tour) return;

    const modeCookieValue = async () => {
      const cookieValue = await getCookieValue({
        name: MODE_COOKIE_NAME,
        path: `/${tour.slug}`,
      });

      if (!cookieValue) {
        const defaultTravelMode = tour.modes.find((m) => m.default) || WALKING;
        setSelectedTravelMode(defaultTravelMode);
        createCookie({
          name: MODE_COOKIE_NAME,
          path: `/${tour.slug}`,
          value: defaultTravelMode.title,
        });
      } else {
        const newMode = travelModes.find((mode) => mode.title === cookieValue);
        if (newMode) setSelectedTravelMode(newMode);
      }
    };
    modeCookieValue();
  }, [tour, locationAllowed]);

  useEffect(() => {
    if (!locationAllowed || !tour || !selectedTravelMode) return;

    const modeCookieValue = async () => {
      const cookieValue = await getCookieValue({
        name: MODE_COOKIE_NAME,
        path: `/${tour.slug}`,
      });

      if (cookieValue && cookieValue !== selectedTravelMode.title) {
        createCookie({
          name: MODE_COOKIE_NAME,
          value: selectedTravelMode.title,
          path: `/${tour.slug}`,
        });
      }
    };
    modeCookieValue();
  }, [selectedTravelMode, tour, locationAllowed]);

  return (
    <StopMapContext.Provider
      value={{
        deviceLocation,
        stopLocation,
        parkingLocation,
        travelMode: selectedTravelMode || WALKING,
        setSelectedTravelMode,
      }}
    >
      <MobileStopMap>
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
      </MobileStopMap>
    </StopMapContext.Provider>
  );
};

export default StopMapRoute;
