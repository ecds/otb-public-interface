import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import MapNudge from "./MapNudge";

const setup = (gMaps: boolean, locationAllowed: boolean) => {
  const addPreference = vi.fn();
  render(
    <MapNudge
      gMaps={gMaps}
      locationAllowed={locationAllowed}
      addPreference={addPreference}
    />,
  );
  return { addPreference };
};

describe("MapNudge", () => {
  it("renders nothing when both gMaps and locationAllowed are true", () => {
    const { container } = render(
      <MapNudge gMaps={true} locationAllowed={true} addPreference={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows combined copy when both are disabled", () => {
    setup(false, false);
    expect(
      screen.getByText(/Enable Google Maps and share your location/),
    ).toBeInTheDocument();
  });

  it("shows location-only copy when only locationAllowed is false", () => {
    setup(true, false);
    expect(
      screen.getByText(/Share your location to get turn-by-turn directions/),
    ).toBeInTheDocument();
  });

  it("shows maps-only copy when only gMaps is false", () => {
    setup(false, true);
    expect(
      screen.getByText(/Enable Google Maps to see your route/),
    ).toBeInTheDocument();
  });

  it("enables both when neither is set", async () => {
    const { addPreference } = setup(false, false);
    await userEvent.click(screen.getByText("Enable"));
    expect(addPreference).toHaveBeenCalledWith("gMaps");
    expect(addPreference).toHaveBeenCalledWith("locationAllowed");
  });

  it("enables only locationAllowed when gMaps is already set", async () => {
    const { addPreference } = setup(true, false);
    await userEvent.click(screen.getByText("Enable"));
    expect(addPreference).not.toHaveBeenCalledWith("gMaps");
    expect(addPreference).toHaveBeenCalledWith("locationAllowed");
  });

  it("enables only gMaps when locationAllowed is already set", async () => {
    const { addPreference } = setup(false, true);
    await userEvent.click(screen.getByText("Enable"));
    expect(addPreference).toHaveBeenCalledWith("gMaps");
    expect(addPreference).not.toHaveBeenCalledWith("locationAllowed");
  });
});
