import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useContext } from "react";
import { Link } from "react-router";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";

const TourMenu = () => {
  const { isDesktop } = useDeviceContext();
  const {
    tour,
    setCurrentFlatPage,
    showMenu,
    setShowMenu,
    setShowPermissionsModal,
  } = useContext(TourContext);

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
        className="text-2xl text-white me-4 hover:bg-gray-700 rounded"
        onClick={handleMenuClick}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={showMenu}
      >
        <FontAwesomeIcon icon={faBars} />
        <span className="sr-only">Menu</span>
      </button>

      {/* A dialog, so focus stays in the menu and the page behind is
          skipped while it's open. */}
      <Dialog
        open={showMenu}
        onClose={() => setShowMenu(false)}
        className="relative z-50"
      >
        <DialogPanel
          transition
          className="fixed top-0 left-0 w-3/4 max-w-sm h-screen bg-black/95 text-gray-300 overflow-y-auto transition-transform duration-300 ease-in-out data-closed:-translate-x-full motion-reduce:transition-none"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <DialogTitle as="h2" className="text-white font-medium">
              Menu
            </DialogTitle>
            <button
              className="text-white/80 text-2xl p-1 hover:bg-gray-700 rounded"
              onClick={() => setShowMenu(false)}
              type="button"
            >
              <FontAwesomeIcon icon={faClose} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Menu" className="p-4">
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
                <Link
                  to={`/${tour?.slug}/stops`}
                  className="block text-gray-300 hover:text-white rounded hover:bg-gray-700"
                  onClick={handleLinkClick}
                >
                  Stops
                </Link>
              </li>
              <li>
                <Link
                  to={`/${tour?.slug}/intro`}
                  className="block text-gray-300 hover:text-white rounded hover:bg-gray-700"
                  onClick={handleLinkClick}
                >
                  Tour Home
                </Link>
              </li>

              {tour && tour.flat_pages && tour.flat_pages.length > 0 && (
                <>
                  {tour.flat_pages.map((flatPage) => (
                    <li key={flatPage.slug}>
                      <button
                        className="block w-full text-left text-gray-300 hover:text-white rounded hover:bg-gray-700"
                        onClick={() => {
                          setShowMenu(false);
                          setCurrentFlatPage(flatPage);
                        }}
                      >
                        {flatPage.title}
                      </button>
                    </li>
                  ))}
                </>
              )}
              <li>
                <button
                  className="block w-full text-left text-gray-300 hover:text-white rounded hover:bg-gray-700"
                  onClick={() => {
                    setShowMenu(false);
                    setCurrentFlatPage("about");
                  }}
                >
                  About OpenTour
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              className="block w-full text-left text-gray-300 hover:text-white rounded hover:bg-gray-700"
              onClick={() => {
                setShowMenu(false);
                setShowPermissionsModal(true);
              }}
            >
              Manage Preferences
            </button>
          </div>

          <div className="h-8"></div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default TourMenu;
