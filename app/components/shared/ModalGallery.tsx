import {
  faArrowLeft,
  faArrowRight,
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
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import CopyMediumLink from "./CopyMediumLink";
import Embed from "./Embed";
import Medium from "./Medium";
import type { TTourMedium } from "~/types";

interface Props {
  media?: TTourMedium[];
}

interface CarouselProps {
  media: TTourMedium[];
  initialIndex: number;
  slideClassName: string;
  onSelect?: (index: number) => void;
  children: (medium: TTourMedium, index: number) => React.ReactNode;
}

const EmblaCarousel = ({
  media,
  initialIndex,
  slideClassName,
  onSelect,
  children,
}: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: initialIndex,
  });
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    if (!emblaApi) return;
    const handler = () => {
      const i = emblaApi.selectedScrollSnap();
      setSelectedIndex(i);
      onSelect?.(i);
    };
    emblaApi.on("select", handler);
    return () => { emblaApi.off("select", handler); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) emblaApi.scrollTo(initialIndex, true);
  }, [emblaApi, initialIndex]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const showControls = media.length > 1;

  return (
    <div>
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {media.map((medium, index) => (
              <div className={`shrink-0 ${slideClassName}`} key={medium.files.desktop}>
                {children(medium, index)}
              </div>
            ))}
          </div>
        </div>
        {showControls && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
              aria-label="Previous"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
              aria-label="Next"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </>
        )}
      </div>
      {showControls && (
        <div className="flex justify-center gap-1 mt-2">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === selectedIndex ? "bg-gray-200" : "bg-gray-600"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Gallery = ({ media }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [activeMedium, setActiveMedium] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const imageParam = searchParams.get("image");
    if (!imageParam || !media) return;
    const index = media.findIndex((m) => m.filename === imageParam);
    if (index !== -1) {
      setActiveMedium(index);
      setShowModal(true);
    }
  }, [searchParams, media]);

  const openModal = (index: number) => {
    setActiveMedium(index);
    setShowModal(true);
  };

  if (!media || media.length === 0) return <div className="h-auto md:h-16" />;

  const currentMedium = media[activeMedium];

  return (
    <div>
      <EmblaCarousel
        media={media}
        initialIndex={activeMedium}
        slideClassName="w-screen md:w-[50vw]"
      >
        {(medium, index) => (
          <Medium medium={medium} index={index} onClick={openModal} />
        )}
      </EmblaCarousel>

      <Dialog
        as="div"
        transition
        open={showModal}
        className="fixed inset-0 flex w-screen items-center justify-center z-50"
        onClose={() => {
          setShowModal(false);
          setSearchParams();
        }}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 w-screen overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel className="w-screen md:w-[50vw] bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex items-start justify-between px-4 py-2">
                <DialogTitle as="h3" className="text-white/85 text-sm md:text-lg text-left grow">
                  {currentMedium?.title}
                </DialogTitle>
                <CloseButton className="text-white/75 hover:text-white shrink-0 ms-4">
                  <FontAwesomeIcon icon={faCircleXmark} />
                </CloseButton>
              </div>

              <EmblaCarousel
                media={media}
                initialIndex={activeMedium}
                slideClassName="w-full"
                onSelect={setActiveMedium}
              >
                {(medium) => (
                  <figure>
                    {medium?.embed ? (
                      <Embed medium={medium} />
                    ) : (
                      <img
                        className="w-full max-h-[60vh] object-contain"
                        srcSet={medium.files.desktop}
                        alt={medium.caption ?? ""}
                      />
                    )}
                    <figcaption className="text-xs text-white/75 md:text-base px-4 mt-2">
                      {medium.caption}
                    </figcaption>
                    <div className="flex flex-row text-xs px-4 pb-2">
                      {!medium?.embed && (
                        <a
                          className="pt-2 text-blue-400 hover:text-blue-300 underline"
                          href={medium.original_image}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Original Image{" "}
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </a>
                      )}
                      <CopyMediumLink
                        filename={medium.filename}
                        className="text-blue-400 hover:text-blue-300"
                      />
                    </div>
                  </figure>
                )}
              </EmblaCarousel>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Gallery;
