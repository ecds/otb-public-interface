import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import TourSiteContext from "~/contexts/tourSiteContext";
import { TourContext } from "~/contexts/tourContext"; 

const TourStop = () => {
  const { currentSite } = useContext(TourSiteContext);
  const { tour: currentTour, setCurrentStop } = useContext(TourContext); // Use TourContext for these
  const params = useParams();

  useEffect(() => {
    if (!params.stop) return;
    document.getElementById(params.stop)?.scrollIntoView();
  }, [params, currentSite, currentTour, setCurrentStop]);

  return <p className="md:hidden">poo</p>;
};

export default TourStop;