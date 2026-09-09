import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { usePreferences, resetPreferencesStore } from "./usePreferences";

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

// Clear storage and re-sync the module-level store before every test.
// Tests that pre-seed storage must call resetPreferencesStore() after seeding.
beforeEach(() => {
  mockStorage.clear();
  resetPreferencesStore();
});

const seed = (prefs: string[]) => {
  mockStorage.setItem("OpenTour", JSON.stringify(prefs));
  resetPreferencesStore();
};

describe("usePreferences — initial state", () => {
  it("defaults to ['functional'] when storage is empty", () => {
    const { result } = renderHook(() => usePreferences());
    expect(result.current.preferences).toEqual(["functional"]);
  });

  it("reads existing preferences from storage", () => {
    seed(["functional", "gMaps"]);
    const { result } = renderHook(() => usePreferences());
    expect(result.current.preferences).toEqual(["functional", "gMaps"]);
    expect(result.current.gMaps).toBe(true);
    expect(result.current.analyticsAllowed).toBe(false);
  });

  it("exposes correct boolean flags from stored preferences", () => {
    seed(["functional", "analyticsAllowed", "locationAllowed"]);
    const { result } = renderHook(() => usePreferences());
    expect(result.current.functional).toBe(true);
    expect(result.current.analyticsAllowed).toBe(true);
    expect(result.current.locationAllowed).toBe(true);
    expect(result.current.gMaps).toBe(false);
    expect(result.current.realtimeLocation).toBe(false);
    expect(result.current.thirdPartyEmbeds).toBe(false);
  });
});

describe("addPreference", () => {
  it("adds a preference to the list", () => {
    const { result } = renderHook(() => usePreferences());
    act(() => result.current.addPreference("gMaps"));
    expect(result.current.preferences).toContain("gMaps");
    expect(result.current.gMaps).toBe(true);
  });

  it("does not add duplicates", () => {
    seed(["functional", "gMaps"]);
    const { result } = renderHook(() => usePreferences());
    act(() => result.current.addPreference("gMaps"));
    expect(
      result.current.preferences.filter((p) => p === "gMaps"),
    ).toHaveLength(1);
  });

  it("persists to localStorage", () => {
    const { result } = renderHook(() => usePreferences());
    act(() => result.current.addPreference("analyticsAllowed"));
    const stored = JSON.parse(mockStorage.getItem("OpenTour")!);
    expect(stored).toContain("analyticsAllowed");
  });
});

describe("removePreference", () => {
  it("removes a preference from the list", () => {
    seed(["functional", "gMaps"]);
    const { result } = renderHook(() => usePreferences());
    act(() => result.current.removePreference("gMaps"));
    expect(result.current.preferences).not.toContain("gMaps");
    expect(result.current.gMaps).toBe(false);
  });

  it("is a no-op when the preference is not present", () => {
    const { result } = renderHook(() => usePreferences());
    act(() => result.current.removePreference("gMaps"));
    expect(result.current.preferences).toEqual(["functional"]);
  });

  it("persists to localStorage", () => {
    seed(["functional", "gMaps"]);
    const { result } = renderHook(() => usePreferences());
    act(() => result.current.removePreference("gMaps"));
    const stored = JSON.parse(mockStorage.getItem("OpenTour")!);
    expect(stored).not.toContain("gMaps");
  });
});

describe("acceptAll", () => {
  it("sets all known preference names", () => {
    const { result } = renderHook(() => usePreferences());
    act(() => result.current.acceptAll());
    expect(result.current.functional).toBe(true);
    expect(result.current.analyticsAllowed).toBe(true);
    expect(result.current.gMaps).toBe(true);
    expect(result.current.locationAllowed).toBe(true);
    expect(result.current.realtimeLocation).toBe(true);
    expect(result.current.thirdPartyEmbeds).toBe(true);
  });
});

describe("denyAll", () => {
  it("reduces preferences to only functional", () => {
    seed(["functional", "gMaps", "analyticsAllowed"]);
    const { result } = renderHook(() => usePreferences());
    act(() => result.current.denyAll());
    expect(result.current.preferences).toEqual(["functional"]);
    expect(result.current.functional).toBe(true);
    expect(result.current.gMaps).toBe(false);
    expect(result.current.analyticsAllowed).toBe(false);
  });
});

describe("refresh", () => {
  it("reloads preferences from localStorage when storage was written externally", () => {
    const { result } = renderHook(() => usePreferences());
    expect(result.current.gMaps).toBe(false);

    // Write directly to storage without going through store.set (simulates another tab)
    mockStorage.setItem("OpenTour", JSON.stringify(["functional", "gMaps"]));
    act(() => result.current.refresh());

    expect(result.current.gMaps).toBe(true);
  });
});
