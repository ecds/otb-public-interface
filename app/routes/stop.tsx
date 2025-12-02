import { useContext, useEffect, useRef } from "react";
import { Outlet, useParams } from "react-router";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";
import type { TStop } from "~/types/TStop";

const TourStop = () => {
  const { currentStop, stops, setCurrentStop } = useContext(TourContext);
  const params = useParams();
  const { isMobile } = useDeviceContext();
  const currentStopRef = useRef<TStop>(currentStop);

  useEffect(() => {
    if (!params.stop) return;

    if (stops) {
      const foundStop = stops.find(
        (stop) => stop.attributes.slug === params.stop
      );

      if (foundStop && foundStop !== currentStopRef.current) {
        currentStopRef.current = foundStop;
        setCurrentStop(foundStop);
      }
    }
  }, [params, stops, setCurrentStop]);

  useEffect(() => {
    if (!currentStop || isMobile) return;

    const element = document.getElementById(currentStop.attributes.slug);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [params.stop, currentStop]);

  if (isMobile)
    return (
      <>
        <Outlet />
      </>
    );

  return <></>;
};

export default TourStop;
