import { useContext } from "react";
import { Link } from "react-router";
import { TourContext } from "~/contexts/TourContext";
import TourMenu from "../mobile/TourMenu";
import FlatPageLinks from "../desktop/FlatPageLinks";
import StopMenu from "../desktop/StopMenu";
import type { ReactNode } from "react";
import type { TTourSetPreview } from "~/types/TTourSet";

const Navbar = ({
  children,
  tour_set,
}: {
  children?: ReactNode;
  tour_set?: TTourSetPreview;
}) => {
  const { tour } = useContext(TourContext);

  return (
    <nav
      className={`bg-${
        tour?.theme.title ?? "default"
      }-primary md:bg-default-primary h-16 fixed top-0 w-screen z-50`}
    >
      <>
        <div className="h-full flex items-center justify-between mx-auto px-4">
          {/* Desktop */}
          <div className="flex flex-shrink-0 items-center w-screen md:w-auto">
            <Link className="hidden md:block" to="/">
              <img
                className="h-16 w-auto p-2"
                src={tour_set?.logo_url ?? "/images/otblogo.png"}
                alt=""
              />
            </Link>
            {tour && (
              <>
                {/* Mobile */}
                <TourMenu />
                <Link className="text-wrap" to={`/${tour.slug}`}>
                  {/* <img
                    className="h-16 w-auto p-2"
                    src={tour_set?.logo_url ?? "/images/otblogo.png"}
                    alt=""
                  /> */}
                  <h1 className="block md:hidden text-white text-sm m-auto text-wrap text-left grow">
                    {tour.title}
                  </h1>
                </Link>
                {/* Desktop */}
                <StopMenu />
              </>
            )}
          </div>{" "}
          <div className="hidden md:inline-flex me-4">
            <FlatPageLinks />
          </div>
          {!tour && (
            <h1 className="ml-2 md:ml-6 sm:block text-white text-lg font-medium">
              {tour_set?.name}
            </h1>
          )}
        </div>
        <div className="hidden md:flex absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          {children}
        </div>
        {/* </div>
        </div> */}
      </>
    </nav>
  );
};

export default Navbar;
