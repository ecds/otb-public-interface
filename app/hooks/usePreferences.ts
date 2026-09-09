import { useCallback, useEffect, useState } from "react";
import { allPreferenceNames, getPreferences, savePreferences } from "~/utils/cookies";
import type { TPreferenceName } from "~/types";

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<TPreferenceName[]>(getPreferences);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const addPreference = useCallback((pref: TPreferenceName) => {
    setPreferences((prev) => [...new Set([...prev, pref])]);
  }, []);

  const removePreference = useCallback((pref: TPreferenceName) => {
    setPreferences((prev) => prev.filter((p) => p !== pref));
  }, []);

  const acceptAll = useCallback(() => {
    setPreferences(allPreferenceNames);
  }, []);

  const denyAll = useCallback(() => {
    setPreferences(["functional"]);
  }, []);

  const refresh = useCallback(() => {
    setPreferences(getPreferences());
  }, []);

  return {
    preferences,
    addPreference,
    removePreference,
    acceptAll,
    denyAll,
    refresh,
    functional: preferences.includes("functional"),
    analyticsAllowed: preferences.includes("analyticsAllowed"),
    gMaps: preferences.includes("gMaps"),
    locationAllowed: preferences.includes("locationAllowed"),
    realtimeLocation: preferences.includes("realtimeLocation"),
    thirdPartyEmbeds: preferences.includes("thirdPartyEmbeds"),
  };
};
