import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getPreferences,
  savePreferences,
  hasSetPreferences,
  cookies,
  allPreferenceNames,
} from "./cookies";

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

beforeEach(() => mockStorage.clear());

describe("getPreferences", () => {
  it("returns ['functional'] when storage is empty", () => {
    expect(getPreferences()).toEqual(["functional"]);
  });

  it("returns stored preferences when present", () => {
    mockStorage.setItem("OpenTour", JSON.stringify(["functional", "gMaps"]));
    expect(getPreferences()).toEqual(["functional", "gMaps"]);
  });

  it("returns ['functional'] when stored value is malformed JSON", () => {
    mockStorage.setItem("OpenTour", "not-json{{{");
    expect(getPreferences()).toEqual(["functional"]);
  });

  it("warns and returns ['functional'] when localStorage throws", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(mockStorage, "getItem").mockImplementationOnce(() => {
      throw new Error("SecurityError");
    });
    expect(getPreferences()).toEqual(["functional"]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("savePreferences", () => {
  it("writes the list to localStorage and returns it", () => {
    const prefs = ["functional", "analyticsAllowed"] as const;
    const result = savePreferences([...prefs]);
    expect(result).toEqual([...prefs]);
    expect(JSON.parse(mockStorage.getItem("OpenTour")!)).toEqual([...prefs]);
  });

  it("warns when localStorage throws", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(mockStorage, "setItem").mockImplementationOnce(() => {
      throw new Error("QuotaExceeded");
    });
    savePreferences(["functional"]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("cookies", () => {
  it("every cookie has an id, label, required, and description", () => {
    for (const cookie of cookies) {
      expect(cookie.id).toBeTruthy();
      expect(cookie.label).toBeTruthy();
      expect(typeof cookie.required).toBe("boolean");
      expect(cookie.description).toBeTruthy();
    }
  });

  it("only functional is required", () => {
    const required = cookies.filter((c) => c.required).map((c) => c.id);
    expect(required).toEqual(["functional"]);
  });

  it("realtimeLocation depends on locationAllowed", () => {
    const rt = cookies.find((c) => c.id === "realtimeLocation");
    expect(rt?.dependsOn).toBe("locationAllowed");
  });
});

describe("hasSetPreferences", () => {
  it("returns false when storage is empty", () => {
    expect(hasSetPreferences()).toBe(false);
  });

  it("returns true after preferences have been saved", () => {
    mockStorage.setItem("OpenTour", JSON.stringify(["functional"]));
    expect(hasSetPreferences()).toBe(true);
  });

  it("returns false when localStorage throws", () => {
    vi.spyOn(mockStorage, "getItem").mockImplementationOnce(() => {
      throw new Error("SecurityError");
    });
    expect(hasSetPreferences()).toBe(false);
  });
});

describe("allPreferenceNames", () => {
  it("contains every cookie id", () => {
    const ids = cookies.map((c) => c.id);
    expect(allPreferenceNames).toEqual(ids);
  });
});
