import scrollama from "scrollama";
import { useRef, useContext, useEffect } from "react";
import { useResizeObserver } from "~/hooks";
import TourSiteContext from "~/contexts/tourSiteContext";
import { getTourStops } from "~/data";
import { TourContext } from "~/contexts/tourContext";
import Stop from "./Stop";
import { ScrollamaContext } from "~/contexts/scrollamaContext";
import type { ScrollamaInstance } from "scrollama";
import type { ReactNode } from "react";
import Gallery from "../shared/Gallery";

interface Props {
  className: string;
  children: ReactNode;
}

const randomWidthStyle = () => {
  return {
    width: `${Math.random() * (95 - 75) + 75}%`,
  };
};

const StopList = ({ className, children }: Props) => {
  const { tour, stops, setStops, currentStop, setCurrentStop } =
    useContext(TourContext);
  const { tenant } = useContext(TourSiteContext);
  const scrollerRef = useRef<ScrollamaInstance | undefined>(undefined);
  const scrollerContainerRef = useRef<HTMLDivElement>(null);
  const { documentSize, mainContentSize } = useResizeObserver();

  useEffect(() => {
    const fetchTourStops = async () => {
      if (!tenant || !tour) return;
      const items = await getTourStops({ tenant, tour });
      setStops(items);
    };

    fetchTourStops();
  }, [tour, tenant, setStops]);

  useEffect(() => {
    history.replaceState(
      {},
      "",
      `/${tour?.attributes.slug}/${currentStop?.attributes.slug ?? ""}`
    );
  }, [currentStop, tour]);

  useEffect(() => {
    if (!stops) return;

    scrollerRef.current = scrollama();
    scrollerRef.current
      .setup({
        step: ".stop",
      })
      .onStepEnter(({ index }) => {
        setCurrentStop(stops.find((stop) => stop.attributes.position == index));
      });

    const scrollerRefCopy = scrollerRef.current;

    return () => {
      scrollerRefCopy?.destroy();
      scrollerRef.current = undefined;
    };
  }, [stops, setCurrentStop]);

  useEffect(() => {
    scrollerRef.current?.resize();
  }, [documentSize, mainContentSize]);

  const resize = () => {
    scrollerRef.current?.resize();
  };

  if (stops) {
    return (
      <ScrollamaContext.Provider value={{ resize }}>
        <div
          ref={scrollerContainerRef}
          className={`otb-desktop-content ${className}`}
        >
          {children}
          {stops.map((stop) => {
            return <Stop key={stop.id} stop={stop} />;
          })}
        </div>
      </ScrollamaContext.Provider>
    );
  }

  return (
    <div>
      {children}
      {tour?.relationships.stops.data.map((stop) => {
        return (
          <div
            key={stop.id}
            role="status"
            className="flex flex-col space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse mt-16"
          >
            <div className="my-4">
              <Gallery />
            </div>
            <div className="my-8">
              <div className="h-2 bg-gray-200 rounded-full mb-4 w-[65%]"></div>
              <div
                className="h-1.5 bg-gray-200 rounded-full mb-2.5"
                style={randomWidthStyle()}
              ></div>
              <div
                className="h-1.5 bg-gray-200 rounded-full mb-2.5"
                style={randomWidthStyle()}
              ></div>
              <div
                className="h-1.5 bg-gray-200 rounded-full mb-2.5"
                style={randomWidthStyle()}
              ></div>
              <div
                className="h-1.5 bg-gray-200 rounded-full mb-2.5"
                style={randomWidthStyle()}
              ></div>
              <div
                className="h-1.5 bg-gray-200 rounded-full"
                style={randomWidthStyle()}
              ></div>
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        );
      })}
    </div>
  );
};

export default StopList;
