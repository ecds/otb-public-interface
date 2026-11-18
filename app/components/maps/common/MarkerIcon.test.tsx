import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MarkerIcon from "./MarkerIcon";

const loadImage = (img: HTMLImageElement, naturalWidth: number) => {
  Object.defineProperty(img, "naturalWidth", { value: naturalWidth });
  fireEvent.load(img);
};

describe("MarkerIcon", () => {
  it("draws a numbered pin without an image", () => {
    const { container } = render(<MarkerIcon position={3} />);
    expect(container.querySelector("img")).toBeNull();
    expect(container).toHaveTextContent("3");
  });

  it("shows a custom icon at half its size once it loads", () => {
    const { container } = render(<MarkerIcon image="/icon.png" />);
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("src", "/icon.png");
    expect(img.style.visibility).toBe("hidden");
    loadImage(img, 64);
    expect(img.style.width).toBe("32px");
    expect(img.style.visibility).toBe("visible");
  });

  it("enlarges the current stop's icon", () => {
    const { container } = render(<MarkerIcon image="/icon.png" current />);
    const img = container.querySelector("img")!;
    loadImage(img, 64);
    expect(img.style.width).toBe("48px");
  });
});
