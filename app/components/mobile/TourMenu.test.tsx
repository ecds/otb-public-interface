import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { TourContext } from "~/contexts/TourContext";
import TourMenu from "./TourMenu";
import type { TTour } from "~/types";

vi.mock("~/hooks/deviceContext", () => ({
  useDeviceContext: () => ({ isDesktop: false, isMobile: true }),
}));

const tour = { slug: "town", flat_pages: [] } as unknown as TTour;

const Harness = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <MemoryRouter>
      <TourContext.Provider
        value={{
          tour,
          showMenu,
          setShowMenu,
          setCurrentFlatPage: vi.fn(),
          setShowPermissionsModal: vi.fn(),
          currentStop: undefined,
          currentFlatPage: undefined,
          setCurrentStop: vi.fn(),
          mapStyle: {} as never,
          showPermissionsModal: false,
        }}
      >
        <TourMenu />
      </TourContext.Provider>
    </MemoryRouter>
  );
};

describe("TourMenu", () => {
  it("keeps its links out of reach while closed", () => {
    render(<Harness />);
    expect(screen.queryByRole("link", { name: "All Tours" })).toBeNull();
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens as a dialog and closes on Escape, back to the menu button", async () => {
    render(<Harness />);
    const menuButton = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(menuButton);
    expect(await screen.findByRole("dialog", { name: "Menu" })).toBeVisible();
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("links Tour Home to the tour", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(
      await screen.findByRole("link", { name: "Tour Home" }),
    ).toHaveAttribute("href", "/town/intro");
  });
});
