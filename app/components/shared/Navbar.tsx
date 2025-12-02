import { useContext } from "react";
import { Link } from "react-router";
import TourSiteContext from "~/contexts/tourSiteContext";
import { TourContext } from "~/contexts/TourContext";
import TourMenu from "../mobile/TourMenu";
import FlatPageLinks from "../desktop/FlatPageLinks";
import type { ReactNode } from "react";
import StopMenu from "../desktop/StopMenu";

const Navbar = ({ children }: { children?: ReactNode }) => {
  const { tour, theme } = useContext(TourContext);
  const { currentSite } = useContext(TourSiteContext);

  return (
    <nav className={`bg-${theme}-primary h-16 fixed top-0 w-screen z-50`}>
      <>
        {/* <div className="mx-auto px-2 sm:px-6">
          <div className="relative flex h-16 items-center justify-between"> */}
        <div className="flex items-center justify-between mx-auto p-4">
          {/* Desktop */}
          <div className="flex flex-shrink-0 items-center">
            <Link className="hidden md:block" to="/">
              <img
                className="h-12 w-auto"
                src="/images/otblogo.png"
                alt="OpenTourBuilder"
              />
            </Link>
            {tour && (
              <>
                {/* Mobile */}
                <TourMenu />
                <h1 className="block md:hidden text-white text-sm">
                  <Link to={`/${tour.attributes.slug}`}>
                    {tour.attributes.title}
                  </Link>
                </h1>
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
              {currentSite?.attributes.name}
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
