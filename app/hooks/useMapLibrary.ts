import { useCallback, useEffect, useState } from "react";
import { canUseWebGL, markWebGLUnavailable } from "~/utils/webgl_check";

export type TMapLibrary = "maplibre" | "leaflet";

// Which library draws the map: MapLibre where WebGL works, Leaflet where it
// doesn't. Undefined until the first render in the browser, since the
// server can't tell. Call fallBack when MapLibre fails anyway; later maps on
// the page then go straight to Leaflet.
export const useMapLibrary = () => {
  const [library, setLibrary] = useState<TMapLibrary>();

  useEffect(() => {
    setLibrary(canUseWebGL() ? "maplibre" : "leaflet");
  }, []);

  const fallBack = useCallback(() => {
    markWebGLUnavailable();
    setLibrary("leaflet");
  }, []);

  return [library, fallBack] as const;
};
