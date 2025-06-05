import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import TourSiteContext from "~/contexts/tourSiteContext";
import { TourContext } from "~/contexts/tourContext";

const TourStop = () => {
  const tourSiteContext = useContext(TourSiteContext);
  const tourContext = useContext(TourContext);
  const params = useParams();

  useEffect(() => {
    if (!params.stop) return;
    
    const element = document.getElementById(params.stop);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    
    if (tourContext?.setCurrentStop && tourContext.stops) {
      const foundStop = tourContext.stops.find(
        stop => stop.attributes.slug === params.stop
      );
      
      if (foundStop) {
        tourContext.setCurrentStop(foundStop);
      }
    }
  }, [params.stop, tourContext]);

  return <p className="md:hidden">Tour stop content</p>;
};

export default TourStop;