import { useContext } from "react";
import MainContent from "~/components/shared/MainContent";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";

const StopIntroRoute = () => {
  const { currentStop } = useContext(TourContext);
  const { isMobile } = useDeviceContext();

  if (currentStop && isMobile) {
    return <MainContent content={currentStop} />;
  }

  return <></>;
};

export default StopIntroRoute;
