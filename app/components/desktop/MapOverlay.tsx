import { useContext, useEffect } from "react";
import { TourContext } from "~/contexts/TourContext";
import type { AddLayerObject, Map, SourceSpecification } from "maplibre-gl";

interface Props {
  map: Map | undefined;
}

const MapOverlay = ({ map }: Props) => {
  const { tour } = useContext(TourContext);

  useEffect(() => {
    if (!tour?.map_overlay || !map) return;

    const overlaySource: SourceSpecification = {
      type: "image",
      url: tour.map_overlay.image_url,
      coordinates: [
        [tour.map_overlay.west, tour.map_overlay.north],
        [tour.map_overlay.east, tour.map_overlay.north],
        [tour.map_overlay.east, tour.map_overlay.south],
        [tour.map_overlay.west, tour.map_overlay.south],
      ],
    };

    const id = `${tour.slug}-overlay`;

    const overlayLayer: AddLayerObject = {
      id,
      type: "raster",
      source: id,
    };

    map.on("load", () => {
      if (map.getSource(id)) return;
      map.addSource(id, overlaySource);
      map.addLayer(overlayLayer);
    });

    return () => {
      if (map && map.getLayer(id)) map.removeLayer(id);
      if (map && map.getSource(id)) map.removeSource(id);
    };
  }, [map, tour]);

  return <></>;
};

export default MapOverlay;
