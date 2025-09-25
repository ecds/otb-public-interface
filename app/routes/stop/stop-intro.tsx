import { useContext } from "react";
import { TourContext } from "~/contexts/tourContext";
import { useDeviceContext } from "~/hooks";
import MainContent from "~/components/shared/MainContent";

const StopIntroRoute = () => {
  const { currentStop } = useContext(TourContext);
  console.log("🚀 ~ StopIntroRoute ~ currentStop:", currentStop);
  const { isMobile } = useDeviceContext();

  if (currentStop && isMobile) {
    return <MainContent content={currentStop} />;
  }

  return <></>;
};

export default StopIntroRoute;
