import { faCircle, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import type { Map } from "maplibre-gl";
import type { ReactNode } from "react";
import type { TTourSetTour } from "~/types";

interface Props {
  tour: TTourSetTour;
  map: Map | undefined;
  children: ReactNode;
}

const TourMarker = ({ map, tour, children }: Props) => {
  const markerRef = useRef<HTMLDivElement>(null);
  const popContainerRef = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    if (!document || !map || !markerRef.current) return;

    const popup = new maplibregl.Popup().setDOMContent(popContainerRef.current);

    const marker = new maplibregl.Marker({
      element: markerRef.current,
      anchor: "bottom",
    })
      .setLngLat([tour.center.lng, tour.center.lat])
      .addTo(map);

    marker.setPopup(popup);

    return () => {
      marker.remove();
    };
  }, [tour, map]);

  if (tour) {
    return (
      <>
        <div ref={markerRef} className="cursor-pointer">
          <FontAwesomeIcon
            icon={faLocationPin}
            style={{
              color: "#d32f2f",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              filter:
                "drop-shadow(0.25px 0 0 black) drop-shadow(-0.25px 0 0 black) drop-shadow(0 0.25px 0 black) drop-shadow(0 -0.25px 0 black)",
            }}
          />
          <span className={`fa-stack-1x fa-inverse text-center "text-base"`}>
            <FontAwesomeIcon
              icon={faCircle}
              className="text-xs text-black/35"
            />
          </span>
        </div>
        <div ref={popContainerRef} id={`${tour.slug}-popup`}>
          {children}
        </div>
      </>
    );
  }

  return <></>;
};

export default TourMarker;
