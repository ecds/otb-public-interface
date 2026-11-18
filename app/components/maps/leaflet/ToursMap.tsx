import { useRef } from "react";
import { useLeafletMap } from "~/hooks/useLeafletMap";
import { addBasemap } from "~/map_styles/leaflet";
import LeafletMarker from "./Marker";
import type { TMapMarker, TMapView } from "~/types";

interface Props {
  markers: TMapMarker[];
  view: TMapView;
  className: string;
}

// For browsers without WebGL.
const ToursLeaflet = ({ markers, view, className }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leaflet = useLeafletMap(containerRef, (L, map) => {
    if ("bounds" in view) {
      const { north, south, east, west } = view.bounds;
      map.fitBounds(
        [
          [south, west],
          [north, east],
        ],
        { padding: [50, 50] },
      );
    } else {
      // MapLibre's 512-pixel tiles put its zoom levels one step out from
      // Leaflet's 256-pixel ones.
      map.setView([view.center.lat, view.center.lng], view.zoom + 1);
    }
    addBasemap(L, map);
  });

  // Markers only render portals, but they stay outside the container so
  // React never touches the DOM Leaflet owns.
  return (
    <>
      <div ref={containerRef} className={className} />
      {leaflet &&
        markers.map((marker) => (
          <LeafletMarker
            key={marker.id}
            L={leaflet.L}
            map={leaflet.map}
            lat={marker.lat}
            lng={marker.lng}
            label={marker.title}
            image={marker.icon}
            color={marker.color}
            popup={marker.popup}
            popupId={`${marker.id}-popup`}
          />
        ))}
    </>
  );
};

export default ToursLeaflet;
