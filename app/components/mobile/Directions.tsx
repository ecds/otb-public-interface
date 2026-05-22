import {
  faCircleXmark,
  faDiamondTurnRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { StopMapContext } from "~/contexts/StopMapContext";
import { TourContext } from "~/contexts/TourContext";

const Directions = () => {
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const locationAllowed = true;
  const { tour, currentStop } = useContext(TourContext);
  const { deviceLocation, stopLocation, parkingLocation, travelMode } =
    useContext(StopMapContext);
  const directionsContainerRef = useRef<HTMLDivElement>(null);
  const parkingDirectionsContainerRef = useRef<HTMLDivElement>(null);

  const map = useMap();

  const routesLib = useMapsLibrary("routes");

  const directionsServiceRef = useRef<
    google.maps.DirectionsService | undefined
  >(undefined);

  const parkingRenderRef = useRef<google.maps.DirectionsRenderer | undefined>(
    undefined,
  );

  const destinationRenderRef = useRef<
    google.maps.DirectionsRenderer | undefined
  >(undefined);

  useEffect(() => {
    if (
      !map ||
      !routesLib ||
      !deviceLocation ||
      !stopLocation ||
      !tour?.use_directions
    )
      return;

    directionsServiceRef.current = undefined;
    destinationRenderRef.current = undefined;
    parkingRenderRef.current = undefined;

    const getDirections = async () => {
      directionsServiceRef.current = new routesLib.DirectionsService();

      parkingRenderRef.current = new routesLib.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#fb2c36",
          strokeWeight: 6,
          strokeOpacity: 0.6,
        },
      });

      destinationRenderRef.current = new routesLib.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#fb2c36",
          strokeWeight: 6,
          strokeOpacity: 0.6,
        },
      });

      if (parkingLocation && travelMode.title === "DRIVING") {
        destinationRenderRef.current.setOptions({
          polylineOptions: {
            strokeColor: "green",
            strokeWeight: 6,
            strokeOpacity: 0.6,
          },
        });
        const parkingDirections = await directionsServiceRef.current.route({
          destination: parkingLocation,
          origin: deviceLocation,
          travelMode: google.maps.TravelMode[travelMode.title],
        });

        const destinationDirections = await directionsServiceRef.current.route({
          destination: stopLocation,
          origin: parkingLocation,
          travelMode: google.maps.TravelMode.WALKING,
        });

        parkingRenderRef.current.setDirections(parkingDirections);
        destinationRenderRef.current.setDirections(destinationDirections);

        const bounds = destinationDirections.routes[0].bounds.union(
          parkingDirections.routes[0].bounds,
        );
        map.fitBounds(bounds, 32);
      } else {
        const destinationDirections = await directionsServiceRef.current.route({
          destination: stopLocation,
          origin: deviceLocation,
          travelMode: google.maps.TravelMode[travelMode.title],
        });
        destinationRenderRef.current.setDirections(destinationDirections);
      }
    };

    getDirections();

    return () => {
      parkingRenderRef.current?.setMap(null);
      destinationRenderRef.current?.setMap(null);
      parkingRenderRef.current?.setPanel(null);
      destinationRenderRef.current?.setPanel(null);
      setShowPanel(false);
    };
  }, [
    map,
    routesLib,
    stopLocation,
    deviceLocation,
    tour,
    travelMode,
    currentStop,
    parkingLocation,
  ]);

  useEffect(() => {
    if (showPanel) {
      parkingRenderRef.current?.setPanel(parkingDirectionsContainerRef.current);
      destinationRenderRef.current?.setPanel(directionsContainerRef.current);
    } else {
      setTimeout(() => {
        parkingRenderRef.current?.setPanel(null);
        destinationRenderRef.current?.setPanel(null);
      }, 800);
    }
  }, [showPanel]);

  useEffect(() => {
    parkingRenderRef.current?.setPanel(null);
    destinationRenderRef.current?.setPanel(null);
    parkingRenderRef.current?.setPanel(parkingDirectionsContainerRef.current);
    destinationRenderRef.current?.setPanel(directionsContainerRef.current);
  }, [deviceLocation, travelMode]);

  if (!locationAllowed || !tour?.use_directions) return <></>;

  return (
    <>
      <button
        className="m-6 p-2 bg-black/45 rounded-md text-white text-lg uppercase"
        onClick={() => setShowPanel(true)}
      >
        <FontAwesomeIcon icon={faDiamondTurnRight} /> directions
      </button>
      <div
        className={`fixed z-[10000000] h-screen w-screen bg-white top-16 left-0 overflow-hidden transition-transform duration-700 ${
          showPanel ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="text-right m-2 text-lg"></div>
        <TabGroup className="p-2 sticky">
          <TabList className="flex mb-2 text-lg space-x-4">
            {(currentStop?.direction_intro || currentStop?.direction_notes) && (
              <Tab as={Fragment}>
                {({ selected }) => (
                  <span
                    className={`py-1 px-2 rounded-lg border block drop-shadow-xl ${
                      selected
                        ? `text-${tour.theme}-accent-text underline bg-${tour.theme}-accent`
                        : `text-${tour.theme}-secondary bg-${tour.theme}-primary`
                    }`}
                  >
                    Notes
                  </span>
                )}
              </Tab>
            )}
            {locationAllowed && (
              <Tab>
                {({ selected }) => (
                  <span
                    className={`py-1 px-2 rounded-lg border drop-shadow-xl ${
                      selected
                        ? `text-${tour.theme}-accent-text underline bg-${tour.theme}-accent`
                        : `text-${tour.theme}-secondary bg-${tour.theme}-primary`
                    }`}
                  >
                    Turn by Turn
                  </span>
                )}
              </Tab>
            )}
            <button
              className="text-right text-black/80 text-sm flex-grow self-start"
              onClick={() => setShowPanel(false)}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          </TabList>
          <TabPanels className="relative">
            {(currentStop?.direction_intro || currentStop?.direction_notes) && (
              <TabPanel className="text-base pt-2 overflow-y-scroll h-[calc(100vh-12rem)]">
                <div
                  className="text-gray-700 leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{
                    __html: currentStop.direction_intro ?? "",
                  }}
                />
                <div
                  className="text-gray-700 leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{
                    __html: currentStop.direction_notes ?? "",
                  }}
                />
              </TabPanel>
            )}
            {locationAllowed && (
              <TabPanel unmount={false}>
                <div className="overflow-y-scroll h-[calc(100vh-12rem)]">
                  {parkingLocation && (
                    <h3 className="text-lg text-red-500">
                      Driving Directions to Parking
                    </h3>
                  )}
                  <div ref={parkingDirectionsContainerRef}></div>
                  {parkingLocation && (
                    <h3 className="text-lg mt-2 text-green-600">
                      Walking Directions from Parking
                    </h3>
                  )}
                  <div className="text-base" ref={directionsContainerRef}></div>
                </div>
              </TabPanel>
            )}
          </TabPanels>
        </TabGroup>
      </div>
    </>
  );
};

export default Directions;
