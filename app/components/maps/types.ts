import type { ReactNode } from "react";
import type { TBounds } from "~/utils/bounds";

export type TMapMarker = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  popup: ReactNode;
};

// Where the map starts. Only read when the map is created.
export type TMapView =
  | { bounds: TBounds }
  | { center: { lat: number; lng: number }; zoom: number };
