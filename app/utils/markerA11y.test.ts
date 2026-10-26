import { describe, expect, it, vi } from "vitest";
import { activateOnKeys, labelMarker } from "./markerA11y";

describe("markerA11y", () => {
  it("names a marker as a button", () => {
    const element = document.createElement("div");
    labelMarker(element, "Stop 2: Old Church");
    expect(element).toHaveAttribute("role", "button");
    expect(element).toHaveAttribute("aria-label", "Stop 2: Old Church");
  });

  it("makes a marker without a popup focusable and activates it with Enter or Space", () => {
    const element = document.createElement("div");
    const onActivate = vi.fn();
    const cleanUp = activateOnKeys(element, onActivate);
    expect(element.tabIndex).toBe(0);

    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    const space = new KeyboardEvent("keydown", { key: " ", cancelable: true });
    element.dispatchEvent(space);
    expect(onActivate).toHaveBeenCalledTimes(2);
    expect(space.defaultPrevented).toBe(true);

    cleanUp();
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(onActivate).toHaveBeenCalledTimes(2);
  });
});
