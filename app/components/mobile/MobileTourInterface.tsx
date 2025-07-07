import { useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faMap, faList } from "@fortawesome/free-solid-svg-icons";
import MobileNavbar from "./MobileNavbar";
import MobileTourInfo from "./MobileTourInfo";
import MobileTourMap from "./MobileTourMap";
import MobileStopsList from "./MobileStopsList";
import FlatPage from "~/components/shared/FlatPage";
import ClientOnly from "~/components/ClientOnly";
import { TourContext } from "~/contexts/tourContext";
import type { TTour } from "~/types/TTour";
import type { TStop } from "~/types/TStop";

interface Props {
  tour: TTour;
  stops?: TStop[];
}

const MobileTourInterface = ({ tour, stops }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const tabs = [
    { name: 'INFO', icon: faInfoCircle },
    { name: 'MAP', icon: faMap },
    { name: 'STOPS', icon: faList }
  ];

  return (
    <div className="h-screen bg-gray-100">
      {/* Fixed Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <MobileNavbar tourTitle={tour.attributes.title} />
      </div>

      {/* Tab Group with proper height calculation */}
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        {/* Main Content Area - calculate height minus fixed bars */}
        <div 
          className="overflow-hidden"
          style={{ 
            height: 'calc(100vh - 4rem - 5rem)', // viewport - top nav - bottom tabs
            marginTop: '4rem', // height of top nav
            marginBottom: '5rem' // height of bottom tabs
          }}
        >
          <TabPanels className="h-full">
            <TabPanel className="h-full overflow-y-auto">
              <MobileTourInfo tour={tour} />
            </TabPanel>
            <TabPanel className="h-full overflow-hidden">
              <ClientOnly>
                <MobileTourMap tour={tour} stops={stops} />
              </ClientOnly>
            </TabPanel>
            <TabPanel className="h-full overflow-y-auto">
              <MobileStopsList stops={stops} />
            </TabPanel>
          </TabPanels>
        </div>

        {/* Fixed Bottom Tab Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <TabList className="flex bg-gray-800 border-t border-gray-700">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `flex-1 py-3 px-4 text-center focus:outline-none transition-colors ${
                    selected 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`
                }
              >
                <div className="flex flex-col items-center">
                  <FontAwesomeIcon icon={tab.icon} className="text-lg mb-1" />
                  <span className="text-xs font-medium">{tab.name}</span>
                </div>
              </Tab>
            ))}
          </TabList>
        </div>
      </TabGroup>

      {/* Flat Page Modal (when opened from menu) */}
      <TourContext.Consumer>
        {({ currentFlatPage }) => 
          currentFlatPage && <FlatPage flatPage={currentFlatPage} />
        }
      </TourContext.Consumer>
    </div>
  );
};

export default MobileTourInterface;