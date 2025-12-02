import {
  faBicycle,
  faCar,
  faSubway,
  faWalking,
} from "@fortawesome/free-solid-svg-icons";
import type { TTravelMode } from "./types/TTravelMode";

export const themes = [
  {
    id: "1",
    title: "default",
  },
  {
    id: "2",
    title: "blue",
  },
  {
    id: "3",
    title: "atl",
  },
  {
    id: "4",
    title: "red",
  },
  {
    id: "5",
    title: "dark-blue",
  },
  {
    id: "6",
    title: "purple",
  },
  {
    id: "7",
    title: "green",
  },
  {
    id: "8",
    title: "orange",
  },
  {
    id: "9",
    title: "dark-green",
  },
  {
    id: "10",
    title: "austrian",
  },
  {
    id: "11",
    title: "emory",
  },
  {
    id: "12",
    title: "gsu",
  },
  {
    id: "13",
    title: "gatech",
  },
  {
    id: "14",
    title: "uga",
  },
  {
    id: "15",
    title: "ksu",
  },
];

export const travelModes: TTravelMode[] = [
  {
    id: "1",
    title: "BICYCLING",
    icon: faBicycle,
  },
  {
    id: "2",
    title: "DRIVING",
    icon: faCar,
  },
  {
    id: "3",
    title: "TRANSIT",
    icon: faSubway,
  },
  {
    id: "4",
    title: "WALKING",
    icon: faWalking,
  },
];
