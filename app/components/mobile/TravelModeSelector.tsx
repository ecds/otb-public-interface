import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useContext } from "react";
import { StopMapContext } from "~/contexts/StopMapContext";
import { TourContext } from "~/contexts/TourContext";

const TravelModeSelector = () => {
  const { modes } = useContext(TourContext);
  const { travelMode, setSelectedTravelMode } = useContext(StopMapContext);

  return (
    <div className="m-6 p-2 bg-black/45 rounded-md text-white text-lg">
      <Listbox value={travelMode} onChange={setSelectedTravelMode}>
        <ListboxButton>
          <FontAwesomeIcon icon={travelMode.icon} /> {travelMode.title}
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className="bg-white text-black/75 tracking-wider drop-shadow-2xl p-2 pe-6 mt-3 ms-2"
        >
          {modes.map((mode) => {
            if (mode) {
              return (
                <ListboxOption key={mode.title} value={mode}>
                  <FontAwesomeIcon icon={mode.icon} /> {mode.title}
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
