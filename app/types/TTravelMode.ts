export type TTravelModeTitle = "BICYCLING" | "DRIVING" | "TRANSIT" | "WALKING";

export type TTravelMode = {
  title: TTravelModeTitle;
  default?: boolean;
  id?: number;
};
