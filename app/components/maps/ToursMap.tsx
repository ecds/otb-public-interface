import { useMapLibrary } from "~/hooks/useMapLibrary";
import ToursLeaflet from "./leaflet/ToursMap";
import ToursMapLibre from "./maplibre/ToursMap";
import type { TMapMarker, TMapView } from "~/types";

interface Props {
  markers: TMapMarker[];
  view: TMapView;
  className: string;
  fullscreen?: boolean;
}

// A map of tours: MapLibre where WebGL works, Leaflet where it doesn't.
// Which one is decided in the browser, after the first render.
const ToursMap = ({ markers, view, className, fullscreen }: Props) => {
  const [library, fallBack] = useMapLibrary();

  if (library === "maplibre") {
    return (
      <ToursMapLibre
        markers={markers}
        view={view}
        className={className}
        fullscreen={fullscreen}
        onWebGLFailure={fallBack}
      />
    );
  }
  if (library === "leaflet") {
    return <ToursLeaflet markers={markers} view={view} className={className} />;
  }
  // Holds the map's space until the library is chosen.
  return <div className={className} />;
};

export default ToursMap;
