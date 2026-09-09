import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { resetPreferencesStore } from "~/hooks/usePreferences";
import { TourContext } from "~/contexts/TourContext";
import PermissionsModal from "./PermissionsModal";
import type { ReactNode } from "react";

vi.mock("~/hooks/deviceContext", () => ({
  useDeviceContext: () => ({ isMobile: true, isDesktop: false }),
}));

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

beforeEach(() => {
  mockStorage.clear();
  resetPreferencesStore();
  setShowPermissionsModal.mockClear();
  setShowMenu.mockClear();
});

const seed = (prefs: string[]) => {
  mockStorage.setItem("OpenTour", JSON.stringify(prefs));
  resetPreferencesStore();
};

const setShowPermissionsModal = vi.fn();
const setShowMenu = vi.fn();

const tourContextValue = {
  showPermissionsModal: true,
  setShowPermissionsModal,
  setShowMenu,
  tour: null,
  tour_set: null,
  currentStop: undefined,
  currentFlatPage: undefined,
  setCurrentStop: vi.fn(),
  setCurrentFlatPage: vi.fn(),
  showMenu: false,
  mapStyle: {} as never,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <TourContext.Provider value={tourContextValue}>{children}</TourContext.Provider>
);

const setup = () => render(<PermissionsModal />, { wrapper });

describe("PermissionsModal — rendering", () => {
  it("renders when showPermissionsModal is true", () => {
    setup();
    expect(screen.getByText("Cookie Notice")).toBeInTheDocument();
  });

  it("shows functional cookie switch as disabled (required)", () => {
    setup();
    expect(screen.getAllByRole("switch")[0]).toBeDisabled();
  });
});

describe("PermissionsModal — individual toggles", () => {
  it("toggling analyticsAllowed on persists to storage", async () => {
    setup();
    await userEvent.click(screen.getAllByRole("switch")[1]);
    expect(JSON.parse(mockStorage.getItem("OpenTour")!)).toContain("analyticsAllowed");
  });

  it("toggling analyticsAllowed off removes it from storage", async () => {
    seed(["functional", "analyticsAllowed"]);
    setup();
    await userEvent.click(screen.getAllByRole("switch")[1]);
    expect(JSON.parse(mockStorage.getItem("OpenTour")!)).not.toContain("analyticsAllowed");
  });
});

describe("PermissionsModal — dependsOn", () => {
  it("realtimeLocation switch is disabled when locationAllowed is off", () => {
    setup();
    // cookies order: functional, analyticsAllowed, gMaps, locationAllowed, realtimeLocation, thirdPartyEmbeds
    expect(screen.getAllByRole("switch")[4]).toBeDisabled();
  });

  it("realtimeLocation switch is enabled when locationAllowed is on", () => {
    seed(["functional", "locationAllowed"]);
    setup();
    expect(screen.getAllByRole("switch")[4]).not.toBeDisabled();
  });
});

describe("PermissionsModal — bulk actions", () => {
  it("Accept All enables all preferences and closes the modal", async () => {
    setup();
    await userEvent.click(screen.getByText("Accept All"));
    const stored = JSON.parse(mockStorage.getItem("OpenTour")!);
    expect(stored).toContain("analyticsAllowed");
    expect(stored).toContain("gMaps");
    expect(stored).toContain("locationAllowed");
    expect(stored).toContain("realtimeLocation");
    expect(stored).toContain("thirdPartyEmbeds");
    expect(setShowPermissionsModal).toHaveBeenCalledWith(false);
  });

  it("Decline Optional reduces preferences to functional and closes the modal", async () => {
    seed(["functional", "gMaps", "analyticsAllowed"]);
    setup();
    await userEvent.click(screen.getByText("Decline Optional"));
    expect(JSON.parse(mockStorage.getItem("OpenTour")!)).toEqual(["functional"]);
    expect(setShowPermissionsModal).toHaveBeenCalledWith(false);
  });

  it("Save Choices closes the modal without changing preferences", async () => {
    seed(["functional", "gMaps"]);
    setup();
    await userEvent.click(screen.getByText("Save Choices"));
    expect(setShowPermissionsModal).toHaveBeenCalledWith(false);
    expect(JSON.parse(mockStorage.getItem("OpenTour")!)).toContain("gMaps");
  });
});
