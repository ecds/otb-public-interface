import scrollama from "scrollama";
import { useRef, useContext, useEffect } from "react";
import { useResizeObserver } from "~/hooks/deviceContext";
import { TourContext } from "~/contexts/TourContext";
import MainContent from "../shared/MainContent";
import { ScrollamaContext } from "~/contexts/scrollamaContext";
import Gallery from "../shared/ModalGallery";
import type { ScrollamaInstance } from "scrollama";
import type { ReactNode } from "react";

interface Props {
  className: string;
  intro: ReactNode;
}

const randomWidthStyle = () => {
  return {
    width: `${Math.random() * (95 - 75) + 75}%`,
  };
};

const StopList = ({ className, intro }: Props) => {
  const { tour, currentStop, setCurrentStop } = useContext(TourContext);
  const scrollerRef = useRef<ScrollamaInstance | undefined>(undefined);
  const scrollerContainerRef = useRef<HTMLDivElement>(null);
  const { documentSize, mainContentSize } = useResizeObserver();

  useEffect(() => {
    history.replaceState({}, "", `/${tour?.slug}/${currentStop?.slug ?? ""}`);
  }, [currentStop, tour]);

  useEffect(() => {
    if (!tour || !tour.stops) return;

    scrollerRef.current = scrollama();
    scrollerRef.current
      .setup({
        step: ".stop",
      })
      .onStepEnter(({ index }) => {
        setCurrentStop(tour.stops.find((stop) => stop.position == index));
      });

    const scrollerRefCopy = scrollerRef.current;

    return () => {
      scrollerRefCopy?.destroy();
      scrollerRef.current = undefined;
    };
  }, [tour, setCurrentStop]);

  useEffect(() => {
    scrollerRef.current?.resize();
  }, [documentSize, mainContentSize]);

  const resize = () => {
    scrollerRef.current?.resize();
  };

  if (!tour || !tour.stops) return <></>;

  if (tour && tour.stops) {
    return (
      <ScrollamaContext.Provider value={{ resize }}>
        <div
          ref={scrollerContainerRef}
          className={`otb-desktop-content ${className}`}
        >
          {intro}
          {tour &&
            tour.stops.map((stop) => {
              return <MainContent key={stop.slug} content={stop} />;
            })}
          <div className="h-12"></div>
        </div>
      </ScrollamaContext.Provider>
    );
  }

  return (
    <div className="">
      {intro}
      {tour?.stops.map((stop) => {
        return (
          <div
            key={stop.slug}
            role="status"
            className="flex flex-col space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse mt-16"
          >
            <div className="my-4">
              <Gallery />
            </div>
            <div className="m-8">
              <div className="h-2 bg-gray-200 rounded-full mb-4 w-[65%]"></div>
              {[1, 2, 3, 4, 5].map((line) => {
                return (
                  <div
                    key={line}
                    className="h-1.5 bg-gray-200 rounded-full mb-2.5"
                    style={randomWidthStyle()}
                  ></div>
                );
              })}
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        );
      })}
    </div>
  );
};

export default StopList;
