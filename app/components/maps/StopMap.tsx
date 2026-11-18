import { useContext } from "react";
import { TourContext } from "~/contexts/TourContext";
import { useMapLibrary } from "~/hooks/useMapLibrary";
import StopMapLeaflet from "./leaflet/StopMap";
import StopMapLibre from "./maplibre/StopMap";

// A close-up of the current stop.
const StopMap = () => {
  const { tour, currentStop } = useContext(TourContext);
  const [library, fallBack] = useMapLibrary();

  if (tour && currentStop && library === "maplibre")
    return (
      <StopMapLibre tour={tour} stop={currentStop} onWebGLFailure={fallBack} />
    );
  if (tour && currentStop && library === "leaflet")
    return <StopMapLeaflet tour={tour} stop={currentStop} />;
  // Holds the map's space until the library is chosen.
  return <div className="h-full w-full" />;
};

export default StopMap;
