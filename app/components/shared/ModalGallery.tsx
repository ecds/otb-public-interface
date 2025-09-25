import { useState } from "react";
import { Carousel } from "nuka-carousel";
import Medium from "./Medium";
import ImagePlaceholder from "./ImagePlaceholder";
import type { TMedium } from "~/types/TMedia";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCircleXmark,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDeviceContext } from "~/hooks";
import Embed from "./Embed";

interface Props {
  media?: TMedium[];
}

const Gallery = ({ media }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeMedium, setActiveMedium] = useState<number>(0);
  const { isDesktop } = useDeviceContext();

  const toggleModal = (clickedMedium: number) => {
    setActiveMedium(clickedMedium);
    setShowModal(!showModal);
  };

  if (media) {
    return (
      <>
        <Carousel
          className="mx-auto w-screen md:w-[50vw] md:flex-col-reverse"
          showArrows={isDesktop}
          showDots
          scrollDistance="slide"
          wrapMode="wrap"
        >
          {media.map((medium, index) => {
            return (
              <div className="min-w-screen md:min-w-[50vw]" key={medium.id}>
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
                  showArrows={isDesktop}
                  showDots
                  initialPage={activeMedium}
                  scrollDistance="screen"
                  wrapMode="wrap"
                  className="mx-auto w-[calc(100vw-3rem)] md:w-[50vw]"
                >
                  {media.map((medium) => {
                    return (
                      <figure
                        className="min-w-[calc(100vw-3rem)] md:min-w-[50vw]"
                        key={medium.id}
                      >
                        <div className="flex flex-row-reverse pb-2 items-start sticky top-0 z-10 bg-white">
                          <CloseButton>
                            <FontAwesomeIcon icon={faCircleXmark} />
                          </CloseButton>
                          <DialogTitle
                            as="h3"
                            className="text-gray-800 text-sm md:text-lg px-4"
                          >
                            {medium.attributes.title}
                          </DialogTitle>
                        </div>
                        <div className="flex flex-col relative items-start">
                          {medium?.attributes.provider && (
                            <Embed medium={medium} />
                          )}
                          {!medium?.attributes.provider && (
                            <img
                              className={`max-h-64 md:max-h-max m-auto`}
                              role="button"
                              srcSet={medium.attributes.files.desktop}
                              alt={medium.attributes.caption ?? ""}
                            />
                          )}
                          <figcaption
                            className="text-xs md:text-base px-6 my-2"
                            dangerouslySetInnerHTML={{
                              __html: medium.attributes.caption ?? "",
                            }}
                          />
                          {!medium?.attributes.provider && (
                            <a
                              className="ps-6 pt-2 text-xs text-blue-500 hover:text-blue-800 visited:text-purple-700 underline"
                              href={medium.attributes.original_image_url}
                              target="_blank"
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
      </>
    );
  }

  return (
    <Carousel>
      <div className="w-screen md:w-[50ww] h-64 m-auto flex justify-center items-center">
        <ImagePlaceholder />
        <FontAwesomeIcon
          icon={faSpinner}
          className="absolute text-8xl motion-safe:animate-spin opacity-65"
          style={{ animationDuration: "4s" }}
        />
      </div>
    </Carousel>
  );
};

export default Gallery;
