import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Medium, { mediumLabel } from "./Medium";
import type { TTourMedium } from "~/types";

vi.mock("~/hooks/deviceContext", () => ({
  useDeviceContext: () => ({ isMobile: false, isDesktop: true }),
}));

class FakeImage {
  static instances: FakeImage[] = [];
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  complete = false;
  src = "";
  constructor() {
    FakeImage.instances.push(this);
  }
}

const medium = {
  title: "Garden",
  filename: "garden.jpg",
  caption: "A garden",
  files: {
    lqip: "/lqip.jpg",
    mobile: "/m.jpg",
    tablet: "/t.jpg",
    desktop: "/d.jpg",
  },
} as unknown as TTourMedium;

const button = () => screen.getByRole("button");

describe("Medium", () => {
  beforeEach(() => {
    FakeImage.instances = [];
    vi.stubGlobal("Image", FakeImage);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("shows a pulsing placeholder with the blurred lqip while loading", () => {
    render(<Medium medium={medium} />);
    const placeholder = screen.getByTestId("medium-placeholder");
    expect(placeholder.className).toContain("animate-pulse");
    expect(placeholder.innerHTML).toContain("/lqip.jpg");
    expect(button().className).toContain("opacity-0");
  });

  it("preloads the desktop image", () => {
    render(<Medium medium={medium} />);
    expect(FakeImage.instances.at(-1)?.src).toBe("/d.jpg");
  });

  it("fades the image in and drops the placeholder once loaded", () => {
    render(<Medium medium={medium} />);
    act(() => FakeImage.instances.at(-1)?.onload?.());
    expect(screen.queryByTestId("medium-placeholder")).not.toBeInTheDocument();
    expect(button().className).toContain("opacity-100");
  });

  it("stops showing the placeholder if the image fails", () => {
    render(<Medium medium={medium} />);
    act(() => FakeImage.instances.at(-1)?.onerror?.());
    expect(screen.queryByTestId("medium-placeholder")).not.toBeInTheDocument();
  });

  it("treats an already-cached image as loaded", () => {
    class CachedImage extends FakeImage {
      complete = true;
    }
    vi.stubGlobal("Image", CachedImage);
    render(<Medium medium={medium} />);
    expect(screen.queryByTestId("medium-placeholder")).not.toBeInTheDocument();
  });

  it("prefers the inline lqip data URI when the API sends one", () => {
    render(
      <Medium
        medium={{ ...medium, lqip_data: "data:image/jpeg;base64,AAAA" }}
      />,
    );
    const placeholder = screen.getByTestId("medium-placeholder");
    expect(placeholder.innerHTML).toContain("data:image/jpeg;base64,AAAA");
    expect(placeholder.innerHTML).not.toContain("/lqip.jpg");
  });
});

describe("mediumLabel", () => {
  it("names the image, its place in the gallery, and what it shows", () => {
    expect(
      mediumLabel({ ...medium, alt_text: "Roses by the gate" }, 1, 5),
    ).toBe("View image 2 of 5: Garden. Roses by the gate");
  });

  it("leaves out a title that's only the filename, and the count for one", () => {
    expect(
      mediumLabel({ ...medium, title: "garden.jpg", decorative: true }, 0, 1),
    ).toBe("View image");
  });

  it("says video for videos", () => {
    expect(mediumLabel({ ...medium, video: "/v.mp4" }, 0, 2)).toBe(
      "View video 1 of 2: Garden",
    );
  });
});
