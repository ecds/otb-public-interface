import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useContext, useState } from "react";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";
import ImagePlaceholder from "../shared/ImagePlaceholder";
import type { TTourStop } from "~/types";

const StopMenu = () => {
  const { setCurrentStop, tour } = useContext(TourContext);
  const { isMobile } = useDeviceContext();
  const [show, setShow] = useState<boolean>(false);

  const goToStop = (stop: TTourStop) => {
    setShow(false);
    document.getElementById(stop.slug)?.scrollIntoView({ behavior: "instant" });
    setCurrentStop(stop);
  };

  if (isMobile || !tour || !tour.stops) return <></>;

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <h1 className="text-lg">
          <MenuButton
            onClick={() => setShow(!show)}
            className={`hidden md:flex space-x-2 text-${tour.theme.title}-secondary rounded-md px-1 py-2 font-medium w-full cursor-pointer`}
          >
            {tour.title}
            <span className="sr-only">, stops</span>{" "}
            <FontAwesomeIcon icon={faChevronDown} />
          </MenuButton>
        </h1>
        {/* Mobile */}
      </div>
      <div // Desktop
        className="hidden md:block overflow-hidden"
        onMouseLeave={() => setShow(false)}
      >
        <MenuItems
          anchor="bottom start"
          className="grid grid-cols-4 text-center absolute -left-10 z-20 mt-2 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none h-1/2 w-5/6 overflow-scroll transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
          transition
        >
          {tour.stops.map((stop) => {
            return (
              <MenuItem key={stop.slug}>
                <button
                  className="flex flex-col items-center justify-center max-w-48 cursor-pointer"
                  onClick={() => goToStop(stop)}
                >
                  {stop.splash || stop.media.length > 0 ? (
                    <img
                      className="max-h-40 max-w-40 margin-auto"
                      src={stop.splash?.url ?? stop.media[0].files.tablet}
                      alt={stop.splash?.caption ?? ""}
                    />
                  ) : (
                    <ImagePlaceholder className="max-h-40 max-w-40 margin-auto text-black/50" />
                  )}
                  <span className="block px-4 py-2 text-sm text-gray-700 text-center">
                    {stop.title}
                  </span>
                </button>
              </MenuItem>
            );
          })}
        </MenuItems>
      </div>
    </Menu>
  );
};

export default StopMenu;
