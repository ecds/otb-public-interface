import { useEffect, useRef, useState } from "react";
import { usePreferences } from "./usePreferences";

const geoOpts = {
  enableHighAccuracy: true,
  maximumAge: 0,
};

// Minimum distance moved (meters) before updating, keyed by lowercase mode title
const DISTANCE_THRESHOLDS: Record<string, number> = {
  walking: 15,
  bicycling: 30,
  driving: 75,
  transit: 15,
};
const DEFAULT_THRESHOLD = 15;

function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const useDeviceLocation = (tourSlug?: string) => {
  const [deviceLocation, setDeviceLocation] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);

  const { locationAllowed, realtimeLocation } = usePreferences();
  const lastPositionRef = useRef<google.maps.LatLngLiteral | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!locationAllowed) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        lastPositionRef.current = { lat: latitude, lng: longitude };
        setDeviceLocation({ lat: latitude, lng: longitude });
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
        const { latitude, longitude, accuracy } = position.coords;

        const modeTitle = tourSlug
          ? (localStorage.getItem(tourSlug) ?? "").toLowerCase()
          : "";
        const threshold = DISTANCE_THRESHOLDS[modeTitle] ?? DEFAULT_THRESHOLD;

        const last = lastPositionRef.current;
        if (last) {
          const moved = haversineMeters(last.lat, last.lng, latitude, longitude);
          if (moved < threshold) return;
        }

        lastPositionRef.current = { lat: latitude, lng: longitude };
        setDeviceLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.warn(error.message);
      },
      geoOpts,
    );

    return () => {
      navigator.geolocation.clearWatch(watcherId);
    };
  }, [realtimeLocation, tourSlug]);

  return { deviceLocation };
};
