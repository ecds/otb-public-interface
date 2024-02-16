import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { TTourSet } from "~/types/TTourSet";
import type { TTour } from "~/types/TTour";
import type { TStop } from "~/types/TStop";
import type { TTourFlatPage } from "~/types/TTourFlatPage";

interface Context {
  currentSite: TTourSet | undefined;
  setCurrentSite: Dispatch<SetStateAction<TTourSet | undefined>>;
  currentTour: TTour | undefined;
  setCurrentTour: Dispatch<SetStateAction<TTour | undefined>>;
  currentStop: TStop | undefined;
  setCurrentStop: Dispatch<SetStateAction<TStop | undefined>>;
  currentFlatPage: TTourFlatPage | string | undefined;
  setCurrentFlatPage: Dispatch<
    SetStateAction<TTourFlatPage | string | undefined>
  >;
}

const TourSiteContext = createContext<Context>({
  currentSite: undefined,
  setCurrentSite: (_: SetStateAction<TTourSet | undefined>) => {
    console.error(
      "setCurrentSite not implemented. Did you pass it to context?"
    );
  },
  currentTour: undefined,
  setCurrentTour: (_: SetStateAction<TTour | undefined>) => {
    console.error(
      "setCurrentTour not implemented. Did you pass it to context?"
    );
  },
  currentStop: undefined,
  setCurrentStop: (_: SetStateAction<TStop | undefined>) => {
    console.error(
      "setCurrentStop not implemented. Did you pass it to context?"
    );
  },
  currentFlatPage: undefined,
  setCurrentFlatPage: (
    _: SetStateAction<TTourFlatPage | string | undefined>
  ) => {
    console.error(
      "setCurrentStop not implemented. Did you pass it to context?"
    );
  },
});

export default TourSiteContext;
