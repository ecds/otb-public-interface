import { useMap } from "@vis.gl/react-google-maps";
import { useContext, useEffect } from "react";
import { TourContext } from "~/contexts/TourContext";
import TourSiteContext from "~/contexts/tourSiteContext";
import { createMapOverlay } from "~/lib/MapOverlay";

const MapOverlay = () => {
  const { tenant } = useContext(TourSiteContext);
  const { tour } = useContext(TourContext);
  const map = useMap();

  useEffect(() => {
    if (!map || !tour || !tour.map_overlay) return;

    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(tour.map_overlay.south, tour.map_overlay.west),
      new google.maps.LatLng(tour.map_overlay.north, tour.map_overlay.east),
    );

    const overlay = createMapOverlay({
      bounds,
      imageUrl: tour.map_overlay.image_url,
      rotation: tour.map_overlay.rotation,
      // A blank map hides the base map behind the overlay. Same gray as the
      // MapLibre blank style.
      background: tour.blank_map ? "#9a9a9a" : undefined,
    });

    overlay.setMap(map);

    return () => {
      overlay.setMap(null);
    };
  }, [tour, tenant, map]);

  if (!tour || !tour.map_overlay) return <></>;
};

export default MapOverlay;
