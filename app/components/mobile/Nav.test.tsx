import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { TourContext } from "~/contexts/TourContext";
import MobileNav from "./Nav";
import type { TTour, TTourStop } from "~/types";

const tour = { slug: "town", theme: { id: 1, title: "default" } } as TTour;

const renderNav = (currentStop: Partial<TTourStop>) =>
  render(
    <MemoryRouter>
      <TourContext.Provider
        value={{
          tour,
          currentStop: currentStop as TTourStop,
          showMenu: false,
          setShowMenu: vi.fn(),
          setCurrentFlatPage: vi.fn(),
          setShowPermissionsModal: vi.fn(),
          currentFlatPage: undefined,
          setCurrentStop: vi.fn(),
          mapStyle: {} as never,
          showPermissionsModal: false,
        }}
      >
        <MobileNav />
      </TourContext.Provider>
    </MemoryRouter>,
  );

describe("MobileNav", () => {
  it("has no Prev link at the first stop", () => {
    renderNav({
      slug: "church",
      next: { id: 2, slug: "school", title: "School" },
    });
    expect(screen.queryByRole("link", { name: /prev/i })).toBeNull();
    expect(screen.getByText("Prev").closest("[aria-disabled]")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute(
      "href",
      "/town/school/intro",
    );
  });

  it("has no Next link at the last stop", () => {
    renderNav({
      slug: "school",
      previous: { id: 1, slug: "church", title: "Church" },
    });
    expect(screen.queryByRole("link", { name: /next/i })).toBeNull();
    expect(screen.getByRole("link", { name: /prev/i })).toHaveAttribute(
      "href",
      "/town/church/intro",
    );
  });
});
