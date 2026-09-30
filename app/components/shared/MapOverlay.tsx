import { useMap } from "@vis.gl/react-google-maps";
import { useContext, useEffect } from "react";
import { TourContext } from "~/contexts/TourContext";
import TourSiteContext from "~/contexts/tourSiteContext";

const MapOverlay = () => {
  const { tenant } = useContext(TourSiteContext);
  const { tour } = useContext(TourContext);
  const map = useMap();

  useEffect(() => {
    if (!map || !tour || !tour.map_overlay) return;

    const worldBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-85, -180),
      new google.maps.LatLng(85, 180),
    );

    const mask = new google.maps.GroundOverlay(
      "/images/blank.jpg",
      worldBounds,
    );
    if (tour.blank_map) {
      mask.setMap(map);
    }

    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(tour.map_overlay.south, tour.map_overlay.west),
      new google.maps.LatLng(tour.map_overlay.north, tour.map_overlay.east),
    );

    const overlay = new google.maps.GroundOverlay(
      tour.map_overlay.image_url,
      bounds,
    );

    overlay.setMap(map);

    return () => {
      mask.setMap(null);
    };
  }, [tour, tenant, map]);

  if (!tour || !tour.map_overlay) return <></>;
};

export default MapOverlay;
