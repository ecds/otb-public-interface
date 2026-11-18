import { baseStyle } from "./base";
import { blank } from "./blank";
import { hybrid } from "./hybrid";
import { satellite } from "./satellite";
import type { StyleSpecification } from "maplibre-gl";
import type { TTour } from "~/types";

// The MapLibre style for a tour's map type. A blank map hides the base map
// whatever the type.
export const styleFor = (
  tour: Pick<TTour, "map_type" | "blank_map">,
): StyleSpecification => {
  if (tour.blank_map) return blank;
  if (tour.map_type === "satellite") return satellite;
  if (tour.map_type === "hybrid") return hybrid as StyleSpecification;
  return baseStyle;
};
