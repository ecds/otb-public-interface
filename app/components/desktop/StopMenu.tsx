import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useDeviceContext } from "~/hooks/deviceContext";
import { useContext, useState } from "react";
import { TourContext } from "~/contexts/TourContext";
import type { TStop } from "~/types/TStop";

const StopMenu = () => {
  const { stops, setCurrentStop, tour } = useContext(TourContext);
  const { isMobile } = useDeviceContext();
  const [show, setShow] = useState<boolean>(false);

  const goToStop = (stop: TStop) => {
    setShow(false);
    document
      .getElementById(stop.attributes.slug)
      ?.scrollIntoView({ behavior: "instant" });
    setCurrentStop(stop);
  };

  if (isMobile || !tour) return <></>;

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton
          onClick={() => setShow(!show)}
          className="hidden md:flex space-x-2 text-white rounded-md px-1 py-2 text-sm font-medium w-full cursor-pointer"
        >
          <h1 className="text-lg">
            {tour.attributes.title} <FontAwesomeIcon icon={faChevronDown} />
          </h1>
        </MenuButton>
        {/* Mobile */}
      </div>
      <div // Desktop
        className="hidden md:block overflow-hidden"
        onMouseLeave={() => setShow(false)}
      >
        <MenuItems
          anchor="bottom start"
          className="grid grid-cols-4 text-center absolute -left-10 z-20 mt-2 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none h-1/2 w-5/6 overflow-scroll transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          transition
        >
          {stops?.map((stop) => {
            return (
              <MenuItem key={stop.id}>
                <button
                  className="flex flex-col items-center justify-center max-w-48 cursor-pointer"
                  onClick={() => goToStop(stop)}
                >
                  <img
                    className="max-h-40 max-w-40 margin-auto"
                    src={stop.attributes.splash.url}
                    alt={stop.attributes.splash.caption ?? ""}
                  />
                  <a
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-700 text-center"
                  >
                    {stop.attributes.title}
                  </a>
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
