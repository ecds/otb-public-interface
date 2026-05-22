import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Switch,
} from "@headlessui/react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, easeOut, motion } from "framer-motion";

import { Fragment, useContext } from "react";
import { useDeviceContext } from "~/hooks/deviceContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cookies, setPreferences } from "~/utils/cookies";
import type { TCookieName } from "~/types/TCookies";
import type { Dispatch, SetStateAction } from "react";
import { PermissionsContext } from "~/contexts/PermissionsContext";

const PermissionsModal = () => {
  const {
    showPermissionsModal,
    setShowPermissionsModal,
    analyticsAllowed,
    setAnalyticsAllowed,
    gMaps,
    setGMaps,
    locationAllowed,
    setLocationAllowed,
    realtimeLocation,
    setRealtimeLocation,
    functional,
    setFunctional,
  } = useContext(PermissionsContext);

  const setters: { [Key in TCookieName]: Dispatch<SetStateAction<boolean>> } = {
    analyticsAllowed: setAnalyticsAllowed,
    gMaps: setGMaps,
    locationAllowed: setLocationAllowed,
    realtimeLocation: setRealtimeLocation,
    functional: setFunctional,
  };

  const currentPrefs: { [Key in TCookieName]: boolean } = {
    analyticsAllowed,
    gMaps,
    locationAllowed,
    realtimeLocation,
    functional,
  };

  const { isMobile } = useDeviceContext();

  const handleAcceptAll = () => {
    for (const setter in setters) {
      setters[setter as TCookieName](true);
    }
    setShowPermissionsModal(false);
  };

  const handleSave = () => {
    setPreferences(
      "OpenTour",
      (Object.keys(currentPrefs) as TCookieName[]).filter(
        (p) => currentPrefs[p],
      ),
    );
    setShowPermissionsModal(false);
  };

  const handleDecline = () => {
    for (const setter in setters) {
      setters[setter as TCookieName](false);
    }
    setFunctional(true);
    setPreferences("OpenTour", ["functional"]);
    setShowPermissionsModal(false);
  };

  if (isMobile) {
    return (
      <Dialog
        open={showPermissionsModal}
        onClose={() => {}}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/80" />{" "}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-6 rounded-lg max-h-[80vh] overflow-y-scroll">
            <DialogTitle>Cookie Notice</DialogTitle>
            <p className="text-xs">
              This site uses self-hosted analytics (Matomo) and Google Maps.
              Matomo tracks only anonymous visit counts and broad geographic
              region — nothing identifying. Google Maps is an optional
              third-party feature; no map loads until you enable it. No data is
              sold. No advertising.{" "}
            </p>
            <div className="flex flex-wrap space-x-2 text-xs space-y-1">
              <div className="bg-black/10 text-black/75 px-1 py-0.5 border-black/50 border-2 rounded-md">
                No ads
              </div>
              <div className="bg-black/10 text-black/75 px-1 py-0.5 border-black/50 border-2 rounded-md">
                No data sales
              </div>
              <div className="bg-black/10 text-black/75 px-1 py-0.5 border-black/50 border-2 rounded-md">
                Analytics self-hosted
              </div>
              <div className="bg-amber-500/10 text-black/75 px-1 py-0.5 border-black/50 border-2 rounded-md">
                Google Maps (optional third party)
              </div>
            </div>
            <div className="">
              <h1>Cookie Settings</h1>
              {cookies.map((cookie) => {
                return (
                  <div key={cookie.id} className="flex flex-row w-full mb-2">
                    <div className="grow w-full justify-self-stretch">
                      <Disclosure as="div">
                        {({ open }) => (
                          <>
                            <DisclosureButton className={"group flex flex-row"}>
                              <FontAwesomeIcon
                                icon={faChevronDown}
                                className="transition duration-300 group-data-open:rotate-180 text-xs justify-self-center self-center me-1"
                              />
                              <h2 className="text-sm">{cookie.label}</h2>
                            </DisclosureButton>
                            <AnimatePresence initial={false}>
                              {open && (
                                <DisclosurePanel static as={Fragment}>
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    transition={{
                                      duration: 0.3,
                                      ease: easeOut,
                                    }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <p className="text-xs">
                                      {cookie.description}
                                    </p>
                                  </motion.div>
                                </DisclosurePanel>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                      </Disclosure>
                    </div>
                    <div className="grow-0 justify-self-end">
                      <Switch
                        checked={currentPrefs[cookie.id]}
                        disabled={cookie.required}
                        onChange={setters[cookie.id]}
                        className="group relative flex h-5 w-10 cursor-pointer rounded-full bg-gray-200 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-blue-500/10 data-focus:outline data-focus:outline-blue-500 justify-self-end decoration-atl-primary disabled:opacity-50"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-blue-500 shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                        />
                      </Switch>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-row space-x-1  grow text-xs justify-around">
              <button
                onClick={handleAcceptAll}
                className="bg-blue-500 rounded-md text-white px-1 py-0.5"
              >
                Accept All
              </button>
              <button
                className="border-2 px-1 py-0.5 border-black/50 rounded-md"
                onClick={handleSave}
              >
                Save Choices
              </button>
              <button onClick={handleDecline} className="text-black/60">
                Decline Optional
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    );
  }

  return <></>;
};

export default PermissionsModal;
