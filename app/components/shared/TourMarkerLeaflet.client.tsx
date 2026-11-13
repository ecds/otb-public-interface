import { faCircle, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import L from "leaflet";
import { useEffect } from "react";
import { renderToString } from "react-dom/server";
import type { ReactNode } from "react";
import type { TTourSetTour } from "~/types";

interface Props {
  map: L.Map | undefined;
  tour: TTourSetTour;
  children: ReactNode;
}

const CustomIcon = () => {
  return (
    <>
      <FontAwesomeIcon
        icon={faLocationPin}
        style={{
          color: "#d32f2f",
          width: "32px",
          height: "32px",
          cursor: "pointer",
          filter: "drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.4))",
        }}
      />
      <span className={`fa-stack-1x fa-inverse text-center`}>
        <FontAwesomeIcon
          icon={faCircle}
          className="text-[0.5rem] text-white/75"
        />
      </span>
    </>
  );
};

const TourMarkerLeaflet = ({ map, tour, children }: Props) => {
  useEffect(() => {
    if (!map) return;

    const customIcon = L.divIcon({
      html: renderToString(<CustomIcon />),
      className: "custom-fa-icon",
      iconSize: [32, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32],
    });

    const marker = L.marker([tour.center.lat, tour.center.lng], {
      icon: customIcon,
    })
      .addTo(map)
      .bindPopup(renderToString(<>{children}</>));

    return () => {
      marker.remove();
    };
  }, [map, tour, children]);
  return <></>;
};

export default TourMarkerLeaflet;
