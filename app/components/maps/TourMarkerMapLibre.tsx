import * as maplibregl from "maplibre-gl";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useDetachedElement } from "~/hooks/useDetachedElement";
import { connectPopup, labelMarker } from "~/utils/markerA11y";
import MarkerPin from "./MarkerPin";
import type { TMapMarker } from "./types";
import type { Map } from "maplibre-gl";

interface Props {
  map: Map;
  marker: TMapMarker;
}

const TourMarkerMapLibre = ({ map, marker }: Props) => {
  const { id, title, lat, lng, popup } = marker;
  const markerElement = useDetachedElement(
    "cursor-pointer rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700",
  );
  const popupElement = useDetachedElement("", `${id}-popup`);

  useEffect(() => {
    const mapPopup = new maplibregl.Popup().setDOMContent(popupElement);

    const mapMarker = new maplibregl.Marker({
      element: markerElement,
      anchor: "bottom",
    })
      .setLngLat([lng, lat])
      .addTo(map);

    mapMarker.setPopup(mapPopup);
    labelMarker(markerElement, title);
    const disconnectPopup = connectPopup(mapPopup, markerElement, popupElement);

    return () => {
      disconnectPopup();
      mapMarker.remove();
    };
  }, [map, lat, lng, title, markerElement, popupElement]);

  return (
    <>
      {createPortal(<MarkerPin />, markerElement)}
      {createPortal(popup, popupElement)}
    </>
  );
};

export default TourMarkerMapLibre;
