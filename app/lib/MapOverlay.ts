type OverlayOptions = {
  bounds: google.maps.LatLngBounds;
  imageUrl: string;
  // Degrees clockwise about the center of `bounds`.
  rotation?: number | null;
  // Fills the visible map behind the image, hiding the base map.
  background?: string;
};

// GroundOverlay can't rotate, so the image is drawn onto a canvas, turned
// about the center of the upright bounds. Google's pixel space is the map's
// projection, so this matches the admin's rotated corners.
//
// The canvas only covers the visible map. Sizing an element to the whole
// overlay breaks when zoomed in: it gets tens of thousands of pixels across,
// more than browsers will draw as one rotated layer, and comes out blank.
//
// The class is built on first use: extending google.maps.OverlayView at
// module load throws before the Maps script has loaded (and on the server).
export const createMapOverlay = ({
  bounds,
  imageUrl,
  rotation,
  background,
}: OverlayOptions): google.maps.OverlayView => {
  class RotatedImageOverlay extends google.maps.OverlayView {
    private canvas?: HTMLCanvasElement;
    private img?: HTMLImageElement;
    private listener?: google.maps.MapsEventListener;

    onAdd() {
      const canvas = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.pointerEvents = "none";
      this.canvas = canvas;
      this.getPanes()?.overlayLayer.appendChild(canvas);

      const img = new Image();
      img.onload = () => this.draw();
      img.src = imageUrl;
      this.img = img;

      // draw() runs on zoom but not on pan, and the visible area moves on both.
      this.listener = (this.getMap() as google.maps.Map | null)?.addListener(
        "bounds_changed",
        () => this.draw(),
      );
    }

    draw() {
      const { canvas, img } = this;
      const projection = this.getProjection();
      const view = (this.getMap() as google.maps.Map | null)?.getBounds();
      if (!canvas || !img || !projection || !view) return;

      // The visible map, in the same pixel space as the overlay.
      const viewSW = projection.fromLatLngToDivPixel(view.getSouthWest());
      const viewNE = projection.fromLatLngToDivPixel(view.getNorthEast());
      const sw = projection.fromLatLngToDivPixel(bounds.getSouthWest());
      const ne = projection.fromLatLngToDivPixel(bounds.getNorthEast());
      if (!viewSW || !viewNE || !sw || !ne) return;

      const left = viewSW.x;
      const top = viewNE.y;
      const width = viewNE.x - viewSW.x;
      const height = viewSW.y - viewNE.y;
      const scale = window.devicePixelRatio || 1;

      canvas.style.left = `${left}px`;
      canvas.style.top = `${top}px`;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);

      const context = canvas.getContext("2d");
      if (!context) return;

      context.setTransform(scale, 0, 0, scale, 0, 0);
      // Painted on the same canvas so it's always under the image.
      if (background) {
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
      }
      if (!img.complete || !img.naturalWidth) return;

      // The upright box, relative to the canvas.
      const boxWidth = ne.x - sw.x;
      const boxHeight = sw.y - ne.y;
      const centerX = (sw.x + ne.x) / 2 - left;
      const centerY = (sw.y + ne.y) / 2 - top;

      context.translate(centerX, centerY);
      context.rotate(((rotation ?? 0) * Math.PI) / 180);
      context.drawImage(
        img,
        -boxWidth / 2,
        -boxHeight / 2,
        boxWidth,
        boxHeight,
      );
    }

    onRemove() {
      this.listener?.remove();
      this.listener = undefined;
      this.canvas?.remove();
      this.canvas = undefined;
      if (this.img) this.img.onload = null;
      this.img = undefined;
    }
  }

  return new RotatedImageOverlay();
};
