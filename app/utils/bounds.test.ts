import { describe, expect, it } from "vitest";
import { toursBounds } from "./bounds";
import type { TTour } from "~/types";

const tour = (centerLat: number, centerLng: number) =>
  ({
    bounds: {
      north: centerLat + 1,
      south: centerLat - 1,
      east: centerLng + 1,
      west: centerLng - 1,
      centerLat,
      centerLng,
    },
  }) as TTour;

describe("toursBounds", () => {
  it("is undefined without tours", () => {
    expect(toursBounds([])).toBeUndefined();
  });

  it("uses a single tour's own bounds", () => {
    expect(toursBounds([tour(33.7, -84.4)])).toEqual({
      north: 34.7,
      south: 32.7,
      east: -83.4,
      west: -85.4,
    });
  });

  it("covers the centers of several tours", () => {
    expect(
      toursBounds([tour(33.7, -84.4), tour(32.1, -81.1), tour(34.5, -83.9)]),
    ).toEqual({ north: 34.5, south: 32.1, east: -81.1, west: -84.4 });
  });
});
