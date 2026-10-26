import { faCircle, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as maplibregl from "maplibre-gl";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useDetachedElement } from "~/hooks/useDetachedElement";
import { connectPopup, labelMarker } from "~/utils/markerA11y";
import type { Map } from "maplibre-gl";
import type { ReactNode } from "react";
import type { TTourSetTour } from "~/types";

interface Props {
  tour: TTourSetTour;
  map: Map | undefined;
  children: ReactNode;
}

const TourMarker = ({ map, tour, children }: Props) => {
  const markerElement = useDetachedElement(
    "cursor-pointer rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700",
  );
  const popupElement = useDetachedElement("", `${tour.slug}-popup`);

  useEffect(() => {
    if (!map) return;

    const popup = new maplibregl.Popup().setDOMContent(popupElement);

    const marker = new maplibregl.Marker({
      element: markerElement,
      anchor: "bottom",
    })
      .setLngLat([tour.center.lng, tour.center.lat])
      .addTo(map);

    marker.setPopup(popup);
    labelMarker(markerElement, tour.title);
    const disconnectPopup = connectPopup(popup, markerElement, popupElement);

    return () => {
      disconnectPopup();
      marker.remove();
    };
  }, [tour, map, markerElement, popupElement]);

  if (tour) {
    return (
      <>
        {createPortal(
          <>
            <FontAwesomeIcon
              icon={faLocationPin}
              style={{
                color: "#d32f2f",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.4))",
              }}
            />
            <span className={`fa-stack-1x fa-inverse text-center`}>
              <FontAwesomeIcon
                icon={faCircle}
                className="text-[0.5rem] text-white/75"
              />
            </span>
          </>,
          markerElement,
        )}
        {createPortal(children, popupElement)}
      </>
    );
  }

  return <></>;
};

export default TourMarker;
