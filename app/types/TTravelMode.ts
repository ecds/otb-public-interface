export type TTravelModeTitle = "BICYCLING" | "DRIVING" | "TRANSIT" | "WALKING";

export type TTravelMode = {
  title: TTravelModeTitle;
  icon: "bicycle" | "car" | "subway" | "walking";
  default: boolean;
};
