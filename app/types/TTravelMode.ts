import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export type TTravelModeTitle = "BICYCLING" | "DRIVING" | "TRANSIT" | "WALKING";

export type TTravelMode = {
  id: string;
  title: TTravelModeTitle;
  icon: IconDefinition;
};
