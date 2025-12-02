import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { Link } from "react-router";
import { TourContext } from "~/contexts/TourContext";
import PermissionSettings from "./PermissionSettings";
import { useDeviceContext } from "~/hooks/deviceContext";

const TourMenu = () => {
  const { isDesktop } = useDeviceContext();
  const { flatPages, setCurrentFlatPage, showMenu, setShowMenu } =
    useContext(TourContext);

  const handleLinkClick = () => {
    setShowMenu(false);
  };

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  if (isDesktop) return <></>;

  return (
    <>
      <button
        className="text-lg text-white p-2 hover:bg-gray-700 rounded"
        onClick={handleMenuClick}
        type="button"
      >
        <FontAwesomeIcon icon={faBars} />
        <span className="sr-only">Menu</span>
      </button>

      <div
        className={`fixed top-0 left-0 w-3/4 max-w-sm h-screen bg-black/95 text-gray-300 overflow-y-auto transition-transform duration-300 ease-in-out z-50 ${
          showMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-medium">Menu</h2>
          <button
            className="text-white/80 text-2xl p-1 hover:bg-gray-700 rounded"
            onClick={() => setShowMenu(false)}
            type="button"
          >
            <FontAwesomeIcon icon={faClose} />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="p-4">
          <ul className="space-y-2 md:space-y-4">
            <li>
              <Link
                to="/tours"
                className="block text-gray-300 hover:text-white rounded hover:bg-gray-700"
                onClick={handleLinkClick}
              >
                All Tours
              </Link>
            </li>
            <li>
              <button
                className="block w-full text-left text-gray-300 hover:text-white rounded hover:bg-gray-700"
                onClick={handleLinkClick}
              >
                Tour Home
              </button>
            </li>

            {flatPages && flatPages.length > 0 && (
              <>
                {flatPages.map((flatPage) => (
                  <li key={flatPage.id}>
                    <button
                      className="block w-full text-left text-gray-300 hover:text-white rounded hover:bg-gray-700"
                      onClick={() => setCurrentFlatPage(flatPage)}
                    >
                      {flatPage.attributes.title}
                    </button>
                  </li>
                ))}
              </>
            )}
            <button
              className="block w-full text-left text-gray-300 hover:text-white rounded hover:bg-gray-700"
              onClick={() => setCurrentFlatPage("about")}
            >
              About OpenTour
            </button>
          </ul>
        </div>

        <div className="p-4 border-t border-gray-700">
          <p className="uppercase text-xs font-semibold text-gray-400 mb-4">
            Location Controls
          </p>
          <PermissionSettings />
        </div>

        <div className="h-8"></div>
      </div>
    </>
  );
};

export default TourMenu;
