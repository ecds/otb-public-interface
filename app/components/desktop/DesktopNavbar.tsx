import { Fragment, useContext, useState } from "react";
import { Link } from "@remix-run/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import TourSiteContext from "~/contexts/tourSiteContext";
import type { TTour } from "~/types/TTour";
import type { TStop } from "~/types/TStop";

interface Props {
  tour?: TTour;
}

export default function DesktopNavbar({ tour }: Props) {
  const { currentSite, setCurrentFlatPage, setCurrentStop } =
    useContext(TourSiteContext);
  const [show, setShow] = useState<boolean>(false);

  const goToStop = (stop: TStop) => {
    setShow(false);
    document
      .getElementById(stop.attributes.slug)
      ?.scrollIntoView({ behavior: "smooth" });
    setCurrentStop(stop);
  };

  return (
    <Disclosure
      as="nav"
      className="bg-gray-800 hidden md:block fixed top-0 w-screen z-50"
    >
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-6">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/">
                    <img
                      className="h-8 w-auto"
                      src="/_static/images/otblogo.png"
                      alt="OpenTourBuilder"
                    />
                  </Link>
                </div>
                {tour && (
                  <Menu
                    onMouseEnter={() => setShow(true)}
                    onMouseLeave={() => setShow(false)}
                    as="div"
                    className="relative ml-3"
                  >
                    <div>
                      <Menu.Button className="flex space-x-2 text-white rounded-md px-1 py-2 text-sm font-medium w-full">
                        <span className="absolute -inset-1.5" />
                        <h1 className="">{tour.attributes.title}</h1>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      show={show}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <div className="overflow-hidden">
                        <Menu.Items className="grid grid-cols-4 text-center absolute -left-10 z-20 mt-2 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none h-[50vh] w-[85vw] overflow-scroll">
                          {tour.stops?.map((stop) => {
                            return (
                              <Menu.Item key={stop.id}>
                                <button
                                  className="flex flex-col items-center justify-center max-w-48"
                                  onClick={() => goToStop(stop)}
                                >
                                  {stop.media[0] && (
                                    <img
                                      className="max-h-40 max-w-40 margin-auto"
                                      src={
                                        stop.media[0].attributes.files.tablet
                                      }
                                      alt={
                                        stop.media[0].attributes.caption ?? ""
                                      }
                                    />
                                  )}
                                  <a
                                    href="/"
                                    className="block px-4 py-2 text-sm text-gray-700 text-center"
                                  >
                                    {stop.attributes.title}
                                  </a>
                                </button>
                              </Menu.Item>
                            );
                          })}
                        </Menu.Items>
                      </div>
                    </Transition>
                  </Menu>
                )}{" "}
                {!tour && (
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4 text-white rounded-md px-3 py-2 text-sm font-medium">
                      {currentSite?.attributes.name}
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0">
                  {tour?.flatPages.map((flatPage) => {
                    return (
                      <li key={flatPage.id}>
                        <button
                          tabIndex={0}
                          className="text-gray-400"
                          onClick={() => setCurrentFlatPage(flatPage)}
                          onKeyDown={({ key }: { key: string }) => {
                            if (key === "Enter") setCurrentFlatPage(flatPage);
                          }}
                        >
                          {flatPage.attributes.title}
                        </button>
                      </li>
                    );
                  })}
                  <li>
                    <button
                      tabIndex={0}
                      className="text-gray-400"
                      onClick={() => setCurrentFlatPage("about")}
                      onKeyDown={({ key }: { key: string }) => {
                        if (key === "Enter") setCurrentFlatPage("about");
                      }}
                    >
                      About OpenTour
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Disclosure.Button
                as="a"
                href="/"
                className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                Disclosure
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
