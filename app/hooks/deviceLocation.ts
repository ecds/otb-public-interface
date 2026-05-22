import { useContext, useEffect, useState } from "react";

const geoOpts = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export const useDeviceLocation = () => {
  const locationAllowed = true;
  const setLocationAllowed = true;
  const locationUpdateAllowed = true;
  const [deviceLocation, setDeviceLocation] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);

  useEffect(() => {
    if (typeof locationAllowed === "undefined") return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDeviceLocation({
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        setLocationAllowed(false);
        console.warn(error.message);
      },
      geoOpts,
    );
  }, [locationAllowed, setLocationAllowed]);

  useEffect(() => {
    if (!locationUpdateAllowed) return;

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
  }, [locationUpdateAllowed]);

  return { deviceLocation };
};
