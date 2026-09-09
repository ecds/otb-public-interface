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
import { useDeviceLocation } from "~/hooks/deviceLocation";

const Directions = () => {
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const { tour, currentStop } = useContext(TourContext);
  const {
    stopLocation,
    parkingLocation,
    travelMode,
    locationAllowed,
    realtimeLocation,
    addPreference,
    removePreference,
  } = useContext(StopMapContext);
  const { deviceLocation } = useDeviceLocation();
  const directionsContainerRef = useRef<HTMLDivElement>(null);
  const parkingDirectionsContainerRef = useRef<HTMLDivElement>(null);
  const [copyMessage, setCopyMessage] = useState<string | undefined>(undefined);
  const [copySuccess, setCopySuccess] = useState<boolean>(true);

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
      !tour?.use_directions ||
      !locationAllowed
    )
      return;

    directionsServiceRef.current = undefined;
    destinationRenderRef.current = undefined;
    parkingRenderRef.current = undefined;

    const getDirections = async () => {
      if (!stopLocation) return;

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
    parkingLocation,
    locationAllowed,
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
  }, [deviceLocation, travelMode, locationAllowed]);

  const handleCopy = async () => {
    if (!currentStop) return;
    try {
      await navigator.clipboard.writeText(currentStop.address);
      setCopyMessage("Stop addressed copied!");
      setCopySuccess(true);
    } catch {
      setCopyMessage("Address failed to copy");
      setCopySuccess(false);
    }
    setTimeout(() => {
      setShowPanel(false);
      setCopyMessage(undefined);
    }, 800);
  };

  if (!tour?.use_directions) return <></>;

  return (
    <>
      <button
        className={`${locationAllowed ? "m-6 p-2" : "m-4 p-1 text-sm"} bg-black/45 rounded-md text-white text-lg uppercase`}
        onClick={() => setShowPanel(true)}
      >
        <FontAwesomeIcon icon={faDiamondTurnRight} /> directions
      </button>
      <div
        className={`fixed z-10000000 h-screen w-screen bg-white top-16 left-0 overflow-hidden transition-transform duration-700 ${
          showPanel ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {locationAllowed ? (
          <>
            <div className="text-right m-2 text-lg"></div>
            {!realtimeLocation && (
              <div className="flex items-center justify-between gap-3 px-3 py-2 mx-2 mb-1 rounded-lg bg-blue-50 text-xs text-blue-800">
                <span>Enable real-time location to keep directions current as you move.</span>
                <button
                  onClick={() => addPreference("realtimeLocation")}
                  className="shrink-0 bg-blue-500 text-white rounded-md px-3 py-1"
                >
                  Enable
                </button>
              </div>
            )}
            <TabGroup className="p-2 sticky">
              <TabList className="flex mb-2 text-lg space-x-4">
                {(currentStop?.direction_intro ||
                  currentStop?.direction_notes) && (
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
                  className="text-right text-black/80 text-sm grow self-start"
                  onClick={() => setShowPanel(false)}
                >
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </TabList>
              <TabPanels className="relative">
                {(currentStop?.direction_intro ||
                  currentStop?.direction_notes) && (
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
                      <div
                        className="text-base"
                        ref={directionsContainerRef}
                      ></div>
                    </div>
                  </TabPanel>
                )}
              </TabPanels>
            </TabGroup>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-lg h-56 mt-36 space-y-8">
            <button
              className="text-blue-500 underline"
              onClick={() => {
                addPreference("locationAllowed");
                setShowPanel(false);
              }}
            >
              Share your location to get directions.
            </button>
            <p className="text-sm">
              Or{" "}
              <button className="text-blue-500 underline" onClick={handleCopy}>
                Copy Address to Clipboard.
              </button>
            </p>
            {copyMessage ? (
              <p className={copySuccess ? "text-green-500" : "text-red-400"}>
                {copyMessage}
              </p>
            ) : (
              <button
                className="text-sm text-black/75 bg-black/10 rounded-sm p-2"
                onClick={() => removePreference("locationAllowed")}
              >
                No Thanks
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Directions;
