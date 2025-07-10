import { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router";
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
import TourSiteContext from "~/contexts/tourSiteContext";
import { getTourStops } from "~/data";
import type { TTour } from "~/types/TTour";
import type { TStop } from "~/types/TStop";

interface Props {
  tour: TTour;
  stops?: TStop[];
}

const MobileTourInterface = ({ tour, stops: propStops }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { stops, setStops } = useContext(TourContext);
  const { tenant } = useContext(TourSiteContext);
  
  const activeStops = stops || propStops;

  const tabs = [
    { name: 'INFO', icon: faInfoCircle, param: 'info' },
    { name: 'MAP', icon: faMap, param: 'map' },
    { name: 'STOPS', icon: faList, param: 'stops' }
  ];

  const getTabIndexFromURL = () => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      const index = tabs.findIndex(tab => tab.param === tabParam);
      return index >= 0 ? index : 0;
    }
    return 0;
  };

  const [selectedIndex, setSelectedIndex] = useState(getTabIndexFromURL);

  useEffect(() => {
    const newIndex = getTabIndexFromURL();
    if (newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
    }
  }, [searchParams]);

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tabs[index].param);
    
    try {
      setSearchParams(newSearchParams);
    } catch (error) {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabs[index].param);
      window.history.pushState({}, '', url.toString());
    }
  };

  useEffect(() => {
    const fetchStops = async () => {
      if (!tenant || !tour || stops) return;
      
      try {
        const fetchedStops = await getTourStops({ tenant, tour });
        setStops(fetchedStops);
      } catch (error) {
        console.error('Error fetching stops:', error);
      }
    };

    fetchStops();
  }, [tenant, tour, stops, setStops]);

  return (
    <div className="h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50">
        <MobileNavbar tourTitle={tour.attributes.title} />
      </div>

      <TabGroup selectedIndex={selectedIndex} onChange={handleTabChange}>
        <div 
          className="overflow-hidden"
          style={{ 
            height: 'calc(100vh - 4rem - 5rem)',
            marginTop: '4rem',
            marginBottom: '5rem'
          }}
        >
          <TabPanels className="h-full">
            <TabPanel className="h-full overflow-y-auto">
              <MobileTourInfo tour={tour} />
            </TabPanel>
            <TabPanel className="h-full overflow-hidden">
              <ClientOnly>
                <MobileTourMap tour={tour} stops={activeStops} />
              </ClientOnly>
            </TabPanel>
            <TabPanel className="h-full overflow-y-auto">
              <MobileStopsList stops={activeStops} />
            </TabPanel>
          </TabPanels>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50">
          <TabList className="flex bg-gray-800 border-t border-gray-700">
            {tabs.map((tab, index) => (
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

      <TourContext.Consumer>
        {({ currentFlatPage }) => 
          currentFlatPage && <FlatPage flatPage={currentFlatPage} />
        }
      </TourContext.Consumer>
    </div>
  );
};

export default MobileTourInterface;