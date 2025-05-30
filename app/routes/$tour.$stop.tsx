// Fixed $tour.$stop.tsx
import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import TourSiteContext from "~/contexts/tourSiteContext";
import { TourContext } from "~/contexts/tourContext";

const TourStop = () => {
  // Get the contexts safely
  const tourSiteContext = useContext(TourSiteContext);
  const tourContext = useContext(TourContext);
  const params = useParams();

  // For debugging
  console.log("TourStop rendered, params:", params);
  console.log("TourContext available:", !!tourContext);
  console.log("TourSiteContext available:", !!tourSiteContext);

  useEffect(() => {
    if (!params.stop) return;
    
    // Try to scroll to the element
    const element = document.getElementById(params.stop);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    
    // Only set current stop if the function and data exist
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