import { useCallback, useSyncExternalStore } from "react";
import {
  allPreferenceNames,
  getPreferences,
  savePreferences,
} from "~/utils/cookies";
import type { TPreferenceName } from "~/types";

// Module-level store — one instance for the entire app, no provider needed.
let snapshot: TPreferenceName[] = getPreferences();
let listeners: Set<() => void> = new Set();

const store = {
  subscribe: (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  getSnapshot: () => snapshot,
  set: (next: TPreferenceName[]) => {
    snapshot = next;
    savePreferences(next);
    listeners.forEach((callback) => callback());
  },
};

/** Resets the module-level store from localStorage — call in beforeEach in tests. */
export const resetPreferencesStore = () => {
  snapshot = getPreferences();
  listeners = new Set();
};

export const usePreferences = () => {
  const preferences = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getPreferences, // server snapshot (SSR)
  );

  const addPreference = useCallback((pref: TPreferenceName) => {
    store.set([...new Set([...store.getSnapshot(), pref])]);
  }, []);

  const removePreference = useCallback((pref: TPreferenceName) => {
    store.set(store.getSnapshot().filter((p) => p !== pref));
  }, []);

  const acceptAll = useCallback(() => {
    store.set(allPreferenceNames);
  }, []);

  const denyAll = useCallback(() => {
    store.set(["functional"]);
  }, []);

  const refresh = useCallback(() => {
    store.set(getPreferences());
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
