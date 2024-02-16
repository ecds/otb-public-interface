import scrollama from "scrollama";
import { useRef, useContext, useEffect } from "react";
import { ClientOnly } from "remix-utils/client-only";
import Gallery from "~/components/shared/Gallery";
import { useResizeObserver } from "~/hooks";
import TourSiteContext from "~/contexts/tourSiteContext";
import type { ScrollamaInstance } from "scrollama";
import type { TTour } from "~/types/TTour";
import type { TStop } from "~/types/TStop";

interface Props {
  tour: TTour;
  stops: TStop[];
  className: string;
}

const StopList = ({ tour, stops, className }: Props) => {
  const scrollerRef = useRef<ScrollamaInstance | undefined>(undefined);
  const scrollerContainerRef = useRef<HTMLDivElement>(null);
  const { documentSize } = useResizeObserver();
  const { currentStop, setCurrentStop, currentTour } =
    useContext(TourSiteContext);

  useEffect(() => {
    history.replaceState(
      {},
      "",
      `/${currentTour?.attributes.slug}/${currentStop?.attributes.slug ?? ""}`
    );
  }, [currentStop, currentTour]);

  useEffect(() => {
    scrollerRef.current = scrollama();
    scrollerRef.current
      .setup({
        step: ".stop",
      })
      .onStepEnter(({ index, direction }) => {
        if (direction === "down") {
          setCurrentStop(
            stops.filter((stop) => stop.attributes.position == index)[0]
          );
        }
      })
      .onStepExit(({ index, direction }) => {
        if (direction === "up") {
          setCurrentStop(
            stops.filter((stop) => stop.attributes.position == index - 1)[0]
          );
        }
      });

    return () => {
      scrollerRef.current?.destroy();
      scrollerRef.current = undefined;
    };
  }, [stops, setCurrentStop]);

  useEffect(() => {
    scrollerRef.current?.resize();
  }, [documentSize]);

  return (
    <div
      ref={scrollerContainerRef}
      className={`mx-6 leading-8 otb-desktop-content ${className}`}
    >
      <div className="stop">
        <div>
          <ClientOnly>{() => <Gallery media={tour.media} />}</ClientOnly>
        </div>

        <div
          dangerouslySetInnerHTML={{
            __html: tour.attributes.description,
          }}
        />
      </div>
      {stops.map((stop) => {
        return (
          <div key={stop.id} className="stop" id={stop.attributes.slug}>
            <div className="sticky top-14 bg-white z-10 w-full h-16 text-2xl pt-4 drop-shadow-sm">
              <h2>
                {stop.attributes.position}: {stop.attributes.title}
              </h2>
            </div>
            <div>
              <ClientOnly>{() => <Gallery media={stop.media} />}</ClientOnly>
            </div>
            <div
              className="relative"
              dangerouslySetInnerHTML={{
                __html: stop.attributes.description,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StopList;
