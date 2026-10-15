type OverlayOptions = {
  bounds: google.maps.LatLngBounds;
  imageUrl: string;
  // Degrees clockwise about the center of `bounds`.
  rotation?: number | null;
};

// GroundOverlay can't rotate, so the image is placed in its own element over
// the upright bounds and turned with CSS. Google's pixel space is the map's
// projection, so this matches the admin's rotated corners.
//
// The class is built on first use: extending google.maps.OverlayView at
// module load throws before the Maps script has loaded (and on the server).
export const createMapOverlay = ({
  bounds,
  imageUrl,
  rotation,
}: OverlayOptions): google.maps.OverlayView => {
  class RotatedImageOverlay extends google.maps.OverlayView {
    private div?: HTMLDivElement;

    onAdd() {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.transformOrigin = "center";
      div.style.transform = `rotate(${rotation ?? 0}deg)`;
      div.style.pointerEvents = "none";

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "";
      img.style.position = "absolute";
      img.style.width = "100%";
      img.style.height = "100%";
      div.appendChild(img);

      this.div = div;
      this.getPanes()?.overlayLayer.appendChild(div);
    }

    draw() {
      const projection = this.getProjection();
      const sw = projection?.fromLatLngToDivPixel(bounds.getSouthWest());
      const ne = projection?.fromLatLngToDivPixel(bounds.getNorthEast());
      if (!this.div || !sw || !ne) return;

      this.div.style.left = `${sw.x}px`;
      this.div.style.top = `${ne.y}px`;
      this.div.style.width = `${ne.x - sw.x}px`;
      this.div.style.height = `${sw.y - ne.y}px`;
    }

    onRemove() {
      this.div?.remove();
      this.div = undefined;
    }
  }

  return new RotatedImageOverlay();
};
