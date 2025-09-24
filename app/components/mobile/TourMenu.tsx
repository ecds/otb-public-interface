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
  const [cookiesBlocked, setCookiesBlocked] = useState(true);
  const [currentLocationOff, setCurrentLocationOff] = useState(true);
  const [updateLocationOff, setUpdateLocationOff] = useState(true);

  const handleFlatPageClick = (flatPage: any) => {
    setCurrentFlatPage(flatPage);
    setOpen(false);
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleMenuClick = () => {
    console.log('Menu button clicked!', { open, setOpen }); // DEBUG
    setOpen(!open);
  };

  // Toggle switch component
  const ToggleSwitch = ({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <button 
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-600'
        }`}
        onClick={onToggle}
        aria-label={`Toggle ${label}`}
      >
        <span 
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`} 
        />
      </button>
    </div>
  );

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

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 w-3/4 max-w-sm h-screen bg-black/95 text-gray-300 overflow-y-auto transition-transform duration-300 ease-in-out z-50 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-medium">Menu</h2>
          <button
            className="text-white/80 text-2xl p-1 hover:bg-gray-700 rounded"
            onClick={() => setOpen(false)}
            type="button"
          >
            <FontAwesomeIcon icon={faClose} />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="p-4">
          <ul className="space-y-4">
            <li>
              <Link 
                to="/tours" 
                className="block text-gray-300 hover:text-white py-2 px-3 rounded hover:bg-gray-700"
                onClick={handleLinkClick}
              >
                All Tours
              </Link>
            </li>
            <li>
              <button 
                className="block w-full text-left text-gray-300 hover:text-white py-2 px-3 rounded hover:bg-gray-700"
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
                      className="block w-full text-left text-gray-300 hover:text-white py-2 px-3 rounded hover:bg-gray-700"
                      onClick={() => handleFlatPageClick(flatPage)}
                    >
                      {flatPage.attributes.title}
                    </button>
                  </li>
                ))}
              </>
            )}
            
            <li>
              <button
                className="block w-full text-left text-gray-300 hover:text-white py-2 px-3 rounded hover:bg-gray-700"
                onClick={() => handleFlatPageClick("about")}
              >
                About
              </button>
            </li>
            
            <li>
              <button
                className="block w-full text-left text-gray-300 hover:text-white py-2 px-3 rounded hover:bg-gray-700"
                onClick={handleLinkClick}
              >
                Instructions
              </button>
            </li>
            
            <li>
              <button
                className="block w-full text-left text-gray-300 hover:text-white py-2 px-3 rounded hover:bg-gray-700"
                onClick={handleLinkClick}
              >
                Companion Article
              </button>
            </li>
          </ul>
        </div>

        <div className="p-4 border-t border-gray-700">
          <p className="uppercase text-xs font-semibold text-gray-400 mb-4">
            Location Controls
          </p>
          <div className="space-y-4">
            <ToggleSwitch 
              enabled={!cookiesBlocked}
              onToggle={() => setCookiesBlocked(!cookiesBlocked)}
              label={cookiesBlocked ? "Cookies BLOCKED" : "Cookies ALLOWED"}
            />
            
            <ToggleSwitch 
              enabled={!currentLocationOff}
              onToggle={() => setCurrentLocationOff(!currentLocationOff)}
              label={currentLocationOff ? "Current Location OFF" : "Current Location ON"}
            />
            
            <ToggleSwitch 
              enabled={!updateLocationOff}
              onToggle={() => setUpdateLocationOff(!updateLocationOff)}
              label={updateLocationOff ? "Update Location OFF" : "Update Location ON"}
            />
          </div>
        </div>

        <div className="h-8"></div>
      </div>
    </>
  );
};

export default TourMenu;