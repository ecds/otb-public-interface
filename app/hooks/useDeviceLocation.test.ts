import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { resetPreferencesStore, usePreferences } from "./usePreferences";
import { useDeviceLocation } from "./deviceLocation";

const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: mockStorage });

const seed = (prefs: string[]) => {
  mockStorage.setItem("OpenTour", JSON.stringify(prefs));
  resetPreferencesStore();
};

beforeEach(() => {
  mockStorage.clear();
  resetPreferencesStore();
  vi.clearAllMocks();
});

const MOCK_POSITION: GeolocationPosition = {
  coords: {
    latitude: 33.749,
    longitude: -84.388,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
};

const WATCH_ID = 42;

let getCurrentPositionCallback: PositionCallback | undefined;
let watchPositionCallback: PositionCallback | undefined;
const clearWatch = vi.fn();

const mockGeolocation: Geolocation = {
  getCurrentPosition: vi.fn((success) => {
    getCurrentPositionCallback = success;
  }),
  watchPosition: vi.fn(() => {
    return WATCH_ID;
  }),
  clearWatch,
};

// watchPosition with callback capture needs to be set up per-test
beforeEach(() => {
  getCurrentPositionCallback = undefined;
  watchPositionCallback = undefined;
  (mockGeolocation.getCurrentPosition as ReturnType<typeof vi.fn>).mockImplementation(
    (success: PositionCallback) => { getCurrentPositionCallback = success; }
  );
  (mockGeolocation.watchPosition as ReturnType<typeof vi.fn>).mockImplementation(
    (success: PositionCallback) => { watchPositionCallback = success; return WATCH_ID; }
  );
});

Object.defineProperty(globalThis.navigator, "geolocation", {
  value: mockGeolocation,
  configurable: true,
});

describe("useDeviceLocation — locationAllowed", () => {
  it("does not call getCurrentPosition when locationAllowed is false", () => {
    renderHook(() => useDeviceLocation());
    expect(mockGeolocation.getCurrentPosition).not.toHaveBeenCalled();
  });

  it("calls getCurrentPosition when locationAllowed is true", () => {
    seed(["functional", "locationAllowed"]);
    renderHook(() => useDeviceLocation());
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledOnce();
  });

  it("sets deviceLocation when getCurrentPosition resolves", () => {
    seed(["functional", "locationAllowed"]);
    const { result } = renderHook(() => useDeviceLocation());

    expect(result.current.deviceLocation).toBeUndefined();

    act(() => getCurrentPositionCallback!(MOCK_POSITION));

    expect(result.current.deviceLocation).toEqual({ lat: 33.749, lng: -84.388 });
  });

  it("does not call getCurrentPosition again on unrelated re-renders", () => {
    seed(["functional", "locationAllowed"]);
    const { rerender } = renderHook(() => useDeviceLocation());
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledOnce();
    rerender();
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledOnce();
  });
});

describe("useDeviceLocation — realtimeLocation", () => {
  it("does not start watchPosition when realtimeLocation is false", () => {
    seed(["functional", "locationAllowed"]);
    renderHook(() => useDeviceLocation());
    expect(mockGeolocation.watchPosition).not.toHaveBeenCalled();
  });

  it("starts watchPosition when realtimeLocation is true", () => {
    seed(["functional", "locationAllowed", "realtimeLocation"]);
    renderHook(() => useDeviceLocation());
    expect(mockGeolocation.watchPosition).toHaveBeenCalledOnce();
  });

  it("updates deviceLocation on each watchPosition callback", () => {
    seed(["functional", "locationAllowed", "realtimeLocation"]);
    const { result } = renderHook(() => useDeviceLocation());

    act(() => watchPositionCallback!(MOCK_POSITION));
    expect(result.current.deviceLocation).toEqual({ lat: 33.749, lng: -84.388 });

    const updated: GeolocationPosition = {
      ...MOCK_POSITION,
      coords: { ...MOCK_POSITION.coords, latitude: 33.75, longitude: -84.39 },
    };
    act(() => watchPositionCallback!(updated));
    expect(result.current.deviceLocation).toEqual({ lat: 33.75, lng: -84.39 });
  });

  it("calls clearWatch with the correct id on unmount", () => {
    seed(["functional", "locationAllowed", "realtimeLocation"]);
    const { unmount } = renderHook(() => useDeviceLocation());
    unmount();
    expect(clearWatch).toHaveBeenCalledWith(WATCH_ID);
  });

  it("calls clearWatch when realtimeLocation is removed", () => {
    seed(["functional", "locationAllowed", "realtimeLocation"]);
    const { result } = renderHook(() => ({
      location: useDeviceLocation(),
      prefs: usePreferences(),
    }));

    expect(mockGeolocation.watchPosition).toHaveBeenCalledOnce();

    act(() => result.current.prefs.removePreference("realtimeLocation"));

    expect(clearWatch).toHaveBeenCalledWith(WATCH_ID);
  });
});
