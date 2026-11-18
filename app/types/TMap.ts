import type { ReactNode } from "react";
import type { TBounds } from "~/utils/bounds";

export type TMapMarker = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  popup: ReactNode;
  color?: string;
  icon?: string;
};

// What a map marker shows and does, whichever library draws it.
export type TMarkerOptions = {
  lat: number;
  lng: number;
  // The marker's accessible name.
  label: string;
  // A custom icon, centered on the spot. Without one, a pin points at it.
  image?: string;
  color?: string;
  // Numbers the pin.
  position?: number;
  current?: boolean;
  // Opens from the marker. Takes precedence over onActivate.
  popup?: ReactNode;
  popupId?: string;
  // What clicking the marker, or Enter or Space on it, does.
  onActivate?: () => void;
};

// Where the map starts. Only read when the map is created.
export type TMapView =
  | { bounds: TBounds }
  | { center: { lat: number; lng: number }; zoom: number };
