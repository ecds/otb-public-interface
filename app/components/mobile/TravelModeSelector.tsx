import {
  faBicycle,
  faCar,
  faStop,
  faSubway,
  faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useContext, useEffect } from "react";
import { StopMapContext } from "~/contexts/StopMapContext";
import { TourContext } from "~/contexts/TourContext";
import type { TTravelModeTitle } from "~/types";

const modeIcon = (mode: TTravelModeTitle) => {
  switch (mode) {
    case "BICYCLING":
      return faBicycle;
    case "DRIVING":
      return faCar;
    case "TRANSIT":
      return faSubway;
    case "WALKING":
      return faWalking;
    default:
      return faStop;
  }
};

const TravelModeSelector = () => {
  const { tour } = useContext(TourContext);
  const { travelMode, setTravelMode } = useContext(StopMapContext);

  useEffect(() => {
    if (!tour) return;
    localStorage.setItem(tour.slug, travelMode.title);
  }, [tour, travelMode]);

  if (!tour || !tour.modes) return <></>;

  return (
    <div className="m-6 p-2 bg-black/45 rounded-md text-white text-lg">
      <Listbox value={travelMode} onChange={setTravelMode}>
        <ListboxButton>
          <FontAwesomeIcon icon={modeIcon(travelMode.title)} />{" "}
          {travelMode.title}
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className="bg-white text-black/75 tracking-wider drop-shadow-2xl p-2 pe-6 mt-3 ms-2"
        >
          {tour.modes.map((mode) => {
            if (mode) {
              return (
                <ListboxOption key={mode.title} value={mode}>
                  <FontAwesomeIcon icon={modeIcon(mode.title)} /> {mode.title}
                </ListboxOption>
              );
            }
          })}
        </ListboxOptions>
      </Listbox>
    </div>
  );
};

export default TravelModeSelector;
