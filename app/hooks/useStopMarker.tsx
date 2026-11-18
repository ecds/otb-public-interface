import { useCallback, useContext } from "react";
import PopUpContent from "~/components/maps/common/PopUpContent";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";
import type { TMarkerOptions, TTourStop } from "~/types";

// How a tour stop's marker looks and behaves, whichever library draws it.
// On mobile the marker opens a popup that links to the stop; on desktop it
// selects the stop and moves to it in the list.
export const useStopMarker = (stop: TTourStop): TMarkerOptions => {
  const { tour, currentStop, setCurrentStop } = useContext(TourContext);
  const { isMobile } = useDeviceContext();

  const goToStop = useCallback(() => {
    setCurrentStop(stop);
    const section = document.getElementById(stop.slug);
    if (!section) return;
    section.scrollIntoView({ behavior: "instant" });
    // Focus follows, so keyboard users land on the stop too.
    if (!section.hasAttribute("tabindex")) section.tabIndex = -1;
    section.focus({ preventScroll: true });
  }, [stop, setCurrentStop]);

  return {
    lat: stop.lat,
    lng: stop.lng,
    label:
      stop.position === 0 ? stop.title : `Stop ${stop.position}: ${stop.title}`,
    image: stop.map_icon ?? tour?.map_icon,
    color: stop.icon_color || tour?.icon_color,
    position: stop.position,
    current: currentStop?.id === stop.id,
    popup: isMobile ? <PopUpContent stop={stop} /> : undefined,
    popupId: `${stop.slug}-popup`,
    onActivate: isMobile ? undefined : goToStop,
  };
};
