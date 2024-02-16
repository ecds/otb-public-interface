import { useContext, useEffect } from "react";
import { useParams } from "@remix-run/react";
import TourSiteContext from "~/contexts/tourSiteContext";

const TourStop = () => {
  const { currentSite, currentTour, setCurrentStop } =
    useContext(TourSiteContext);
  const params = useParams();

  useEffect(() => {
    if (!params.stop) return;
    document.getElementById(params.stop)?.scrollIntoView();
  }, [params, currentSite, currentTour, setCurrentStop]);

  return <p className="md:hidden">poo</p>;
};

export default TourStop;
