import { useContext, useEffect, useRef } from "react";
import { Outlet, useParams } from "react-router";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";
import type { TStop } from "~/types";

const TourStop = () => {
  const { currentStop, tour, setCurrentStop } = useContext(TourContext);
  const params = useParams();
  const { isMobile } = useDeviceContext();
  const currentStopRef = useRef<TStop>(currentStop);

  useEffect(() => {
    if (!params.stop || !tour || !isMobile) return;

    if (tour.stops) {
      const foundStop = tour.stops.find((stop) => stop.slug === params.stop);

      if (foundStop && foundStop !== currentStopRef.current) {
        currentStopRef.current = foundStop;
        setCurrentStop(foundStop);
      }
    }
  }, [params, tour, setCurrentStop, isMobile]);

  if (isMobile)
    return (
      <>
        <Outlet />
      </>
    );

  return <></>;
};

export default TourStop;
