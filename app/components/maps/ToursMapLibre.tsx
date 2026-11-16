import * as maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { baseStyle } from "~/map_styles";
import TourMarkerMapLibre from "./TourMarkerMapLibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { TMapMarker, TMapView } from "./types";

interface Props {
  markers: TMapMarker[];
  view: TMapView;
  className: string;
  fullscreen?: boolean;
  onWebGLFailure: () => void;
}

const ToursMapLibre = ({
  markers,
  view,
  className,
  fullscreen = false,
  onWebGLFailure,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map>();
  // Later changes to these don't rebuild the map.
  const [initial] = useState({ view, fullscreen });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { view, fullscreen } = initial;
    let _map: maplibregl.Map;
    try {
      _map = new maplibregl.Map({
        container,
        style: baseStyle,
        renderWorldCopies: false,
        ...("bounds" in view
          ? {
              bounds: [
                [view.bounds.west, view.bounds.south],
                [view.bounds.east, view.bounds.north],
              ],
              fitBoundsOptions: { padding: 100 },
            }
          : {
              center: [view.center.lng, view.center.lat],
              zoom: view.zoom,
            }),
      });
    } catch (error) {
      if (!(error instanceof maplibregl.GPUInitializationError)) throw error;
      onWebGLFailure();
      return;
    }

    if (fullscreen) {
      _map.addControl(new maplibregl.FullscreenControl({ container }));
    }

    // Only fired when restoring a lost WebGL context fails.
    _map.on("error", ({ error }) => {
      if (error instanceof maplibregl.GPUInitializationError) onWebGLFailure();
    });

    setMap(_map);

    return () => {
      _map.remove();
      setMap(undefined);
    };
  }, [initial, onWebGLFailure]);

  return (
    <div ref={containerRef} className={className}>
      {map &&
        markers.map((marker) => (
          <TourMarkerMapLibre key={marker.id} map={map} marker={marker} />
        ))}
    </div>
  );
};

export default ToursMapLibre;
