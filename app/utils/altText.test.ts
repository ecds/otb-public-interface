import { describe, it, expect } from "vitest";
import { altFor } from "./altText";

describe("altFor", () => {
  it("uses the alt text", () => {
    expect(altFor({ alt_text: " The pulpit " })).toBe("The pulpit");
  });

  it("is empty for decorative images, even with alt text", () => {
    expect(altFor({ alt_text: "Texture", decorative: true })).toBe("");
  });

  it("is empty when nothing has been written", () => {
    expect(altFor({ alt_text: null })).toBe("");
    expect(altFor({})).toBe("");
  });
});
