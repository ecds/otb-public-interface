import { useContext } from "react";
import { TourContext } from "~/contexts/TourContext";
import { useMapLibrary } from "~/hooks/useMapLibrary";
import TourMapLeaflet from "./leaflet/TourMap";
import TourMapLibre from "./maplibre/TourMap";

// The tour's map with all its stops.
const TourMap = () => {
  const { tour } = useContext(TourContext);
  const [library, fallBack] = useMapLibrary();

  if (tour && library === "maplibre")
    return <TourMapLibre tour={tour} onWebGLFailure={fallBack} />;
  if (tour && library === "leaflet") return <TourMapLeaflet tour={tour} />;
  // Holds the map's space until the library is chosen.
  return <div className="h-full w-full" />;
};

export default TourMap;
