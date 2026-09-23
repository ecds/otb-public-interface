import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDeviceLocation } from "./deviceLocation";
import { resetPreferencesStore, usePreferences } from "./usePreferences";

const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
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

const MOCK_POSITION = {
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
} as unknown as GeolocationPosition;

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
  (
    mockGeolocation.getCurrentPosition as ReturnType<typeof vi.fn>
  ).mockImplementation((success: PositionCallback) => {
    getCurrentPositionCallback = success;
  });
  (
    mockGeolocation.watchPosition as ReturnType<typeof vi.fn>
  ).mockImplementation((success: PositionCallback) => {
    watchPositionCallback = success;
    return WATCH_ID;
  });
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

    expect(result.current.deviceLocation).toEqual({
      lat: 33.749,
      lng: -84.388,
    });
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
    expect(result.current.deviceLocation).toEqual({
      lat: 33.749,
      lng: -84.388,
    });

    const updated = {
      ...MOCK_POSITION,
      coords: { ...MOCK_POSITION.coords, latitude: 33.75, longitude: -84.39 },
    } as unknown as GeolocationPosition;
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

// 1 degree of latitude ≈ 111,320 m; used to build positions at known distances.
const latOffset = (meters: number) => meters / 111_320;

const positionAt = (lat: number, lng: number, accuracy = 5) =>
  ({
    coords: { latitude: lat, longitude: lng, accuracy, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
    timestamp: Date.now(),
  }) as unknown as GeolocationPosition;

describe("useDeviceLocation — distance throttling", () => {
  const BASE_LAT = 33.749;
  const BASE_LNG = -84.388;
  const TOUR_SLUG = "my-tour";

  it("accepts first watchPosition callback with no prior position", () => {
    seed(["functional", "locationAllowed", "realtimeLocation"]);
    mockStorage.setItem(TOUR_SLUG, "WALKING");
    const { result } = renderHook(() => useDeviceLocation(TOUR_SLUG));

    act(() => watchPositionCallback!(positionAt(BASE_LAT, BASE_LNG)));
    expect(result.current.deviceLocation).toEqual({
      lat: BASE_LAT,
      lng: BASE_LNG,
    });
  });

  it("suppresses update when movement is below walking threshold (15 m)", () => {
    seed(["functional", "locationAllowed", "realtimeLocation"]);
    mockStorage.setItem(TOUR_SLUG, "WALKING");
    const { result } = renderHook(() => useDeviceLocation(TOUR_SLUG));

    act(() => watchPositionCallback!(positionAt(BASE_LAT, BASE_LNG)));
    // Move ~10 m north — below 15 m threshold
    const near = positionAt(BASE_LAT + latOffset(10), BASE_LNG);
    act(() => watchPositionCallback!(near));

    expect(result.current.deviceLocation).toEqual({
      lat: BASE_LAT,
      lng: BASE_LNG,
    });
  });

  it("accepts update when movement exceeds walking threshold (15 m)", () => {
    seed(["functional", "locationAllowed", "realtimeLocation"]);
    mockStorage.setItem(TOUR_SLUG, "WALKING");
    const { result } = renderHook(() => useDeviceLocation(TOUR_SLUG));

    act(() => watchPositionCallback!(positionAt(BASE_LAT, BASE_LNG)));
    // Move ~20 m north — above 15 m threshold
    const far = positionAt(BASE_LAT + latOffset(20), BASE_LNG);
    act(() => watchPositionCallback!(far));

    expect(result.current.deviceLocation).toEqual({
      lat: BASE_LAT + latOffset(20),
      lng: BASE_LNG,
    });
  });

  it("uses a larger threshold for driving (75 m)", () => {
    seed(["functional", "locationAllowed", "realtimeLocation"]);
    mockStorage.setItem(TOUR_SLUG, "DRIVING");
    const { result } = renderHook(() => useDeviceLocation(TOUR_SLUG));

    act(() => watchPositionCallback!(positionAt(BASE_LAT, BASE_LNG)));
    // Move ~50 m — above walking threshold but below driving threshold
    const mid = positionAt(BASE_LAT + latOffset(50), BASE_LNG);
    act(() => watchPositionCallback!(mid));
    expect(result.current.deviceLocation).toEqual({
      lat: BASE_LAT,
      lng: BASE_LNG,
    });

    // Move ~100 m from origin — above driving threshold
    const far = positionAt(BASE_LAT + latOffset(100), BASE_LNG);
    act(() => watchPositionCallback!(far));
    expect(result.current.deviceLocation).toEqual({
      lat: BASE_LAT + latOffset(100),
      lng: BASE_LNG,
    });
  });

  it("mode title matching is case-insensitive", () => {
    seed(["functional", "locationAllowed", "realtimeLocation"]);
    // localStorage stores uppercase titles (e.g. "BICYCLING")
    mockStorage.setItem(TOUR_SLUG, "BICYCLING");
    const { result } = renderHook(() => useDeviceLocation(TOUR_SLUG));

    act(() => watchPositionCallback!(positionAt(BASE_LAT, BASE_LNG)));
    // Move ~20 m — above walking (15 m) but below bicycling (30 m)
    const mid = positionAt(BASE_LAT + latOffset(20), BASE_LNG);
    act(() => watchPositionCallback!(mid));
    expect(result.current.deviceLocation).toEqual({
      lat: BASE_LAT,
      lng: BASE_LNG,
    });
  });

  it("suppresses update when GPS accuracy exceeds the threshold", () => {
    seed(["functional", "locationAllowed", "realtimeLocation"]);
    mockStorage.setItem(TOUR_SLUG, "WALKING");
    const { result } = renderHook(() => useDeviceLocation(TOUR_SLUG));

    // accuracy=20 > walking threshold of 15 — should be ignored
    act(() => watchPositionCallback!(positionAt(BASE_LAT, BASE_LNG, 20)));
    expect(result.current.deviceLocation).toBeUndefined();
  });

  it("falls back to default threshold (15 m) when no tourSlug is provided", () => {
    seed(["functional", "locationAllowed", "realtimeLocation"]);
    const { result } = renderHook(() => useDeviceLocation());

    act(() => watchPositionCallback!(positionAt(BASE_LAT, BASE_LNG)));
    // Move ~10 m — below 15 m default
    const near = positionAt(BASE_LAT + latOffset(10), BASE_LNG);
    act(() => watchPositionCallback!(near));
    expect(result.current.deviceLocation).toEqual({
      lat: BASE_LAT,
      lng: BASE_LNG,
    });
  });
});
