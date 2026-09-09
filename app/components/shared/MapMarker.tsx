import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback, useContext, useState } from "react";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";
import PopUpContent from "../mobile/PopUpContent";
import type { TTourStop } from "~/types";

const MapMarker = ({
  stop,
  zIndex,
}: {
  stop: TTourStop;
  zIndex: number;
  hasIcon: boolean;
}) => {
  const { currentStop, setCurrentStop } = useContext(TourContext);
  const { isMobile } = useDeviceContext();
  const [infoWindowShown, setInfoWindowShown] = useState<boolean>(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const handleClose = useCallback(() => {
    setInfoWindowShown(false);
  }, []);

  const handleMarkerClick = (stop: TTourStop) => {
    if (isMobile) {
      setInfoWindowShown(true);
    } else {
      setCurrentStop(stop);

      document
        .getElementById(stop.slug)
        ?.scrollIntoView({ behavior: "instant" });
      setCurrentStop(stop);
    }
  };

  if (stop) {
    return (
      <>
        <AdvancedMarker
          position={{
            lat: stop.lat,
            lng: stop.lng,
          }}
          title={stop.title}
          onClick={() => handleMarkerClick(stop)}
          zIndex={zIndex}
          ref={markerRef}
        >
          {stop.map_icon ? (
            <img src={stop.map_icon} alt="" width={32} />
          ) : (
            <Pin
              scale={stop === currentStop ? 1.5 : 1}
              background={stop.icon_color}
              borderColor={stop.icon_color}
            >
              <span
                className={`text-white ${
                  stop === currentStop ? "text-xl" : "text-base"
                }`}
              >
                {stop.position}
              </span>
            </Pin>
          )}
        </AdvancedMarker>
        {infoWindowShown && isMobile && (
          <InfoWindow anchor={marker} onCloseClick={handleClose}>
            <PopUpContent stop={stop} />
          </InfoWindow>
        )}
      </>
    );
  }

  return <></>;
};

export default MapMarker;
