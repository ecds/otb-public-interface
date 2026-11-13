import * as maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import { baseStyle } from "~/map_styles";
import { canUseWebGL, markWebGLUnavailable } from "~/utils/webgl_check";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  children: ReactNode;
  setWebglSupported: Dispatch<SetStateAction<boolean | undefined>>;
  map: maplibregl.Map | undefined;
  setMap: Dispatch<SetStateAction<maplibregl.Map | undefined>>;
}

const AllToursMapLibre = ({
  children,
  setWebglSupported,
  map,
  setMap,
}: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (canUseWebGL()) {
      try {
        setWebglSupported(true);
        const _map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: baseStyle,
          center: new maplibregl.LngLat(-83.4375901, 32.6620411),
          zoom: 5,
          renderWorldCopies: false,
        });

        _map.addControl(
          new maplibregl.FullscreenControl({
            container: mapContainerRef.current,
          }),
        );

        _map.on("error", ({ error }) => {
          if (error instanceof maplibregl.GPUInitializationError) {
            setWebglSupported(false);
          }
        });

        setMap(_map);

        return () => {
          _map.remove();
          setMap(undefined);
          setWebglSupported(canUseWebGL());
        };
      } catch (error) {
        if (!(error instanceof maplibregl.GPUInitializationError)) throw error;
        markWebGLUnavailable();
        setWebglSupported(false);
      }
    } else {
      setWebglSupported(false);
    }
  }, [setWebglSupported, setMap]);

  return (
    <div
      id="all-tour-maps"
      ref={mapContainerRef}
      className="w-full max-w-screen h-[50vh] mt-16"
    >
      {map && <>{children}</>}
    </div>
  );
};

export default AllToursMapLibre;
