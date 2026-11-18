import { useContext, useEffect } from "react";
import { TourContext } from "~/contexts/TourContext";
import { overlayCorners } from "~/utils/overlayGeometry";
import type Leaflet from "leaflet";
import type { TMapOverlay } from "~/types";

interface Props {
  map: Leaflet.Map;
  L: typeof Leaflet;
}

// An image pinned to the overlay's corners. Leaflet's own ImageOverlay only
// takes an upright box, so the image is drawn onto a canvas instead. At a
// single zoom level the map is linear, so three corners fix the transform.
//
// The canvas only covers the visible map. Sizing an element to the whole
// overlay breaks when zoomed in: it gets tens of thousands of pixels across,
// more than browsers will draw as one transformed layer, and comes out blank.
export const rotatedOverlay = (L: typeof Leaflet, overlay: TMapOverlay) => {
  // Top-left, top-right, bottom-right, bottom-left as [lng, lat].
  const [topLeft, topRight, , bottomLeft] = overlayCorners(overlay).map(
    ([lng, lat]) => L.latLng(lat, lng),
  );

  class RotatedOverlay extends L.Layer {
    private canvas?: HTMLCanvasElement;
    private img?: HTMLImageElement;

    onAdd(map: Leaflet.Map) {
      const canvas = L.DomUtil.create("canvas", "leaflet-image-layer");
      canvas.style.position = "absolute";
      canvas.style.pointerEvents = "none";
      this.canvas = canvas;
      map.getPane("overlayPane")?.appendChild(canvas);

      const img = new Image();
      img.onload = () => this.redraw();
      img.src = overlay.image_url;
      this.img = img;

      // The visible area moves while dragging, not just when it ends.
      map.on("move zoomend viewreset resize", this.redraw, this);
      map.on("zoomstart", this.hide, this);
      this.redraw();
      return this;
    }

    onRemove(map: Leaflet.Map) {
      map.off("move zoomend viewreset resize", this.redraw, this);
      map.off("zoomstart", this.hide, this);
      this.canvas?.remove();
      this.canvas = undefined;
      if (this.img) this.img.onload = null;
      this.img = undefined;
      return this;
    }

    // Hidden while zooming rather than animated along with the tiles.
    private hide() {
      if (this.canvas) this.canvas.style.visibility = "hidden";
    }

    private redraw() {
      const { canvas, img } = this;
      const map = this._map;
      if (!canvas || !img || !map) return;

      // The visible map, in the overlay pane's pixel space.
      const origin = map.containerPointToLayerPoint([0, 0]);
      const { x: width, y: height } = map.getSize();
      const scale = window.devicePixelRatio || 1;

      L.DomUtil.setPosition(canvas, origin);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      canvas.style.visibility = "";

      const context = canvas.getContext("2d");
      if (!context) return;

      context.setTransform(scale, 0, 0, scale, 0, 0);

      const imageWidth = img.naturalWidth;
      const imageHeight = img.naturalHeight;
      if (!img.complete || !imageWidth || !imageHeight) return;

      // Stretches the image's top edge onto the top-left → top-right line
      // and its left edge onto top-left → bottom-left.
      const a = map.latLngToLayerPoint(topLeft).subtract(origin);
      const b = map.latLngToLayerPoint(topRight).subtract(origin);
      const c = map.latLngToLayerPoint(bottomLeft).subtract(origin);

      context.transform(
        (b.x - a.x) / imageWidth,
        (b.y - a.y) / imageWidth,
        (c.x - a.x) / imageHeight,
        (c.y - a.y) / imageHeight,
        a.x,
        a.y,
      );
      context.drawImage(img, 0, 0);
    }
  }

  return new RotatedOverlay();
};

const LeafletOverlay = ({ map, L }: Props) => {
  const { tour } = useContext(TourContext);
  const overlay = tour?.map_overlay;

  // Keyed on the overlay rather than the tour, so editing stops doesn't
  // rebuild it.
  useEffect(() => {
    if (!overlay) return;

    const layer = rotatedOverlay(L, overlay).addTo(map);

    return () => {
      layer.remove();
    };
  }, [map, L, overlay]);

  return <></>;
};

export default LeafletOverlay;
