import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useContext } from "react";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";

const FlatPageLinks = () => {
  const { setCurrentFlatPage, tour } = useContext(TourContext);
  const { isMobile } = useDeviceContext();

  if (tour && tour.flat_pages) {
    if (tour.flat_pages.length > 4 || isMobile) {
      return (
        <div className="">
          <Menu>
            <MenuButton className="inline-flex items-center gap-2 text-gray-400">
              More <FontAwesomeIcon icon={faChevronDown} />
            </MenuButton>
            <MenuItems
              transition
              anchor="bottom end"
              className="w-52 min-w-fit origin-top-right rounded-xl border border-white/5 bg-gray-400 text-left p-1 text-sm leading-6 text-gray-800 transition duration-100 ease-out [--anchor-gap:1.5rem] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              {tour.flat_pages.map((flatPage) => {
                return (
                  <MenuItem key={flatPage.slug}>
                    {({ close }) => (
                      <button
                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:underline cursor-pointer"
                        onClick={() => {
                          setCurrentFlatPage(flatPage);
                          close();
                        }}
                      >
                        {flatPage.title}
                      </button>
                    )}
                  </MenuItem>
                );
              })}
              <MenuItem>
                {({ close }) => (
                  <button
                    className="cursor-pointer group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:underline"
                    onClick={() => {
                      setCurrentFlatPage("about");
                      close();
                    }}
                  >
                    About OpenTour
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      );
    }

    return (
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0">
        {tour.flat_pages?.map((flatPage) => {
          return (
            <li key={flatPage.slug}>
              <button
                tabIndex={0}
                className={`text-${
                  tour?.theme.title ?? "default"
                }-secondary md:text-gray-200 cursor-pointer hover:underline`}
                onClick={() => setCurrentFlatPage(flatPage)}
                onKeyDown={({ key }: { key: string }) => {
                  if (key === "Enter") setCurrentFlatPage(flatPage);
                }}
              >
                {flatPage.title}
              </button>
            </li>
          );
        })}
        <li>
          <button
            tabIndex={0}
            className={`text-${
              tour?.theme.title ?? "default"
            }-secondary md:text-gray-200 cursor-pointer hover:underline`}
            onClick={() => setCurrentFlatPage("about")}
            onKeyDown={({ key }: { key: string }) => {
              if (key === "Enter") setCurrentFlatPage("about");
            }}
          >
            About OpenTour
          </button>
        </li>
      </ul>
    );
  }

  return (
    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0">
      <li>
        <button
          tabIndex={0}
          className="text-gray-400 cursor-pointer"
          onClick={() => setCurrentFlatPage("about")}
          onKeyDown={({ key }: { key: string }) => {
            if (key === "Enter") setCurrentFlatPage("about");
          }}
        >
          About OpenTour
        </button>
      </li>
    </ul>
  );
};

export default FlatPageLinks;
