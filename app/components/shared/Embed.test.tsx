import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Embed from "./Embed";
import type { TTourMedium } from "~/types";

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

// about:blank prevents happy-dom from making a network request when rendering the iframe
const EMBED_SRC = "about:blank";

const medium = (embed?: string): TTourMedium => ({
  caption: "Test caption",
  desktop_width: 1200,
  embed,
  filename: "test.mp4",
  files: {
    lqip: "lqip.jpg",
    mobile: "mobile.jpg",
    tablet: "tablet.jpg",
    desktop: "desktop.jpg",
  },
});

describe("Embed — thirdPartyEmbeds not set", () => {
  it("shows the consent nudge", () => {
    render(<Embed medium={medium(EMBED_SRC)} />);
    expect(
      screen.getByText(/This content is hosted by a third party/),
    ).toBeInTheDocument();
    expect(screen.getByText("View Embedded Content")).toBeInTheDocument();
  });

  it("does not render an iframe", () => {
    render(<Embed medium={medium(EMBED_SRC)} />);
    expect(screen.queryByTitle("desktop.jpg")).not.toBeInTheDocument();
  });

  it("enabling thirdPartyEmbeds persists the preference", async () => {
    render(<Embed medium={medium(EMBED_SRC)} />);
    await userEvent.click(screen.getByText("View Embedded Content"));
    const stored = JSON.parse(mockStorage.getItem("OpenTour")!);
    expect(stored).toContain("thirdPartyEmbeds");
  });
});

describe("Embed — thirdPartyEmbeds granted", () => {
  beforeEach(() => {
    mockStorage.setItem(
      "OpenTour",
      JSON.stringify(["functional", "thirdPartyEmbeds"]),
    );
  });

  it("renders an iframe when embed url is present", () => {
    render(<Embed medium={medium(EMBED_SRC)} />);
    const iframe = screen.getByTitle("desktop.jpg");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", EMBED_SRC);
  });

  it("renders nothing when embed url is absent", () => {
    const { container } = render(<Embed medium={medium(undefined)} />);
    expect(container).toBeEmptyDOMElement();
  });
});
