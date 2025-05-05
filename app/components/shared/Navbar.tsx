import { Fragment, useContext, useState } from "react";
import { Link } from "@remix-run/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import TourSiteContext from "~/contexts/tourSiteContext";
import { TourContext } from "~/contexts/tourContext";
import type { TStop } from "~/types/TStop";
import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import TourMenu from "../mobile/TourMenu";

export const Navbar = ({ children }: { children?: ReactNode }) => {
  const { tour, stops, setCurrentStop } = useContext(TourContext);
  const { currentSite } = useContext(TourSiteContext);
  const [show, setShow] = useState<boolean>(false);

  const goToStop = (stop: TStop) => {
    setShow(false);
    document
      .getElementById(stop.attributes.slug)
      ?.scrollIntoView({ behavior: "smooth" });
    setCurrentStop(stop);
  };

  return (
    <nav className="bg-gray-800 fixed top-0 w-screen z-50">
      <>
        <div className="mx-auto px-2 sm:px-6">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex items-center justify-center">
              {/* Desktop */}
              <div className="hidden md:flex flex-shrink-0 items-center">
                <Link to="/">
                  <img
                    className="h-12 w-auto"
                    src="/images/otblogo.png"
                    alt="OpenTourBuilder"
                  />
                </Link>
              </div>
              {/* Mobile */}
              <TourMenu />
              {tour && (
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton // Desktop
                      onClick={() => setShow(!show)}
                      className="hidden md:flex space-x-2 text-white rounded-md px-1 py-2 text-sm font-medium w-full"
                    >
                      <h1 className="text-lg">
                        {tour.attributes.title}{" "}
                        <FontAwesomeIcon icon={faChevronDown} />
                      </h1>
                    </MenuButton>
                    {/* Mobile */}
                    <h1 className="block md:hidden text-white text-sm">
                      {tour.attributes.title}
                    </h1>
                  </div>
                  <div // Desktop
                    className="hidden md:block overflow-hidden"
                    onMouseLeave={() => setShow(false)}
                  >
                    <MenuItems
                      anchor="bottom start"
                      className="grid grid-cols-4 text-center absolute -left-10 z-20 mt-2 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none h-[50vh] w-[85vw] overflow-scroll transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                      transition
                    >
                      {stops?.map((stop) => {
                        return (
                          <MenuItem key={stop.id}>
                            <button
                              className="flex flex-col items-center justify-center max-w-48"
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
              )}{" "}
              {!tour && (
                <h1 className="ml-2 md:ml-6 sm:block text-white text-lg font-medium">
                  {currentSite?.attributes.name}
                </h1>
              )}
            </div>
            <div className="hidden md:flex absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {children}
            </div>
          </div>
        </div>
      </>
    </nav>
  );
};

export default Navbar;
