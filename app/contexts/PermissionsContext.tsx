import { createContext } from "react";

import type { Dispatch, SetStateAction } from "react";

type Context = {
  analyticsAllowed: boolean;
  setAnalyticsAllowed: Dispatch<SetStateAction<boolean>>;
  gMaps: boolean;
  setGMaps: Dispatch<SetStateAction<boolean>>;
  locationAllowed: boolean;
  setLocationAllowed: Dispatch<SetStateAction<boolean>>;
  realtimeLocation: boolean;
  setRealtimeLocation: Dispatch<SetStateAction<boolean>>;
  functional: boolean;
  setFunctional: Dispatch<SetStateAction<boolean>>;
  showPermissionsModal: boolean;
  setShowPermissionsModal: Dispatch<SetStateAction<boolean>>;
};

export const PermissionsContext = createContext<Context>({
  analyticsAllowed: false,
  setAnalyticsAllowed: (_: SetStateAction<boolean>) => {},
  gMaps: false,
  setGMaps: (_: SetStateAction<boolean>) => {},
  locationAllowed: false,
  setLocationAllowed: (_: SetStateAction<boolean>) => {},
  realtimeLocation: false,
  setRealtimeLocation: (_: SetStateAction<boolean>) => {},
  functional: false,
  setFunctional: (_: SetStateAction<boolean>) => {},
  showPermissionsModal: false,
  setShowPermissionsModal: (_: SetStateAction<boolean>) => {},
});
