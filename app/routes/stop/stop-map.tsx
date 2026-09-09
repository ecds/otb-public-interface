import { faWalking } from "@fortawesome/free-solid-svg-icons";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useContext, useEffect, useState } from "react";
import Directions from "~/components/mobile/Directions";
import GrantLocationAccess from "~/components/mobile/location/LocationServices";
import DeviceLocationMarker from "~/components/mobile/mapMarkers/DeviceLocation";
import ParkingMarker from "~/components/mobile/mapMarkers/Parking";
import StopMarker from "~/components/mobile/mapMarkers/Stop";
import StopGMap from "~/components/mobile/StopGMap";
import StopMap from "~/components/mobile/StopMap";
import TravelModeSelector from "~/components/mobile/TravelModeSelector";
import MapOverlay from "~/components/shared/MapOverlay";
import { StopMapContext } from "~/contexts/StopMapContext";
import { TourContext } from "~/contexts/TourContext";
import { usePreferences } from "~/hooks";
import { useLocationPermission } from "~/hooks/locationPermission";
import type { TTravelMode } from "~/types";

const WALKING: TTravelMode = {
  title: "WALKING",
  icon: faWalking,
  default: true,
};

const StopMapRoute = () => {
  const { tour, currentStop, setShowPermissionsModal } =
    useContext(TourContext);
  const {
    gMaps,
    locationAllowed,
    removePreference,
    addPreference,
    realtimeLocation,
  } = usePreferences();
  const locationPermission = useLocationPermission();

  const [stopLocation, setStopLocation] = useState<
    google.maps.LatLngLiteral | undefined
  >();

  const [parkingLocation, setParkingLocation] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);

  const [travelMode, setTravelMode] = useState<TTravelMode>(WALKING);

  useEffect(() => {
    if (!tour) return;
    const storedTravelMode = tour.modes.find(
      (mode) => mode.title === localStorage.getItem(tour.slug),
    );
    setTravelMode(storedTravelMode ?? tour.mode);
  }, [tour]);

  useEffect(() => {
    if (!currentStop) return;

    const lat = currentStop.lat;
    const lng = currentStop.lng;

    if (isNaN(lat) || isNaN(lng)) return;

    setStopLocation({ lat, lng });

    if (currentStop.parking_lat && currentStop.parking_lng) {
      setParkingLocation({
        lat: currentStop.parking_lat,
        lng: currentStop.parking_lng,
      });
    }
  }, [currentStop]);

  if (locationPermission === "denied" && locationAllowed)
    return (
      <GrantLocationAccess
        dismiss={removePreference}
        locationAllowed={locationAllowed}
      />
    );

  return (
    <StopMapContext.Provider
      value={{
        stopLocation,
        parkingLocation,
        travelMode,
        setTravelMode,
        locationAllowed,
        gMaps,
        realtimeLocation,
        removePreference,
        addPreference,
      }}
    >
      {gMaps ? (
        <StopGMap>
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
        </StopGMap>
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
    </StopMapContext.Provider>
  );
};

export default StopMapRoute;
