import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export type TTravelModeTitle = "BICYCLING" | "DRIVING" | "TRANSIT" | "WALKING";

export type TTravelMode = {
  title: TTravelModeTitle;
  icon: IconDefinition;
  default?: boolean;
  id?: number;
};
