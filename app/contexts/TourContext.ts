import { createContext } from "react";
import type { TTour, TTourFlatPage, TTourStop } from "~/types/TTour";
import type { Dispatch, SetStateAction } from "react";
import type { StyleSpecification } from "maplibre-gl";
import { baseStyle } from "~/map_styles";

type Context = {
  tour: TTour | undefined;
  currentStop: TTourStop | undefined;
  setCurrentStop: Dispatch<SetStateAction<TTourStop | undefined>>;
  currentFlatPage: TTourFlatPage | string | undefined;
  setCurrentFlatPage: Dispatch<
    SetStateAction<TTourFlatPage | string | undefined>
  >;
  showMenu: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  mapStyle: StyleSpecification;
};

export const TourContext = createContext<Context>({
  tour: undefined,
  currentStop: undefined,
  showMenu: false,
  setShowMenu: (_: SetStateAction<boolean>) => {
    console.error("setShowMenu not implemented. Did you pass it to context?");
  },
  setCurrentStop: (_: SetStateAction<TTourStop | undefined>) => {
    console.error(
      "setCurrentStop not implemented. Did you pass it to context?",
    );
  },
  currentFlatPage: undefined,
  setCurrentFlatPage: (
    _: SetStateAction<TTourFlatPage | string | undefined>,
  ) => {
    console.error(
      "setCurrentStop not implemented. Did you pass it to context?",
    );
  },
  mapStyle: baseStyle,
});
