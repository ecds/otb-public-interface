import { createContext } from "react";
import type { TTour, TTourFlatPage, TTourStop } from "~/types/TTour";
import type { Dispatch, SetStateAction } from "react";

type Context = {
  tour: TTour | undefined;
  currentStop: TTourStop | undefined;
  setFlatPages: Dispatch<SetStateAction<TTourFlatPage[] | undefined>>;
  setCurrentStop: Dispatch<SetStateAction<TTourStop | undefined>>;
  flatPages: TTourFlatPage[] | undefined;
  currentFlatPage: TTourFlatPage | string | undefined;
  setCurrentFlatPage: Dispatch<
    SetStateAction<TTourFlatPage | string | undefined>
  >;
  showMenu: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
};

export const TourContext = createContext<Context>({
  tour: undefined,
  currentStop: undefined,
  flatPages: undefined,
  showMenu: false,
  setFlatPages: (_: SetStateAction<TTourFlatPage[] | undefined>) => {
    console.error("setFlatPages not implemented. Did you pass it to context?");
  },
  setShowMenu: (_: SetStateAction<boolean>) => {
    console.error("setShowMenu not implemented. Did you pass it to context?");
  },
  setCurrentStop: (_: SetStateAction<TTourStop | undefined>) => {
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
