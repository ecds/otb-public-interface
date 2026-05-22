import type { TTravelModeTitle } from "./TTravelMode";

export type TCookieName =
  | "functional"
  | "locationAllowed"
  | "realtimeLocation"
  | "gMaps"
  | "analyticsAllowed";

export type TCookie = TCookieName[] | TTravelModeTitle;
