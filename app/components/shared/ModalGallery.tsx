import {
  faArrowUpRightFromSquare,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Carousel } from "nuka-carousel";
import { useState } from "react";
import Embed from "./Embed";
import Medium from "./Medium";
import type { TTourMedium } from "~/types";

interface Props {
  media?: TTourMedium[];
}

const Gallery = ({ media }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeMedium, setActiveMedium] = useState<number>(0);

  const toggleModal = (clickedMedium: number) => {
    setActiveMedium(clickedMedium);
    setShowModal(!showModal);
  };

  if (media && media.length > 0) {
    return (
      <div>
        <Carousel
          className="mx-auto w-screen md:w-[50vw] md:flex-col-reverse mt-2 md:mt-4"
          showArrows={media.length > 1}
          showDots={media.length > 1}
          scrollDistance="slide"
          wrapMode="wrap"
        >
          {media.map((medium, index) => {
            return (
              <div
                className={`min-w-screen md:min-w-[50vw]`}
                key={medium.files.desktop}
              >
                <Medium medium={medium} index={index} onClick={toggleModal} />
              </div>
            );
          })}
        </Carousel>
        <Dialog
          as="div"
          transition
          open={showModal}
          className="fixed inset-0 flex w-screen items-center justify-center z-50"
          onClose={() => setShowModal(false)}
        >
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 w-screen overflow-y-auto p-4">
            <div className="flex min-h-full items-center justify-center">
              <DialogPanel className="w-screen md:w-auto bg-white p-2 rounded-lg">
                <Carousel
                  showArrows={media.length > 1}
                  showDots={media.length > 1}
                  initialPage={activeMedium}
                  scrollDistance="screen"
                  wrapMode="wrap"
                  className="mx-auto w-[calc(100vw-3rem)] md:w-[50vw]"
                >
                  {media.map((medium) => {
                    return (
                      <figure
                        className="min-w-[calc(100vw-3rem)] md:min-w-[50vw]"
                        key={medium.files.desktop}
                      >
                        <div className="flex flex-row-reverse pb-2 items-start sticky top-0 z-10 bg-white w-full">
                          <CloseButton>
                            <FontAwesomeIcon icon={faCircleXmark} />
                          </CloseButton>
                          <DialogTitle
                            as="h3"
                            className="text-gray-800 text-sm md:text-lg px-4 text-left grow"
                          >
                            {medium.title}
                          </DialogTitle>
                        </div>
                        <div className="flex flex-col relative items-start">
                          {medium?.provider && <Embed medium={medium} />}
                          {!medium?.provider && (
                            <img
                              className={`max-h-64 md:max-h-max m-auto`}
                              srcSet={medium.files.desktop}
                              alt={medium.caption ?? ""}
                            />
                          )}
                          <figcaption className="text-xs md:text-base px-6 my-2">
                            {medium.caption}
                          </figcaption>
                          {!medium?.provider && (
                            <a
                              className="ps-4 pt-2 text-xs text-blue-500 hover:text-blue-800 visited:text-purple-700 underline"
                              href={medium.original_image}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Original Image{" "}
                              <FontAwesomeIcon
                                icon={faArrowUpRightFromSquare}
                              />
                            </a>
                          )}
                        </div>
                      </figure>
                    );
                  })}
                </Carousel>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }

  return <div className="h-auto md:h-16"></div>;
};

export default Gallery;
