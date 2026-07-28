import { useCallback, useEffect, useState } from "react";
import type { TPreferenceName } from "~/types";

const STORAGE_KEY = "OpenTour";
const currentPrefs = () => {
  const currentPrefStr = localStorage.getItem(STORAGE_KEY);
  return currentPrefStr ? JSON.parse(currentPrefStr) : ["functional"];
};

export const usePreferences = () => {
  const [preferences, setPreferences] =
    useState<TPreferenceName[]>(currentPrefs());
  const [analyticsAllowed, setAnalyticsAllowed] = useState<boolean>(
    currentPrefs().includes("analyticsAllowed"),
  );
  const [gMaps, setGMaps] = useState<boolean>(currentPrefs().includes("gMaps"));
  const [locationAllowed, setLocationAllowed] = useState<boolean>(
    currentPrefs().includes("locationAllowed"),
  );
  const [realtimeLocation, setRealtimeLocation] = useState<boolean>(
    currentPrefs().includes("realtimeLocation"),
  );
  const [thirdPartyEmbeds, setThirdPartyEmbeds] = useState<boolean>(
    currentPrefs().includes("thirdPartyEmbeds"),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setAnalyticsAllowed(preferences.includes("analyticsAllowed"));
    setGMaps(preferences.includes("gMaps"));
    setLocationAllowed(preferences.includes("locationAllowed"));
    setRealtimeLocation(preferences.includes("realtimeLocation"));
    setThirdPartyEmbeds(preferences.includes("thirdPartyEmbeds"));
  }, [preferences]);

  const addPreference = (pref: TPreferenceName) => {
    setPreferences([...new Set([...currentPrefs(), pref])]);
  };

  const removePreference = (pref: TPreferenceName) => {
    setPreferences(
      currentPrefs().filter(
        (currentPref: TPreferenceName) => currentPref !== pref,
      ),
    );
  };

  const acceptAll = () => {
    setPreferences([
      "analyticsAllowed",
      "functional",
      "gMaps",
      "locationAllowed",
      "realtimeLocation",
      "thirdPartyEmbeds",
    ]);
  };

  const denyAll = () => {
    setPreferences(["functional"]);
  };

  const refresh = useCallback(() => setPreferences(currentPrefs()), []);

  return {
    preferences,
    addPreference,
    removePreference,
    acceptAll,
    denyAll,
    analyticsAllowed,
    gMaps,
    locationAllowed,
    realtimeLocation,
    refresh,
    thirdPartyEmbeds,
  };
};
