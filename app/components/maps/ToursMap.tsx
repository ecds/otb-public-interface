import { useCallback, useEffect, useState } from "react";
import { canUseWebGL, markWebGLUnavailable } from "~/utils/webgl_check";
import ToursLeaflet from "./ToursLeaflet";
import ToursMapLibre from "./ToursMapLibre";
import type { TMapMarker, TMapView } from "./types";

interface Props {
  markers: TMapMarker[];
  view: TMapView;
  className: string;
  fullscreen?: boolean;
}

// A map of tours: MapLibre where WebGL works, Leaflet where it doesn't.
// Which one is decided in the browser, after the first render.
const ToursMap = ({ markers, view, className, fullscreen }: Props) => {
  const [library, setLibrary] = useState<"maplibre" | "leaflet">();

  useEffect(() => {
    setLibrary(canUseWebGL() ? "maplibre" : "leaflet");
  }, []);

  const fallBack = useCallback(() => {
    markWebGLUnavailable();
    setLibrary("leaflet");
  }, []);

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
