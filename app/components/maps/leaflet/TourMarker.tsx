import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useDetachedElement } from "~/hooks/useDetachedElement";
import { connectPopup, labelMarker } from "~/utils/markerA11y";
import MarkerPin from "../common/MarkerPin";
import type Leaflet from "leaflet";
import type { TMapMarker } from "~/types";

interface Props {
  L: typeof Leaflet;
  map: Leaflet.Map;
  marker: TMapMarker;
}

const TourMarkerLeaflet = ({ L, map, marker }: Props) => {
  const { id, title, lat, lng, popup } = marker;
  const iconElement = useDetachedElement();
  const popupElement = useDetachedElement("", `${id}-popup`);

  useEffect(() => {
    const mapMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        html: iconElement,
        className:
          "rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      }),
    })
      .bindPopup(popupElement)
      .addTo(map);

    const markerElement = mapMarker.getElement();
    if (!markerElement) return () => mapMarker.remove();

    labelMarker(markerElement, title);
    // Leaflet reports the popup opening and closing on the marker.
    const disconnectPopup = connectPopup(
      {
        on: (type, handler) => mapMarker.on(`popup${type}`, handler),
        off: (type, handler) => mapMarker.off(`popup${type}`, handler),
        remove: () => mapMarker.closePopup(),
      },
      markerElement,
      popupElement,
    );

    return () => {
      disconnectPopup();
      mapMarker.remove();
    };
  }, [L, map, lat, lng, title, iconElement, popupElement]);

  return (
    <>
      {createPortal(<MarkerPin />, iconElement)}
      {createPortal(popup, popupElement)}
    </>
  );
};

export default TourMarkerLeaflet;
