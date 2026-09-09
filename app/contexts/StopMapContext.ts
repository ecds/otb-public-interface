import { createContext } from "react";
import { travelModes } from "~/mappings";
import type { Dispatch, SetStateAction } from "react";
import type { TTravelMode, TPreferenceName } from "~/types";

interface Context {
  travelMode: TTravelMode;
  stopLocation: google.maps.LatLngLiteral | undefined;
  parkingLocation: google.maps.LatLngLiteral | undefined;
  setTravelMode: Dispatch<SetStateAction<TTravelMode>>;
  gMaps: boolean;
  locationAllowed: boolean;
  realtimeLocation: boolean;
  addPreference: (pref: TPreferenceName) => void;
  removePreference: (pref: TPreferenceName) => void;
}

export const StopMapContext = createContext<Context>({
  travelMode: travelModes[1],
  stopLocation: undefined,
  parkingLocation: undefined,
  setTravelMode: (_: SetStateAction<TTravelMode>) => {
    console.error("setTravelMode not implemented. Did you pass it to context?");
  },
  gMaps: false,
  locationAllowed: false,
  realtimeLocation: false,
  addPreference: () => {},
  removePreference: () => {},
});
