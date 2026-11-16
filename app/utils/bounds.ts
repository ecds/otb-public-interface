import type { TTour } from "~/types";

export type TBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

// The area to show for a list of tours: a single tour's own bounds, or the
// box around the centers of several. Plain numbers, so each map library can
// take it in its own coordinate order.
export const toursBounds = (tours: TTour[]): TBounds | undefined => {
  if (tours.length === 0) return undefined;
  if (tours.length === 1) {
    const { north, south, east, west } = tours[0].bounds;
    return { north, south, east, west };
  }

  const lats = tours.map((tour) => tour.bounds.centerLat);
  const lngs = tours.map((tour) => tour.bounds.centerLng);
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
};
