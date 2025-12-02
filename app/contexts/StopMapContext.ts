import { createContext } from "react";
import { travelModes } from "~/mappings";
import type { TTravelMode } from "~/types/TTravelMode";
import type { Dispatch, SetStateAction } from "react";

interface Context {
  travelMode: TTravelMode;
  deviceLocation: google.maps.LatLngLiteral | undefined;
  stopLocation: google.maps.LatLngLiteral | undefined;
  parkingLocation: google.maps.LatLngLiteral | undefined;
  setSelectedTravelMode: Dispatch<SetStateAction<TTravelMode | undefined>>;
}

export const StopMapContext = createContext<Context>({
  travelMode: travelModes[1],
  deviceLocation: undefined,
  stopLocation: undefined,
  parkingLocation: undefined,
  setSelectedTravelMode: (_: SetStateAction<TTravelMode | undefined>) => {
    console.error(
      "setSelectedTravelMode not implemented. Did you pass it to context?"
    );
  },
});
