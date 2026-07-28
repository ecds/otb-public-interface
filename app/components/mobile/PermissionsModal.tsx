import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { AnimatePresence, easeOut, motion } from "framer-motion";
import { Fragment, useContext, useEffect } from "react";
import { TourContext } from "~/contexts/TourContext";
import { usePreferences } from "~/hooks";
import { useDeviceContext } from "~/hooks/deviceContext";
import { cookies } from "~/utils/cookies";

const PermissionsModal = () => {
  const { showPermissionsModal, setShowPermissionsModal, setShowMenu } =
    useContext(TourContext);

  const {
    preferences,
    acceptAll,
    denyAll,
    addPreference,
    removePreference,
    refresh,
  } = usePreferences();

  const { isMobile } = useDeviceContext();

  useEffect(() => {
    if (showPermissionsModal) refresh();
  }, [refresh, showPermissionsModal]);

  if (isMobile) {
    return (
      <Dialog
        open={showPermissionsModal}
        onClose={() => setShowMenu(false)}
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
                        checked={preferences.includes(cookie.id)}
                        disabled={
                          cookie.required ||
                          (cookie.dependsOn &&
                            !preferences.includes(cookie.dependsOn))
                        }
                        onChange={() => {
                          if (preferences.includes(cookie.id)) {
                            removePreference(cookie.id);
                          } else {
                            addPreference(cookie.id);
                          }
                        }}
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
                onClick={() => {
                  setShowPermissionsModal(false);
                  setShowMenu(false);
                  acceptAll();
                }}
                className="bg-blue-500 rounded-md text-white px-1 py-0.5"
              >
                Accept All
              </button>
              <button
                className="border-2 px-1 py-0.5 border-black/50 rounded-md"
                onClick={() => {
                  setShowPermissionsModal(false);
                  setShowMenu(false);
                }}
              >
                Save Choices
              </button>
              <button
                onClick={() => {
                  setShowPermissionsModal(false);
                  setShowMenu(false);
                  denyAll();
                }}
                className="text-black/60"
              >
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
