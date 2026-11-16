import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useContext, useEffect, useMemo, useState } from "react";
import Directions from "~/components/maps/google/Directions";
import DeviceLocationMarker from "~/components/maps/google/markers/DeviceLocation";
import ParkingMarker from "~/components/maps/google/markers/Parking";
import StopMarker from "~/components/maps/google/markers/Stop";
import MapOverlay from "~/components/maps/google/Overlay";
import StopGMap from "~/components/maps/google/StopMap";
import StopMap from "~/components/maps/maplibre/StopMap";
import GrantLocationAccess from "~/components/mobile/location/LocationServices";
import MapNudge from "~/components/mobile/MapNudge";
import TravelModeSelector from "~/components/mobile/TravelModeSelector";
import { StopMapContext } from "~/contexts/StopMapContext";
import { TourContext } from "~/contexts/TourContext";
import { usePreferences } from "~/hooks";
import { useLocationPermission } from "~/hooks/locationPermission";
import { pageTitle } from "~/utils/pageTitle";
import type { MetaFunction } from "react-router";
import type { TTour, TTravelMode } from "~/types";

export const meta: MetaFunction = ({ matches, params }) => {
  const data = matches.find((m) => m.id === "routes/tour")?.loaderData as
    | { tour?: TTour }
    | undefined;
  const stop = data?.tour?.stops.find((s) =>
    s.slugs.includes(params.stop ?? ""),
  );
  return [{ title: pageTitle("Map", stop?.title, data?.tour?.title) }];
};

const WALKING: TTravelMode = {
  title: "WALKING",
  default: true,
};

const StopMapRoute = () => {
  const { tour, currentStop } = useContext(TourContext);
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

  const stopMapContextValue = useMemo(
    () => ({
      stopLocation,
      parkingLocation,
      travelMode,
      setTravelMode,
      locationAllowed,
      gMaps,
      realtimeLocation,
      removePreference,
      addPreference,
    }),
    [
      stopLocation,
      parkingLocation,
      travelMode,
      locationAllowed,
      gMaps,
      realtimeLocation,
      removePreference,
      addPreference,
    ],
  );

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

  const useGMaps = gMaps && tour?.use_directions;

  return (
    <StopMapContext.Provider value={stopMapContextValue}>
      {useGMaps ? (
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
          <div className="w-screen h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] mt-16">
            <StopMap />
          </div>
          {tour?.use_directions && (
            <MapNudge
              gMaps={gMaps}
              locationAllowed={locationAllowed}
              addPreference={addPreference}
            />
          )}
        </>
      )}
    </StopMapContext.Provider>
  );
};

export default StopMapRoute;
