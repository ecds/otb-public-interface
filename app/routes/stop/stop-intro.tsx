import { useContext } from "react";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";
import MainContent from "~/components/shared/MainContent";

const StopIntroRoute = () => {
  const { currentStop } = useContext(TourContext);
  const { isMobile } = useDeviceContext();

  if (currentStop && isMobile) {
    return <MainContent content={currentStop} />;
  }

  return <></>;
};

export default StopIntroRoute;
