import { createContext } from "react";
import type { TTour } from "~/types/TTour";
import type { TStop } from "~/types/TStop";
import type { TTourFlatPage } from "~/types/TTourFlatPage";
import type { Dispatch, SetStateAction } from "react";

type Context = {
  tour: TTour | undefined;
  currentStop: TStop | undefined;
  stops: TStop[] | undefined;
  setFlatPages: Dispatch<SetStateAction<TTourFlatPage[] | undefined>>;
  setStops: Dispatch<SetStateAction<TStop[] | undefined>>;
  setCurrentStop: Dispatch<SetStateAction<TStop | undefined>>;
  flatPages: TTourFlatPage[] | undefined;
  currentFlatPage: TTourFlatPage | string | undefined;
  setCurrentFlatPage: Dispatch<
    SetStateAction<TTourFlatPage | string | undefined>
  >;
};

export const TourContext = createContext<Context>({
  tour: undefined,
  currentStop: undefined,
  flatPages: undefined,
  stops: undefined,
  setFlatPages: (_: SetStateAction<TTourFlatPage[] | undefined>) => {
    console.error("setFlatPages not implemented. Did you pass it to context?");
  },
  setStops: (_: SetStateAction<TStop[] | undefined>) => {
    console.error(
      "setCurrentStop not implemented. Did you pass it to context?"
    );
  },
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
