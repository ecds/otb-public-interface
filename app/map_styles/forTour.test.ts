import { describe, expect, it } from "vitest";
import { baseStyle, blank, hybrid, satellite } from "~/map_styles";
import { styleFor } from "./forTour";

describe("styleFor", () => {
  it("matches the tour's map type", () => {
    expect(styleFor({ map_type: "road", blank_map: false })).toBe(baseStyle);
    expect(styleFor({ map_type: "satellite", blank_map: false })).toBe(
      satellite,
    );
    expect(styleFor({ map_type: "hybrid", blank_map: false })).toBe(hybrid);
  });

  it("uses the blank style for a blank map, whatever the type", () => {
    expect(styleFor({ map_type: "satellite", blank_map: true })).toBe(blank);
  });
});
