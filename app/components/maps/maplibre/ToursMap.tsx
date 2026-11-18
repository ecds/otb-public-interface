import * as maplibregl from "maplibre-gl";
import { useRef } from "react";
import { useMapLibreMap } from "~/hooks/useMapLibreMap";
import { baseStyle } from "~/map_styles";
import MapLibreMarker from "./Marker";
import "maplibre-gl/dist/maplibre-gl.css";
import type { TMapMarker, TMapView } from "~/types";

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
  const map = useMapLibreMap(
    containerRef,
    {
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
    },
    onWebGLFailure,
    (map, container) => {
      if (fullscreen)
        map.addControl(new maplibregl.FullscreenControl({ container }));
    },
  );

  return (
    <div ref={containerRef} className={className}>
      {map &&
        markers.map((marker) => (
          <MapLibreMarker
            key={marker.id}
            map={map}
            lat={marker.lat}
            lng={marker.lng}
            label={marker.title}
            image={marker.icon}
            color={marker.color}
            popup={marker.popup}
            popupId={`${marker.id}-popup`}
          />
        ))}
    </div>
  );
};

export default ToursMapLibre;
