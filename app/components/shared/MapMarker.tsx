import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";
import type { TTourStop } from "~/types/TTour";

const MapMarker = ({
  stop,
  zIndex,
}: {
  stop: TTourStop;
  zIndex: number;
  hasIcon: boolean;
}) => {
  const { currentStop, setCurrentStop, tour } = useContext(TourContext);
  const { isMobile } = useDeviceContext();
  const [infoWindowShown, setInfoWindowShown] = useState<boolean>(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const navigate = useNavigate();

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

  const goToStop = () => {
    setCurrentStop(stop);
    navigate(`/${tour?.slug}/${stop.slug}`);
  };

  if (stop) {
    return (
      <>
        <AdvancedMarker
          position={{
            lat: parseFloat(stop.lat),
            lng: parseFloat(stop.lng),
          }}
          title={stop.title}
          onClick={() => handleMarkerClick(stop)}
          zIndex={zIndex}
          ref={markerRef}
        >
          {stop.icon ? (
            <img src={stop.icon} alt="" width={32} />
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
            <>
              <h3 className="text-lg mb-2">{stop.title}</h3>
              <button
                role="link"
                className="text-blue-500 visited:text-purple-800 underline"
                onClick={goToStop}
              >
                Go To Stop
              </button>
            </>
          </InfoWindow>
        )}
      </>
    );
  }
};

export default MapMarker;
