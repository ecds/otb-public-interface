import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TourContext } from "~/contexts/TourContext";
import FlatPage from "./FlatPage";
import type { TTourFlatPage } from "~/types";

const page = {
  slug: "credits",
  title: "Credits",
  body: "<p>Thanks</p>",
} as TTourFlatPage;

const renderPage = (open: boolean, setCurrentFlatPage = vi.fn()) =>
  render(
    <TourContext.Provider
      value={{
        tour: undefined,
        showMenu: false,
        setShowMenu: vi.fn(),
        setCurrentFlatPage,
        setShowPermissionsModal: vi.fn(),
        currentStop: undefined,
        currentFlatPage: open ? page : undefined,
        setCurrentStop: vi.fn(),
        mapStyle: {} as never,
        showPermissionsModal: false,
      }}
    >
      <FlatPage flatPage={page} />
    </TourContext.Provider>,
  );

describe("FlatPage", () => {
  it("isn't in the page while closed", () => {
    renderPage(false);
    expect(screen.queryByText("Thanks")).toBeNull();
  });

  it("is a dialog named by its title, closed with Escape", async () => {
    const setCurrentFlatPage = vi.fn();
    renderPage(true, setCurrentFlatPage);
    expect(
      await screen.findByRole("dialog", { name: "Credits" }),
    ).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(setCurrentFlatPage).toHaveBeenCalledWith(undefined);
  });
});
