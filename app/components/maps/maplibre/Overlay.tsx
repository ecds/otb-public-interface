import { useContext, useEffect } from "react";
import { TourContext } from "~/contexts/TourContext";
import { overlayCorners } from "~/utils/overlayGeometry";
import type {
  AddLayerObject,
  Coordinates,
  Map,
  SourceSpecification,
} from "maplibre-gl";
import type { TMapOverlay } from "~/types";

interface Props {
  map: Map | undefined;
}

const corners = (overlay: TMapOverlay) =>
  overlayCorners(overlay) as Coordinates;

const MapLibreOverlay = ({ map }: Props) => {
  const { tour } = useContext(TourContext);
  const overlay = tour?.map_overlay;
  const slug = tour?.slug;

  // Keyed on the overlay rather than the tour, so editing stops doesn't
  // rebuild it.
  useEffect(() => {
    if (!overlay || !map) return;
    const id = `${slug}-overlay`;
    if (map.getSource(id)) return;

    const overlaySource: SourceSpecification = {
      type: "image",
      url: overlay.image_url,
      coordinates: corners(overlay),
    };

    const overlayLayer: AddLayerObject = {
      id,
      type: "raster",
      source: id,
    };

    map.addSource(id, overlaySource);
    map.addLayer(overlayLayer);

    return () => {
      try {
        if (map.getLayer(id)) map.removeLayer(id);
        if (map.getSource(id)) map.removeSource(id);
      } catch {
        // The map was already removed.
      }
    };
  }, [map, overlay, slug]);

  return <></>;
};

export default MapLibreOverlay;
