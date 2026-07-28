import { useEffect, useState } from "react";
import { usePreferences } from "./usePreferences";

const geoOpts = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export const useDeviceLocation = () => {
  const [deviceLocation, setDeviceLocation] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);

  const { locationAllowed, realtimeLocation } = usePreferences();

  useEffect(() => {
    if (!locationAllowed) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDeviceLocation({
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        console.warn(error.message);
      },
      geoOpts,
    );
  }, [locationAllowed]);

  useEffect(() => {
    if (!realtimeLocation) return;

    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDeviceLocation({
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        console.warn(error.message);
      },
      geoOpts,
    );

    return () => {
      navigator.geolocation.clearWatch(watcherId);
    };
  }, [realtimeLocation]);

  return { deviceLocation };
};
