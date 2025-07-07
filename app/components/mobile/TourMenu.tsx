import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { Link } from "react-router";
import { TourContext } from "~/contexts/tourContext";
import TourSiteContext from "~/contexts/tourSiteContext";

const TourMenu = () => {
  const { flatPages, setCurrentFlatPage } = useContext(TourContext);
  const { currentSite } = useContext(TourSiteContext);
  const [open, setOpen] = useState<boolean>(false);

  const handleFlatPageClick = (flatPage: any) => {
    setCurrentFlatPage(flatPage);
    setOpen(false);
  };

  return (
    <>
      <button
        className="text-lg text-white"
        onClick={() => setOpen(!open)}
      >
        <FontAwesomeIcon icon={faBars} />
        <span className="sr-only">Menu</span>
      </button>

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 w-3/4 h-screen bg-black/95 text-gray-300 overflow-scroll transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-medium">Menu</h2>
          <button
            className="text-white/80 text-2xl"
            onClick={() => setOpen(false)}
          >
            <FontAwesomeIcon icon={faClose} />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-4">
          <ul className="space-y-3">
            <li>
              <Link 
                to="/tours" 
                className="block text-gray-300 hover:text-white"
                onClick={() => setOpen(false)}
              >
                All Tours
              </Link>
            </li>
            <li>
              <button 
                className="block text-gray-300 hover:text-white text-left"
                onClick={() => setOpen(false)}
              >
                Tour Home
              </button>
            </li>
            
            {/* Flat Pages */}
            {flatPages?.map((flatPage) => (
              <li key={flatPage.id}>
                <button
                  className="block text-gray-300 hover:text-white text-left"
                  onClick={() => handleFlatPageClick(flatPage)}
                >
                  {flatPage.attributes.title}
                </button>
              </li>
            ))}
            
            <li>
              <button
                className="block text-gray-300 hover:text-white text-left"
                onClick={() => handleFlatPageClick("about")}
              >
                About
              </button>
            </li>
            
            <li>
              <button
                className="block text-gray-300 hover:text-white text-left"
                onClick={() => setOpen(false)}
              >
                Instructions
              </button>
            </li>
            
            <li>
              <button
                className="block text-gray-300 hover:text-white text-left"
                onClick={() => setOpen(false)}
              >
                Companion Article
              </button>
            </li>
          </ul>
        </div>

        {/* Location Controls Section */}
        <div className="p-4 border-t border-gray-700">
          <p className="uppercase text-xs font-semibold text-gray-400 mb-3">
            Location Controls
          </p>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <span className="text-sm">Cookies BLOCKED</span>
              <button className="w-10 h-6 bg-gray-600 rounded-full relative">
                <div className="w-4 h-4 bg-gray-400 rounded-full absolute top-1 left-1"></div>
              </button>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-sm">Current Location OFF</span>
              <button className="w-10 h-6 bg-gray-600 rounded-full relative">
                <div className="w-4 h-4 bg-gray-400 rounded-full absolute top-1 left-1"></div>
              </button>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-sm">Update Location OFF</span>
              <button className="w-10 h-6 bg-gray-600 rounded-full relative">
                <div className="w-4 h-4 bg-gray-400 rounded-full absolute top-1 left-1"></div>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default TourMenu;