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
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import Embed from "./Embed";
import Medium from "./Medium";
import type { SlideHandle } from "nuka-carousel";
import type { TTourMedium } from "~/types";

interface Props {
  media?: TTourMedium[];
}

const Gallery = ({ media }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeMedium, setActiveMedium] = useState<number>(0);
  const [directMedium, setDirectMedium] = useState<TTourMedium | undefined>(
    undefined,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const carouselRef = useRef<SlideHandle>(null);

  useEffect(() => {
    const imageParam = searchParams.get("image");
    if (!imageParam || !media) return;

    setDirectMedium(media.find((m) => m.filename === imageParam));
  }, [searchParams, media]);

  useEffect(() => {
    if (!directMedium || !media) return;
    const indexOfDirect = media.indexOf(directMedium);
    carouselRef.current?.goToPage(indexOfDirect);
    setActiveMedium(indexOfDirect);
    setShowModal(true);
  }, [directMedium, media, setSearchParams]);

  const toggleModal = (clickedMedium: number) => {
    setActiveMedium(clickedMedium);
    setShowModal(!showModal);
  };

  if (media && media.length > 0) {
    return (
      <div>
        <Carousel
          ref={carouselRef}
          className="mx-auto w-screen md:w-[50vw] md:flex-col-reverse mt-2 md:mt-4"
          showArrows={media.length > 1}
          showDots={media.length > 1}
          scrollDistance="slide"
          wrapMode="wrap"
          initialPage={activeMedium}
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
              <DialogPanel className="w-screen md:w-[50vw] bg-white p-2 rounded-lg">
                <Carousel
                  showArrows={media.length > 1}
                  showDots={media.length > 1}
                  initialPage={activeMedium}
                  scrollDistance="screen"
                  wrapMode="wrap"
                  className="mx-auto w-[calc(100vw-3rem)] md:w-[calc(50vw-1rem)]"
                >
                  {media.map((medium) => {
                    return (
                      <figure
                        className="min-w-[calc(100vw-3rem)] md:min-w-[calc(50vw-1rem)]"
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
                          {medium?.embed && <Embed medium={medium} />}
                          {!medium?.embed && (
                            <div className="w-full h-[60vh]">
                              <img
                                className="w-full h-full object-contain"
                                srcSet={medium.files.desktop}
                                alt={medium.caption ?? ""}
                              />
                            </div>
                          )}
                          <figcaption className="text-xs md:text-base px-6 my-2">
                            {medium.caption}
                          </figcaption>
                          {!medium?.embed && (
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
