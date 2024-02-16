import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { Dispatch, SetStateAction, ReactElement } from "react";
import type { TMedia } from "~/types/TMedia";
import Embed from "./Embed";

interface Props {
  medium: TMedia;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  children?: ReactElement | Array<ReactElement>;
}

const MediumModal = ({ medium, showModal, setShowModal, children }: Props) => {
  const handleDeactivate = () => {
    setShowModal(false);
  };

  return (
    <>
      {children}
      <Transition.Root as={Fragment} show={showModal || false}>
        <Dialog as="div" className="relative z-50 modal" onClose={setShowModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full justify-center p-2 md:p-4 text-center items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-0 md:translate-y-4 scale-95 md:scale-[none]"
                enterTo="opacity-100 translate-y-0 scale-100 md:scale-[none]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100 md:scale-[none]"
                leaveTo="opacity-0 translate-y-0 md:translate-y-4 scale-95 md:scale-[none]"
              >
                <Dialog.Panel className="rounded bg-white text-center max-w-[66%]">
                  <Dialog.Title as="h3" className="text-xl text-gray-800 mt-4">
                    {medium?.attributes.title}
                  </Dialog.Title>
                  <Dialog.Description></Dialog.Description>
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
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: medium?.attributes.caption ?? "",
                      }}
                    />
                  </figure>
                  <button
                    className="b bg-blue-500 p-2 text-white mb-6 rounded"
                    onClick={handleDeactivate}
                  >
                    Close
                  </button>{" "}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default MediumModal;
