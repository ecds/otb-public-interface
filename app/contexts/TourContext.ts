import { createContext } from "react";
import { travelModes } from "~/mappings";
import type { TTour } from "~/types/TTour";
import type { TStop } from "~/types/TStop";
import type { TTourFlatPage } from "~/types/TTourFlatPage";
import type { Dispatch, SetStateAction } from "react";
import type { TTravelMode } from "~/types/TTravelMode";

type Context = {
  tour: TTour | undefined;
  theme: string;
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
  modes: (TTravelMode | undefined)[];
  defaultMode: TTravelMode;
  showMenu: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
};

export const TourContext = createContext<Context>({
  tour: undefined,
  currentStop: undefined,
  flatPages: undefined,
  showMenu: false,
  stops: undefined,
  theme: "default",
  modes: [],
  defaultMode: travelModes[1],
  setFlatPages: (_: SetStateAction<TTourFlatPage[] | undefined>) => {
    console.error("setFlatPages not implemented. Did you pass it to context?");
  },
  setShowMenu: (_: SetStateAction<boolean>) => {
    console.error("setShowMenu not implemented. Did you pass it to context?");
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
