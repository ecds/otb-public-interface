import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDetachedElement } from "~/hooks/useDetachedElement";
import { activateOnKeys, connectPopup, labelMarker } from "~/utils/markerA11y";
import MarkerIcon from "../common/MarkerIcon";
import type Leaflet from "leaflet";
import type { TMarkerOptions } from "~/types";

type Props = TMarkerOptions & { L: typeof Leaflet; map: Leaflet.Map };

const LeafletMarker = ({
  L,
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
  const iconElement = useDetachedElement();
  const popupElement = useDetachedElement("", popupId);
  const [marker, setMarker] = useState<Leaflet.Marker>();
  const hasPopup = popup !== undefined;
  // Pins point at the spot; custom icons are centered on it.
  const anchor = image ? "center" : "bottom";

  useEffect(() => {
    const created = L.marker([lat, lng], {
      // Keys are handled below, the same way as for MapLibre markers.
      keyboard: false,
      icon: L.divIcon({
        html: iconElement,
        className:
          "cursor-pointer rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700",
        // No fixed size: the icon sizes itself, and is anchored below.
        iconSize: undefined,
        popupAnchor: [0, anchor === "center" ? -16 : -32],
      }),
    }).addTo(map);

    // Leaflet positions the marker with `transform`; the separate
    // `translate` property anchors it without getting in the way.
    const element = created.getElement();
    if (element)
      element.style.translate =
        anchor === "center" ? "-50% -50%" : "-50% -100%";

    setMarker(created);
    return () => {
      setMarker(undefined);
      created.remove();
    };
  }, [L, map, iconElement, anchor, lat, lng]);

  useEffect(() => {
    const element = marker?.getElement();
    if (element) labelMarker(element, label);
  }, [marker, label]);

  useEffect(() => {
    const element = marker?.getElement();
    if (!marker || !element) return;
    if (current) element.setAttribute("aria-current", "true");
    else element.removeAttribute("aria-current");
    // Keeps the current marker on top of its neighbors.
    marker.setZIndexOffset(current ? 1000 : 0);
  }, [marker, current]);

  useEffect(() => {
    const element = marker?.getElement();
    if (!marker || !element) return;

    if (hasPopup) {
      marker.bindPopup(popupElement);
      const stopKeys = activateOnKeys(element, () => marker.togglePopup());
      // Leaflet reports the popup opening and closing on the marker.
      const disconnect = connectPopup(
        {
          on: (type, handler) => marker.on(`popup${type}`, handler),
          off: (type, handler) => marker.off(`popup${type}`, handler),
          remove: () => marker.closePopup(),
        },
        element,
        popupElement,
      );
      return () => {
        stopKeys();
        disconnect();
        marker.unbindPopup();
      };
    }

    if (!onActivate) return;
    marker.on("click", onActivate);
    const stopKeys = activateOnKeys(element, onActivate);
    return () => {
      stopKeys();
      marker.off("click", onActivate);
    };
  }, [marker, popupElement, hasPopup, onActivate]);

  return (
    <>
      {createPortal(
        <MarkerIcon
          image={image}
          color={color}
          position={position}
          current={current}
        />,
        iconElement,
      )}
      {hasPopup && createPortal(popup, popupElement)}
    </>
  );
};

export default LeafletMarker;
