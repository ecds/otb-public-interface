import {
  CloseButton,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import type { Dispatch, SetStateAction, ReactElement } from "react";
import type { TMedium } from "~/types/TMedia";
import Embed from "./Embed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface Props {
  medium: TMedium;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  children?: ReactElement | Array<ReactElement>;
  className?: string;
}

const MediumModal = ({
  medium,
  showModal,
  setShowModal,
  children,
  className,
}: Props) => {
  const handleDeactivate = () => {
    setShowModal(false);
  };

  return (
    <div className={className}>
      {children}
      <Dialog
        as="div"
        transition
        open={showModal}
        className="fixed inset-0 z-50 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0 overflow-y-auto"
        onClose={setShowModal}
      >
        <DialogPanel className="rounded bg-white text-center md:max-w-[66%]">
          <div className="w-full text-right mt-2 pr-12 fixed">
            <CloseButton>
              <FontAwesomeIcon icon={faCircleXmark} />
            </CloseButton>
          </div>
          {medium.attributes.title && (
            <DialogTitle as="h3" className="text-xl text-gray-800 mt-6">
              {medium?.attributes.title}
            </DialogTitle>
          )}
          <figure>
            {medium?.attributes.provider && <Embed medium={medium} />}
            {!medium?.attributes.provider && (
              <img
                src={medium?.attributes.original_image_url}
                alt={medium?.attributes.title || ""}
                className="m-auto px-6 py-2"
              />
            )}
            <figcaption
              className="text-sm px-6 mb-2"
              dangerouslySetInnerHTML={{
                __html: medium?.attributes.caption ?? "",
              }}
            />
          </figure>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default MediumModal;
