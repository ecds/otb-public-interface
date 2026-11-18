import * as maplibregl from "maplibre-gl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDetachedElement } from "~/hooks/useDetachedElement";
import { activateOnKeys, connectPopup, labelMarker } from "~/utils/markerA11y";
import MarkerIcon from "../common/MarkerIcon";
import type { TMarkerOptions } from "~/types";

type Props = TMarkerOptions & { map: maplibregl.Map };

const MapLibreMarker = ({
  map,
  lat,
  lng,
  label,
  image,
  color,
  position,
  current = false,
  popup,
  popupId,
  onActivate,
}: Props) => {
  const element = useDetachedElement(
    "cursor-pointer rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700",
  );
  const popupElement = useDetachedElement("", popupId);
  const [marker, setMarker] = useState<maplibregl.Marker>();
  const hasPopup = popup !== undefined;
  // Pins point at the spot; custom icons are centered on it.
  const anchor = image ? "center" : "bottom";

  useEffect(() => {
    const created = new maplibregl.Marker({ element, anchor })
      .setLngLat([lng, lat])
      .addTo(map);
    setMarker(created);
    return () => {
      setMarker(undefined);
      created.remove();
    };
  }, [map, element, anchor, lat, lng]);

  useEffect(() => labelMarker(element, label), [element, label]);

  useEffect(() => {
    if (current) element.setAttribute("aria-current", "true");
    else element.removeAttribute("aria-current");
    // Keeps the current marker on top of its neighbors.
    element.style.zIndex = current ? "1" : "";
  }, [element, current]);

  useEffect(() => {
    if (!marker) return;

    if (hasPopup) {
      const mapPopup = new maplibregl.Popup().setDOMContent(popupElement);
      marker.setPopup(mapPopup);
      const disconnect = connectPopup(mapPopup, element, popupElement);
      return () => {
        disconnect();
        marker.setPopup(null);
      };
    }

    if (!onActivate) return;
    element.addEventListener("click", onActivate);
    const stopKeys = activateOnKeys(element, onActivate);
    return () => {
      stopKeys();
      element.removeEventListener("click", onActivate);
    };
  }, [marker, element, popupElement, hasPopup, onActivate]);

  return (
    <>
      {createPortal(
        <MarkerIcon
          image={image}
          color={color}
          position={position}
          current={current}
        />,
        element,
      )}
      {hasPopup && createPortal(popup, popupElement)}
    </>
  );
};

export default MapLibreMarker;
