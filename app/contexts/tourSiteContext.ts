import { createContext } from "react";
import type { TTourSet } from "~/types/TTourSet";

interface Context {
  currentSite: TTourSet | undefined;
  tenant: string;
}

const TourSiteContext = createContext<Context>({
  currentSite: undefined,
  tenant: "",
});

export default TourSiteContext;
