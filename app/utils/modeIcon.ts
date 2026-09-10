import {
  faBicycle,
  faCar,
  faStop,
  faSubway,
  faWalking,
} from "@fortawesome/free-solid-svg-icons";
import type { TTravelModeTitle } from "~/types";

export const modeIcon = (mode: TTravelModeTitle) => {
  switch (mode) {
    case "BICYCLING":
      return faBicycle;
    case "DRIVING":
      return faCar;
    case "TRANSIT":
      return faSubway;
    case "WALKING":
      return faWalking;
    default:
      return faStop;
  }
};
