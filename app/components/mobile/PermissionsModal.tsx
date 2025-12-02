import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import PermissionsContext from "~/contexts/PermissionsContext";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";

const PermissionsModal = () => {
  const [show, setShow] = useState<boolean>(true);
  const { setShowMenu } = useContext(TourContext);
  const {
    cookiesAcknowledged,
    setCookiesAcknowledged,
    setLocationUpdateAllowed,
  } = useContext(PermissionsContext);
  const { isMobile } = useDeviceContext();

  useEffect(() => {
    console.log(
      "🚀 ~ PermissionsModal ~ cookiesAcknowledged:",
      cookiesAcknowledged
    );
    if (isMobile && cookiesAcknowledged) setShow(!cookiesAcknowledged);
  }, [isMobile, cookiesAcknowledged]);

  const handleAcceptAll = () => {
    setLocationUpdateAllowed(true);
  };

  const handleSettings = () => {
    setCookiesAcknowledged(true);
    setShowMenu(true);
  };

  const handleReject = () => {
    setCookiesAcknowledged(true);
  };

  if (isMobile) {
    return (
      <Dialog
        open={show}
        onClose={() => setShow(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/80" />{" "}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-lg">
            <DialogTitle>Cookie Notice</DialogTitle>
            <p className="text-sm">
              We use only site-specific cookies to improve your experience and
              ensure the site works properly. These cookies do not track you
              across other websites and are not shared with third parties.
            </p>
            <div className="flex flex-col space-y-3">
              <button className="">Cookie Settings</button>
              <button className="" onClick={handleAcceptAll}>
                Accept All
              </button>
              <button className="" onClick={handleSettings}>
                Settings
              </button>
              <button className="" onClick={handleReject}>
                Reject All
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
